/// <reference types="qs" />
/// <reference types="express" />
import { ExpressRules } from "./express_rules";
export { Schema } from 'jsonschema';
export * from './interfaces';
export * from './request_rule';
export declare const expressRules: () => ExpressRules;
export declare const ruler: (req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs>, _res: import("express").Response<any>, next: import("express").NextFunction) => void;
