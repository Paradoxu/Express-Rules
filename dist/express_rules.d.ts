import { Request, Response, NextFunction } from 'express';
import { Rules } from './interfaces';
export declare class ExpressRules {
    private rules;
    /**
     * Split the given url into an array of paths, ex:
     *
     * /test/route/child will return ['test', 'route', 'child']
     */
    private paths;
    /**
     * Handle a given rule and throw a new Error if one of the handlers of the rule rejects the request
     */
    private validateRule;
    /**
     * Get the rule for a given level
     * @param oPath - The original path, for matching placeholder parameters
     * @param rPath - The replaced path, for matching specific situations
     * @param currentRule - The current rule found by the previous level
     * @returns The found rule for the given path, or null if it doesn't exist
     */
    private getLevelRule;
    /**
     * A ruler that will handle the request and only pass to the next middleware if the current route request is allowed
     */
    ruler: (req: Request, _res: Response, next: NextFunction) => void;
    /**
     * Configure the rules to be applied when the ruler handle is called
     */
    configure: (rules: Rules) => Rules;
}
