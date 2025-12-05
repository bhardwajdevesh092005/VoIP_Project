class ApiResponse {
    constructor(code, message = "Success", data = null) {
        ((this.statusCode = code),
            (this.message = message),
            (this.data = data),(this.success = code >= 200 && code < 300));
    }
}
export {ApiResponse};
