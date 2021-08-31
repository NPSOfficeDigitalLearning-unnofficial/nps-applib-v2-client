import { APIResponse } from "./api-types";

type FetchMethod = "GET"|"POST"|"PATCH"|"DELETE";
type Status = {code:number,message:string};

function apiURL(path:string[]):string {
    const joinedPath = path.filter(Boolean).join("/");
    if (process.env.NODE_ENV==="development")
        return `http://${process.env.TEST_API_ORIGIN}/api/${joinedPath}`;

    return `https://${window.location.host}/api/${joinedPath}`;
}

export async function apiFetch<B,D>(path:string[],method:FetchMethod,body?:B):Promise<{status:Status,data:APIResponse<D>}> {
    const res = await fetch(apiURL(path),{method,body:JSON.stringify(body)});
    return {
        status: {
            code: res.status,
            message: res.statusText
        },
        data: await res.json()
    };
}

