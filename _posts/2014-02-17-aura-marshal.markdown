---
title: Aura.Marshal, A Database-less non-ORM
layout: post
tags : [aura, marshal, orm, sql]
author : Paul M. Jones
---

Today's post is about [Aura.Marshal](https://github.com/auraphp/Aura.Marshal), a database-independent tool that receives results from your data sources and marshals those result sets into domain model objects of your own design, preserving data relationships along the way.

It's probably not correct to call Aura.Marshal an object-relational manager. With ORMs proper like Doctrine and Propel, the ORM issues queries for you using an embedded or preferred database library.

With Aura.Marshal, you use the data retrieval tools of your choice and write your own queries to retrieve data from a data source. You then [load the result data](https://github.com/auraphp/Aura.Marshal#loading-data) into an [entity type object](https://github.com/auraphp/Aura.Marshal#defining-types), and the marshal [automatically wires up entity and collection objects](https://github.com/auraphp/Aura.Marshal#reading-data) for you based on a [relationship scheme](https://github.com/auraphp/Aura.Marshal#defining-relationships) you define for it.

The great benefit of this approach is that it completely decouples the in-memory object wiring from the act of doing the queries in the first place.  The Marshal knows how to build and interrelate the objects, but it has no idea how to get the data for those objects in the first place.  Without the query-building stuff, the Marshal package turns out to be pretty light, comparatively speaking (only about 900 non-comment lines of source code, plus about 1300 lines of tests).

Among other things, this means you can use any database abstraction layer of your choice (or no abstraction layer at all). Indeed, your data source can be anything at all, not just an SQL database. It could be CSV, XML, JSON, the results of an API call, a set of no-SQL documents, or any other format.  As long as the results can be represented as an array, Aura.Marshal can receive them and wire them up into object for you.

Because the Marshal does not issue queries for you, it means a DBA can tune the data retrieval layer of your application to its most efficient use in plain old SQL if needed.  Of course, one of the drawbacks here is that someone on the team actually needs to know how to use SQL (or another data retrieval system of choice).  But for fine control over queries, as well as keeping a good separation of concerns and minimizing the size of your dependency packages, Aura.Marshal is hard to beat.

If you like clean code, fully decoupled libraries, and truly independent packages, then [the Aura project](http://auraphp.com) is for you. Download a single package and start using it in your project today, with no added dependencies. Also be sure to join the [mailing list](http://groups.google.com/group/auraphp) and check out the #auraphp IRC channel on Freenode!
