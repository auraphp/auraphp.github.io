---
title: First 2.0 Stable Project Releases!
layout: post
tags : [release]
author : Paul M. Jones
---

Exciting news! After a little over a year in the making, the Aura web and CLI project packages saw their first stable 2.0 releases this weekend.  This is a major milestone for Aura, as it means not just the core libraries but also the frameworks built from them are now complete.

Because Aura takes a "libraries first, framework second" approach, the project packages had to wait for the following 2.0 stable releases of these core libraries yesterday:

- [Aura.Di](https://github.com/auraphp/Aura.Di) (a dependency injection container)
- [Aura.Web](https://github.com/auraphp/Aura.Web) (web request/response objects, and a response sender)

Once those were stable, it was not much trouble to promote the various kernels and project skeletons to stable as well:

- [Aura.Project_Kernel](https://github.com/auraphp/Aura.Project_Kernel) (the kernel files for every Aura project type)
- [Aura.Cli_Kernel](https://github.com/auraphp/Aura.Cli_Kernel) (the kernel files for CLI projects)
- [Aura.Web_Kernel](https://github.com/auraphp/Aura.Web_Kernel) (the kernel files for web projects)
- [Aura.Cli_Project](https://github.com/auraphp/Aura.Cli_Project) (a skeleton CLI project)
- [Aura.Web_Project](https://github.com/auraphp/Aura.Web_Project) (a skeleton web project)
- [Aura.Framework_Project](https://github.com/auraphp/Aura.Framework_Project) (a skeleton cli+web project)

(Unlike Aura library packages, which have no dependencies because they are completely decoupled from each other, the `*_Kernel` and `*_Project` packages *do* have dependencies, as they are compositions of library and other packages.)

These project releases means that you can now start a new, stable Aura project using Composer. For example, the following will create a `myproject/` folder with an Aura installation ready-to-go for you:

```
composer create-project aura/web-project myproject
```

### Other Releases

In related news, we released stable 2.0 versions of [Aura.Autoload](https://github.com/auraphp/Aura.Autoload) and [Aura.Includer](https://github.com/auraphp/Aura.Includer), since they have had no changes in several months. (These were initially thought to be core components for the project packages, but it turns out they were not needed.)

The [Aura.Accept](https://github.com/auraphp/Aura.Accept) package saw its first beta release today as well. Aura.Accept was extracted from Aura.Web so that content-negotiation behavior could be used separately from the Aura.Web Request and Response objects, such as in a Responder or other presentation mechanism. As the behaviors have not changed much in the extraction, we expect this package to see a stable release relatively soon.

The [Aura.Auth](https://github.com/auraphp/Aura.Auth) package also got its first beta release. There's still some work to be done here, notably regarding a "remember me" feature, and perhaps some additional LDAP behaviors.

The [Aura.Router](https://github.com/auraphp/Aura.Router) package got bumped to 2.1.0 as it has a new method, `generateRaw()`, to generate routes with raw data.

Finally, we updated [Aura.Html](https://github.com/auraphp/Aura.Html) to 2.1.0 to reflect a change in the service names it presents through an Aura project DI container. If you're using Aura.Html independent of an Aura.Di container builder, these changes should not affect you at all.

### Conclusion

Thanks to [the many contributors in the Aura community](http://auraphp.com/community) who made these releases possible!
