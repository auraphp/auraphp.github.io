---
title: A Peek At Aura v2 -- Aura.Dispatcher
layout: post
tags : [v2, dispatcher]
author : Paul M. Jones
---

In the [lessons learned][] post, I talked about how [Aura][] was born of the
idea that we could extract independent decoupled packages from [Solar][], and
how in doing so, we discovered that some of those extracted packages themsleves
could be further split into independent pieces.

[Previously][], I wrote about [Aura.Sql-v2][], [Aura.Sql_Query][], and
[Aura.Sql_Schema][] as extractions from a single Aura.Sql package.

Today, I'm going to talk about [Aura.Dispatcher][] as a combined extraction
from three separate packages.


### Dispatchers

At its core, a dispatcher uses a set of parameters to determine what logic
should be invoked.  That set of parameters is generally the result of parsing
a URL with a [router][], but it could come from anywhere.

In Aura v1, we actually have two layers of dispatchers. First, there is a
front controller at the [Aura.Framework][] level to determine what page
controller class should be instantiated. Then, at the [Aura.Web][] page
controller level, there is an internal dispatcher that picks what method will
be invoked. (Some dispatchers work in only one pass to pick both the class and
the method; others, such as micro-framework dispatchers, pick only a closure
to execute.)

In addition to the web dispatching, the Aura v1 framework also has a CLI
equivalent of a front controller. It picks the right command class based on
the CLI input, but the method is always the same.

Finally, it's not enough to know what object should get instantiated;
something has to actually instantiate it. As such, the web and CLI front
controllers need factories to create the objects they are dispatching to.


### Extraction and Behavior

It turns out that dispatching at the framework level, and at the web and CLI
levels, is all remarkably similar. After realizing that, we extracted the
dispatching logic to its own independent package, without any dependendcies on
any other packages.

The [Aura.Dispatcher][] package lets you define named objects that will get
instantiated only as they are dispatched to (i.e., lazy loading). It picks
which named object to instantiate, and optionally which method to invoke,
based on an array of router values (or any other array you wish to pass). It
also works as a micro-framework dispatcher; instead of using an object factory
proper, you can add a named closure and *that* will be invoked.

Additionally, if you want a two-stage invocation where the dispatcher picks
an object, and the object picks its own method, [Aura.Dispatcher][] comes
with a [trait][] that lets you pass named parameters to any method you like.
You can use that trait in any object to pick a method and invoke it with the
router (or other) parameters.


### Refactoring From Micro- to Full-Stack Frameworks

[Aura.Dispatcher][] is built with the idea that some developers may begin with
a micro-framework architecture, and evolve over time toward a full-stack
architecture.  Here's an outline of the [full description][]; note that the
logic used to invoke the dispatcher *never changes*; the only thing that
changes are the params being passed and the object being dispatched to.

1. At first, the developer uses closures embedded in the routers parameters
passed to the dispatcher; this is a typical micro-framework approach.

2. After adding several closure-based controllers to a router, the developer
is likely to want to keep the routing configurations separate from the
controller actions. At this point the developer may start putting the
controller actions into the dispatcher as named closures.

3. As the number and complexity of controllers continues to grow, the
developer may wish to convert the controller closures into separately
invokable classes, lazy-loading along the way.

4. Finally, the developer may collect several action methods into a single
controller, keeping related functionality in the same class.

With that, we have a clear path from closures in a router, to closures in the
dispatcher, to invokable classes factoried by the dispatcher, and finally to
classes of multiple methods factoried by the dispatcher.  This means you can
modify your application architecture and not have to worry about swapping
dispatcher systems.

### Next Steps

Because we have extracted the dispatcher behaviors from both the [Aura.Web][]
and [Aura.Cli][] packages, it means that those packages can become further
reduced in size and more focused. More on the [Aura.Web v2][] package next time!

[Aura.Cli]: http://github.com/auraphp/Aura.Cli
[Aura.Dispatcher]: https://github.com/auraphp/Aura.Dispatcher
[Aura.Framework]: https://github.com/auraphp/Aura.Framework
[Aura.Sql-v2]: https://github.com/auraphp/Aura.Sql/tree/2.x
[Aura.Sql]: http://github.com/auraphp/Aura.Sql
[Aura.Sql_Query]: https://github.com/auraphp/Aura.Sql_Query/tree/2.x
[Aura.Sql_Schema]: https://github.com/auraphp/Aura.Sql_Schema/tree/2.x
[Aura.Web]: http://github.com/auraphp/Aura.Web
[Aura.Web v2]: https://github.com/auraphp/Aura.Web/tree/2.x
[Aura]: http://auraphp.com
[Solar]: http://solarphp.com
[full description]: https://github.com/auraphp/Aura.Dispatcher#refactoring-to-architecture-changes
[lessons learned]: http://auraphp.com/blog/2013/09/30/lessons-learned/
[router]: http://github.com/auraphp/Aura.Router
[trait]: https://github.com/auraphp/Aura.Dispatcher#intercessory-dispatch-methods
[Previously]: http://auraphp.com/blog/2013/10/21/aura-sql-v2-extended-pdo/