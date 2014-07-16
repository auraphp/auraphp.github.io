---
title: A Peek At Aura v2 -- Aura.Web_Project, The Micro/Macro Web Framework
layout: post
tags : [v2, web, project]
author : Paul M. Jones
---

*Updated July 16, 2014 to reflect version 2.2 changes in the examples.*

(In this series, we have been discussing the improvements over Aura v1 that
are being incorporated into v2.)

Lighter than [Silex][], and slimmer than [Slim][], the [Aura.Web_Project][]
package is a minimalist web-specific project framework that starts out small
and grows only as you need it.

By "minimal" we mean *very* minimal. The project package provides only a
[dependency injection container][Aura.Di v2],
a [configuration system][Aura.Project_Kernel],
a [router][Aura.Router v2],
a [dispatcher][Aura.Dispatcher],
a pair of [request and response][Aura.Web v2] objects,
and a [Monolog][] instance for logging.

This minimal implementation should not be taken as "restrictive":

- The DI container, coupled with the project kernel's two-stage configuration,
  allows a wide range of programmatic service definitions.  This means *no
  more static calls* to configure services; edit the `modify` stage config
  files, pull a service out of the container, and operate on it directly.

- You can add *any* library you want into the project, not just Aura
  libraries, through Composer and the DI container. This means the
  bundle/plugin universe is made up of **anything written in PHP**, not just
  Aura-specific plugins.

- As noted in earlier articles in this series, the [router][] and [dispatcher][] are
  completely separated from each other, and are built with iterative
  refactoring in mind. This means you can start with micro-framework-like
  closure controllers, and work your way into more complex controller objects
  of your own design.


### Projects? Kernels? Dependencies?

It had to happen at some point. Unlike Aura *library* packages, the *project*
and associated *kernel* packages have dependencies. This is something we
can't get around; the idea behind Aura has always been to build its framework
out of the independent library packages, but of course that means the
framework itself is not independent of the libraries.

(The `Aura.*_Project` packages are system skeletons, providing a directory
structure for the proejct. The `Aura.*_Kernel` packages bring together
the libraries necessary for the project skeleton.)

### Getting Started

You can start a new [Aura.Web_Project][] via [Composer][] in a
`{$PROJECT_PATH}` of your choosing:

    composer create-project --stability=dev aura/web-project {$PROJECT_PATH}
    
This will create the project skeleton and install all of the necessary
library packages.

Once you have installed the project, start the built-in PHP server inside the
new project web directory:

    cd {$PROJECT_PATH}
    php -S localhost:8000 -t web/

When you browse to <http://localhost:8000> you should see "Hello World!" as
the output.


### Controllers: Micro/Macro?

When we say "micro/macro", we mean that the system starts out as a the most
micro of micro-frameworks, but is built with the idea that eventually you may
want to refactor your architecture to a full-stack type of system.

#### Micro Controller

For example, you can start by embedding your controller logic directly in
the router system ...

{% highlight php %}
<?php
/**
 * {$PROJECT_PATH}/config/Common.php
 */
public function modifyWebRouter(Container $di)
{

    $router = $di->get('web_router');
    $request  = $di->get('web_request');
    $response = $di->get('web_response');

    $router->add('blog.read', '/blog/read/{id}')
        ->addValues(array(
            'controller' => function ($id) use ($request, $response) {
                $content = "Reading blog post $id";
                $response->content->set(htmlspecialchars(
                    $content, ENT_QUOTES|ENT_SUBSTITUTE, 'UTF-8'
                ));
            }
        ));
}
?>
{% endhighlight %}

#### Macro Controller

You can then migrate that to a more full-stack system (or you can
start with a full stack style in the first place).  This is more complex but
is much more powerful, maintainable, and testable in the long run.

First, define a controller class and place it in the project `src/` directory.

{% highlight php %}
<?php
/**
 * {$PROJECT_PATH}/src/App/Controllers/BlogController.php
 */
namespace App\Controllers;

use Aura\Web\Request;
use Aura\Web\Response;

class BlogController
{
    public function __construct(Request $request, Response $response)
    {
        $this->request = $request;
        $this->response = $response;
    }
    
    public function read($id)
    {
        $content = "Reading blog post $id";
        $this->response->content->set(htmlspecialchars(
            $content, ENT_QUOTES|ENT_SUBSTITUTE, 'UTF-8'
        ));
    }
}
?>
{% endhighlight %}

