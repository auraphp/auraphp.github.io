---
title: First Aura 3.x Stable Releases
layout: post
tags : [v3, router, payload]
author : Paul M. Jones
---

Today we released the first round of stable Aura 3.x packages:

- [Aura.Payload_Interface][], an interface for [domain payload][] implementations.

- [Aura.Payload][], a [domain payload][] implementation.

- [Aura.Router][], a powerful, flexible web routing implemention for [PSR-7][] requests.

Since the announcement of the plans for Aura 3.x, we have made one small concession: the minimum PHP version is 5.5, instead of 5.6 [as originally announced](http://auraphp.com/blog/2015/03/27/aura-3-plans/). Even so, all the 3.x packages are tested and operational on PHP 5.6, PHP 7, and HHVM.

[domain payload]: https://vaughnvernon.co/?page_id=40
[Aura.Payload_Interface]: https://github.com/auraphp/Aura.Payload_Interface/
[Aura.Payload]: https://github.com/auraphp/Aura.Payload/
[Aura.Router]: https://github.com/auraphp/Aura.Router/
[PSR-7]: https://github.com/php-fig/fig-standards/blob/master/proposed/http-message.md
