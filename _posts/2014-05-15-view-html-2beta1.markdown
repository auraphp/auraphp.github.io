---
title: Aura.View and Aura.Html 2.0.0-beta1 Released!
layout: post
tags : [view, html, v2]
author : Paul M. Jones
---

We have new v2 beta releases!

### Aura.View

[Aura.View](https://github.com/auraphp/Aura.View) 2.0.0-beta1 is a reduced implementation of the v1 View package. It is notably different from v1 in several ways:

- The templates can still be include files, but (and this is new) they can also be closures. This means that you can completely avoid the file system for templates if you like. (We bind closures to the _View_ instance so you can use `$this` from inside the closure to reference data, helpers, and so on.)

- The library no longer searches through directory stacks/hierarchies for templates. Those kinds of file-system scan turned out to be fine in most cases, but in high-performance situations it becomes a drag on performance. The search stacks have been replaced with a _TemplateRegistry_ where you explicitly register templates by name. This involves more setup work but makes it easier to determine where the templates are coming from.

- The library does not auto-escape data for output any more. Auto-escaping seemed like a good idea for v1 but it turned out to be more trouble than it was worth. In fact, there are no escapers included at all any more (see below for more about that).

- There are no longer any escapers or helpers included, although the package does include a bare-bones _HelperRegistry_ so you can add your own callables as helpers.

What? No escapers or helpers? Have no fear; they have not disappeared, they have only been moved into the Aura.Html package.

### Aura.Html

[Aura.Html](https://github.com/auraphp/Aura.Html) 2.0.0-beta1 contains a collection of helpers extracted from the v1 Aura.View package. These helpers are completely standalone and are not dependent on any particular view system: instantiate a _HelperLocator_ from the Aura.Html package and you can use the helpers from any PHP code.  As an example of the standalone nature of the Aura.Html helpers, [Hari has shown how to integrate it](http://harikt.com/blog/2014/05/13/extending-plates-with-aura-html-helpers/) with [Plates](http://platesphp.com) from Jonathan Reinink.

And what a [set of helpers](https://github.com/auraphp/Aura.Html/blob/develop-2/README-HELPERS.md), especially the [form helpers](https://github.com/auraphp/Aura.Html/blob/develop-2/README-FORMS.md)! All of the HTML5 input types are supported. This makes building form elements very easy, especially since the data structure for each element is just an array. Any library that can generate the recognized array structure can be used to feed the form input helpers. (Incidentally, [Aura.Input](https://github.com/auraphp/Aura.Input) generates the recognized structure.)

In addition, the package includes [a powerful escaping mechanism](https://github.com/auraphp/Aura.Html#escaping) derived from Zend\Escaper and modified for conceptual integrity with the rest of Aura. The Aura.Html _Escaper_ exposes static methods to make escaping as non-verbose as possible. Place a `use Aura\Html\Escaper as e` statement at the top of your PHP-based template file, and you can issue ...

- `e::h()` to escape HTML;

- `e::a()` to escape attributes, including arrays of attribute key-value pairs;

- `e::c()` to escape CSS; and

- `e::j()` to escape JavaScript.

(Normally in Aura we avoid static methods, but the verbosity tradeoff here was too good to ignore.)

### Conclusion

If you already have an project and all you need is a PHP-based template system, or if you already have a view system and all you need is some form helpers, then Aura is for you! Each package is completely decoupled from the others, meaning you can download just what you need and not worry about inter-library dependencies. Try [Aura.View](https://github.com/auraphp/Aura.View) and [Aura.Html](https://github.com/auraphp/Aura.Html) today!