(Note that you don't need to extend a base controller here. The
[Aura.Web_Project][] package does not force any specific controller
methodology on you. Of course, if you want to, you can create your own base
controllers and extend them.)

Next, tell the project how to build the _BlogController_ through the DI
system. Edit the project `config/default/define.php` config file to tell the
DI system to pass _Request_ and _Response_ objects to the constructor.

{% highlight php %}
<?php
/**
 * {$PROJECT_PATH}/config/Common.php
 */
public function define(Container $di)
{
    $di->params['App\Controllers\BlogController'] = array(
        'request' => $di->lazyGet('web_request'),
        'response' => $di->lazyGet('web_response'),
    );
}
?>
{% endhighlight %}

After that, put the _App\Controllers\BlogController_ object in the dispatcher
under the name `blog` as a lazy-loaded instantiation ...

{% highlight php %}
<?php
/**
 * {$PROJECT_PATH}/config/Common.php
 */
public function modifyWebDispatcher($di)
{
    $dispatcher = $di->get('web_dispatcher');

    $dispatcher->setObject('blog', $di->lazyNew('App\Controllers\BlogController'));
}
?>
{% endhighlight %}

... and finally, point the router to the `blog` controller object and its
its `read` action:

{% highlight php %}
<?php
/**
 * {$PROJECT_PATH}/config/Common.php
 */
public function modifyWebRouter(Container $di)
{
    $router = $di->get('web_router');

    $router->add('blog.read', '/blog/read/{id}')
        ->addValues(array(
            'controller' => 'blog',
            'action' => 'read',
        ));
}
?>
{% endhighlight %}


### Configuration?

As with the Aura v1, configuration files are located in
`{$PROJECT_PATH}/config` directory. Previously, they were single files,
labeled for the config mode. In Aura v2, config files are organized into
subdirectories by config mode. (The config mode is still stored in the `_mode`
file in the config directory.)

Whereas Aura v1 projects used a single-stage config system, loading up the
individual config files to define params, setters, and services, Aura v2
projects use a two-stage configuration system:

1. First, all `define.php` files are included from the packages and the
project; these define constructor parameters, setter methods, and shared
services through the DI container.

2. After that, the DI container is locked, and all `modify.php` files are
included; these are for retrieving services from the DI container for
programmatic modification.

(The `default` mode directory is always loaded; if the mode is something other
than `default` then the files in that directory will be loaded after `default`.)

This two-stage process provides a very powerful system for configuring any and
all PHP libraries, especially those that have been registered as services in
the DI container. However, this power comes with some level of complexity; the
rules are simple, but they lead to complex combinations and effects. As such,
will write about the configuration system in specific at a later time.

### Adding Functionality

Adding new functionality is as easy as modifying the project `composer.json`
file, doing `composer update`, and then changing your config files to build
the new library objects properly. If you are adding an Aura library, the
system knows enough to configure it automatically via the library package's
`config/` directory, but *any* reasonably well-structured PHP library can be
included and configured.


### Conclusion

The point of [Aura.Web_Project][] is to provide an absolute minimal framework
for building web apps in a way that promotes separation of concerns along with
a refactorable architecture. The DI container and two-stage configuration
system are the key components here, with the fully-separated router and
dispatcher layered on top of them.

If you like clean code, fully decoupled libraries, and truly independent
packages, then [the Aura project][Aura] is for you. Download a single package
and start using it in your project today, with no added dependencies.


[Aura.Di v2]: https://github.com/auraphp/Aura.Di/tree/develop-2
[Aura.Dispatcher]: https://github.com/auraphp/Aura.Dispatcher
[Aura.Project_Kernel]: https://github.com/auraphp/Aura.Project_Kernel
[Aura.Router v2]: https://github.com/auraphp/Aura.Router/tree/develop-2
[Aura.Web v2]: http://github.com/auraphp/Aura.Web/tree/develop-2
[Aura.Web_Project]: https://github.com/auraphp/Aura.Web_Kernel
[Aura]: http://auraphp.com
[Silex]: http://silex.sensiolabs.org
[Slim]: http://www.slimframework.com
[Solar]: http://solarphp.com
[Monolog]: https://github.com/Seldaek/monolog
[Composer]: http://getcomposer.org
[router]: /blog/2013/11/18/aura-v2-router
[dispatcher]: /blog/2013/11/04/aura-v2-dispatcher
