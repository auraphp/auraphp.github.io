---
layout: site
active: packages
title: Aura for PHP &#58; Packages
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


Techniques
----------

- No use of public properties, unless they are magic via `__get()/__set()`

- No use of underscore with protected elements

- Use of the pre-existing Solar [vocabulary for methods](http://solarphp.com/manual/appendix-standards.naming.methods)

- Use [dependency injection](https://github.com/auraphp/Aura.Di) proper
  instead of service locator

- Compose functionality as much as possible through dependency injection,
  instead of through inheritance and base classes

- Find effective and reasonable uses for closures/anonymous functions,
  primarily for object creation within the dependency injector service
  definitions

- Use explicit configuration more often than implicit convention

- Use factories as object creators in general, rather than as adapter creators
  in specific

- Windows Vista/7 support as-we-go, so that Windows users are part of the
  community from the very beginning
