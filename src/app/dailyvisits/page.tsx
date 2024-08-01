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
import { MuiInferencer } from "@refinedev/inferencer/mui";
import { Button, ButtonGroup } from "@mui/material";
export default function ApprovedProjects() {
    const cookieStore = useCookies();
    const token = decrypt(cookieStore.get("token") ?? '');

    //   "company_name": "abc 3",
    // "item_type": "adwqw`",
    // "item_name": "rthtr",
    // "item_qty": "12",
    // "item_rate": "34",

    // // {
    //   "_id": {
    //     "$oid": "66617ef5b4c21c6f79551835"
    //   },
    //   "company_name": "Foxlo tech",
    //   "customer_name": "edwedw",
    //   "data": {
    //     "remark": "fwefw",
    //     "visited_date_time": "2024-06-06T12:00:00.000"
    //   },
    //   "spid": "req.auth.uuid",
    //   "createdAt": {
    //     "$date": "2024-06-06T09:18:45.024Z"
    //   },
    //   "updatedAt": {
    //     "$date": "2024-06-06T09:18:45.024Z"
    //   },
    //   "__v": 0
    // }
    const roles = cookieStore.get("date") != null ? decrypt(cookieStore.get("date") ?? '') : [];

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
    const columns: GridColDef[] = [
        // { field: '_id', headerName: 'ID', width: 2 },
        // { field: 'client_name', headerName: 'Client Name', width: 200 },
        { field: 'company_name', headerName: 'Company Name', width: 250 },
        { field: 'customer_name', headerName: 'Interacted With', width: 250 },
        { field: 'data', headerName: 'Remark', width: 250, valueGetter: params => params.row.data.remark },
        // {
        //     field: 'Amount', headerName: 'Total Amount', width: 100, renderCell: function render({ row }) {
        //         return <div>{'₹' + (row.amount).toString().replace(/(\d)(?=(\d\d)+$)/g, "$1,")}</div>;

        //     },
        // },

        {
            field: 'createdAt', headerName: 'Visited On', width: 170,
            renderCell: function render({ row }) {
                // return <DateField format="d/MM/YYYY" value={row.created_at} />;
                return <p>{formatDate(row.createdAt)}</p>
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
    if (roles.includes("admin")) {
        columns.unshift({
            field: "spid",
            headerName: "Added by",
            type: "singleSelect",
            headerAlign: "left",
            align: "left",
            maxWidth: 250,
            sortable: false,
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
    function formatDate(dateString: string): string {
        console.log(dateString)
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }


    const { triggerExport, isLoading: ll } = useExport({
        resource: "edpl/daily_visit",
        meta: {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        },

        mapData: (item) => {
            return {
                ...item,
                spid: options.find(
                    (iteme) => {
                        // console.log(item);

                        return item.spid === iteme.value
                    },
                )?.label,
                data: '',
                // category is an object, we need to stringify it
                // data: JSON.stringify(item.data),
                // {"remark":"give regular folder  show zero by euer ","visited_date_time":"2024-07-19T11:30:00.000"}
                remark: JSON.parse(JSON.stringify(item.data)).remark,
                visited_date_time: formatDate(JSON.parse(JSON.stringify(item.data)).visited_date_time),
                added_on: formatDate(item.createdAt)


            };
        },
    });
    return (
        <>

            <List title="Daily Visits"
                headerButtons={({ defaultButtons }) => {
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
                }}
            >

                <DataGrid
                    className=""
                    getRowId={(row) => row._id}
                    {...dataGridProps}
                    columns={columns}
                    disableVirtualization
                    columnBuffer={50}
                    // checkboxSelection
                    autoHeight

                />
            </List>
        </>
    );

}