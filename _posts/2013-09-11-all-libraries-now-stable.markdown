---
title: All Aura Libraries Now Stable
layout: post
tags : [release]
author : Paul M. Jones
---

As of yesterday, the three remaining "Google Beta" libraries were marked as
stable and released:

- [Aura.Filter](https://github.com/auraphp/Aura.Filter) provides validation
  and sanitizing for data objects and arrays.

- [Aura.Input](https://github.com/auraphp/Aura.Input) has tools to describe
  and filter user inputs from an HTML form, including sub-forms/sub-fieldsets,
  fieldset collections, an interface for injecting custom filter systems, and
  CSRF protection.

- [Aura.Intl](https://github.com/auraphp/Aura.Input) provides
  internationalization (I18N) tools, specifically package-oriented per-locale
  message translation.

This means all the Aura library packages are now stable, and formally ready
for production use.


Maintenance and Feature Releases
--------------------------------

In addition, we have issued releases of all the other Aura libraries. The
substantial changes were to these packages:

- Aura.Http: (CHG) Transport now adds a 'Close' header when sending a request.

- Aura.Router: (CHG) Route::attach() now works with an empty path.

- Aura.Session: (CHG) Manager::destroy() now checks whether the session is
  started; if not, starts it, and then destroys. (This is because sessions are
  lazy-loading in Aura.)

- Aura.Sql:

    - (ADD) Profiler::getLastQuery() to get the last profiled query.

    - (CHG) AbstractConnection::fetchAll(), fetchAssoc(), fetchCol(), and
      fetchPairs() all now take a third param: a callable to apply to each row
      in the results.

    - (NEW) Query\Mysql classes to support MySQL-specific functionality:

        - (NEW) Query\Mysql\Select with `SQL_CALC_FOUND_ROWS` and other
          mysql-specific flags.

        - (NEW) Query\Mysql\Insert with `IGNORE` and other mysql-specific
          flags.

        - (NEW) Query\Mysql\Update with `IGNORE` and other mysql-specific
          flags, as well as LIMIT functionality.

        - (NEW) Query\Mysql\Delete with LOW_PRIORITY and other mysql-specific
          flags, as well as LIMIT functionality.

- Aura.View:

    - (CHG) Escaper\Object now recursively escapes arrays instead of
      converting to ArrayObject and wrapping in an escaper

    - (ADD) TwoStepView::getTemplate() to get the template out of the view

    - (NEW) Helper\Form\Checkboxes


Package Documentation and New Manual
------------------------------------

We have reorganized the package documentation somewhat; instead of keeping
API docs in the `gh-pages` branch of each library repository, we are now
pushing them to the main site repo. It turns out this is easier for site
maintenance in many ways, not least of which is keeping a consistent look and
feel for the site.

In addition, we have incorporated a new
[manual](http://auraphp.com/manuals/v1/en/). Many thanks to Hari KT for
putting that together.


The Future!
-----------

The next step is to make a stable Framework and system release. After that, we
can review our initial goals to check our progress. Finally, in addition to
maintaining the v1 libraries, we can begin thinking about how to move toward
Aura v2 to take advantage of the current state of PHP.
