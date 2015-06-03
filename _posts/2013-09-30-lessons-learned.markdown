---
title: Lessons Learned From The Aura Project
layout: post
tags : [general]
author : Paul M. Jones
---

## tl;dr

- "Libraries first" is the way to go; it imposes good discipline

- Extracting is detailed work, but you get testable units

- DependencyInjection is awesome ...

- ... but in-library ServiceLocators can be useful

- There are still lots of PHP 5.3 users

- If you have server or session vars in your HTTP request object, it's not an
  HTTP request object

- Some packages are still too broad in scope

- From PEAR to Composer

- People love ORMs

- New packages: Aura.Dispatcher, Aura.Includer, Aura.Sql_Query, and others

- PHP 5.3 support in some new packages

## Introduction

As you may know, [Aura][] is essentially the second version of the [Solar][] framework. (The name change was to differentiate from the later-arriving but more well-known [Solr][].)

Whereas Solar was monolithic, Aura is primarily a series of completely independent libraries extracted from Solar. Each library in Aura is completely independent of the others. It also provides a system package that composes the various libararies into a full-stack framework.

I present this article to give insight into some (but not all) of the lessons learned from the process of creating the Aura project packages.  (To list "all" would take way too long, and this article long enough already.)

## Looking Back

### "Libraries First" Is The Way To Go

Extracting libraries first, and only then going on to find a way to tie them together in a framework, was exactly the right approach.  Having the discipline to say that no one library could depend on any other changed the way we looked at how a framework should operate, and how the libraries should interact in a framework. It gave us libraries that can be used in *any* system, not just an Aura system.

Having said that, it was our practice to have a proof-of-concept framework system running along the way, so that we could test the tying-together process as we went.  As we realized what worked and what didn't at the framework level, we were able to go back and revise the library so that it was more friendly in a shared system.

### Extracting Is Detailed Work, But You Get Testable Units

Just because the code to be extracted already exists, does not mean it's easy to extract it. Since the original system was monolithic, tracing the dependencies and either extracting them or copying them was a time-consuming process. Because the original system did not have 100% test coverage, we needed to write unit tests for the newly extracted units. However, by extacting the units, it was actually *possible* to write unit tests.

### DependencyInjection Is Awesome ...

Solar used a variation of ServiceLocator for inversion of control. When you have control of the whole system, ServiceLocator is reasonable, but in a suite of completely independent libraries, using a ServiceLocator to coordinate them means introducing a dependency. That in turn means the packages are no longer independent of each other. This is why we setted on using DependencyInjection early in the project (and even then only after trying lots of different ServiceLocator variations).

Using DependencyInjection for the libraries has been a complete and total win. Aside from having to change how you think about dependencies, the technique provides an unmitigated positive outcome.  The added bonus of having the [Aura.Di][] DependencyInjection container to manage injections has likewise been of immense benefit.

### ... But In-Library ServiceLocators Can Be Useful

However, using a ServiceLocator *inside* a library *only* for the purposes of that library has turned out to be a reasonable approach.  For example, the helpers in [Aura.View][] are collected into a locator, and the locator is injected into the template object.  That particular locator is not reused outside the Aura.View package.

Each package that ends up needing a locator gets its own, sometimes more than one depending on the service that needs to be located.  Obviously this is not [DRY][] behavior.  The tradeoff is that you completely avoid the temptation to use a shared ServiceLocator across multiple packages, thereby introducing dependencies and reducing testability.

(Incidentally, writing a ServiceLocator is dead simple in PHP 5.3 and later; perhaps that deserves a post of its own.)

### There Are Still Lots Of PHP 5.3 Users

The first major work on the Aura project started in Feb 2011. At that time, we targeted PHP 5.3, which had been out for quite a while.  When PHP 5.4 came out in Mar 2012, it was too hard to resist the new short array syntax and `callable` typehint, so we changed the minimum PHP requirement to 5.4.  Adoption of PHP 5.4 has not been as quick as we thought it might be; we still get lots of requests for 5.3 versions of the packages.  Some folks have actually backported some of the packages to 5.3.

### You Keep Saying "HTTP" -- I Do Not Think It Means What You Think It Means

If you have representations of `$_ENV`, `$_SERVER`, or `$_SESSION` in your HTTP request object, it's not an *HTTP* request object.  The same goes for a wide range of other functionality.  An HTTP request is composed of headers and content, not server variables.  Your request object may be a *web* request, or it may be a representation of the PHP execution context, but it's not an HTTP request object.

For us, providing an [Aura.Web][] request object completely independent of an HTTP (proper) request object was a big win.  The web (not HTTP) response object, as a data-transfer object, being able to be translated to any other HTTP response, was also a big win for testability and separation of concerns.

### Some Packages Still Too Broad In Scope

We successfully made the split between bootstrapping (at the framework level), routing, front-controller dispatching, the actual controllers, and the HTTP request/response cycle; between command-line dispatching and the actual commands; between input modeling, input filtering, and form output generation; between session handling and everything else; and so on.

However, it turns out that some packages can be split apart even more. For example, the [Aura.Web][] package could easily have the web "request" and "response" objects (not to be confused with HTTP request/response) removed to their own package for reuse; likewise, the internal dispatching mechanism can be pulled out for reuse as well.  [Aura.Sql][], [Aura.Cli][], [Aura.View][], and even parts of the framework itself have candidates for further extraction.

