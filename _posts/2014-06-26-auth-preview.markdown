---
title: An Updated Preview Of Aura.Auth
layout: post
tags : [auth, v2]
author : Paul M. Jones
---

A couple of weeks ago I started porting [Solar_Auth](https://github.com/solarphp/core/tree/master/Solar/Auth) to an Aura v2 package, [Aura.Auth](https://github.com/auraphp/Aura.Auth). It can be difficult to find a truly standalone, authentication-only library, and Aura.Auth fits that bill.

The library is still under development, but the major pieces are all now in place:

- a [state-tracking object](https://github.com/auraphp/Aura.Auth#instantiation)

- [services](https://github.com/auraphp/Aura.Auth#services) for login, logout, and resuming sessions

- adapters for [htpasswd](https://github.com/auraphp/Aura.Auth#htpasswd-adapter) and [PDO](https://github.com/auraphp/Aura.Auth#pdo-adapter) backends

- [service integration idioms](https://github.com/auraphp/Aura.Auth#service-idioms) (including HTTP `Authorization: Basic` login integration)

- [native session management](https://github.com/auraphp/Aura.Auth#session-management)

Each layer can handle custom implementations. There are instructions for [custom adapters](https://github.com/auraphp/Aura.Auth#custom-adapters), [custom session managers](https://github.com/auraphp/Aura.Auth#custom-sessions) (including [session-less authentication](https://github.com/auraphp/Aura.Auth#working-without-sessions)), and [custom services](https://github.com/auraphp/Aura.Auth#custom-services).

Note that the library is purposely limited in scope. It does not do roles, groups, access control, or account management. You give it some credentials, it tells you if the credentials are valid or not, and starts/stops sessions.

As with all Aura libraries, [the measurable code quality is very high](https://github.com/auraphp/Aura.Auth#quality). It has 100% test coverage, is fully decoupled from all other libraries, and scores very well on Scrutinizer-CI. It is PHP 5.3 compatible, although if you want to use the new and more-secure [password_hash()](http://php.net/password_hash) functionality, you will need PHP 5.5 (or a userland implementation such as [ircmaxell/password-compat](https://github.com/ircmaxell/password_compat).)

If you are interested in the project, try it out and get in your suggestions on what's needed.  We already have a [TODO](https://github.com/auraphp/Aura.Auth/blob/2.x/TODO.md) list, but there may be things we haven't thought of. Now is the time to make your voice heard -- and, of course, pull requests are always welcome for review.
