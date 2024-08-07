"use client";
import { Header } from "@components/header";
import { DataGrid, GridValueFormatterParams, type GridColDef } from "@mui/x-data-grid";
import { useExport, useMany, useSelect } from "@refinedev/core";
import { Option } from "@refinedev/core";
import {
    DateField,

    DeleteButton,
    EditButton,
    List,
    MarkdownField,
    ShowButton,
    useDataGrid
} from "@refinedev/mui";
import { decrypt } from "../enc"
import React from "react";
import { useCookies } from 'next-client-cookies';
import { Button, ButtonGroup } from "@mui/material";
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
    function formatDate(dateString: string): string {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

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
                        {roles.includes("admin") ? <DeleteButton hideText recordItemId={row._id} meta={{
                            headers: {
                                "Authorization": `Bearer ${token}`,
                            }
                        }} /> : <></>}
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
          // editable: true,
            field: "sid",
            headerName: "Added by",
            type: "singleSelect",
            headerAlign: "left",
            align: "left",
            maxWidth: 200,
            flex: 0.5,
            sortable: false,
            valueOptions: options,
            // 
            valueFormatter: (params: GridValueFormatterParams<Option>) => {
                return params.value;
            },
            renderCell: function render({ row }) {
                //console.log(row);
                if (isLoading) {
                    return "Loading...";
                } else {
                    const category = options.find(
                        (item) => {
                           //console.log(item);

                            return row.sid === item.value
                        },
                    );
                    return category?.label;
                }
            },
        })
    }

    const { dataGridProps ,setSorter} = useDataGrid({
        // syncWithLocation: true,
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
    const { filterMode, filterModel, onFilterModelChange, ...restDataGridProps } =
        dataGridProps;
    const { triggerExport, isLoading: ll } = useExport({
        resource: "edpl/company",
        meta: {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        },
        mapData: (item) => {
            var data = {
                ...item,
                // category is an object, we need to stringify it
                address: JSON.stringify(item.address),
                address1: JSON.parse(JSON.stringify(item.address)).address1,
                address2: JSON.parse(JSON.stringify(item.address)).address2,
                state: JSON.parse(JSON.stringify(item.address)).state,
                pincode: JSON.parse(JSON.stringify(item.address)).pincode,
                city: JSON.parse(JSON.stringify(item.address)).city,
                district: JSON.parse(JSON.stringify(item.address)).district,
                landmark: JSON.parse(JSON.stringify(item.address)).landmark,
                person_to_contact: JSON.stringify(item.person_to_contact),
                first_visited: formatDate(item.first_visited),
                next_visit: formatDate(item.next_visit),


            };

            var person_to_contact = JSON.parse(data.person_to_contact);
            // [{"company_person_name":"Bhupesh kumar ","company_person_email":"bknyar@yahoo.com","company_person_pno":"9810376142"}]
            if (person_to_contact.length > 0) {
                // its list can have multiple person to contact

                person_to_contact.forEach((element: any, i: Number) => {
                    // @ts-ignore
                    data["person_to_contact_" + (i + 1)] = element.company_person_name;
                    // @ts-ignore
                    data["company_person_email_" + (i + 1)] = element.company_person_email;
                    // @ts-ignore
                    data["company_person_pno_" + (i + 1)] = element.company_person_pno;

                });

            } else {
                // data["person_to_contact"] = "";
                //   // @ts-ignore
                // data["company_person_email"] = "";
                //   // @ts-ignore
                // data["company_person_pno"] = "";
            }
            return data;
        },
    });

// @ts-ignore
    // setSorter({ field: "name", order: "asc" });
      
    return (
        <>

            <List title="Company List"
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
                    onSortModelChange={(model, details) => {
                        dataGridProps.onSortModelChange(model, details);
                        console.log(model);

                        
                        // do something else
                      }} 

                    // checkboxSelection
                    autoHeight

                />
            </List>
        </>
    );

}