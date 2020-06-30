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
    public ruler = (req: Request, _res: Response, next: NextFunction) => {
        const oPaths = this.paths(req.route.path);
        const rPaths = this.paths(req.originalUrl);
        const requestRule = new RequestRule(req);

        let index = 0;
        let levelRule = this.getLevelRule(oPaths[index], rPaths[index], null);

        /**
         * Check if there is any global rule the global object,
         * ignore rules setted inside of the given exclude array
         */
        if (this.rules.global && !this.rules.exclude?.includes(levelRule.path)) {
            this.validateRule(this.rules.global, requestRule, 'global');
        }
        while (
            levelRule.rule !== null &&
            this.validateRule(levelRule.rule, requestRule, levelRule.path) &&
            index < oPaths.length
        ) {
            index++;
            levelRule = this.getLevelRule(oPaths[index], rPaths[index], levelRule.rule);
        }

        next();
    }

    /**
     * Configure the rules to be applied when the ruler handle is called
     */
    public configure = (rules: Rules) => this.rules = rules;
}