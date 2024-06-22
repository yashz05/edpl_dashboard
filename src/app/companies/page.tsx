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
    const columns: GridColDef[] = [

        { field: 'name', headerName: 'Name', width: 200 },
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