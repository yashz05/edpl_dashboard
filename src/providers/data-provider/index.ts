"use client";

import dataProviderSimpleRest from "@refinedev/simple-rest";
import axios from "axios";

const API_URL = "http://207.180.252.68:8092/api";
// const API_URL = "https://api.fake-rest.refine.dev";

const dataProvider = dataProviderSimpleRest(API_URL);


export const myDataProvider = {
    ...dataProvider,
    //  @ts-ignore
    update: async ({ resource, id, variables }) => {

        const url = `${API_URL}/${resource}/${id}`;

        const { data } = await axios.put(url, variables);

        return {
            data,
        };
    },
};
