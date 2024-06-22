// @ts-nocheck
"use client";

import dataProviderSimpleRest from "./../../datapr/";
import axios from "axios";

const API_URL = "http://207.180.252.68:8092/api";
export const photos = "http://207.180.252.68:8092/assets/uploads/";
// const API_URL = "https://api.fake-rest.refine.dev";

const dataProvider = dataProviderSimpleRest(API_URL);


export const myDataProvider = {
    ...dataProvider,



};
