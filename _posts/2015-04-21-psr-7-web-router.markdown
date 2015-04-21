---
title: A Web Router for PSR-7, with Bookdown Documentation
layout: post
tags : [v3, router, bookdown]
author : Paul M. Jones
---

Last month I wrote about [our plans for Aura 3.x](http://auraphp.com/blog/2015/03/27/aura-3-plans/). Those plans are coming to fruition a bit earlier than I anticipated. Our first 3.x package is now available for review, a [PSR-7][] implementation of [Aura.Router][]. It includes some feature upgrades such as [custom rules][] and [more powerful route definitions][].

This is the first Aura library to use an external dependency. In fact, is uses two: one on the [PSR-3][] logger interface, and one on the proposed [PSR-7][] HTTP message interface.  Please note that these are *interface* dependencies, and not implementation dependencies. Any package that implements those interfaces will fulfill the dependency requirement.

Unfortunately, because of the PSR-7 interface dependency, the Aura.Router package cannot go "stable" until PSR-7 itself does. I expect this will be in the next 30 days or so. In the mean time we may tag preliminary "Google Beta" releases.

On a side note, the package documentation uses [Bookdown][] for its documentation. You can see the generated documentation [here](http://auraphp.com/packages/Aura.Router).  Bookdown allows us to keep documentation sources in each library repository. We can then collect them all into a single "book" on the Aura site using a [bookdown.json](https://github.com/auraphp/auraphp.github.com/blob/master/_bookdown/_packages.bookdown.json) file with remote "content" elements.


[Aura.Router]: https://github.com/auraphp/Aura.Router/tree/3.x#aurarouter
[Bookdown]: http://bookdown.io
[PSR-3]: https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-3-logger-interface.md
[PSR-7]: https://github.com/php-fig/fig-standards/blob/master/proposed/http-message.md
[custom rules]: http://auraphp.com/packages/Aura.Router/advanced-topics.html#1.5.3
[more powerful route definitions]: http://auraphp.com/packages/Aura.Router/defining-routes.html
