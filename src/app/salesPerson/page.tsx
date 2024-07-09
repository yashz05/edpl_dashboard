"use client";

import { Header } from "@components/header";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useMany, useSelect } from "@refinedev/core";
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

export default function UsersLists() {
   
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
                        <DeleteButton hideText recordItemId={row._id} />
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


         
            <List title="Users">
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