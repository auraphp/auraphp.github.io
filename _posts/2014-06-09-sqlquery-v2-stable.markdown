---
title: Aura.SqlQuery v2 Stable Release
layout: post
tags : [release, v2, sqlquery]
author : Paul M. Jones
---

We released a stable version of [Aura.Sql v2](https://github.com/auraphp/Aura.Sql) a couple of months ago, and as of today its sister package [Aura.SqlQuery](https://github.com/auraphp/Aura.SqlQuery) is at [2.0.0 stable](https://github.com/auraphp/Aura.SqlQuery/releases) as well!

Aura.SqlQuery provides provides a truly independent, fully decoupled package of query-building tools for PHP 5.3 and up.  With it, you can use object-oriented techniques to create SELECT, INSERT, UPDATE, and DELETE queries. The package comes with a set of common base query objects, and provides specialized objects for [MySQL](https://github.com/auraphp/Aura.SqlQuery#mysql-query-objects-mysql), [PostgreSQL](https://github.com/auraphp/Aura.SqlQuery#postgresql-query-objects-pgsql), [SQLite](https://github.com/auraphp/Aura.SqlQuery#sqlite-query-objects-sqlite), and [Microsoft SQL Server](https://github.com/auraphp/Aura.SqlQuery#microsoft-sql-query-objects-sqlsrv).

When we say "truly independent and fully decoupled" we really mean it. The SqlQuery package has no dependencies on any particular database connection system or abstraction layer.  For example, you can build a SELECT query, then pass the finished query string to a PDO connection, a mysql connection, or through the database abstraction layer of your choice. This means the package is suitable for any framework or application that needs a query-building mechanism.

For more information and examples, be sure to take a look at the [Aura.SqlQuery](https://github.com/auraphp/Aura.SqlQuery) README. Download the package and try it today!
