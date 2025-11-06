class ApiResponse{
    constructor(code,message="Success",data=null){
        this.statusCode = code,
        this.message = message,
        this.data = data
    }
}
export {ApiResponse}