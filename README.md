# Express-Rules
A simple ruler that will can help you sampling the way you apply rules to your routes <br />

This is a beta package and should not be used in production!

## Usage

#### Configuring your rules
Preferably create and export a variable with your rules in a new file:
<pre>
const rules: Rules = {
	global: {
		allowAllIf: () => isAuthenticated === true
	}
}
</pre>

A Rules can have the following structure:
<pre>
{
    exclude?: string[];
    global?: Rule;
    routes?: {
        [key: string]: Rule;
    };
};
</pre>

- exclude: Takes an array of routes that will be defined inside the `routes`, all routes passed in this array will ignore the `Rule` defined inside `global`.
- global: Global rules can be used to apply rules to all routes, without having to specify them manually
- routes: Takes an object of `Rule`, where the key corrisponds to the route name of that level.

### What is a level?
The level of a route is how deep your route is inside the yours `Rules`.
Example:
route: `/client/details/:id`
In this case `client` would be a route of first level, `details` second level and the `:id` parameter a third level.

An example of Rule for this case would be:
<pre>
const rules: Rules = {
	global: {
		allowAllIf: () => isAuthenticated === true
	},
	routes: {
		client: {
			routes:{
				details:{
					routes: {
						':id': {

						}
					}
				}
			}
		}
	}
}
</pre>

Each level of the routes key must implement the [Rule](https://github.com/Paradoxu/Express-Rules/blob/master/src/request_rule.ts) that has the following format:

<pre>
interface Rule {
    allowReadIf?: (levelValue: string, req: RequestRule) => boolean;
    allowWriteIf?: (levelValue: string, req: RequestRule) => boolean;
    allowAllIf?: (levelValue: string, req: RequestRule) => boolean;
    routes?: {
        [key: string]: Rule;
    };
}
</pre>

The optional methods `allowReadIf`, `allowWriteIf` and `allowAllIf` can define the behavior of the ruler when that level is reached and they have cascade effect, which mean that if request is rejected by any previous level, but authorize the request on the current level, the request will be rejected anyway, example:

<pre>
'client': {
    allowAllIf: () => false,
    routes: {
	':id': {
	    allowAllIf: () => true
	},
    }
}
</pre>

In this example we have the `client` level that is rejecting any kind of request, but the route `client/:id` that accepts all, for performance reasons the ruler will stop on the first rejected rule, which means that it won't even reach the handler `allowAllIf` inside `:id`
