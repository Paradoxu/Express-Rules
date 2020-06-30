# Express-Rules
A simple ruler that will can help you sampling the way you apply rules to your routes <br />

This is a beta package and should not be used in production!

#Usage

#### Configuring your rules
Preferably create and export a variable with your rules:
```javascript
const rules: Rules = {
	global: {
		allowAllIf: () => isAuthenticated === true
	}
}
```

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
