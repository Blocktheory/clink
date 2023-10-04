import axios from "axios";
import { BaseGoerli } from "./chain/baseGoerli";
import { useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";



export const globalApiService = (method: string, url:string, params?: any ) => {

    if(!url) throw new Error("url cannot be empty");

    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const body = JSON.stringify({
        jsonrpc: "2.0",
        method: method,
        params,
        id: 1,
    });

    const requestOptions = {
        method: "POST",
        headers,
        body,
    };

    // const jsonRpcUrl = chainSelected.info.url;

    return fetch(url, requestOptions)
        .then((response) => response.json())
        .catch((e) => e);
};

export const axiosInstance = axios.create();

export const getApiService = (data: any) => {
    const { method, payload, url, requestHeader, body } = data;
    let config = {
        method: method,
        url: url,
        headers: {
            "Content-Type": "application/json",
            ...requestHeader,
        },
        params: payload,
        data: body,
    };
    return new Promise((resolve, reject) => {
        axiosInstance(config)
            .then((res) => resolve(res))
            .catch((e) => reject(e));
    });
};
