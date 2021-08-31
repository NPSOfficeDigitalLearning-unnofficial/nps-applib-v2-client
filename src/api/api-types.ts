// API response data types.
export type APIDataResponse<T> = { type: "data", data: T };
export type APIErrorResponse = { type: "error", error: string, moreInfo?:string };
export type APISuccessResponse = { type: "success", moreInfo?:string };
export type APIResponse<T> = APIDataResponse<T> | APIErrorResponse | APISuccessResponse;
