---
title: Aura.Sql_Query 2.0.0-beta1 Released
layout: post
tags : [v2, sql, beta, release]
author : Paul M. Jones
---

We're happy to announce the 2.0.0-beta1 release of [Aura.Sql_Query][], an database-connection-independent query builder. You can [download it](https://github.com/auraphp/Aura.Sql_Query/releases) directly or install via [Composer and Packagist](https://packagist.org/packages/aura/sql-query).

This is one of the packages that was extracted from the prior [Aura.Sql v1][] package. There was some demand for keeping the database *connection* portions separate from the *query builder* (and other) portions, thus the splitting-up of the original v1 package.

What's interesting (to me anyway) is that originally, I didn't think it would be possible to separate the two.  A query *builder* seemed inextricable from a query *connection*.  But it turned out to be possible, and the separation is pretty clean.  Check out the [README][Aura.Sql_Query] for examples.

If you like clean code, fully decoupled libraries, and truly independent packages, then the Aura project is for you. You can download a single package and start using it in your project today, with no added dependencies.

Be sure to join the [mailing list][] and check out the #auraphp IRC channel on Freenode!

[Aura.Sql v1]: https://github.com/auraphp/Aura.Sql/
[Aura.Sql_Query]: https://github.com/auraphp/Aura.Sql_Query/tree/develop-2
[mailing list]: http://groups.google.com/group/auraphp