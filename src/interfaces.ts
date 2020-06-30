import { RequestRule } from "./request_rule";

export interface Rule {
    /**
     * Define wheter read requests should be rejected or not
     * this method by default will only check for GET, HEAD and OPTIONS requests
     * @param levelValueThe levelValue is value of the current path level
     * so if you areinside a placeholder parameter like [client/:id], the levelValue will be the given :id matched in the url
     * 
     * @param req - A wrapper that has the original request for further customizations and also usefull methods to help you treat the request
     * 
     * Keep your handler small and fast as possible, to avoid wasting time validating the rules
     */
    allowReadIf?: (levelValue: string, req: RequestRule) => boolean,

    /**
     * Define wheter write requests should be rejected or not
     * this method by default will only check for POST, PUT and DELETE requests
     * @param levelValueThe levelValue is value of the current path level
     * so if you areinside a placeholder parameter like [client/:id], the levelValue will be the given :id matched in the url
     *
     * @param req - A wrapper that has the original request for further customizations and also usefull methods to help you treat the request
     * 
     * Keep your handler small and fast as possible, to avoid wasting time validating the rules
     */
    allowWriteIf?: (levelValue: string, req: RequestRule) => boolean,

    /**
     * If defined, this method will override the behavior of allowWriteIf and allowReadIf
     * 
     * be careful when using it, since it can allow both Read and Write in any kind of request
     * @param levelValueThe levelValue is value of the current path level
     * so if you areinside a placeholder parameter like [client/:id], the levelValue will be the given :id matched in the url
     *
     * @param req - A wrapper that has the original request for further customizations and also usefull methods to help you treat the request
     * 
     * Keep your handler small and fast as possible, to avoid wasting time validating the rules
     */
    allowAllIf?: (levelValue: string, req: RequestRule) => boolean,

    /**
     * The routes children of the current one,
     * 
     * All parent rules can be overriden on the children as well, but if a parent rule reject a request
     * the rule setted on the child won't be considered
     */
    routes?: {
        /**
         * Define a key rule for a route, where the key is the route name
         * 
         * User the [:key] as key name, if you want to point to a generic key value that can change
         * such as /client/:id or /product/:name
         */
        [key: string]: Rule,
    }
}

export type Rules = {
    /**
     * Exclude specific routes from the global rules,
     * 
     * If a route name is inserted here, the validator will skip the rules defined inside the of the global rules
     * 
     * this exclude array will only check for first level routes, which means that a value like: client/:id will have no effect
     */
    exclude?: string[],

    /**
     * Use this to apply global rules for all routes inside the `routes`
     */
    global?: Rule,

    routes?: {
        /**
         * Define a key rule for a route, where the key is the route name
         */
        [key: string]: Rule,
    }
}