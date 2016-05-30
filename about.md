---
layout: site
active: about
title:  About
---

# About Aura

The Aura project centers around a collection of high-quality, well-tested, [semantically versioned](http://semver.org), [standards-compliant](/contributing#standards), independent library packages that can be used in any codebase.

Each library is self-contained and has only the things it needs for its core purpose. None of the library packages depends on any other package. They are decoupled, not only from any particular framework, but also from each other.  This means developers can use as much or as little of the project as necessary.

Whereas Aura library packages have no dependencies, underscore-suffixed packages (such as `*_Bundle`) combine other libraries together, and so are dependent on those libraries.


## History

Aura 1.x began as a rewrite of [Solar](http://solarphp.com), reimagined as a library collection with dependency injection instead of a monolithic framework with service location. (The name change from Solar to Aura was to reduce confusion with the Apache Solr project.) The libraries, once finished, were combined into the [1.x framework](/framework/1.x/en/).

Aura 2.x continues the decoupling of 1.x components into even more independent packages. It also splits apart the framework into kernel and project packages, providing the basis for the [2.x framework](/framework/2.x/en/). Various `*_Kernel` and `*_Project` packages compose the [2.x framework](/framework/2.x/en); they depend on the foundational Aura libraries as well as external packages.

Aura 3.x very slightly relaxes the no-dependencies rule to allow for "interface package" dependencies. Under the relaxed rule, an Aura library may depend on an interface package, but not on an implementation. This allows an Aura library to conform to commonly-used interfaces for logging, HTTP messages, and so on.  In addition, the 3.x series eschews providing a framework, preferring to let end-users build their own for their own particular needs.
