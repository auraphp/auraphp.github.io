---
title: A Peek At Aura v2 -- Aura.Router
layout: post
tags : [v2, router]
author : Paul M. Jones
---

Lately, we've been going over the migration of v2 packages from v1. Today,
I'll talk about the updated [Aura.Router v2][] package. While not an example
of extracting a new package from an existing one, it has a couple of features
that other routers don't currently have, in addition to being truly
independent and completely decoupled from any other package.

(This post describes only some of the features of the router; please visit
the [Aura.Router v2][] package page for full information. Also, unlike v1,
the v2 package is PHP 5.3 compatible!)


### Only Routing, No Dispatching

Anyone using a framework system built in the past 5 years or so should already
be familiar with routers. A router takes the incoming URL path, along with
other optional data, and extracts a series of values that determine what
controller and action should be executed, along with the parameters to send
along to the controller and action.

Most routing systems combine the "routing" task with the "dispatch" task. That
is, they *both* extract the parameters *and* pick the controller/action.
[Aura.Router v2][], because of its truly independent nature, *only* does
routing. It turns out that dispatching is something that can be independent of
routing, and so we have a separate [Aura.Dispatcher][] package to handle that
(although you can use any dispatching system you like).

### The Basics

[Aura.Router v2][] has the basic features one expects: map a path to a route,
define token regexes, etc.

{% highlight php %}
<?php
// add a basic route with name, path, token regexes, and default values
$router->add('blog.read', '/blog/read/{id}{format}')
    ->addTokens(array(
        'id' => '\d+',
        'format' => '(\.\w+)?'
    ))
    ->addValues(array(
        'controller' => 'Blog',
        'action' => 'read',
    ));

// use addGet(), addPost(), etc. to limit the matching HTTP method.
// use setSecure() to limit to secure connections.
?>
{% endhighlight %}

Because [Aura.Router v2][] is completely decoupled, you have to feed it the
incoming URL path and server information when doing matching (it does not make
assumptions about the execution environment):


{% highlight php %}
<?php
// get the incoming request URL path
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// get the route based on the path and server
$route = $router->match($path, $_SERVER);
?>
{% endhighlight %}

If there is a match, the `$route` variable will be a _Route_ object (otherwise
false).  You can then dispatch to the controller and action of your choice
by getting the `$route->params`; the following is naive but works just fine
when autoloading is set up:

{% highlight php %}
<?php
// get the route params
$params = $route->params;

// what class and method should we dispatch to?
$class = "App\Controllers\{$params['controller']}Controller";
$method = $params['action'] . 'Action';

// with the above 'blog.read' route, this will execute
// \App\Controllers\BlogController::readAction()
// and get back the result
$controller = new $class;
$result = $controller->$method($params);
?>
{% endhighlight %}

If you're looking for an independent dispatching system with a little more
power and flexibility, checkout [Aura.Dispatcher][].

### Routing By Server Values

[Aura.Router v2][] allows you to examine the `$_SERVER` values and pick a
route based on them using the `addServer()` method. For example, if you want
to match routes based on the `HTTP_ACCEPT` value ...

{% highlight php %}
<?php
$router->addRoute('json_only', '/accept/json/{id}')
    ->addServer(array(
        // must be of quality *, 1.0, or 0.1-0.9
        'HTTP_ACCEPT' => 'application/json(;q=(\*|1\.0|[0\.[1-9]]))?'
    ));
?>
{% endhighlight %}

In that naive example, there must be a `$_SERVER['HTTP_ACCEPT']` string that
matches the given regex for the route to match. The matching `HTTP_ACCEPT`
portion will be placed in the `$route->params` for you to use as you wish.

### Sequentially Optional Params

Sometimes we need a params in the route path to be *sequentially* optional.
The classic example is a blog archive organized by year, month, and day.
We don't want to have to write three routes, one for `/{year}`, `/{year}/{month}`,
and `/{year}/{month}/{day}`, each with repeated information about the route.

In [Aura.Router v2][], there is a special notation similar to [URI Template][]s
that indicates sequentially optional params:

{% highlight php %}
<?php
$router->add('blog.archive', '/blog/archive{/year,month,day}')
    ->addTokens(array(
        'year'  => '\d{4}',
        'month' => '\d{2}',
        'day'   => '\d{2}'
    ))
    ->addValues(array(
        'controller' => 'blog',
        'action' => 'archive',
        'year' => null,
        'month' => null,
        'day' => null,
    ));
