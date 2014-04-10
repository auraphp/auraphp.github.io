---
title: Composer-Assisted Two-Stage Configuration
layout: post
tags : [aura, project, config, container, composer, psr-4]
author : Paul M. Jones
---

One of the design choices for configuration in [Solar](http://solarphp.com), and later in [the Aura v1 framework](http://auraphp.com/framework), was that all values were inteded to be passed at construction time. If you wanted to set up a router, for example, you would create an array structure to define all the routes, and then the DI container would pass that structure as a constructor param when creating the router object.

In a most situations, config via constructor param is perfectly reasonable.  Unfortunately, there are some times where it's not as practical as I would like. It can feel clumsy setting up these kinds of huge data structures, such as for a router system. We wanted to find a solution to these less frequent but still necessary setup situations, perhaps using a programmatic approach.

The problem is that programmatic setup of foundational components can itself be a little clunky. The solution I see most often for this is to use static methods on the target object; for example, `Router::add()` to map a new route. In Aura, static methods are a design approach that we consciously avoid. We want to keep good scope separation at all times, and make all dependencies explicit. Statics are not congruent with those goals.

### Two-Stage Config

After a long period of consideration, research, and experiment, we have found a non-static solution for programmatic configuration through a DI container. It is part of a two-stage configuration process, implemented through a [_ContainerBuilder_](https://github.com/auraphp/Aura.Di/blob/bb309817b23fce9c119f850c0e943426cbff8c9e/src/ContainerBuilder.php).

The two stages are "define" and "modify":

- In the "define" stage, the _Config_ object defines constructor params, setter method values, and services. This is the equivalent of the previous single-stage Solar and Aura v1 configuration system.

- The _ContainerBuilder_ then locks the _Container_ so that its definitions cannot be changed, and then begins the "modify" stage. In this second stage, we retrieve service objects from the _Container_ and modify them programmatically.

### Classes, Not Includes

We originally tried do this define-and-modify process with include files, as is usually the case with configuration approaches. With this approach, we needed two config files (`define.php` and `modify.php`) for each configuration mode. We also needed an [Aura.Includer](https://github.com/auraphp/Aura.Includer) to scan the file system in predefined locations for the config file pairs for each installed package.

However, that include-oriented approach never felt quite right. A couple of weeks ago it occurred to me that we could use classes for the two-stage config operations. This would allow for autoloading, independent testing, a smaller number of files, and a host of other subtle quality improvements. This led to the creation of the [_Config_](https://github.com/auraphp/Aura.Di/blob/bb309817b23fce9c119f850c0e943426cbff8c9e/src/Config.php) class, which is now part of the Aura.Di v2 package.

So now, instead of each Aura package carrying a pair of define and modify includes in a subdirectory named for the config mode, we have a single class file for each config mode. The class file is in a subnamespace `_Config` under the package namespace. Here are two examples, one from the [Aura.Web_Kernel](https://github.com/auraphp/Aura.Web_Kernel/blob/1cf523ce1e90d111aa691b3cd29b150aa8e057e6/config/Common.php) package, and one from the [Aura.Web_Project](https://github.com/auraphp/Aura.Web_Project/blob/34755dd5f1e67ade59edf49e69f715ad41cdceff/config/Common.php) package.

Because they are classes, you can call other methods as needed, subclass or inherit, use traits, create instance properties and local variables for configuration logic, and so on. You could even call `include` in the methods if you wanted, keeping the class as a scaffold for much larger configuration files. This gives great flexibility to the confguration system.

### Composer Assistance

None of this is any good if the application cannot find and load the configuraiton logic.  To make sure the Aura project installation can find all the package config files, we use the `{"extra": {"aura": { ... } } }` elements of the `composer.json` in each package to provide a mapping from the config mode to the config class. As [this example from Aura.Cli](https://github.com/auraphp/Aura.Cli/blob/7c15b148248ee8370f07374b493d128a84afc9e0/composer.json#L24-L40) shows, we accomplish this in two parts:

- Create a PSR-4 entry for the `Aura\Cli\_Config` namespace that maps to the package `config/` directory, and

- Create an entry for the config mode that maps to the _Config_ class for that mode.

This is where the "extra" entry provided by Composer really shines. We can place critical project-level information in the `composer.json` for each package under the "extra" entry, namespaced for "aura". This information can be structured any way we like.

We then inject the decoded JSON data from the project-level `composer.json` along with the decoded JSON data from `vendor/composer/installed.json` into our [_Project_](https://github.com/auraphp/Aura.Project_Kernel/blob/1e938da37ba0378a2e6549d6f11570dffaa825f2/src/Project.php) service. Note that the _Project_ object does not read the Composer data itself; that data is [injected at construction time](https://github.com/auraphp/Aura.Project_Kernel/blob/a95f4302772e69be85c578e3b59b0ed7ce49fb23/src/Factory.php).

Finally, we use [`getConfigClasses()`](https://github.com/auraphp/Aura.Project_Kernel/blob/1e938da37ba0378a2e6549d6f11570dffaa825f2/src/Project.php#L155-L162) to get back that project-level information from the object, and use them to load our _ContainerBuilder_.

### Conclusion

With this two-stage configuration mechanism, using classes instead of includes, and using Composer to map the config modes the to the config classes, we have the benefits of both a define-only config system *and* a programmatic modification system. This gives us the best of both worlds, and helps us avoid resorting to static methods for configuration.

