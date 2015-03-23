---
layout: docs2-en
title: Quick Start
permalink: /manuals/2.0/en/quick-start/
---

## Creating your project

Installation is done via [composer](http://getcomposer.org).


{% highlight bash %}
composer create-project aura/web-project quick-start
cd quick-start
composer require "foa/html-view-bundle:2.*"
{% endhighlight %}

All views and layouts are kept in `templates/views` and `templates/layouts` folder.

{% highlight bash %}
mkdir -p templates/{views,layouts}
{% endhighlight %}

Create your basic template `templates/views/hello.php`

{% highlight php %}
<?php // templates/views/hello.php ?>
<?php $this->title()->set("Hello from aura"); ?>
<p>Hello <?= $this->name; ?></p>
{% endhighlight %}

and a very basic layout

{% highlight php %}
<?php // templates/layouts/default.php ?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en-us">
  <head>
    <?php echo $this->title(); ?>
  </head>
  <body>
    <?php echo $this->getContent(); ?>
  </body>
</html>
{% endhighlight %}

Edit `config/Common.php` and define service for `view` and the template paths in registry.

{% highlight php %}
public function define(Container $di)
{
    $di->params['Aura\View\TemplateRegistry']['paths'] = array(
        dirname(__DIR__) . '/templates/views',
        dirname(__DIR__) . '/templates/layouts',
    );
    $di->set('view', $di->lazyNew('Aura\View\View'));
}
{% endhighlight %}

> Setting paths in registry is available from 2.1+

Edit `modifyDispatcher` method to

{% highlight php %}
public function modifyWebDispatcher($di)
{
    $view = $di->get('view');
    $dispatcher = $di->get('aura/web-kernel:dispatcher');
    $response = $di->get('aura/web-kernel:response');
    $request = $di->get('aura/web-kernel:request');
    $dispatcher->setObject('hello', function () use ($view, $response, $request) {
        $name = $request->query->get('name', 'Aura');
        // set the view to render
        $view->setView('hello');
        // set the layout
        $view->setLayout('default');
        // set the data for view
        $view->setData(array('name' => $name));
        $response->content->set($view->__invoke());
    });
}
{% endhighlight %}

Let us fire the php server

{% highlight bash %}
php -S localhost:8000 web/index.php
{% endhighlight %}

Now you can browse `http://localhost:8000` or pass a get value to name as `http://localhost:8000/?name=Hari`

Enjoy using Aura!
