---
title: A Peek At Aura v2 -- Aura.Sql and ExtendedPdo
layout: post
tags : [v2, sql, pdo]
author : Paul M. Jones
---

In the [lessons learned][] post, I talked about how [Aura][] was born of the
idea that we could extract independent decoupled packages from [Solar][], and
how in doing so, we discovered that some of those extracted packages themselves
could be further split into independent pieces.

For example, take [Aura.Sql][]. From [Solar_Sql][], we pulled out the database
connection abstraction layers, the query objects, and the schema discovery
tools, then added on a connection manager and a mapper/gateway implementation.
It was very natural to think of all these things as belonging together; they
all need an SQL connection, so of course they should be bundled with an
SQL connection implementation, right?

### Even More Decoupling

Well, it turns out that merely extracting the SQL parts was not good enough
for some of our audience. They asked, "Can we download *just* the SQL
connection classes, without the query objects or the mapper?" As with Solar,
we had to answer, "No; although the Aura.Sql package is independent from every
other Aura package, the various SQL tools all have be taken together as a
whole."

As a result, we have done even more decoupling with the [Aura.Sql-v2][]
packages.  We have managed to make these packages independent from each other:

- [Aura.Sql-v2][] is composed primarily of an extended PDO implementation,
  along with a connection manager and a bare-bones profiler. Its only
  dependency is the native [PDO][]; there are no userland dependencies. As an
  added bonus, we have taken pains to make it PHP 5.3 compatible.

- [Aura.Sql_Query][] is a package of SELECT, INSERT, UPDATE, and DELETE query
  objects for MySQL, PostgreSQL, SQLite, and Microsoft SQL Server. It has no
  dependencies at all, not even on PDO. You build your query with the object,
  then pass it along to the database abstraction layer of your choice. Because
  it uses traits, it is for PHP 5.4 and up.

- [Aura.Sql_Schema][] comprises "list tables" and "list columns" functionality
  for MySQL, PostgreSQL, SQLite, and Microsoft. As with [Aura.Sql-v2][], its
  only dependency is the native [PDO][] (note, **not** the Aura.Sql-v2
  _ExtendedPdo_). Also as with [Aura.Sql-v2][], it is PHP 5.3 compatible.

With this dedicated effort at decoupling and true independence, you can now
use *just* the extended PDO connection object, *or* the query objects, *or*
the schema discovery tools, without having to download the others. Of course,
you can use them all in concert if you like.

Let's talk a little more about just the new [Aura.Sql-v2][] package.

### Aura.Sql-v2: The ExtendedPdo Class

Instead of wrapping PDO, the _ExtendedPdo_ class extends PDO directly. Among
other things, this means you can drop it into any code already using PDO,
including methods and functions typhinted against PDO, with no changes.

> (N.b.: The only caveat here is that persistent connections may be an issue
> with extensions of PDO. If you simply cannot do without persistent
> connections, ExtendedPdo may not be for you.)

Once you have replaced PDO with ExtendedPdo, you can begin to use the added
functionality in [Aura.Sql-v2][] piece by piece.

- **[Lazy connection.][]** _ExtendedPdo_ connects to the database only on
  method calls that require a connection. This means you can create an
  instance and not incur the cost of a connection if you never make a query.

- **[Bind values.][]** You may provide values for binding to the next query
  using `bindValues()`. Multiple calls to `bindValues()` will merge, not
  reset, the values. The values will be reset after calling `query()`,
  `exec()`, `prepare()`, or any of the `fetch*()` methods. In addition,
  binding values that do not have any corresponding placeholders will not
  cause an error.

- **[Array quoting.][]** The `quote()` method will accept an array as input,
  and return a string of comma-separated quoted values. In addition, named
  placeholders in prepared statements that are bound to array values will be
  replaced with comma-separated quoted values. This means you can bind an
  array of values to a placeholder used with an `IN (...)` condition.

- **[Fetch methods.][]** _ExtendedPdo_ provides several `fetch*()` methods for
  commonly-used fetch styles. For example, you can call `fetchAll()` directly
  on the instance instead of having to prepare a statement, bind values,
  execute, and then fetch from the prepared statement. All of the `fetch*()`
  methods take an array of values to bind to to the query statement.

- **Exceptions by default.** _ExtendedPdo_ starts in the
  `ERRMODE_EXCEPTION` mode for error reporting instead of the `ERRMODE_SILENT`
  mode.

- **[Profiler.][]** An optional query profiler is provided, along with an
  interface for other implementations.

- **[Connection locator.][]** A optional lazy-loading service locator is
  provided for picking different database connections (default, read, and
  write).

All this functionality is the result of extracting three classes, plus interfaces and
exceptions, into their own independent package.

### Conclusion

If you are the kind of developer who likes clean code, fully decoupled
libraries, and truly independent packages, then you can see from the above
examples that [the Aura project][Aura] is for you. Download a single library
package and start using it in your project today, with no added dependencies.


[lessons learned]: http://auraphp.com/blog/2013/09/30/lessons-learned/
[Aura]: http://auraphp.com
[Solar]: http://solarphp.com
[Solar_Sql]: http://solarphp.com/apidoc/package.Solar_Sql
[PDO]: http://php.net/pdo
[Aura.Sql]: http://github.com/auraphp/Aura.Sql
[Aura.Sql-v2]: https://github.com/auraphp/Aura.Sql/tree/2.x
[Aura.Sql_Query]: https://github.com/auraphp/Aura.Sql_Query/tree/2.x
[Aura.Sql_Schema]: https://github.com/auraphp/Aura.Sql_Schema/tree/2.x
[Lazy connection.]: https://github.com/auraphp/Aura.Sql/tree/2.x#lazy-connection
[Bind values.]: https://github.com/auraphp/Aura.Sql/tree/2.x#bind-values
[Array quoting.]: https://github.com/auraphp/Aura.Sql/tree/2.x#array-quoting
[Fetch methods.]: https://github.com/auraphp/Aura.Sql/tree/2.x#fetch-methods
[Profiler.]: https://github.com/auraphp/Aura.Sql/tree/2.x#profiler
[Connection locator.]: https://github.com/auraphp/Aura.Sql/tree/2.x#connection-locator

