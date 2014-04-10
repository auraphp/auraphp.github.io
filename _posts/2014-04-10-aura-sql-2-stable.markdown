---
title: Aura.Sql 2.0 Stable Released
layout: post
tags : [aura, sql]
author : Paul M. Jones
---

Last week, we released [Aura.Sql](https://github.com/auraphp/Aura.Sql) v2 stable. Install it via Composer using `{"require": {"aura/sql": "2.*"}}`, or download a package and read change notes on [the releases page](https://github.com/auraphp/Aura.Sql/releases).

If you're not already familiar with it, the Aura.Sql package primarily provides an _ExtendedPdo_ object with convenience functions extended from _PDO_. This means your existing _PDO_-typehinted code can take an _ExtendedPdo_ object directly. As with all other Aura libraries, it has 100% unit test coverage, and is completely decoupled from all other packages, having no additional dependencies.

Unfortunately, this stable release has a few BC breaks from the "Google beta" release before it:

> Previously, the ExtendedPdo object itself would retain values to bind against the next query. After discussion with interested parties, notably Rasmus Schultz, I was convinced that it was too much of a departure from normal PDO semantics.
> 
> Thus, the collection of values for binding has been removed. The methods query(), exec(), and prepare() no longer take bound values directly. Instead,we have a new method perform() that acts like query() but takes an array of values to bind at query time. We also have a new method prepareWithValues() that prepares a statement and binds values at that time. Finally, the new method fetchAffected() acts like exec(), but with bind values passed at the time of calling (just like with the other fetch*() methods).

But we have a new feature as well thanks to Stan Lemon. If you have an existing PDO instance, you can pass it to the _ExtendedPdo_ constructor to decorate the existing instance with the extended behaviors. This can help in in transitional situations.

Enjoy!
