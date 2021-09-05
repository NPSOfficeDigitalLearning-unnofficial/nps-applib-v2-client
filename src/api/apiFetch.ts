import { APIResponse } from "./api-types";

type FetchMethod = "GET"|"POST"|"PATCH"|"DELETE";

const TEST_API_ORIGIN = "localhost:3001";

function apiURL(path:string[]):string {
    const joinedPath = path.filter(Boolean).join("/");
    if (process.env.NODE_ENV==="development")
        return `http://${TEST_API_ORIGIN}/api/${joinedPath}`;

    return `https://${window.location.host}/api/${joinedPath}`;
}

export async function apiFetch<B,D>(path:string[],method:FetchMethod,body?:B):Promise<APIResponse<D>> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const res = await fetch(apiURL(path),{method,mode:"cors",body:JSON.stringify(body),headers:{"Content-Type": "application/json"}});
    return await res.json();
}

