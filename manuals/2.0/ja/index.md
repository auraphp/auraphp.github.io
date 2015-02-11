---
layout: docs2-ja
title: イントロダクション
permalink: /manuals/2.0/ja/
previous_page:
previous_page_url:
next_page: コンフィギュレーション
next_page_url: /manuals/2.0/ja/configuration
---

# はじめに

[Composer](http://getcomposer.org) は PHP の世界において、パッケージ管理ツールのデファクトスタンダードとなっています。Aura フレームワークにおいても同じです。

## インストール

{% highlight php %}
composer create-project --stability=dev aura/framework-project {$PROJECT_PATH}
{% endhighlight %}

> {$PROJECT_PATH} を実際のパスに置き換えてください

このコマンドは `{$PROJECT_PATH}` というディレクトリを作成し、 vendor フォルダに依存関係をインストールします。

### 構造

ディレクトリ構造は以下のようなものになります。このリストはいくつかのファイルやディレクトリを削除しているため、完全なものではありません。

{% highlight bash %}
├── CHANGES.md
├── cli
│   └── console.php
├── composer.json
├── composer.lock
├── config
│   ├── Common.php
│   ├── Dev.php
│   ├── _env.php
│   ├── Prod.php
│   └── Test.php
├── src
├── tests
├── tmp
│   ├── cache
│   └── log
│       └── dev.log
├── vendor
│   ├── aura
│   │   ├── cli
│   │   ├── cli-kernel
│   │   ├── di
│   │   ├── dispatcher
│   │   ├── project-kernel
│   │   ├── router
│   │   ├── web
│   │   └── web-kernel
│   ├── autoload.php
│   ├── monolog
│   │   └── monolog
│   └── psr
│       └── log
└── web
    └── index.php
{% endhighlight %}

バーチャルホストを設定して `web/index.php` へアクセスできるようにする必要があります。詳細については使用しているバーチャルホストの設定を確認してください。

ここでは、組み込みのPHPサーバーを利用してみます。


{% highlight bash %}
php -S localhost:8000 -t web/
{% endhighlight %}

Web ブラウザで `http://localhost:8000` を開くと、 `Hello World!` のメッセージを見ることができます。

すばらしい！問題なく動作していますね。

## Hello World! を探る

`config/Common.php` を開いてください。`modifyWebRouter()` と `modifyWebDispatcher()` のメソッドを見てみます。

{% highlight php %}
public function modifyWebRouter(Container $di)
{
    $router = $di->get('aura/web-kernel:router');
    $router->add('hello', '/')
           ->setValues(array('action' => 'hello'));
}
{% endhighlight %}

`modifyWebRouter()` ではルータサービスを取得して、 `/` を `hello` というルート名で追加しています。これにより `http://localhost:8000` へのすべてのリクエストは `hello` というルート名で処理されます。

リクエストが来たときにどんな処理が行われるのか、ルータは知りません。ディスパッチャがディスパッチ処理を手伝います。

{% highlight php %}
public function modifyWebDispatcher($di)
{
    $dispatcher = $di->get('aura/web-kernel:dispatcher');

    $dispatcher->setObject('hello', function () use ($di) {
        $response = $di->get('aura/web-kernel:response');
        $response->content->set('Hello World!');
    });
}
{% endhighlight %}

ディスパッチャサービスを取得し、`setObject` にコントローラのルートと同じ名前をセットして、クロージャまたはコールバックで処理を記述します。

この例ではクロージャを使用しています。use で受け取った DI コンテナを利用して Web レスポンスオブジェクトを取得し、レスポンスの内容をセットしています。

Dependency Injection （依存性の注入）と DI コンテナについてはあまり気にしないでください。これからの章で詳細を説明します。
