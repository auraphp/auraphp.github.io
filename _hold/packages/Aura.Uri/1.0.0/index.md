---
title: Aura for PHP -- Tools to build and manipulate URL strings.
layout: site
active: packages
---

Aura.Uri
========

The `Auri.Uri` package provides objects to help you create and manipulate URLs,
including query strings and path elements. It does so by splitting up the pieces
of the URL and allowing you modify them individually; you can then fetch
them as a single URL string. This helps when building complex links,
such as in a paged navigation system.

This package is compliant with [PSR-0][], [PSR-1][], and [PSR-2][]. If you
notice compliance oversights, please send a patch via pull request.

[PSR-0]: https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-0.md
[PSR-1]: https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-1-basic-coding-standard.md
[PSR-2]: https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-2-coding-style-guide.md

Getting Started
===============

Instantiation
-------------

The easiest way to instantiate a URL object is to use the factory instance
script, like so:

{% highlight php %}
<?php
$url_factory = require '/path/to/Aura.Uri/scripts/instance.php';
$url = $url_factory->newCurrent();
{% endhighlight %}

Alternatively, you can add the `src/` directory to your autoloader and
instantiate a URL factory object:

{% highlight php %}
<?php
use Aura\Uri\Url\Factory as UrlFactory;

$url_factory = new UrlFactory($_SERVER);
$url = $url_factory->newCurrent();
{% endhighlight %}

When using the factory, you can populate the URL properties from a URL
string:

{% highlight php %}
<?php
$string = 'http://anonymous:guest@example.com/path/to/index.php/foo/bar.xml?baz=dib#anchor');
$url = $url_factory->newInstance($string);

// now the $url properties are ...
// 
// $url->scheme   => 'http'
// $url->host     => 'example.com'
// $url->user     => 'anonymous'
// $url->pass     => 'guest'
// $url->path     => ArrayObject(['path', 'to', 'index.php', 'foo', 'bar'])
// $url->format   => '.xml'
// $url->query    => ArrayObject(['baz' => 'dib'])
// $url->fragment => 'anchor'
{% endhighlight %}

Alternatively, you can use the factory to create a URL representing the
current web request URI:

{% highlight php %}
<?php
$url = $url_factory->newCurrent();
{% endhighlight %}


Manipulation
------------

After we have created the URL object, we can modify the component parts, then
fetch a new URL string from the modified object.

{% highlight php %}
<?php
// start with a full URL
$string = 'http://anonymous:guest@example.com/path/to/index.php/foo/bar.xml?baz=dib#anchor';
$url = $url_factory->newInstance($string);

// change to 'https://'
$url->setScheme('https');

// remove the username and password
$url->setUser(null);
$url->setPass(null);

// change the value of 'baz' from 'dib' to 'zab'
$url->query->baz = 'zab';

// add a new query element called 'zim' with a value of 'gir'
$url->query->zim = 'gir';

// reset the path to something else entirely.
// this will additionally set the format to '.php'.
$url->path->setFromString('/something/else/entirely.php');

// add another path element
$url->path[] = 'another';

// get the url as a string; this will be without the scheme, host, port,
// user, or pass.
$new_url = $url->get();

// the $new_url string is as follows; notice how the format
// is always applied to the last path-element:
// /something/else/entirely/another.php?baz=zab&zim=gir#anchor

// get the full url string, including scheme, host, port, user, and pass.
$full_url = $url->getFull();

// the $full_url string is as follows:
// https://example.com/something/else/entirely/another.php?baz=zab&zim=gir#anchor
{% endhighlight %}

* * *