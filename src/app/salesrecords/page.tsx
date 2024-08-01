"use client";
import { Header } from "@components/header";
import { DataGrid, GridValueFormatterParams, type GridColDef } from "@mui/x-data-grid";
import { useMany, useSelect, Option, useExport } from "@refinedev/core";
import {
    DateField,
    DeleteButton,
    EditButton,
    List,
    MarkdownField,
    ShowButton,
    useDataGrid,
} from "@refinedev/mui";
import { decrypt } from "../enc"
import React from "react";
import { useCookies } from 'next-client-cookies';

import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
export default function ApprovedProjects() {
    const cookieStore = useCookies();
    const token = decrypt(cookieStore.get("token") ?? '');

    //   "company_name": "abc 3",
    // "item_type": "adwqw`",
    // "item_name": "rthtr",
    // "item_qty": "12",
    // "item_rate": "34",

    function formatDate(dateString: string): string {
        console.log(dateString)
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
    const {
        options,
        queryResult: { isLoading, data: n },
    } = useSelect({

        resource: "auth/sales_team",
        optionValue: (item) => item.uuid,
        optionLabel: (item) => item.name,
        meta: {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        },
        hasPagination: false,
    });

    const roles = cookieStore.get("date") != null ? decrypt(cookieStore.get("date") ?? '') : [];

    const columns: GridColDef[] = [
        // { field: '_id', headerName: 'ID', width: 2 },
        // { field: 'client_name', headerName: 'Client Name', width: 200 },
        { field: 'company_name', headerName: 'Company Name', width: 200 },
        { field: 'item_type', headerName: 'Item Type', width: 100 },
        { field: 'item_name', headerName: 'Item Name', width: 200 },
        { field: 'item_qty', headerName: 'Item Quantity', width: 150 },
        {
            field: 'Total', headerName: 'Total Amount', width: 100, renderCell: function render({ row }) {
                if (row.item_type === 'Veneer') {
                    return <div>{'₹' + (row.item_qty * row.item_rate * row.v_width * row.v_length).toString().replace(/(\d)(?=(\d\d)+$)/g, "$1,")}</div>;
                } else {
                    return <div>{'₹' + (row.item_qty * row.item_rate).toString().replace(/(\d)(?=(\d\d)+$)/g, "$1,")}</div>;
                }

            },
        },
        {
            field: 'from', headerName: 'Date', width: 100, renderCell: function render({ row }) {
                return <DateField format="D/M/YYYY" value={row.createdAt} />;
            },
        },

        // { field: 'rates', headerName: 'Rates', width: 200 },
        // { field: 'approved_by', headerName: 'Approved By', width: 200 },
        // { field: 'contractor', headerName: 'Contractor', width: 200 },
        {
            field: "actions",
            headerName: "Actions",
            sortable: false,
            renderCell: function render({ row }) {
                return (
                    <>

                        <EditButton hideText recordItemId={row._id} />
                        <DeleteButton hideText recordItemId={row._id} meta={{
                            headers: {
                                "Authorization": `Bearer ${token}`,
                            }
                        }} />
                    </>
                );
            },
            align: "center",
            headerAlign: "center",
            minWidth: 120,
        },
    ];

    const { triggerExport, isLoading: ll } = useExport({
        resource: "edpl/sales",
        meta: {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        },
        mapData: (item) => {
            return {
                ...item,
                // category is an object, we need to stringify it
                // category: JSON.stringify(item.category),
                spid: options.find(
                    (iteme) => {
                        // console.log(item);

                        return item.spid === iteme.value
                    },
                )?.label,
            };
        },
    });
    if (roles.includes("admin")) {
        columns.unshift({
            field: "spid",
            headerName: "Added by",
            type: "singleSelect",
            sortable: false,
            headerAlign: "left",
            align: "left",
            maxWidth: 150,
            flex: 0.5,
            valueOptions: options,
            // 
            valueFormatter: (params: GridValueFormatterParams<Option>) => {
                return params.value;
            },
            renderCell: function render({ row }) {
                console.log(row);
                if (isLoading) {
                    return "Loading...";
                } else {
                    const category = options.find(
                        (item) => {
                            // console.log(item);

                            return row.spid === item.value
                        },
                    );
                    return category?.label;
                }



            },
        })
    }
    

    const { dataGridProps } = useDataGrid({

        pagination: {
            current: 1,
            pageSize: 100,
            mode: "off", // "client" or "server"
        },
        filters: {
            mode: "off",
        }, 
        sorters: {
            mode: "off",
          },

        meta: {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        }
    });
    const { sortingMode, sortModel, onSortModelChange, ...restDataGridProps } =
    dataGridProps;

    return (
        <>

            <List title="Sales Records" headerButtons={({ defaultButtons }) => {
                return (
                    <>

                        {defaultButtons}
                        
                        <ButtonGroup>
                            <Button onClick={() => triggerExport()} disabled={ll} variant="contained" color="primary">
                                Export
                            </Button>
                        </ButtonGroup>
                    </>
                );
            }}>
                <DataGrid


                    // className=""
                    getRowId={(row) => row._id}
                    {...dataGridProps}
                    columns={columns}
                    sortingMode={sortingMode}
                    sortModel={sortModel}
                    onSortModelChange={onSortModelChange}
                    // disableVirtualization
                    // columnBuffer={50}
                    // checkboxSelection
                    // autoHeight

                />
            </List>
        </>
    );

}