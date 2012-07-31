---
title: Aura Project releases Beta3
layout: post
category : auraphp
tags : [contibuting]
draft: true
---
{% include JB/setup %}

So the much awaited Beta-3 is here after a long time. There are some things you must know. The `master` of every package points to the latest  release. The development of the next release is on `develop` branch. If you love to contribute a feature or fix a bug please send to develop branch. Have a look into our earlier post [Contributing to Aura Project](http://auraphp.github.com/2012/07/13/contributing-to-aura-project/). If you don't run a blog or your own but love to share what you learned have a look into [this post](http://auraphp.github.com/2012/05/18/writing-blog-post-for-aura/)

The good things:

All the Aura.Packages are now following the PSR-0, 1, 2 complaiance.
We have a new Aura.Uri package in this release.
The Aura.View automatically escapes all html output.
For the Aura.Framework to make use of different rendering engine as we made some changes to Aura.Web. So now its easy for you to incorporate your own rendering engines like Aura.View, Mustache, Twig etc.

The Bad :

We have some backward compatibility breaks for some of the packages like Aura.Web and Aura.View . The change logs are given below. But as we we all know for these changes are for the better tomorrow I feel its not a bad idea either.

Aura.Autoload

Added support for recognizing trait classes.

Aura.Di

- The Forge::newInstance() method now has a third param, $setters, to allow passing of setter injection values.

Aura.Http

- Now includes Request, Adapter, and Transport mechanisms, making it a full-fledged HTTP library.

- Cookies and Headers are now represented by objects, not arrays.

Aura.Router

- Documentation fixes

Aura.Sql

- [NEW] Select object and SelectFactory.

- [ADD] AbstractAdapter::newSelect() to return a new Select object.

- [CHG] AbstractAdapter::query() can now take a Select object directly.

- [FIX] In ConnectionManager::getMaster() and getSlate(), use `=== null` when comparing connection names; this allows integer zero keys in the pool arrays.

- [FIX] Profiler output now numbers queries correctly.

- [ADD] Method Column::__set_state() to make it easier to var_export() a Column object.

- [CHG] In tests, you can now specify your own globals.php file to set local database connection params.

- [CHG] AbstractAdapter::update() $data values can now be literals instead of just key-value pairs.

Aura.Uri

- first release

Aura.View

- [NEW] Automatic HTML escaping of output via an Escaper object (and related classes); use __raw() for raw values.

- [CHG] All helper functions now assume inputs are pre-escaped, or wrapped in an Escaper object

- [CHG] Helper\AbstractHelper::attribs() and Helper\Attribs::__invoke() now have a $skip param, allowing you to skip over certain attributes when building them.

- [BRK] Remove TwoStep::setInnerData() and setOuterData(), in favor of a single setData() method that sets data once for both inner and outer
  templates.

- [BRK] Helper\Styles::add() method now has $attribs second and $pos last, for consistency with all other helpers.

Aura.Web

- [BRK] Significant reorganization of class files. AbstractPage is now
  Controller\AbstractPage.

- [BRK] New SignalInterface and basic Signal manager class. Hooks are now
  executed through the Signal manager instead of directly in exec(). Must
  be passed in AbstractPage constructor.

- [BRK] New Renderer strategy classes, including a default Renderer strategy
  of "None." Rendering now happens through strategies instead of directly in
  render(). Must be passed in AbstractPage constructor.

- [NEW] Method Context::getUrl()

Aura.Framework

- [BRK] Moved Web\Factory and Web\Front to Web\Controller\Factory and Web\Controller\Front, respectively.

- [CHG] Updated to use new package versions.

- [FIX] Cli\MakeTest\Command::action() now errors when no package file path is specified.

- [NEW] CLI script to set up and run a development server using the built-in PHP server.

- [FIX] Web\Controller\Front::request() now extracts path from REQUEST_URI instead of using PATH_INFO; this helps with some non-Apache servers.

Thanks for being with Aura and we love to see your contributions. If you have any queries feel free to comment below or create an issue or talk in #auraphp irc freenode or in [https://groups.google.com/group/auraphp](https://groups.google.com/group/auraphp) or tweet to [@auraphp](http://twitter.com/auraphp).

If you are new to irc, you can use [pidgin](http://www.pidgin.im/) or [x-chat](http://xchat.org/).

Aura Team
