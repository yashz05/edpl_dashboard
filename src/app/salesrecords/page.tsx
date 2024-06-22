"use client";
import { Header } from "@components/header";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useMany } from "@refinedev/core";
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
    const token = decrypt(cookieStore.get("token") ?? '');

    //   "company_name": "abc 3",
    // "item_type": "adwqw`",
    // "item_name": "rthtr",
    // "item_qty": "12",
    // "item_rate": "34",



    const columns: GridColDef[] = [
        // { field: '_id', headerName: 'ID', width: 2 },
        // { field: 'client_name', headerName: 'Client Name', width: 200 },
        { field: 'company_name', headerName: 'Company Name', width: 250 },
        { field: 'item_type', headerName: 'Item Type', width: 250 },
        { field: 'item_name', headerName: 'Item Name', width: 250 },
        { field: 'item_qty', headerName: 'Item Quantity', width: 100 },
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
            field: 'from', headerName: 'Date', width: 170, renderCell: function render({ row }) {
                return <DateField format="d/M/YYYY" value={row.created_at} />;
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




    const { dataGridProps } = useDataGrid({

        pagination: {
            current: 1,
            pageSize: 100,
            mode: "client", // "client" or "server"
        },


        meta: {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        }

    });

    return (
        <>

            <List title="Sales Records">

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