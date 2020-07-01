"use strict"

import { Request } from 'express';
import { validate, Schema } from 'jsonschema';
import { Rule } from './interfaces';

export class RequestRule {
    private originalRequest: Request;
    private readTypes = ['GET', 'HEAD', 'OPTIONS'];
    private writeTypes = ['POST', 'PUT', 'DELETE'];

    private rule: Rule | null;

    constructor(request: Request, rule: Rule | null) {
        this.originalRequest = request;
        this.rule = rule;
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
     * Validate the body of the current rule level using the defined schema for this level, 
     * 
     * If no schema has been defined or the body doesn't exist, it will return false
     * 
     * Lean more about schemas on:
     * @tutorial https://www.npmjs.com/package/jsonschema
     */
    get isValid(): boolean {
        let hasBody = this.original() && this.original().body;
        let schemaValidation = validate(this.original().body, (this.rule?.schema || {})).valid;

        return hasBody && schemaValidation;
    }
}