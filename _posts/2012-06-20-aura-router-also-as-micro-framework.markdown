---
title: Aura.Router can also be used as a micro-framework dispatcher!
layout: post
tags : [router, routing]
author : Hari KT
---

Sometimes you may wish to use Aura as a micro-framework. It’s also possible to assigning anonymous function to controller:

    <?php
    $map->add("read", "/blog/read/{:id}{:format}", [
        "params" => [
            "id" => "(\d+)",
            "format" => "(\..+)?",
        ],
        "values" => [
            "controller" => function ($args) {
                $id = (int) $args["id"];
                return "Reading blog ID {$id}";
            },
            "format" => ".html",
        ],
    ));
    
When you are using Aura.Router as a micro-framework, the dispatcher will look something similar to the one below:

    <?php
    $params = $route->values;
    $controller = $params["controller"];
    unset($params["controller"]);
    echo $controller($params);

Via [phpmaster | Web Routing in PHP with Aura.Router](http://phpmaster.com/web-routing-in-php-with-aura-router/). The Aura project for PHP 5.4 codebase is [https://github.com/auraphp](https://github.com/auraphp).
