---
title: Aura for PHP -- Packages
layout: site
active: packages
---

Aura Packages
=============

The Aura project centers around a collection of independent packages. Each
package is self-contained and has only the things it needs for its core
purpose. None of the packages depends on any of the other; you can use each of
the packages on its own.

{% include packages.md %}

High-Quality, Well-Tested, Standards-Compliant
----------------------------------------------

With very few exceptions, all classes in all packages have 100% test coverage.

The packages available through the Aura project all conform to the
currently accepted standards of the [PHP Framework Interoperability
Group](http://www.php-fig.org/):
[PSR-0](https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-0.md),
[PSR-1](https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-1-basic-coding-standard.md), and
[PSR-2](https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-2-coding-style-guide.md).


Driving Principles
------------------

### In General

- Libraries first, framework later

- No dependencies on any other package (self-contained)

- Carry data across package boundaries using data transfer objects

- Use a separated interface for shared tools (signal, log, cache, etc)

- Tests and assets encapsulated within package

### Class Idioms

- Follow PSR-0, PSR-1, PSR-2, etc.

- No use of public properties, unless they are magic via `__get()/__set()`

- No use of underscore with protected elements

- No use of globals within packages (e.g., $_SERVER)

- Use of the pre-existing Solar [vocabulary for methods](http://solarphp.com/manual/appendix-standards.naming.methods)

### Dependency Injection and Factories

- Classes *either* create objects *or* operate on those objects, never both

- Use explicit configuration more often than implicit convention

- Use [dependency injection](https://github.com/auraphp/Aura.Di) proper
  instead of service locator

- Compose functionality as much as possible through dependency injection,
  instead of through inheritance and base classes

- Use factories as object creators in general, rather than as adapter creators
  in specific

- Effective and reasonable usage of closures/anonymous functions,
  primarily for object creation within the dependency injector service
  definitions


Package Stucture
----------------

The package directory structure looks like this:

    Aura.Package_Name/
        cli/                        # command-line script invokers
        composer.json               # composer/packagist file
        config/                     # package-level configs
            default.php             # default configs
            test.php                # configs for "test" mode
        meta/                       # metadata for packaging scripts
        LICENSE                     # license file
        README.md                   # readme file
        src/                        # the actual source code organized for PSR-0
            Aura/
                Package_Name/
                    Foo.php
        tests/                      # test files for phpunit
            Aura/
                Package_Name/
                    FooTest.php
            bootstrap.php
            phpunit.xml
        web/                        # public web assets
            styles/                 # css files
            images/                 # image files
            scripts/                # javascript (or other script) files

In general, the `src/` files are organized like so:

    Aura/
        Package_Name/
            Cli/                    # all CLI commands
                CommandName/        # a particular CLI command and its support files
                    Command.php     # the actual command logic
                    data/           # other data for the command
            Web/                    # all web pages
                PageName/           # a particular web page and its support files
                    Page.php        # the actual page action logic
                    views/          # views for the page
                    layouts/        # layouts for the page
                    data/           # other data for the page
            View/
                Helper/
                    HelperName.php  # a view helper
