---
title: Aura.Micro -- Experimental Replacement for Silex
layout: post
category : auraphp
tags : [router, routing, micro, framework]
author : Stan Lemon
---
{% include JB/setup %}

Micro-frameworks have gotten a lot of attention in the PHP community over the
last year. Many people are familiar with [Silex][], the extremely popular
micro-framework built on top of Symfony Components. There's something really
elegant about the way you can write a quick little application with a micro-framework.

I was recently working on a small project that used [Silex][]. As I browsed my
vendor folder, I realized how much extra "stuff" I had inherited with Silex.
There were a bunch of other components required when all I wanted was some
quick and easy routing, micro-framework style.

When I think about going lean I always find myself coming back to Aura.
[Micro-frameworks are not a new to idea to Aura][microblog], so I wondered if
I could take the elegance and ease of Silex by wrapping up [Aura.Router][] and
exposing it through a similar API. The result is [Aura.Micro][], a light
wrapper for Aura.Router to get a Silex-style API.

A couple of things are worth noting:

- First, this is just an experiment and I had no intention of 100% parity with
  Silex. Silex is built onto Pimple, mixing the ideas of a micro-framework and
  a service locator. Aura.Micro is just a micro-framework for quick and easy
  web application routing.

- Second, I very intentionally decided to make Aura.Router the **only
  dependency** for Aura.Micro. This means that rather than leverage
  [Aura.Signal][] or [Aura.Di][] (both really awesome libraries!), or even some
  other Event and Dependency Injection libraries, I added a super-light
  callback system to provide methods like `$app->before()` and `$app->after()`
  and `$app->finish()` and `$app->error()`. I completely ignored pieces
  like the Silex service providers.

So what does Aura.Micro look like in practice?

{% highlight php %}
<?php
$app = new Aura\Micro\Micro();

$app->before(function(){
    print "Running before" . PHP_EOL;
});

$app->after(function(){
    print "Running after" . PHP_EOL;;
});

$app->finish(function(){
    print "Running finish" . PHP_EOL;
});

$app->error(function(){
    print "Error" . PHP_EOL;
});

$app->get("/test", function(){
    print "Testing" . PHP_EOL;
});

$app->get("/hello/{:world}", function($world) use($app){
    print "Hello {$world}" . PHP_EOL;
});

$app->run();
{% endhighlight %}

You can clone [Aura.Micro][] from GitHub or drop the following into your
`composer.json` file:

    {
        "repositories": [
            {
                "type": "vcs",
                "url": "http://github.com/stanlemon/aura-micro"
            }
        ],
        "require": {
            "stanlemon/aura-micro": "*"
        }
    }

Have ideas on how to improve this little wrapper? Add an issue or send over a
pull request!


[microblog]: http://auraphp.github.com/2012/06/20/aura-router-also-as-micro-framework/
[Aura.Router]: https://github.com/auraphp/Aura.Router
[Aura.Micro]: http://github.com/stanlemon/aura-micro
[Silex]: http://silex.sensiolabs.org
[Aura.Signal]: https://github.com/auraphp/Aura.Signal
[Aura.Di]: https://github.com/auraphp/Aura.Di
