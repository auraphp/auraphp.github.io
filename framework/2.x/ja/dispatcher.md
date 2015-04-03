---
layout: docs2-ja
title: ディスパッチ
permalink: /framework/2.x/ja/dispatcher/
previous_page: ルーティング
previous_page_url: /framework/2.x/ja/router/
next_page: リクエスト
next_page_url: /framework/2.x/ja/request/
---

# ディスパッチ

Auraプロジェクトは[Aura.Dispatcher](https://github.com/auraphp/Aura.Dispatcher)の助けを借りて様々なバリエーションのプロジェクトを取り扱うことができます。

* [Microframework](#microframework)
* [Modified Micro-Framework Style](#modified-micro-framework-style)
* [Full-Stack Style](#full-stack-style)

従って、あなたのアプリケーションがまだ小さく、成長している場合でもアプリケーションをマイクロフレームワークからフルスタックスタイルへと変化させてゆくことは簡単です。

> You can skip to your favourite usage.

## マイクロフレームワーク

以下に続くのはマイクロフレームワークスタイルのルーターで、アクションロジックはルーターのパラメータに埋め込まれています。`modify()`メソッドのなかで`aura/web-kernel:response`によってシェアされた`aura/web-kernel:request`と`aura/web-kernel:response`サービスを取得します。次に、`blog.read`という名前をルートに追加しアクションのコードをクロージャとして埋め込みます。

{% highlight php %}
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
{% endhighlight %}

## 修正マイクロフレームワークスタイル

上の例をルーター自身を使う代わりにアクションロジックをディスパッチャーの中におくように修正できます。

`blog.name`という名前でディスパッチャにアクションクロージャを設定します。そしてルーターの内部ではディスパッチャーとのマッチングの為に`action`の値に設定します。

{% highlight php %}
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
{% endhighlight %}

## フルスタックスタイル

マイクロフレームワークスタイルからフルスタックスタイルへと移行することも可能です。(または最初からフルスタックスタイルで開始することも可能です。)

まず、アクションクラスと`src/`ディレクトリ配下の場所を定義してください。

{% highlight php %}
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
{% endhighlight %}

次に、DI _Container_ を通してプロジェクトにどうやって _BlogRead_ を構築するか通知します。_BlogRead_コンストラクタに`aura/web-kernel:request`と`aura/web-kernel:response`サービスオブジェクトを渡すように_Container_を設定するには、プロジェクトの`config/Common`ファイルを編集します。

{% highlight php %}
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
{% endhighlight %}

その後、 _`App\Actions\BlogRead`_ オブジェクトを`blog.read`という名前でディスパッチャーにレジーロードで登録します。

{% highlight php %}
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
{% endhighlight %}

... そして最後に、ルーターに`blog.read`アクションオブジェクトにを指定します。

{% highlight php %}
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
{% endhighlight %}
