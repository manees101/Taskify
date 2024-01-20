class CustomeAPIError extends Error{
    constructor(msg,statusCode)
    {
        super(msg);
        this.statusCode=statusCode;
    }
}

const createCustomeError=(msg,statusCode)=>{
    return new CustomeAPIError(msg,statusCode);
}

module.exports={CustomeAPIError,createCustomeError};