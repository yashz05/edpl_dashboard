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
import { MuiInferencer } from "@refinedev/inferencer/mui";
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

    const columns: GridColDef[] = [
        // { field: '_id', headerName: 'ID', width: 2 },
        // { field: 'client_name', headerName: 'Client Name', width: 200 },
         { field: 'company_name', headerName: 'Company Name', width: 250 },
         { field: 'customer_name', headerName: 'Interacted With', width: 250 },
         { field: 'data', headerName: 'Remark', width: 250 , valueGetter: params => params.row.data.remark},
        // {
        //     field: 'Amount', headerName: 'Total Amount', width: 100, renderCell: function render({ row }) {
        //         return <div>{'₹' + (row.amount).toString().replace(/(\d)(?=(\d\d)+$)/g, "$1,")}</div>;

        //     },
        // },


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
        
            <List title="Daily Visits">

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