?>
{% endhighlight %}

With that, the following routes will all match the 'archive' route, and will
set the appropriate values:

    /blog/archive
    /blog/archive/1979
    /blog/archive/1979/11
    /blog/archive/1979/11/07

Incidentally, this means that the commonly used controller/action/id catchall
route is easy to implement with defaults in place:

{% highlight php %}
<?php
$router->add('catchall', '{/controller,action,id}')
    ->addValues(array(
        'controller' => 'default',
        'action' => 'index',
        'id' => null,
    ));
?>
{% endhighlight %}

That means `/` will have params indicating the `default` controller `index`
action, `/foo` will indicate the `foo` controller `index` action, `/foo/bar`
will indicate the `foo` controller `bar` action, and `/foo/bar/42` will
indicate the `foo` controller `bar` action with `id` of 42.


### Attaching Route Groups

[Aura.Router v2][] is different from v1 in how it attaches what are variously
called sub-routes or route groups.  Previously, we used a descriptor array,
but in practice that turned out to be a little unwieldly. The new version
uses a callable to allow you attach route groups programmatically:

{% highlight php %}
<?php
// attach routes to the '/blog' path prefix, and prefix all names with 'blog.'
$router->attach('blog', '/blog', function ($router) {
    // blog.browse at /blog
    $router->add('browse', '');
    // blog.read at /blog/read/{id}{format}
    $router->add('read', '/{id}{format}', array(
        ->addTokens(array(
            'id' => '\d+',
            'format' => '(\.\w+)?'
        ));
?>
{% endhighlight %}

See a longer example [here](https://github.com/auraphp/Aura.Router/tree/develop-2#attaching-route-groups).

As a side note, the router will automatically add default `controller` and
`action` values for you here. The `controller` value is the route name prefix,
and the `action` value is the sub-route name. Of course, these can be
overridden by path params or your own default values.

### Attaching REST Routes

As a consequence of using a closure to add route groups, we can now add REST
resource routes in a single call to `attachResource()`:

{% highlight php %}
<?php
$router->attachResource('blog', '/blog');
?>
{% endhighlight %}

This will add seven REST routes with appropriate names, paths, HTTP methods,
and token regexes; you can see the list [here](https://github.com/auraphp/Aura.Router/tree/develop-2#attaching-rest-resource-routes).

If you decide those routes are not to your liking, you can override the
default behavior by using `setResourceCallable()` to pass callable of your own
to create resource routes:

{% highlight php %}
<?php
$router->setResourceCallable(function ($router) {
    $router->addPost('create', '/{id}');
    $router->addGet('read', '/{id}');
    $router->addPatch('update', '/{id}');
    $router->addDelete('delete', '/{id}');
});
?>
{% endhighlight %}

That example will cause four CRUD routes to be added when you call
`attachResource()`.

### Conclusion

The [Aura.Router v2][] library retains the strengths of the v1 offering while
adding convenience and power, all in a completely decoupled package with no
other dependencies. It keeps a separation between routing and dispatching,
allowing you to drop it into any system you like and use any dispatching
mechanism of your own choice.

If you like clean code, fully decoupled libraries, and truly independent
packages, then [the Aura project][Aura] is for you. Download a single package
and start using it in your project today, with no added dependencies.


[Aura.Dispatcher]: https://github.com/auraphp/Aura.Dispatcher
[Aura.Router v2]: https://github.com/auraphp/Aura.Router/tree/develop-2
[Aura.Web]: http://github.com/auraphp/Aura.Web
[Aura]: http://auraphp.com
[Solar]: http://solarphp.com
[full description]: https://github.com/auraphp/Aura.Dispatcher#refactoring-to-architecture-changes
[lessons learned]: http://auraphp.com/blog/2013/09/30/lessons-learned/
[peek at Aura.Sql v2]: http://auraphp.com/blog/2013/10/21/aura-sql-v2-extended-pdo/
[router]: http://github.com/auraphp/Aura.Router
[we extracted Aura.Dispatcher]: http://auraphp.com/blog/2013/11/04/aura-v2-dispatcher/
[Aura.View]: https://github.com/auraphp/Aura.View
[Mustache]: https://github.com/bobthecow/mustache.php
[URI template]: https://tools.ietf.org/html/rfc6570
