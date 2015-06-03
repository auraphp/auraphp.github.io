---
title: First v2 Beta Releases of Web_Project, Cli_Project, and Framework_Project
layout: post
tags : [aura, project, kernel, web, cli, framework]
author : Paul M. Jones
---

Earlier this week, we put the final touches on the "micro/macro" frameworks for [v2 web projects](https://github.com/auraphp/Aura.Web_Project) and [v2 command line projects](https://github.com/auraphp/Aura.Cli_Project). Although these had been delayed a bit while working out the [Aura.Di](https://github.com/auraphp/Aura.Di) v2 beta release, they both now have their first "Google beta" releases!

### Projects

We have spoken before of [Aura.Web_Project](https://github.com/auraphp/Aura.Web_Project) as a ["micro/macro" framework](http://auraphp.com/blog/2013/12/12/aura-v2-web-project/). The idea is that it starts as a very minimal system, with only router, dispatcher, request, and response functionality. But thanks to the [Composer-assisted configuration system](http://auraphp.com/blog/2014/04/07/two-stage-config/), it's very easy to add whatever functionality you want, making the project as large or as small as you need.  Installation is as easy as issuing `composer create-project -s beta aura/web-project`.

[Aura.Cli_Project]((https://github.com/auraphp/Aura.Cli_Project)) takes exactly the same approach, but for command-line applications. It consists of a "context" and standard I/O system (the equivalents of a request and response), along with a console and dispatcher. It uses the same configuration system as Web_Project, so you start with a very minimal system that grows only as you need it. Getting started is as just as easy: `composer create-project -s beta aura/cli-project`.

Finally, we have [Aura.Framework_Project]((https://github.com/auraphp/Aura.Framework_Project)); it is a combination of both Web_Project and Cli_Project. That one installs just like the others:
`composer create-project -s beta aura/framework-project`. The goal on the Framework_Project more extensive than with the other two; while they are more micro to begin with, the Framework_Project will eventually become more of a full-stack system.

> N.b.: Unlike Aura library packages, which are fully decoupled and independent from all other packages, the `*_Kernel` and `*_Project` packages **do** have dependencies. This is because their purpose is to combine other packages together.


### Kernels

Each project is little more than a skeleton around a core "kernel" package. The [Aura.Web_Kernel](https://github.com/auraphp/Aura.Web_Kernel/tree/2.x/src) is what actually provides the glue to connect the underlying library packages together, as does the [Aura.Cli_Kernel](https://github.com/auraphp/Aura.Cli_Kernel/tree/2.x/src).

Keeping the kernel separate from the project means we can update the kernel without having to re-install a project. The separation between kernel and project also makes it possible to combine or stack the kernel packages. For example, the web and CLI kernel packages depend on a the same underlying [Project_Kernel](https://github.com/auraphp/Aura.Project_Kernel) to handle the common task of configuration and setup.  Similarly, the Framework_Project uses both the web and CLI kernel packages together.

### Conclusion

If you are the kind of developer who wants to keep dependencies to a minimum, but still wants a little bit of architecture to start with, then [Aura](http://auraphp.com) fits the bill. Download individual library packages with no dependencies, or install a minimal project package and add only what you need. Try it out today!
