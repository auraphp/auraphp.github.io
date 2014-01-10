---
title: Aura.Sql_Schema 2.0.0-beta1 Released
layout: post
tags : [v2, aura, sql, schema, beta, release]
author : Paul M. Jones
---

Wrapping up this week's "one release a day" series is the 2.0.0-beta1 release of [Aura.Sql_Schema](https://github.com/auraphp/Aura.Sql_Schema/tree/develop-2). You can [download it](https://github.com/auraphp/Aura.Sql_Schema/releases) directly or install via [Composer and Packagist](https://packagist.org/packages/aura/sql-schema).

The Aura.Sql_Schema package contains PDO-based tools to read table and column information from a database.  If you already use PDO, or if your database abstraction layer of choice uses PDO under the hood, you can feed that PDO object to the _Schema_ object and start reading your table and column information.  (Because it is typehinted to PDO, this means the _Schema_ can use an [Aura.Sql v2](https://github.com/auraphp/Aura.Sql/tree/develop-2) _ExtendedPdo_ object as well.)  The package supports MySQL, PostgreSQL, SQLite, and Microsoft SQL Server.

If you like clean code, fully decoupled libraries, and truly independent packages, then the Aura project is for you. You can download a single package and start using it in your project today, with no added dependencies.

Be sure to join the [mailing list](http://groups.google.com/group/auraphp) and check out the #auraphp IRC channel on Freenode!
