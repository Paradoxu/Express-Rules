/// <reference types="qs" />
import { Request } from 'express';
import { Schema } from 'jsonschema';
export declare class RequestRule {
    private originalRequest;
    private readTypes;
    private writeTypes;
    constructor(request: Request);
    private contentLength;
    /**
     * Get the original request retrieved from express
     */
    original: () => Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs>;
    /**
     * True if the content of the body is lower or equal than the given length
     */
    maxLength: (length: number) => boolean;
    /**
     * True if the content of the body is higher or equal than the given length
     */
    minLength: (length: number) => boolean;
    /**
     * True if the given properties exists on the body of the original request
     *
     * The body of the request must be in the format of x-www-form-urlencoded
     */
    hasProps: (properties: string | string[]) => boolean;
    /**
     * True if the original request is a Get, Head or Options
     */
    isRead: () => boolean;
    /**
     * True if the original request is a Post, Put or Delete
     */
    isWrite: () => boolean;
    /**
     * Validate the body with the given schema, the validation will be made using the jsonschema package,
     *
     * @tutorial https://www.npmjs.com/package/jsonschema
     */
    validSchema: (schema: Schema) => boolean;
}
