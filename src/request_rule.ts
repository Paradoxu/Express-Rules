"use strict"

import { Request } from 'express';
import { validate, Schema } from 'jsonschema';

export class RequestRule {
    private originalRequest: Request;
    private readTypes = ['GET', 'HEAD', 'OPTIONS'];
    private writeTypes = ['POST', 'PUT', 'DELETE'];

    constructor(request: Request) {
        this.originalRequest = request;
    }

    private contentLength = () => JSON.stringify(this.originalRequest.body).length;

    /**
     * Get the original request retrieved from express
     */
    original = () => this.originalRequest;

    /**
     * True if the content of the body is lower or equal than the given length
     */
    maxLength = (length: number) => this.contentLength() <= length;

    /**
     * True if the content of the body is higher or equal than the given length
     */
    minLength = (length: number) => this.contentLength() >= length;

    /**
     * True if the given properties exists on the body of the original request
     * 
     * The body of the request must be in the format of x-www-form-urlencoded
     */
    hasProps = (properties: string | string[]) => {
        if (Array.isArray(properties)) {
            return properties.every(prop => this.originalRequest.body[prop] !== undefined);
        } else {
            return this.originalRequest.body[properties] !== undefined;
        }
    }

    /**
     * True if the original request is a Get, Head or Options
     */
    isRead = () => this.readTypes.includes(this.original().method);

    /**
     * True if the original request is a Post, Put or Delete
     */
    isWrite = () => this.writeTypes.includes(this.original().method);

    /**
     * Validate the body with the given schema, the validation will be made using the jsonschema package,
     * 
     * @tutorial https://www.npmjs.com/package/jsonschema
     */
    validSchema = (schema: Schema) => validate(this.original().body, schema).valid;
}