The drive to put more functionality in a library can be unnoticeable, even when your explicit goal is to separate concerns, because you're used to thinking about a problem in a certain way.  That can make it hard to see which pieces *may* be delivered separately and which *must* go togther.

### From PEAR to Composer

When we started the project, [PEAR][] was still the package manager of record in PHP land.  We centered our release process around writing PEAR `package.xml` files, based on the previous Solar release process.  When Composer came along, we tried for a while to target both packaging systems.  I will admit to dismissing Composer at first and trying very hard to make PEAR do what we wanted (I am as susceptible to inertia as anyone else ;-) but in the end Composer was much more suited to our needs.  (I say this as someone who has a long PEAR history and background.)

### People Love ORMs

Aura provides a DataMapper as part of [Aura.Sql][], and a marshalling tool in [Aura.Marshal][], so you can build your own model layer any way you like.  But people (reasonably) want something to do all the work for them. We had `Solar_Sql_Model` previously, and there's been an expectation that we'll provide something similar in Aura.

Writing a *good* ORM is exceptionally difficult, time-consuming, and detail-oriented. It is a huge time-sink and takes over your life.  It also turns out that an ORM is, by its nature, not something that is easy to decouple.  Finally, *using* an ORM seems like heaven at first, until you reach the edges of its usability, and then like a Twilight Zone episode you realize you are actually in hell.

So, not providing an ORM has been a mixed bag. We have been able to concentrate on other useful components without getting dragged down by writing an ORM.  On the other hand, there's clearly a desire for them in the PHP world. The lack of an ORM package for Aura has been perceived as a negative by some people, even as they also note they want to do things their own way.


## Looking Ahead

As we improve on Aura v1 and begin work on Aura v2 libraries, here's some of what we expect to do.

### Further Extraction

As noted above, some packages have functionality candidates for extraction.

We can derive an [Aura.Dispatcher][] package from combined functionality of the [Aura.Cli][], [Aura.Web][], and [Aura.Framework][] packages. This makes full-stack *and* micro-framework dispatch styles available in a single package.

The [Aura.Web][] package can have its request/response objects extracted as well. At that point, because dispatching has been extracted, there's no need for a base controller object in [Aura.Web][]. Your own controllers become trivial to implement in any way you like. The same goes for [Aura.Cli][], in that the _Context_ and _Stdio_ objects can live in a package of their own, leaving commands for independent implementation.

The framework package has a technique for including configuration files from the various packages. This can be pulled out into a general-purpose [Aura.Includer][] package.

The [Aura.View][] package currently has the helpers bound to it, but it turns out the helpers are easily extractable to their own [Aura.Html][] package.

The [Aura.Sql][] package is particularly interesting.  It seems like the database connection functions, query objects, and schema discovery functions all have to be bound together.  But, by moving some of the functionality around, it turns out they can be split up into their own independent packages.  Take a look at [Aura.Sql-2.x][], [Aura.Sql_Query][], and [Aura.Sql_Schema][] to see how we're doing it.

### Package Organization

As you can see from the new packages, we expect to use [PSR-4][] instead of [PSR-0][]. This makes the `src/` and `tests/` directories somewhat more shallow and easier to navigate.  We will be getting rid of the `meta/` directory, since it was an artifact of attempting to maintain both PEAR and Composer packages.

### PHP 5.3

Where reasonable, we will consider re-implementing functionality for PHP 5.3, but this is likely to be the case only for v2 libraries.

This is something we've gone back-and-forth on, and it's been a hard call.  Basically, if a library must have traits, it will be PHP 5.4 only; otherwise, we might try to use the old array syntax and avoid the `callable` typehint for the sake of broader usability.

## That's All For Now

There's a lot of other stuff in the works, but that's all we can discuss for now!  Join the [mailing list][] and watch us on [Twitter][] for more updates.


[Aura.Cli]: https://github.com/auraphp/Aura.Cli
[Aura.Di]: https://github.com/auraphp/Aura.Di
[Aura.Dispatcher]: https://github.com/auraphp/Aura.Dispatcher
[Aura.Filter]: https://github.com/auraphp/Aura.Filter
[Aura.Framework]: https://github.com/auraphp/Aura.Framework
[Aura.Html]: https://github.com/auraphp/Aura.Html
[Aura.Includer]: https://github.com/auraphp/Aura.Includer
[Aura.Input]: https://github.com/auraphp/Aura.Input
[Aura.Marshal]: https://github.com/auraphp/Aura.Marshal
[Aura.Sql-2.x]: https://github.com/auraphp/Aura.Sql/tree/2.x
[Aura.Sql]: https://github.com/auraphp/Aura.Sql
[Aura.Sql_Query]: https://github.com/auraphp/Aura.Sql_Query
[Aura.Sql_Schema]: https://github.com/auraphp/Aura.Sql_Schema
[Aura.View]: https://github.com/auraphp/Aura.View
[Aura.Web]: https://github.com/auraphp/Aura.Web
[Aura]: http://auraphp.com
[PEAR]: http://pear.php.net
[Solar]: http://solarphp.com
[Solr]: https://lucene.apache.org/solr/
[PSR-4]: https://github.com/php-fig/fig-standards/blob/master/proposed/psr-4-autoloader/psr-4-autoloader.md
[PSR-0]: https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-0.md
[DRY]: https://en.wikipedia.org/wiki/Don%27t_repeat_yourself
[mailing list]: https://groups.google.com/forum/#!forum/auraphp
[Twitter]: http://twitter.com/auraphp
