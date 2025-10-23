import { MongooseErrorResponse } from "../filters/mongoose-exception/ErrorResponse.type";

export function parseMongoDuplicateError(exception: any): MongooseErrorResponse {
    const duplicatedField = Object.keys(exception.keyPattern || {})[0];
    const duplicatedValue = exception.keyValue?.[duplicatedField];

    const message = `${duplicatedField} ${duplicatedValue} ya se encuentra registrado en la base de datos `

    return {
        statusCode: 409,
        success: false,
        message: message,
        timestamp: new Date().toISOString(),
    }
}