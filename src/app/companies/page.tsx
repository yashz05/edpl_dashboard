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
import React from "react";
export default function CompanyList() {
    const columns: GridColDef[] = [
        { field: 'uuid', headerName: 'UUID', width: 70 },
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'email', headerName: 'Email', width: 200 },
        {
            field: "actions",
            headerName: "Actions",
            sortable: false,
            renderCell: function render({ row }) {
                return (
                    <>
                        <EditButton hideText recordItemId={row._id} />

                        <DeleteButton hideText recordItemId={row.id} />
                    </>
                );
            },
            align: "center",
            headerAlign: "center",
            minWidth: 80,
        },

    ];
    const { dataGridProps } = useDataGrid({
        syncWithLocation: true,
    });
    return (
        <>


         
            <List title="Sales Team">
                <DataGrid
                    getRowId={(row) => row._id}
                    {...dataGridProps}
                    columns={columns}
                    pageSizeOptions={[10, 100]}
                    checkboxSelection
                    autoHeight

                />
            </List>
        </>
    );

}