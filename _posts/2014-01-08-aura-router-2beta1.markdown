---
title: Aura.Router 2.0.0-beta1 Released
layout: post
tags : [v2, aura, router, beta, release]
author : Paul M. Jones
---

Continuing our string of library package releases, today we have the 2.0.0-beta1 release of [Aura.Router](https://github.com/auraphp/Aura.Router/tree/2.x). Given a URL path and a copy of `$_SERVER`, it will extract path-info and `$_SERVER` values for a specific route. You can [download it](https://github.com/auraphp/Aura.Router/releases) directly or install via [Composer and Packagist](https://packagist.org/packages/aura/router).

The Aura.Router package does not provide a dispatching mechanism. Your application is expected to take the information provided by the matching route and dispatch to a controller on its own. You might do this with [Aura.Dispatcher](https://github.com/auraphp/Aura.Dispatcher/tree/2.x) or with [some other system of your own devising](https://github.com/auraphp/Aura.Router/tree/2.x#dispatching-a-route).

In addition to all the standard stuff like adding routes and generating links, Aura.Router has some added conveniences:

- [Nice-looking "optional" params.](https://github.com/auraphp/Aura.Router/tree/2.x#optional-params) To specify optional params, use a notation like `{/year,month,day}` in the path. Optional params are sequentially optional. This means that, in the example, you cannot have a "day" without a "month", and you cannot have a "month" without a "year". If you generate a link with optional params, the params will be filled in if they are present in the data for the link.

- [Attaching route groups.](https://github.com/auraphp/Aura.Router/tree/2.x#attaching-route-groups) You can add a series of routes all at once under a single "mount point" in your application via a closure.

- [Attaching REST resource routes.](https://github.com/auraphp/Aura.Router/tree/2.x#attaching-rest-resource-routes) The router can attach a series of REST resource routes for you with the `attachResource()` method. One call to that method with a resource name and base path will add named `browse`, `read`, `edit`, `add`, `delete`, `create`, `update`, and `replace` routes for you under that base path. Don't like the defaults on those? Set your own resource attachment callback with `setResourceCallback()`.

If you like clean code, fully decoupled libraries, and truly independent packages, then the Aura project is for you. You can download a single package and start using it in your project today, with no added dependencies.

Be sure to join the [mailing list](http://groups.google.com/group/auraphp) and check out the #auraphp IRC channel on Freenode!
