# Express-Rules
A simple ruler that will can help you sampling the way you apply rules to your routes <br />

> This is a beta package and should not be used in production!

## Usage

#### Configuring your rules
> Preferably create and export a variable with your rules in a new file.

Rules can have the following structure:
<pre>
{
    global?: Rule & {
		exclude?: string[];
	};
    routes?: {
        [key: string]: Rule;
    };
};
</pre>

- global: Global rules can be used to apply rules to all routes, without having to specify them manually.
- global.exclude - takes an array of routes that will be defined inside the `routes`, all routes passed in this array will ignore the global `rules`.

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
		allowAllIf: () => isAuthenticated === true,
		exclude: ['login']
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

Each level of the routes key must implement the [Rule](https://github.com/Paradoxu/Express-Rules/blob/master/src/request_rule.ts) interface that has the following format:

<pre>
interface Rule {
	allowReadIf?: (levelValue: string, req: RequestRule) => boolean;
	allowWriteIf?: (levelValue: string, req: RequestRule) => boolean;
	allowAllIf?: (levelValue: string, req: RequestRule) => boolean;
	schema?: Schema;
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

In this example we have the `client` level that is rejecting any kind of request, but the route `client/:id` that accepts all, for performance reasons the ruler will stop on the first rejected rule, which means that it won't even reach the handler `allowAllIf` inside `:id`. Any of these handler will be called with the parameters: `levelValue: string and request: RequestRule`, to help you handle the request easy.

- levelValue: Is a string that has the value of the current level

Example of request: `/client/20`

<pre>
'client': {
	// value in this case will be a string equal to 'client'
	allowAllIf: (value) => false,
	routes: {
		':id': {
			// value is a string, but it's not equal to ':id' instead it will have the actual value of the route, which is '20'
			allowAllIf: (value) => true
		},
	}
}
</pre>

- request: (RequestRule)[https://github.com/Paradoxu/Express-Rules/blob/master/src/request_rule.ts] it's just a simple wrapper around the original `Request` retrieved from the original request of express, that can help you to handle the request with simple method like:
	- `maxLength(N: number): Return false if the length of the body is higher than N`
	- `minLength(N: number): Return false if the length of the body is lower than N`
	- `hasProps(p: string | string[]): Return true if the passed properties exists on the body of this request`
	- `isRead(): if the request type is a Get, Head or Options`
	- `isWrite(): if the request type is a Post, Put or Delete`
	
If you want have a better control of the validation of this information, you can also get the original request by calling the method `original()` on the `RequestRule` object, which will return the original request generated by express.

You can also define schema like the [json schema](https://www.npmjs.com/package/jsonschema) package and pass this schema as a value to the `schema` attribute of any Rule Level, once you have defined a schema, you can easily call the method `isValid` on the `RequestRule` to verify if the body of that level matches the predefined schema.

> To help with intellisense, JS users can define an schema by importing the `createSchema` function that takes a `Schema` as parameter.

#### Usage of schemas
<pre>
const { expressRules, ruler, createSchema } = require('@paradoxu/express-rules');

const loginSchema = createSchema({
	type: 'object',
	properties: {
		email: {
			type: 'string',
			required: true,
			maxLength: 64,
			pattern: /^\S+@\S+\.\S+$/
		},
		password: {
			type: 'string',
			required: true,
			minLength: 8,
			maxLength: 128
		}
	}
});

expressRules.configure({
	routes: {
		login: {
			schema: loginSchema,
			allowReadIf: (_, req) => req.isValid
		}
	}
});

app.post('/login', ruler, function(req, res) {
	// ... Handle your login request
});
</pre>

Once you have defined your rules, just call the method configure like `expressRules.configure(myRules)` in the initialization of your app, and then pass the `ruler` as a middleware for your routes: 
<pre>
app.post('/client/:id', ruler, (req, res) => {
  // ... handle your request
});
</pre>

> The `configure` method should be called only once, preferably when you start your app, if you call it more than once in different scripts, each call will override the previous rules.

#### Attach to express

Since version `0.0.8-beta` it is also possible to modify the default express dispatch handler to always call the our ruler before
calling the route handle, by using this method it unnecessary to pass the ruler in every route.

The `attach` method takes the Route function exposed by the `express` module, example:

<pre>
const Route = require('express').Route;

expressRules.configure(myRules);
expressRules.attach(Route); // Attach our ruler to `express` prototype
</pre>

And now you can just implement your routes like:

<pre>
app.post('/client/:id', (req, res) => {
  // ... handle your request
});
</pre>

And express will always call our `ruler` before your handlers. If you have multiple files with different Routes, you just need to call
`attach` once when you start your app.

> Attention, this is a test method that my change or be removed in the future!
