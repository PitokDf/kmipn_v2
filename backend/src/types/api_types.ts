export interface ResponseApiType {
    success: boolean,
    message: string,
    data?: Object | null,
    errors?: Object
}