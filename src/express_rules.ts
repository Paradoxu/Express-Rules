"use strict"

import { Request, Response, NextFunction } from 'express';
import { UnauthorizedOperation, UnauthorizedWriteOperation } from './exceptions';
import { RequestRule } from './request_rule';
import { Rules, Rule } from './interfaces';

export class ExpressRules {
    private rules: Rules = {};

    /**
     * Split the given url into an array of paths, ex:
     * 
     * /test/route/child will return ['test', 'route', 'child']
     */
    private paths = (url: string) => url.substring(1).split('/') ?? [];

    /**
     * Handle a given rule and throw a new Error if one of the handlers of the rule rejects the request
     */
    private validateRule = (rule: Rule, reqRuler: RequestRule, levelValue: string): boolean => {
        if (rule.allowAllIf && !rule.allowAllIf(levelValue, reqRuler)) {
            throw new UnauthorizedOperation();
        } else if (rule.allowReadIf && reqRuler.isRead() && !rule.allowReadIf(levelValue, reqRuler)) {
            throw new UnauthorizedWriteOperation();
        } else if (rule.allowWriteIf && reqRuler.isWrite() && !rule.allowWriteIf(levelValue, reqRuler)) {
            throw new UnauthorizedWriteOperation();
        }
        return true;
    }

    /**
     * Get the rule for a given level
     * @param oPath - The original path, for matching placeholder parameters
     * @param rPath - The replaced path, for matching specific situations
     * @param currentRule - The current rule found by the previous level
     * @returns The found rule for the given path, or null if it doesn't exist
     */
    private getLevelRule = (oPath: string, rPath: string, currentRule: Rule | null = null): { rule: Rule | null, path: string } => {
        let rules = currentRule === null ? (this.rules.routes ?? {}) : (currentRule.routes ?? {});

        if (rules[rPath])
            return {
                rule: rules[rPath],
                path: rPath
            };
        else if (rules[oPath])
            return {
                rule: rules[oPath],
                path: oPath
            };

        return {
            rule: null,
            path: oPath
        };
    }

    /**
     * A ruler that will handle the request and only pass to the next middleware if the current route request is allowed
     */
    public ruler = (req: Request) => {
        const oPaths = this.paths(req.route.path);
        const rPaths = this.paths(req.originalUrl);

        let index = 0;
        let levelRule = this.getLevelRule(oPaths[index], rPaths[index], null);

        /**
         * Check if there is any global rule the global object,
         * ignore rules setted inside of the given exclude array
         */
        if (this.rules.global && !this.rules.global.exclude?.includes(levelRule.path)) {
            let requestRule = new RequestRule(req, this.rules.global);
            this.validateRule(this.rules.global, requestRule, 'global');
        }

        while (levelRule.rule !== null && index < oPaths.length) {
            let requestRule = new RequestRule(req, levelRule.rule);
            this.validateRule(levelRule.rule, requestRule, levelRule.path);

            index++;
            levelRule = this.getLevelRule(oPaths[index], rPaths[index], levelRule.rule);
        }
    }

    /**
     * Configure the rules to be applied when the ruler handle is called
     */
    public configure = (rules: Rules) => this.rules = rules;

    /**
     * Call this method if you wish to modify express default prototype
     * to always call your ruler, by doing so you won't need to pass a `ruler` to each route
     * 
     * @since 0.0.8-beta
     * @description This is a test method that my change in the future
     * @param route - The Route that can be retrieved from express module, ex: 
     * const route = require('express').Route
     */
    public attach = (route: Function) => {
        const defaultImplementation = route.prototype.dispatch;
        const self = this;

        route.prototype.dispatch = function handle(req: Request, res: Response, next: NextFunction) {
            /// Validate the the call by calling the ruler
            self.ruler(req);

            // Once the rule is validated, call the default implementation
            defaultImplementation.call(this, req, res, next);
        };
    }
}