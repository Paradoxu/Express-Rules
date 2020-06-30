import { ExpressRules } from "./express_rules";

const instance = new ExpressRules();

export { Schema } from 'jsonschema';
export * from './interfaces';
export * from './request_rule';

export const expressRules = () => instance;
export const ruler = instance.ruler;