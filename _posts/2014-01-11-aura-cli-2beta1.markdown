---
title: Aura.Cli 2.0.0-beta1 Released
layout: post
tags : [v2, aura, cli, beta, release]
author : Paul M. Jones
---

Starting this week's "one release a day" series is the 2.0.0-beta1 release of [Aura.Cli](https://github.com/auraphp/Aura.Cli/tree/develop-2). You can [download it](https://github.com/auraphp/Aura.Cli/releases) directly or install via [Composer and Packagist](https://packagist.org/packages/aura/cli).

The Aura.Cli package provides the command-line equivalents of web request and response objects. The [_Context_](https://github.com/auraphp/Aura.Cli/tree/develop-2#context-discovery) (request-equivalent) object allows insight into the `$_ENV`, `$_SERVER`, and `$argv` values, along with a [_Getopt_](https://github.com/auraphp/Aura.Cli/tree/develop-2#getopt-support) object that lets you build and then parse flags and options passed at the command line. The [_Stdio_](https://github.com/auraphp/Aura.Cli/tree/develop-2#standard-inputoutput-streams) (response-equivalent) object provides access to to the standard input/output/error streams.

As with other Aura libraries, the Aura.Cli has a very narrow focus. Its purpose is not to provide a base object for commands or a console for exeucting commands, but instead to provide tools for you to use in your own command objects and scripts.  (Writing a [standalone command script](https://github.com/auraphp/Aura.Cli/tree/develop-2#writing-commands) with Aura.Cli is pretty straightforward.)

If you like clean code, fully decoupled libraries, and truly independent packages, then the Aura project is for you. You can download a single package and start using it in your project today, with no added dependencies.

Be sure to join the [mailing list](http://groups.google.com/group/auraphp) and check out the #auraphp IRC channel on Freenode!
