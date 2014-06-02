---
title: A Round Of 1.x Releases
layout: post
tags : [release]
author : Paul M. Jones
---

Even though we have begun a series of [Aura v2 packages](http://auraphp.com/packages/v2), the 1.x versions do not languish. Over the weekend we released updated versions of [every 1.x library](http://auraphp.com/packages).

Most of these were "hygiene" releases, with docblock updates, extra tests, and minor bug fixes. However, the [Router](http://auraphp.com/packages/Aura.Router/) has two new methods to append and prepend route collections, and the [Uri](http://auraphp.com/packages/Aura.Uri/) package adds support for schemeless URLs, ftp/ftps schemes, single label hosts, and an updated Public Suffix List.

Many thanks to everyone who made these releases possible, especially to Hari KT for insisting on the need for hygiene releases, and to Jeremy Kendall for his work on the Uri package.

We at Aura adhere to [Semantic Versioning](http://semver.org); none of these releases have any backwards-compatibility breaks, so you should be able to update-in-place without any problems. Note also that each of these packages is completely independent and fully decoupled, so you can download and use one library without adding any further dependencies.
