---
layout: docs2-ja
title: ルーティング
permalink: /framework/2.x/ja/router/
previous_page: コンフィギュレーション
previous_page_url: /framework/2.x/ja/configuration/
next_page: ディスパッチ
next_page_url: /framework/2.x/ja/dispatcher/
---

# ルーティング

ルーティング設定はプロジェクトレベルの config/ クラスで行われています。もし、全てのコンフィグモードでルートを有効にしたい場合はプロジェクトレベルの config/Common.php クラスを編集しましょう。もし、特定のコンフィグモード(例えば、dev) で有効にしたいルートは、モードに対応したコンフィグファイル (`config/Dev.php`) を編集しましょう。

`modify()` メソッドで、 `$di->get('aura/web-kernel:router')` を利用してルーターサービスを取得し、アプリケーションにルートを設定しましょう。

{% highlight php %}
<?php
namespace Aura\Framework_Project\_Config;

use Aura\Di\Config;
use Aura\Di\Container;

class Common extends Config
{
    public function define(Container $di)
    {
        // パラメーター、セッター、サービスを定義します。
    }

    public function modify(Container $di)
    {
        // ルーターサービスを取得します。
        $router = $di->get('aura/web-kernel:router');
        // ... 以下に、アプリケーションのルーティング設定を行います。
    }
}
{% endhighlight %}

