---
title: Version 2 Beta Releases: Includer, Autoload, Sql, Dispatcher
layout: post
tags : [v2, beta, release]
author : Paul M. Jones
---

In addition to the [Aura.Autoload v2](http://auraphp.com/blog/2014/01/03/first-psr-4-autoloader/) "Google Beta" release from last week, we have been releasing v2 beta versions of other packages as well:

- [Aura.Includer v2][] on Wed, 01 Jan 2014
- [Aura.Autoload v2][] on Thu, 02 Jan 2014
- [Aura.Sql v2][] on Fri, 03 Jan 2014
- [Aura.Dispatcher v2][] on Mon, 06 Jan 2014

Hey, that looks like a pattern: one release per weekday of the new year. Who knows what tomorrow will bring?  Regardless, you can see continuing updates on our [v2 packages page][].

The new [Github releases API](http://developer.github.com/v3/repos/releases/) has been a real blessing here. Our [release2 admin script](https://github.com/auraphp/bin/blob/master/Release2.php#L228-L248) uses it to make the release directly from whatever branch we happen to be on at the time of release.  Because each Aura library package is completely self-contained, the release tool can run the tests, check composer.json, etc. very easily before it makes the release. (Non-library packages, which do have dependencies, have an additional `composer install` step before the tests run.)

Happy belated New Year to all, and many thanks to the Aura contributors who have made these releases possible!

[Aura.Autoload v2]: https://github.com/auraphp/Aura.Autoload/tree/develop-2
[Aura.Includer v2]: https://github.com/auraphp/Aura.Includer/tree/develop-2
[Aura.Dispatcher v2]: https://github.com/auraphp/Aura.Dispatcher/tree/develop-2
[Aura.Sql v2]: https://github.com/auraphp/Aura.Sql/tree/develop-2
[v2 packages page]: /packages/v2
