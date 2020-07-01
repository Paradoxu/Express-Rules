import { ExpressRules } from "./express_rules";
import { Schema } from "jsonschema";


export { Schema } from 'jsonschema';
export * from './interfaces';
export * from './request_rule';

const instance = new ExpressRules();
export const expressRules = instance;
export const ruler = instance.ruler;

/**
 * Creates an schema from the given object
 * 
 * it can be helpful for non ts uses that wants some intellisense
 */
export function createSchema(schema: Schema) {
    return schema
};