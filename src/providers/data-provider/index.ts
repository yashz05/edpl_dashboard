// @ts-nocheck
"use client";

import dataProviderSimpleRest from "./../../datapr/";
import axios from "axios";
export var API_URL = ''
export var photos = ''
// UAT
// http://152.53.111.150:8092/
if (process.env.NODE_ENV === 'production') {
    API_URL = "https://salesbe.eurodecor.co.in/api";
    photos = "https://salesbe.eurodecor.co.in/assets/uploads/";
} else {
    API_URL = "http://152.53.111.150:8092/api";
    photos = "http://152.53.111.150:8092/assets/uploads/";
}



// const API_URL = "https://api.fake-rest.refine.dev";

const dataProvider = dataProviderSimpleRest(API_URL);


export const myDataProvider = {
    ...dataProvider,



};
