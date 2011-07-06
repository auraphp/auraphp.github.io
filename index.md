---
title: The Aura Project for PHP
layout: cloud
---

<div class="grid_4" markdown="1">

Introduction
------------

In a world of monolithic frameworks, the Aura project provides independent library packages for PHP 5.3+.  These packages can be used alone, in concert with each other, or combined into a full-stack framework of their own.

The project is still young and just getting underway. Please fork the various library package repositories or the system skeleton repository, and help us keep high-quality libraries available and maintained for PHP 5.3+.

Join our mailing list at [http://groups.google.com/group/auraphp](http://groups.google.com/group/auraphp), or chat with us using IRC on Freenode at `#auraphp`.

</div>

<div class="grid_8" markdown="1">

Getting Started
---------------

Because the project is so young, there's not a lot in place yet. We do have a full system skeleton for developing libraries; check out the [System](https://github.com/auraphp/system) project for more details.

If you like, you can use the various libraries on their own.  The libraries available at this time are:

- [Autoload](https://github.com/auraphp/Aura.Autoload) for a PSR-0 compliant autoloader

- [Cli](https://github.com/auraphp/Aura.Cli) for tools to build command-line controllers

- [Di](https://github.com/auraphp/Aura.Di) for dependency injection

- [Http](https://github.com/auraphp/Aura.Http) for HTTP response messages

- [Router](https://github.com/auraphp/Aura.Router) for web routing independent of any particular framework

- [Signal](https://github.com/auraphp/Aura.Signal) for signal slots / event handling

- [Web](https://github.com/auraphp/Aura.Web) for web page controllers

- [View](https://github.com/auraphp/Aura.View) for templates, two-step views, and view helpers

- [Sql](https://github.com/auraphp/Aura.Sql) for connecting with Relational Database.

Background
----------

The Aura project is essentially the second major version of [Solar](http://solarphp.com), reimagined and rewritten as a library collection with dependency injection instead of a framework with service location.  The name change from Solar to Aura is to reduce confusion with the Apache Solr project.

</div>

<div class="clear">&nbsp;</div>

<div class="grid_4" markdown="1">

Libraries First, Framework Second
---------------------------------

The primary goal of Aura is to provide high-quality well-tested library packages that can be used in any codebase. This means developers can use as much or as little of the project as necessary.

Aura will have enough libraries to form a full-stack framework of its own. A system repository will be available to incorporate them all into a coherent framework for application development.

Coding Standards
----------------

The packages available through the Aura project all conform to the Horde/Pear/Solar/Zend [coding standards](http://pear.php.net/manual/en/coding-standards.php).  In particular:

- No use of public properties, unless they are magic via `__get()/__set()`
- No use of underscore with protected elements
- Retain the Solar vocabulary for [methods](http://solarphp.com/manual/appendix-standards.naming.methods)


</div>

<div class="grid_8" markdown="1">

Goals and Standards
-------------------

These goals and standards are presented in relation to [Solar](http://solarphp.com).

### PHP 5.3+

Aura takes advantage of the features available in PHP 5.3+. This means formal namespaces, anonymous functions and closures, late static binding, and other features not available in PHP 5.2.x and earlier.  In particular:

- Use a top-level vendor name ("Aura") and second-level package name ("Di", "Router", "Web", "Cli", etc);

- Sub-namespaces are allowed, but they are not sub-packages, and are not distributed separately


### Self-Containment

In line with the goal of "libraries first", all packages are as self-contained as possible and are independently downloadable.  In some cases this level of independence may lead to some class duplication between packages. In other cases, it may lead to data-transfer objects being used to carry information across package boundaries, so that the package can be used with non-Aura codebases.

Sometimes complete self-containment is not possible.  In these cases, the number of external packages dependencies is kept as small as possible.  Packages with external dependencies have a `DEPENDS` file noting the other packages needed.

</div>

<div class="clear">&nbsp;</div>

<div class="grid_4" markdown="1">

Techniques
----------

- Use dependency injection proper instead of the service-locator Solar::dependency() system; the basis for this exists at [https://github.com/auraphp/Aura.Di](https://github.com/auraphp/Aura.Di)

- Find effective and reasonable uses for closures/anonymous functions, primarily for object creation within the dependency injector service definitions

- More use of explicit mapping, as vs automatic searching of directory stacks.

- Compose functionality as much as possible through dependency injection, instead of through inheritance and base classes

- Use factories as object creators in general, rather than as adapter creators in specific

- Windows Vista/7 support as-we-go, so that Windows users are part of the community from the very beginning

</div>

<div class="grid_8" markdown="1">

Conversion Priorities
---------------------

These are in relation to converting [Solar](http://solarphp.com) packages and classes.

### Remaining

- Localization should be at the package level, not class-level.

### Completed

- Concentrate on the dynamic dispatch cycle for web apps:  bootstrap, front controller, page controller, and view.

- Secondary or corollary concentration is on CLI and support classes.

- Make it possible to have CLI controllers on a per-package basis.

- Make it so that CLI and web controllers share a common vocabulary and execution pattern.

- Use PHPUnit for testing in Aura. Write tests as we go.  Aim for 100% coverage with each commit.


</div>
