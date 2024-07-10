"use client";
import { Header } from "@components/header";
import { DataGrid, GridValueFormatterParams, type GridColDef } from "@mui/x-data-grid";
import { useMany, useSelect } from "@refinedev/core";
import { Option } from "@refinedev/core";
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
export default function ApprovedProjects() {
    const cookieStore = useCookies();
    const roles = cookieStore.get("date") != null ? decrypt(cookieStore.get("date") ?? '') : [];
    const token = decrypt(cookieStore.get("token") ?? '');
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

        { field: 'name', headerName: 'Name', width: 250 },
        {
            field: 'person_to_contact', headerName: 'Person To Contact', width: 200,
            valueGetter: params => params.row.person_to_contact.length > 0 ? params.row.person_to_contact[0].company_person_name : ""
        }, {
            field: 'address', headerName: 'Pincode', width: 200,
            valueGetter: params => params.row.address.pincode
        },
        { field: 'area_of_company', headerName: 'Area', width: 200 },
        {
            field: "actions",
            headerName: "Actions",
            sortable: false,
            renderCell: function render({ row }) {
                return (
                    <>
                        <EditButton hideText recordItemId={row._id} />
                        {roles.includes("admin") ?? <DeleteButton hideText recordItemId={row._id} meta={{
                            headers: {
                                "Authorization": `Bearer ${token}`,
                            }
                        }} />}
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
            field: "sid",
            headerName: "Added by",
            type: "singleSelect",
            headerAlign: "left",
            align: "left",
            maxWidth: 200,
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
                            console.log(item);

                            return row.sid === item.value
                        },
                    );
                    return category?.label;
                }



            },
        })
    }

    const { dataGridProps } = useDataGrid({
        syncWithLocation: true,
        pagination: {
            current: 1,
            pageSize: 100,
            mode: "client", // "client" or "server"
        },
        filters: {
            mode: "off",
        }, sorters: {
            mode: "off",
        },

        meta: {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        }

    });

    return (
        <>

            <List title="Company List"
            // wrapperProps={{
            //     style: {

            //         padding: "16px",
            //     },
            // }}
            >
                <DataGrid
                    getRowId={(row) => row._id}
                    {...dataGridProps}
                    columns={columns}

                    checkboxSelection
                    autoHeight

                />
            </List>
        </>
    );

}