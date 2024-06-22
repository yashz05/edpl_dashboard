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
    const token = decrypt(cookieStore.get("token") ?? '');
    const {
        options,
        queryResult: { isLoading, data: n },
    } = useSelect({

        resource: "edpl/company",
        optionValue: (item) => item._id,
        optionLabel: (item) => item.name,
        meta: {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        },
        hasPagination: false,
    });


    const columns: GridColDef[] = [
        {
            field: "company_name",
            headerName: "Company Name",
            type: "singleSelect",
            headerAlign: "left",
            align: "left",
            maxWidth: 250,
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

                            return row.company_name === item.value
                        },
                    );
                    return category?.label;
                }



            },
        },
        { field: 'type', headerName: 'Request Type', width: 100 },
        {
            field: 'from', headerName: 'Requested On', width: 170, renderCell: function render({ row }) {
                return <DateField format="D/M/YYYY" value={row.createdAt} />;
            },
        },
        {
            field: "actions",
            headerName: "Actions",
            sortable: false,
            renderCell: function render({ row }) {
                return (
                    <>
                        <ShowButton hideText recordItemId={row._id} meta={{
                            headers: {
                                "Authorization": `Bearer ${token}`,
                            }
                        }} />
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
        filters: {
            mode: "off",
        }, sorters: {
            mode: "off",
        },

        syncWithLocation: false,
        meta: {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        },
        onSearch: (values) => {
            return [
                {
                    field: "name",
                    operator: "contains",
                    // @ts-ignore
                    value: values.name,
                },
            ];
        },

    });

    return (
        <>

            <List title="Sample Request">
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