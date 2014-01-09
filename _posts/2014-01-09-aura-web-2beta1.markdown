---
title: Aura.Web 2.0.0-beta1 Released
layout: post
tags : [v2, aura, web, beta, release]
author : Paul M. Jones
---

Our "one release a day" series continues with the 2.0.0-beta1 release of [Aura.Web](https://github.com/auraphp/Aura.Web/tree/develop-2). You can [download it](https://github.com/auraphp/Aura.Web/releases) directly or install via [Composer and Packagist](https://packagist.org/packages/aura/web).

Whereas the v1 package included controllers, renderers, and other
functionality, the v2 package provides only _Request_ and
_Response_ objects. These objects are independent of any particular controller
system, and independent of any specific HTTP delivery mechanism, which means
they can be used in any new or existing codebase without introducing other
dependencies. You can read more about the distillation of these concerns into separate packages [here](http://auraphp.com/blog/2013/11/11/aura-v2-web/).

As a side note, you can see from the timing of these recent releases that Aura libraries are completely independent from each other.  There's no subtree-split or extract-and-build-for-release processing; each library is completely contained in its own repository, making individual releases through [our admin script](https://github.com/auraphp/bin/blob/master/Release2.php) a trivial matter.

If you like clean code, fully decoupled libraries, and truly independent packages, then the Aura project is for you. You can download a single package and start using it in your project today, with no added dependencies.

Be sure to join the [mailing list](http://groups.google.com/group/auraphp) and check out the #auraphp IRC channel on Freenode!
