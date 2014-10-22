---
layout: docs2-en
title: Dispatching
permalink: /manuals/2.0/en/dispatcher/
previous_page: Routing
previous_page_url: /manuals/2.0/en/router/
next_page: Request
next_page_url: /manuals/2.0/en/request/
---

# Dispatching

Aura projects can handle different variations of dispatching with the help of [Aura.Dispatcher](https://github.com/auraphp/Aura.Dispatcher).

* [Microframework](#micro-framework)
* [Modified Micro-Framework Style](#modified-micro-framework)
* [Full-Stack Style](#full-stack)

So if your application starts small and grows, it is easy to modify the application routes acting as a micro framework to a full-stack style.

> You can skip to your favourite usage.

## Microframework

The following is an example of a micro-framework style route, where the action logic is embedded in the route params. In the `modify()` config method, we retrieve the shared `aura/web-kernel:request` and `aura/web-kernel:response` services, along with the `aura/web-kernel:router` service. We then add a route names `blog.read` and embed the action code as a closure.

```php
<?php
namespace Aura\Web_Project\_Config;

use Aura\Di\Config;
use Aura\Di\Container;

class Common extends Config
{
    // ...

    public function modify(Container $di)
    {
        $request = $di->get('aura/web-kernel:request');
        $response = $di->get('aura/web-kernel:response');

        $router = $di->get('aura/web-kernel:router');
        $router
            ->add('blog.read', '/blog/read/{id}')
            ->addValues(array(
                'action' => function ($id) use ($request, $response) {
                    $content = "Reading blog post $id";
                    $response->content->set(htmlspecialchars(
                        $content, ENT_QUOTES|ENT_SUBSTITUTE, 'UTF-8'
                    ));
                }
            ));
    }

    // ...
}
```

## Modified Micro-Framework Style

We can modify the above example to put the action logic in the dispatcher instead of the route itself.

Extract the action closure to the dispatcher under the name `blog.read`. Then, in the route, use a `action` value that matches the name in the dispatcher.

```php
<?php
namespace Aura\Web_Project\_Config;

use Aura\Di\Config;
use Aura\Di\Container;

class Common extends Config
{
    // ...

    public function modify(Container $di)
    {
        $request = $di->get('aura/web-kernel:request');
        $response = $di->get('aura/web-kernel:response');

        $dispatcher = $di->get('aura/web-kernel:dispatcher');
        $dispatcher->setObject(
            'blog.read',
            function ($id) use ($request, $response) {
                $content = "Reading blog post $id";
                $response->content->set(htmlspecialchars(
                    $content, ENT_QUOTES|ENT_SUBSTITUTE, 'UTF-8'
                ));
            }
        );

        $router = $di->get('aura/web-kernel:router');
        $router
            ->add('blog.read', '/blog/read/{id}')
            ->addValues(array(
                'action' => 'blog.read',
            ));
    }

    // ...
}
```

## Full-Stack Style

You can migrate from a micro-framework style to a full-stack style (or start with full-stack style in the first place).

First, define a action class and place it in the project `src/` directory.

```php
<?php
/**
 * {$PROJECT_PATH}/src/App/Actions/BlogRead.php
 */
namespace App\Actions;

use Aura\Web\Request;
use Aura\Web\Response;

class BlogRead
{
    public function __construct(Request $request, Response $response)
    {
        $this->request = $request;
        $this->response = $response;
    }

    public function __invoke($id)
    {
        $content = "Reading blog post $id";
        $this->response->content->set(htmlspecialchars(
            $content, ENT_QUOTES|ENT_SUBSTITUTE, 'UTF-8'
        ));
    }
}
```

Next, tell the project how to build the _BlogRead_ through the DI _Container_. Edit the project `config/Common.php` file to configure the _Container_ to pass the `aura/web-kernel:request` and `aura/web-kernel:response` service objects to the _BlogRead_ constructor.

```php
<?php
namespace Aura\Web_Project\_Config;

use Aura\Di\Config;
use Aura\Di\Container;

class Common extends Config
{
    public function define(Container $di)
    {
        // ...

        $di->params['App\Actions\BlogRead'] = array(
            'request' => $di->lazyGet('aura/web-kernel:request'),
            'response' => $di->lazyGet('aura/web-kernel:response'),
        );
    }

    // ...
}
```

After that, put the _`App\Actions\BlogRead`_ object in the dispatcher under the name `blog.read` as a lazy-loaded instantiation ...

```php
<?php
namespace Aura\Web_Project\_Config;

use Aura\Di\Config;
use Aura\Di\Container;

class Common extends Config
{
    // ...

    public function modify(Container $di)
    {
        // ...
        $dispatcher = $di->get('aura/web-kernel:dispatcher');
        $dispatcher->setObject(
            'blog.read',
            $di->lazyNew('App\Actions\BlogRead')
        );
    }

    // ...
}
```

... and finally, point the router to the `blog.read` action object:

```php
<?php
namespace Aura\Web_Project\_Config;

use Aura\Di\Config;
use Aura\Di\Container;

class Common extends Config
{
    // ...

    public function modify(Container $di)
    {
        // ...
        $router = $di->get('aura/web-kernel:router');
        $router
            ->add('blog.read', '/blog/read/{id}')
            ->addValues(array(
                'action' => 'blog.read',
            ));
    }

    // ...
}
```
