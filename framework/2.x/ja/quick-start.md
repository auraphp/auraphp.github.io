---
layout: docs2-ja
title: クイックスタート
permalink: /framework/2.x/ja/quick-start/
---

## プロジェクトの作成

インストールは [composer](http://getcomposer.org) で行います。


{% highlight bash %}
composer create-project aura/web-project quick-start
cd quick-start
composer require "foa/html-view-bundle:2.*"
{% endhighlight %}

すべてのビューファイルとレイアウトファイルは、`templates/views` および `templates/layouts` フォルダ内に置きます。

{% highlight bash %}
mkdir -p templates/{views,layouts}
{% endhighlight %}

基本的なテンプレートファイルを `templates/views/hello.php` に作成します。

{% highlight php %}
<?php // templates/views/hello.php ?>
<?php $this->title()->set("Hello from aura"); ?>
<p>Hello <?= $this->name; ?></p>
{% endhighlight %}


そしてとても簡単なレイアウトを作成します。

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

`config/Common.php` を編集し`view` のサービスを定義します。

{% highlight php %}
public function define(Container $di)
{
    $di->set('view', $di->lazyNew('Aura\View\View'));
}
{% endhighlight %}

`modifyDispatcher` メソッドを下記のように編集します。

{% highlight php %}
public function modifyWebDispatcher($di)
{
    $view = $di->get('view');
    $dispatcher = $di->get('aura/web-kernel:dispatcher');
    $response = $di->get('aura/web-kernel:response');
    $request = $di->get('aura/web-kernel:request');
    $dispatcher->setObject('hello', function () use ($view, $response, $request) {

        // ビューファイルとレイアウトファイルのパスをセットします。
        $view_registry = $view->getViewRegistry();
        $view_registry->set('hello', dirname(__DIR__) . '/templates/views/hello.php');
        $layout_registry = $view->getLayoutRegistry();
        $layout_registry->set('default', dirname(__DIR__) . '/templates/layouts/default.php');

        $name = $request->query->get('name', 'Aura');
        $view->setView('hello');
        $view->setLayout('default');
        $view->setData(array('name' => $name));
        $response->content->set($view->__invoke());
    });
}
{% endhighlight %}

PHPサーバを起動してみましょう。

{% highlight bash %}
php -S localhost:8000 web/index.php
{% endhighlight %}
