---
title: Aura.Di And Testable Controllers
layout: post
tags : [di, controller, testing]
author : Paul M. Jones
---

Brandon Savage mentions his use of [Aura.Di][] in his blog post
[The Myth of the Untestable Controller][myth].

> Back when I was working on Zend Framework, controllers were
> untestable.  They had lots of dependencies, many of which were
> difficult if not impossible to mock. Testing a controller, at least in
> isolation, was nearly impossible.
>
>  ...
>
> But the controller, being just an object, is as testable as you want
> it to be.
> 
> In a small framework that I’ve written, the controller is entirely
> testable. Dependencies are injected through use of a dependency
> inversion container ([Aura.Di][] in fact). These dependencies can be
> effectively mocked. The controller is responsible for returning a
> response object that is decoupled from an HTTP response which can be
> inspected and evaluated for correctness.

Sounds like there's some use of [Aura.Web][] in there too.


[Aura.Di]: https://github.com/auraphp/Aura.Di
[myth]: http://www.brandonsavage.net/the-myth-of-the-untestable-controller
[Aura.Di]: https://github.com/auraphp/Aura.Web
