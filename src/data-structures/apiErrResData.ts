import { APIErrorResponse } from "../api/api-types";
import { ErrorData } from "../components/error-display/ErrorDisplay";

export function apiErrResData(res: APIErrorResponse): ErrorData {
    const { error, moreInfo } = res;
    return { error, detail: moreInfo };
}
