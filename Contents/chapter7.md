# Routing #

The routing for the framework is made possible with the help of Aura.Router.
Aura Router is a PHP package that implements web routing. Given a URI path and
a copy of `$_SERVER`, it will extract controller, action, and parameter values
for a specific application route.

Your application foundation or framework is expected to take the information
provided by the matching route and dispatch to a controller on its own. As
long as your system can provide a URI path string and a representative copy of
`$_SERVER`, you can use Aura Router.

Aura Router is inspired by [Solar rewrite
rules](http://solarphp.com/manual/dispatch-cycle.rewrite-rules) and
<http://routes.groovie.org>.

## Adding A Route ##

To create a route, call the `add()` method.

    [php]
    <?php
    // add a simple named route without params
    $di->get('router_map')->add('home', '/');
    
    // add a simple unnamed route with params
    $di->get('router_map')->add(null, '/{:controller}/{:action}/{:id:(\d+)}');
    
    // add a complex named route
    $di->get('router_map')->add('read', '/blog/read/{:id}{:format}', [
        'params' => [
            'id'     => '(\d+)',
            'format' => '(\..+)?',
        ],
        'values' => [
            'controller' => 'blog',
            'action'     => 'read',
            'format'     => 'html',
        ],
    ]);

## Generating A Route Path ##

### Inside Controller ###

To generate a URI path from a route so that you can create links, call
`generate()` on the router object and provide the route name.

    [php]
    <?php
    // $path => "/blog/read/42.atom"
    $path = $this->router->generate('read', [
        'id' => 42,
        'format' => '.atom',
    ]);

Aura Router does not do dynamic matching of routes; a route must have a name
to be able to generate a path from it.

The example shows that passing an array of data as the second parameter will
cause that data to be interpolated into the route path. This data array is
optional. If there are path params without matching data keys, those params
will *not* be replaced, leaving the `{:param}` token in the path. If there are
data keys without matching params, those values will not be added to the path.

## Advanced Usage ##

## Complex Route Specification ##

When you add a complex route specification, you describe extra information
related to the path as an array with one or more of the following recognized
keys:

- `params` -- The regular expression subpatterns for path params; inline 
params will override these settings. For example:
        
        'params' => [
            'id' => '(\d+)',
        ]
        
  Note that the path itself is allowed to contain param tokens with inline 
  regular expressions; e.g., `/read/{:id:(\d+)}`.  This may be easier to read in some cases.

- `values` -- The default values for the route. These will be overwritten 
by matching params from the path.

        'values' => [
            'controller' => 'blog',
            'action' => 'read',
            'id' => 1,
        ]
        
- `method` -- The `$server['REQUEST_METHOD']` must match one of these values.

- `secure` -- When `true` the `$server['HTTPS']` value must be on, or the 
request must be on port 443; when `false`, neither of those must be in place.

- `routable` -- When `false` the route will not be used for matching, 
only for generating paths.

- `is_match` -- A custom callback or closure with the signature 
`function(array $server, \ArrayObject $matches)` that returns true on a 
match, or false if not. This allows developers to build any kind of matching 
logic for the route, and to change the `$matches` for param values from the path.

- `generate` -- A custom callback or closure with the signature 
`function(\aura\router\Route $route, array $data)` that returns a modified 
`$data` array to be used when generating the path.

Here is a full route specification named `read` with all keys in place:

    [php]
    <?php
    $di->get('router_map')->add('read', '/blog/read/{:id}{:format}', [
        'params' => [
            'id' => '(\d+)',
            'format' => '(\..+)?',
        ],
        'values' => [
            'controller' => 'blog',
            'action' => 'read',
            'id' => 1,
            'format' => '.html',
        ],
        'secure' => false,
        'method' => ['GET'],
        'routable' => true,
        'is_match' => function(array $server, \ArrayObject $matches) {
                
            // disallow matching if referred from example.com
            if ($server['HTTP_REFERER'] == 'http://example.com') {
                return false;
            }
            
            // add the referer from $server to the match values
            $matches['referer'] = $server['HTTP_REFERER'];
            return true;
            
        },
        'generate' => function(\Aura\Router\Route $route, array $data) {
            $data['foo'] = 'bar';
            return $data;
        }
    ]);


Note that using closures, instead of callbacks, means you will not be able to
`serialize()` or `var_export()` the router for caching.


## Simple Routes ##

You don't need to specify a complex route specification. If you pass a string
for the route instead of an array ...

    [php]
    <?php
    $di->get('router_map')->add('archive', '/archive/{:year}/{:month}/{:day}');


... then Aura Router will use a default subpattern that matches everything
except slashes for the path params, and use the route name as the default
value for `'action'`. Thus, the above short-form route is equivalent to the
following long-form route:

    [php]
    <?php
    $di->get('router_map')->add('archive', '/archive/{:year}/{:month}/{:day}', [
        'params' => [
            'year'  => '([^/]+)',
            'month' => '([^/]+)',
            'day'   => '([^/]+)',
        ],
        'values' => [
            'action' => 'archive',
        ],
    ]);


## Wildcard Routes ##

Sometimes it is useful to allow the trailing part of the path be anything at
all. There are two types of such "wildcard" routes. (Wildcard routing of this
sort works only when specified at the end of the path.)

The first is a "values optional" named wildcard, represented by adding
`/{:foo*}` to the end of the path. This will allow the route to match
anything after that point, including nothing at all. On a match, it will
collect the remaining slash-separated values into a sequential array named
`'foo'`. Notably, the matched path with no wildcard values may have a slash at
the end or not.

    [php]
    <?php
    $di->get('router_map')->add('wild_post', '/post/{:id}/{:other*}');
    
    // this matches, with the following values
    $route = $di->get('router_map')->match('/post/88/foo/bar/baz', $_SERVER);
    // $route->values['id'] = 88;
    // $route->values['other'] = ['foo', 'bar', 'baz'];
    
    // this also matches, with the following values; note the trailing slash
    $route = $di->get('router_map')->match('/post/88/', $_SERVER);
    // $route->values['id'] = 88;
    // $route->values['other'] = [];
    
    // this also matches, with the following values; note the missing slash
    $route = $di->get('router_map')->match('/post/88', $_SERVER);
    // $route->values['id'] = 88;
    // $route->values['other'] = [];


The second is a "values required" wildcard, represented by adding `/{:foo+}`
to the end of the path. This will allow the route to match anything at all
after that point, but there must be at least one slash and an additional
value. On a match, it will collect the remaining slash-separated values into a
sequential array named `'foo'`.

    [php]
    <?php
    $di->get('router_map')->add('wild_post', '/post/{:id}/{:other+}');
    
    // this matches, with the following values
    $route = $di->get('router_map')->match('/post/88/foo/bar/baz', $_SERVER);
    // $route->values['id'] = 88;
    // $route->values['other'] = ['foo', 'bar', 'baz'];
    
    // these do not match
    $route = $di->get('router_map')->match('/post/88/', $_SERVER);
    $route = $di->get('router_map')->match('/post/88', $_SERVER);


> N.b.: In previous releases of the router, `'/*'` was the wildcard
> indicator, with wildcard values collected in an array named `'*'`. This
> behavior remains available but is deprecated.


## Attaching Route Groups ##

You can add a series of routes all at once under a single "mount point" in
your application. For example, if you want all your blog-related routes to be
mounted at `'/blog'` in your application, you can do this:

    [php]
    <?php
    $di->get('router_map')->attach('/blog', [
        
        // the routes to attach
        'routes' => [
            
            // a short-form route named 'browse'
            'browse' => '/',
            
            // a long-form route named 'read'
            'read' => [
                'path' => '/{:id}{:format}',
                'params' => [
                    'id'     => '(\d+)',
                    'format' => '(\.json|\.atom)?'
                ],
                'values' => [
                    'format' => '.html',
                ],
            ],
            
            // a short-form route named 'edit'
            'edit' => '/{:id:(\d+)}/edit',
        ],
    ]);

    
Each of the route paths will be prefixed with `/blog`, so the effective paths
become:

- `browse: /blog/`
- `read:   /blog/{:id}{:format}`
- `edit:   /blog/{:id}/edit`

You can set other route specification keys as part of the attachment
specification; these will be used as the defaults for each attached route, so
you don't need to repeat common information:

    [php]
    <?php
    $di->get('router_map')->attach('/blog', [
        
        // common params for the routes
        'params' => [
            'id'     => '(\d+)',
            'format' => '(\.json|\.atom)?',
        ],
        
        // common values for the routes
        'values' => [
            'controller' => 'blog',
            'format'     => '.html',
        ],
    
        // the routes to attach
        'routes' => [
            'browse' => '/',
            'read'   => '/{:id}{:format}',
            'edit'   => '/{:id}/edit',
        ],
    ));

## Inside controller ##

RouterMap objects are availble inside controller as `$this->router`

    [php]
    $this->router->generategenerate('read', [
        'id' => 42,
        'format' => '.atom',
    ]);

## Inside view ##

You can generate routes as  

    [php]
    $this->route('read', [
        'id' => 42,
        'format' => '.atom',
    ]);