`aura/web-kernel:router` は、_Aura\\Router\\Router_ のオブジェクトです。よって、もし [Aura.Router](https://github.com/auraphp/Aura.Router) についてすでにご存知の方は、この章を読み飛ばして頂いても大丈夫です。

Aura フレームワークは、マイクロフレームワークとしてもフルスタックフレームとしても振舞う事が出来ます。もし、マイクロフレームワークとして利用する場合は、アクションにクロージャをセットします。それ以外は、ディスパッチャーに、アクション名をセットします。

## ルートの追加

ルートを作成するためには、_Router_ で `add()` メソッドを呼び出しましょう。パラメーターは、パスの括弧の内側に定義されます。

{% highlight php %}
// パラメーター無しのシンプルなルートを追加します
$router->add('home', '/');

// パラメーター有りのルートを追加します
$router->add(null, '/{action}/{id}');

// 設定を拡張し、命名したルートを追加します
$router->add('blog.read', '/blog/read/{id}{format}')
    ->addTokens(array(
        'id'     => '\d+',
        'format' => '(\.[^/]+)?',
    ))
    ->addValues(array(
        'action'     => 'BlogReadAction',
        'format'     => '.html',
    ));
{% endhighlight %}

特定のHTTPメソッドに対してのみ、一致するルートを作成する事が出来ます。下記の _Router_ メソッドは、`add()` と同様ですが関連したHTTPメソッドを必要とします。:

- `$router->addGet()`
- `$router->addDelete()`
- `$router->addOption()`
- `$router->addPatch()`
- `$router->addPost()`
- `$router->addPut()`

## 高度な使用法

## ルート仕様の拡張

下記のメソッドでルートの仕様を拡張する事が出来ます。:

- `addTokens()` -- パラメーターにマッチする正規表現のサブパターンを追加します。

        addTokens(array(
            'id' => '\d+',
        ))

    `setTokens()` メソッドも利用する事が出来ます。ただしこちらは、すでに定義
    されているサブパターンをマージするのではなく、上書きします。


- `addServer()` -- サーバーの値にマッチする正規表現を追加します。

        addServer(array(
            'REQUEST_METHOD' => 'PUT|PATCH',
        ))

    `setServer()` メソッドも利用する事が出来ます。ただしこちらは、すでに定義
    されている表現をマージするのではなく、上書きします。

- `addValues()` -- パラメーターのデフォルト値を設定します。

        addValues(array(
            'year' => '1979',
            'month' => '11',
            'day' => '07'
        ))

    `setValues()` メソッドも利用する事が出来ます。ただしこちらは、すでに定義
    されているデフォルト値をマージするのではなく、上書きします。

- `setSecure()` -- `true` の時、`$server['HTTPS']`　が設定されている必要があります。あるいは、
  443番ポートへのリクエストを要求します。`false` の場合はどちらも要求されません。

- `setWildcard()` -- 不確定なパラメーターの名前を設定します。ルートパス後の任意のスラッシュで区切られた
値が保持されます。

- `setRoutable()` -- `false` の時、ルートはパス生成のみに利用され、マッチングを行いません。 (デフォルトは `true` です).

- `setIsMatchCallable()` -- `function(array $server, \ArrayObject $matches)` のシグニチャでコーラブルを設定できます。マッチした時には、 true を返し、そうでない場合は false を返します。これは、デベロッパーがパスからパラメーターのために `$matches` を変更したり、マッチングのロジックを定義する事ができます。

- `setGenerateCallable()` -- `function(\ArrayObject $data)` のシグニチャでコーラブルを設定できます。パス補完のためのデータを変更したりする事ができます。

こちらは、`read` と名付けられたフルに拡張されたルート仕様の例です。:

{% highlight php %}
$router->add('blog.read', '/blog/read/{id}{format}')
    ->addTokens(array(
        'id' => '\d+',
        'format' => '(\.[^/]+)?',
        'REQUEST_METHOD' => 'GET|POST',
    ))
    ->addValues(array(
        'id' => 1,
        'format' => '.html',
    ))
    ->setSecure(false)
    ->setRoutable(false)
    ->setIsMatchCallable(function(array $server, \ArrayObject $matches) {

        // example.com からの経由を許可しない。
        if ($server['HTTP_REFERER'] == 'http://example.com') {
            return false;
        }

        // マッチするために、$serverからリファラーを追加する。
        $matches['referer'] = $server['HTTP_REFERER'];
        return true;

    })
    ->setGenerateCallable(function (\ArrayObject $data) {
        $data['foo'] = 'bar';
    });
{% endhighlight %}

## デフォルトのルート仕様

下記の _Router_ メソッドでデフォルトのルート仕様を設定する事が出来ます。
この値は、その後の全てのルートに適用されます。

{% highlight php %}
// 'tokens' 表現のデフォルトを追加します。setTokens() も利用出来ます。
$router->addTokens(array(
    'id' => '\d+',
));

// 'server' 表現のデフォルト値を追加します。setServer() も利用出来ます。
$router->addServer(array(
    'REQUEST_METHOD' => 'PUT|PATCH',
));

// パラメーターのデフォルト値を追加します。setValues() も利用出来ます。
$router->addValues(array(
    'format' => null,
));

// 'secure' のデフォルト値を設定します。
$router->setSecure(true);

// 不確定なパラメーター名のデフォルト値を設定します。
$router->setWildcard('other');

// 'routable' フラグのデフォルト値を設定します。
$router->setRoutable(false);

// 'isMatch()'　コーラブルのデフォルトを設定します。
$router->setIsMatchCallable(function (...) { ... });

// 'generate()' コーラブルのデフォルトを設定します。
$router->setGenerateCallable(function (...) { ... });
{% endhighlight %}

## シンプルなルート

下記のようなシンプルなルートでは、特別なルート仕様を設定する必要はありません。

{% highlight php %}
$router->add('archive', '/archive/{year}/{month}/{day}');
{% endhighlight %}

... _Router_ はスラッシュ以外のパラメーターにマッチするデフォルトのサブパターンを使用します。よって、上記のシンプルなルートは下記の設定と同等です。:

{% highlight php %}
$router->add('archive', '/archive/{year}/{month}/{day}')
    ->addTokens(array(
        'year'  => '[^/]+',
        'month' => '[^/]+',
        'day'   => '[^/]+',
    ));
{% endhighlight %}

## オートマティックなパラメーター

_Router_　は、もし明示的に設定されていなければ、自動的に値を `action` ルートパラメーターに使用します。

{% highlight php %}
// 特に設定が行われていないので、自動的に ['action' => 'foo.bar'] へ設定されています。
$router->add('foo.bar', '/path/to/bar');

// 明示的に、設定されているので ['action' => 'zim'] となります。
$router->add('foo.dib', '/path/to/dib')
       ->addValues(array('action' => 'zim'));

// ここでの 'action' パラメーターは、パス上のパラメーターから設定されます。
$router->add('/path/to/{action}');
{% endhighlight %}

## オプション値

時に、ルートには名前のあるパラメーターが定義できると便利です。オプション値はあってもなくても、ルート定義にマッチします。

オプション値を設定するには、パスへ `{/param1,param2,param3}` のようなノーテーションを使用しましょう。例えば:

{% highlight php %}
$router->add('archive', '/archive{/year,month,day}')
    ->addTokens(array(
        'year'  => '\d{4}',
        'month' => '\d{2}',
        'day'   => '\d{2}'
    ));
{% endhighlight %}

> 先頭のスラッシュは外側でなく、トークンの内側に定義します。

それによって、以下のルートは全て 'archive' ルートと一致し、適切な値をセットします。:

    /archive
    /archive/1979
    /archive/1979/11
    /archive/1979/11/07

オプションのパラメーターは、*連続性のある* オプションになります。つまり、上記のサンプルでは、
"month" の値がなければ、"day" の値を持ちません。そして、"year" の値がなければ、"month" の値を持ちません。

パス毎に、1セットのオプション値が、_Router_ に認識されます。

オプションのパラメーターはルートパスの最後に属します。他の場所に置くことは予期しない動作が発生する可能性があります。

## 不確定（ワイルドカード）なパラメーター

場合によっては、パスの末尾の部分を何でも定義できるようにすると便利です。
ルートに、任意の末尾のパラメーターを許可するためには、 `setWildcard()` で末尾のパラメーターを保持するパラメーター名を指定します。

{% highlight php %}
$router->add('wild_post', '/post/{id}')
    ->setWildcard('other');
{% endhighlight %}

## ルートグループの設定

アプリケーションの "マウントポイント" へ、一連のルートを設定する事が出来ます。 例えば、アプリケーション内で
ブログ関連のルートを `/blog` へ組み込みたい場合は、以下のように出来ます。:

{% highlight php %}
$name_prefix = 'blog';
$path_prefix = '/blog';

$router->attach($name_prefix, $path_prefix, function ($router) {

    $router->add('browse', '{format}')
        ->addTokens(array(
            'format' => '(\.json|\.atom|\.html)?'
        ))
        ->addValues(array(
            'format' => '.html',
        ));

    $router->add('read', '/{id}{format}', array(
        ->addTokens(array(
            'id'     => '\d+',
            'format' => '(\.json|\.atom|\.html)?'
        )),
        ->addValues(array(
            'format' => '.html',
        ));

    $router->add('edit', '/{id}/edit{format}', array(
        ->addTokens(array(
            'id' => '\d+',
            'format' => '(\.json|\.atom|\.html)?'
        ))
        ->addValues(array(
            'format' => '.html',
        ));
});
{% endhighlight %}

それぞれのルート名には、'blog.' のプレフィックスが付きます、そしてルートパスには、 `/blog` のプレフィックスが付きます。よって有効になるルート名とルートパスは以下の通りです:

- `blog.browse  =>  /blog{format}`
- `blog.read    =>  /blog/{id}{format}`
- `blog.edit    =>  /blog/{id}/edit{format}`

その他のルート仕様も付加できるように設定する事ができます。これによって設定されたルートはデフォルトでルート仕様が設定されるため、共通設定を繰り返し定義する必要はありません。(このグループ外のルートには、影響されません。）

{% highlight php %}
$name_prefix = 'blog';
$path_prefix = '/blog';

$router->attach($name_prefix, $path_prefix, function ($router) {

    $router->setTokens(array(
        'id'     => '\d+',
        'format' => '(\.json|\.atom)?'
    ));

    $router->setValues(array(
        'format' => '.html',
    ));

    $router->add('browse', '');
    $router->add('read', '/{id}{format}');
    $router->add('edit', '/{id}/edit');
});
{% endhighlight %}

## RESTリソースルートの付加

ルーターは、一連のRESTリソースルートを `attachResource()` メソッドで付加する事が出来ます。:

{% highlight php %}
$router->attachResource('blog', '/blog');
{% endhighlight %}

下記のルートが追加されます。:

<table>
  <thead>
    <tr>
      <th>ルート名</th>
      <th>HTTP メソッド</th>
      <th>ルートパス</th>
      <th>目的</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>blog.browse</td>
      <td>GET</td>
      <td>/blog{format}</td>
      <td>複数リソースの閲覧</td>
    </tr>
    <tr>
      <td>blog.read</td>
      <td>GET</td>
      <td>/blog/{id}{format}</td>
      <td>リソースの読み込み</td>
    </tr>
    <tr>
      <td>blog.edit</td>
      <td>GET</td>
      <td>/blog/{id}{format}</td>
      <td>リソースを編集するためのフォーム</td>
    </tr>
    <tr>
      <td>blog.add</td>
      <td>GET</td>
      <td>/blog/add</td>
      <td>リソースを追加するためのフォーム</td>
    </tr>
    <tr>
      <td>blog.delete</td>
      <td>DELETE</td>
      <td>/blog/{id}</td>
      <td>リソースの削除</td>
    </tr>
    <tr>
      <td>blog.create</td>
      <td>POST</td>
      <td>/blog</td>
      <td>リソースの作成</td>
    </tr>
    <tr>
      <td>blog.update</td>
      <td>PATCH</td>
      <td>/blog/{id}</td>
      <td>リソースの一部を更新</td>
    </tr>
    <tr>
      <td>blog.replace</td>
      <td>PUT</td>
      <td>/blog/{id}</td>
      <td>リソース全体の置き換え</td>
    </tr>
  </tbody>
</table>

`{id}` トークンはすでにルータに定義されています。定義されていない場合は、それは一連の数字となります。
同様に、`{format}` トークンもすでにルータに定義されています。
定義されていない場合、それは（ドット自体を含む）、ファイル拡張子です。

`action` の値は、ルート名と同じものです。

`attachResource()` を使って、異なる一連のRESTルートを作成したい場合は、 `setResourceCallable()` メソッドを使って専用のコーラブルを設定し、作成しましょう。


{% highlight php %}
$router->setResourceCallable(function ($router) {
    $router->setTokens(array(
        'id' => '([a-f0-9]+)'
    ));
    $router->addPost('create', '/{id}');
    $router->addGet('read', '/{id}');
    $router->addPatch('update', '/{id}');
    $router->addDelete('delete', '/{id}');
});
{% endhighlight %}

この例では、 `attachResource()` が呼ばれると4つのCRUDルートが追加され、リソースIDには、16進数が使用されます。
