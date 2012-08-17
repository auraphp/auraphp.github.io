---
title: The Aura Project for PHP
layout: cloud
---

<div class="grid_4" markdown="1">

Introduction
============

The Aura project provides independent library packages for PHP 5.4+. These
packages can be used alone, in concert with each other, or combined into a
full-stack framework of their own.

The Aura project is essentially the second major version of
[Solar](http://solarphp.com), reimagined and rewritten as a library collection
with dependency injection instead of a framework with service location. (The
name change from Solar to Aura is to reduce confusion with the Apache Solr
project.)

The project is becoming mature, and has just had a set of 1.0.0-beta1 package
releases. Please fork the various library package repositories or the system
skeleton repository, and help us keep high-quality libraries available and
maintained for PHP 5.4+.

Join our mailing list at
[http://groups.google.com/group/auraphp](http://groups.google.com/group/auraphp),
or chat with us using IRC on Freenode at `#auraphp`.

</div>

<div class="grid_8" markdown="1">

Available Packages
==================

The Aura project centers around a collection of independent packages. Each
package is self-contained and has only the things it needs for its core
purpose. None of the packages depends on any of the other; you can use each of
the packages on its own:

- **[Autoload](https://github.com/auraphp/Aura.Autoload):** A PSR-0 compliant
  autoloader, ready for SplClassloader.

- **[Cli](https://github.com/auraphp/Aura.Cli):** Tools to build command-line
  controllers, including a CLI context, options management, and input/ouput
  handlers

- **[Di](https://github.com/auraphp/Aura.Di):** Dependency injection
  container.

- **[Filter](https://github.com/auraphp/Aura.Filter):** Provides validation and
  sanitizing for data objects.

- **[Framework](https://github.com/auraphp/Aura.Framework):** The only package
  that has dependencies, this package wraps the others to provide a
  component-based framework library.

- **[Http](https://github.com/auraphp/Aura.Http):** Tools to build HTTP
  response messages

- **[Marshal](https://github.com/auraphp/Aura.Marshal):** Marshals data from
  any data source into domain objects, including relationships between those
  object.

- **[Router](https://github.com/auraphp/Aura.Router):** A web router.

- **[Signal](https://github.com/auraphp/Aura.Signal):** A signal slots / event
  handler implementation.

- **[Sql](https://github.com/auraphp/Aura.Sql):** SQL database connection and
  query tools.

- **[View](https://github.com/auraphp/Aura.View):** Template views, two-step
  views, and view helpers.

- **[Web](https://github.com/auraphp/Aura.Web):** A bare-bones web page
  controller system, including pre- and post-hooks, a response transfer, and
  context discovery.

The Aura project also includes a [system](https://github.com/auraphp/system)
that composes the independent packages into a full-stack framework.


Goals and Standards
===================

Libraries First, Framework Second
---------------------------------

The primary goal of Aura is to provide high-quality well-tested independent
library packages that can be used in any codebase. This means developers can
use as much or as little of the project as necessary.

Aura will have enough libraries to form a full-stack framework of its own. A
system repository will be available to incorporate them all into a coherent
framework for application development.

In line with the goal of "libraries first", all packages are as self-contained
as possible and are independently downloadable. In some cases this level of
independence may lead to some class duplication between packages. In other
cases, it may lead to data-transfer objects being used to carry information
across package boundaries, so that the package can be used with non-Aura
codebases.


High-Quality, Well-Tested
-------------------------

All packages are to have 100% test coverage.


Coding Standards
----------------

The packages available through the Aura project all conform to the currently accepted standards of [php-fig](http://www.php-fig.org/)
[PSR-0](https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-0.md), 
[PSR-1](https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-1-basic-coding-standard.md), 
[PSR-2](https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-2-coding-style-guide.md). In particular:

- No use of public properties, unless they are magic via `__get()/__set()`

- No use of underscore with protected elements

- Retain the Solar vocabulary for
  [methods](http://solarphp.com/manual/appendix-standards.naming.methods)

These goals and standards are presented in relation to
[Solar](http://solarphp.com).

PHP 5.4+
--------

Aura is intended to take advantage of the features available in PHP 5.4+ (as
compared to PHP 5.2.x and prior). This means formal namespaces, anonymous
functions and closures, late static binding, short array syntax, traits, and
other features not available in PHP 5.2.x and earlier.


Techniques
----------


- Use dependency injection proper instead of the service-locator
  `Solar::dependency()` system; the basis for this exists at
  [https://github.com/auraphp/Aura.Di](https://github.com/auraphp/Aura.Di)

- Find effective and reasonable uses for closures/anonymous functions,
  primarily for object creation within the dependency injector service
  definitions

- More use of explicit mapping, as vs automatic searching of directory stacks.

- Compose functionality as much as possible through dependency injection,
  instead of through inheritance and base classes

- Use factories as object creators in general, rather than as adapter creators
  in specific

- Windows Vista/7 support as-we-go, so that Windows users are part of the
  community from the very beginning


Conversion Priorities
=====================

These are in relation to converting [Solar](http://solarphp.com) packages and
classes.

### Remaining

- Localization should be at the package level, not class-level.

- Form generation tools

</div>
