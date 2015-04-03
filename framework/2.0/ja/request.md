---
layout: docs2-ja
title: リクエスト
permalink: /framework/2.0/ja/request/
previous_page: ディスパッチ
previous_page_url: /framework/2.0/ja/dispatcher/
next_page: レスポンス
next_page_url: /framework/2.0/ja/response/
---

# リクエスト

_リクエスト_ オブジェクトは現在実行しているPHPのためのWebコンテキストを表現します。
このオブジェクトはHTTPリクエストそのものを表しているのではないことに注意してください。
というのも、`$_ENV` や HTTPとは関係ない`$_SERVER` の要素を含むからです。

_リクエスト_ オブジェクトはDIを利用して取得することができます。

{% highlight php %}
<?php
$request = $di->get('aura/web-kernel:request');

// もしくは下記のように別のクラスにインジェクトすることもできます。
$di->lazyGet('aura/web-kernel:request');
{% endhighlight %}

_リクエスト_ オブジェクトはいくつかのプロパティオブジェクトを持ちます。
そのうちのいくつかは、PHPのスーパーグローバル変数をコピーしたものです ...

- `$request->cookies` for `$_COOKIES`
- `$request->env` for `$_ENV`
- `$request->files` for `$_FILES`
- `$request->post` for `$_POST`
- `$request->query` for `$_GET`
- `$request->server` for `$_SERVER`

... その他のプロパティオブジェクトは、リクエストに特有の情報を表します。

- `$request->client` for the client making the request
- `$request->content` for the raw body of the request
- `$request->headers` for the request headers
- `$request->method` for the request method
- `$request->accept` for content negotiation
- `$request->params` for path-info parameters
- `$request->url` for the request URL

_リクエスト_ オブジェクトはただ一つ `isXhr()` メソッドを持ちます。
これはリクエストが _XmlHttpRequest_ であるかどうかを知るために使用します。

## スーパーグローバル変数

スーパーグローバル変数を表す各オブジェクトは単一のメソッド `get()` を持ち、
スーパーグローバル変数のキーに該当する値を返します。もし該当するキーがなければ、
代替の値を返します。これらの値はリードオンリーです。

{% highlight php %}
<?php

// $_POST['field_name'] の値を返します。もし$_POSTに 'field_name' というキーがなければ
// 'not set' を返します。
$field_name = $request->post->get('field_name', 'not set');

// 引数にキーが与えられなければスーパーグローバル変数内のすべての値の配列を返します。
$all_server_values = $request->server->get();

// $_FILES配列は$_POSTと同じ構造に再構成されます。
$file = $request->files->get('file_field', array());
?>
{% endhighlight %}

## Client

`$request->client` オブジェクトは下記メソッドを持ちます:

- `getForwardedFor()` `X-Forwarded-For` ヘッダの値を配列で返します。

- `getReferer()` `Referer` ヘッダの値を配列で返します。

- `getIp()` `$_SEVER['REMOTE_ADDR']` の値を返します。もしくは適切な `X-Forwarded-For` の値を返します。

- `getUserAgent()` `User-Agent` ヘッダの値を返します。

- `isCrawler()` `User-Agent` ヘッダの値が bot/crawler/robot のユーザエージェントリストの
  一つにマッチすればtrueを返します(マッチしなければfalse)。

- `isMobile()` `User-Agent` ヘッダの値がモバイルのユーザエージェントリストの
  一つにマッチすればtrueを返します(マッチしなければfalse)。

## Content

`$request->content` オブジェクトは下記メソッドを持ちます:

- `getType()` リクエストボディのcontent-typeを返します。

- `getRaw()` 生のリクエストボディを返します。

- `get()` content-typeに基づいてデコードされた後のリクエストボディを返します。

_Content_ オブジェクトは2つのビルトインのデコーダを持っています。
もしリクエストのcontent-typeが `application/json` だった場合、
`get()` メソッドは自動的にリクエストボディを `json_decode()` でデコードします。
同じように、もしcontent-typeが `application/x-www-form-urlencoded` だった場合、
`get()` メソッドは自動的にリクエストボディを `parse_str()` でデコードします。

## Headers

`$request->headers` オブジェクトは単一のメソッド `get()` を持ち、
特定ヘッダの値を返します。もし該当するキーがなければ、代替の値を返します。
これらの値はリードオンリーです。

{% highlight php %}
<?php

// 'X-Header' が存在すればその値を、存在しなければ 'not set' を返します。
$header_value = $request->headers->get('X-Header', 'not set');
?>
{% endhighlight %}

## Method

`$request->method` オブジェクトは下記メソッドを持ちます:

- `get()`: リクエストメソッドの値を返します。
- `isDelete()`: リクエストはDELETEメソッドを使用したか?
- `isGet()`: リクエストはGETメソッドを使用したか?
- `isHead()`: リクエストはHEADメソッドを使用したか?
- `isOptions()`: リクエストはOPTIONSメソッドを使用したか?
- `isPatch()`: リクエストはPATCHメソッドを使用したか?
- `isPut()`: リクエストはPUTメソッドを使用したか?
- `isPost()`: リクエストはPOSTメソッドを使用したか?

{% highlight php %}
<?php
if ($request->method->isPost()) {
    // perform POST actions
}
?>
{% endhighlight %}

_Method_ オブジェクトで `is*()` メソッドをコールすることもできます。`is` の後の文字列は、
カスタムのHTTPメソッド名として扱われ、リクエストがそのHTTPメソッドを利用して生成されたか
どうかをチェックします。

{% highlight php %}
<?php
if ($request->method->isCustom()) {
    // perform CUSTOM actions
}
?>
{% endhighlight %}

フォームにカスタムHTTPメソッドを示す特別なフィールドを用意して、POSTでリクエストを行う
場合もあるでしょう。デフォルトでは _Method_ オブジェクトは `_method` フォームフィールド
をその用途に使用できます。

{% highlight php %}
<?php
// '_method' フィールドを使用したPOSTリクエストでは、POSTの代わりに_methodの値がメソッドとなります。
$_SERVER['REQUEST_METHOD'] = 'POST';
$_POST['_method'] = 'PUT';
echo $request->method->get(); // PUT
?>
{% endhighlight %}

## Params

他のほとんどの _Request_ プロパティオブジェクトと異なり、_Params_ オブジェクトは読み書き可能です(リードオンリーではない)。
_Params_ オブジェクトにはアプリケーションに特有のパラメータを設定することができます。これらのパラメータは典型的には
何らかのルータ(例えば [Aura.Router][])がURLのパスをパーズすることで検出されます。

  [Aura.Router]: https://github.com/auraphp/Aura.Router

`$request->params` オブジェクトは2つのメソッドを持ちます:

- `set()` パラメータの配列をセットします。
- `get()` 特定のパラメータの値もしくはすべてのパラメータの配列を取得します。

例えば:

{% highlight php %}
<?php

// ルーティングのメカニズムで検出されたパラメータの値。
$values = array(
    'controller' => 'blog',
    'action' => 'read',
    'id' => '88',
);

// リクエストにパラメータをセットします。
$request->params->set($values);

// 'id' パラメータの値を取得します。もし存在しなければfalseが返ります。
$id = $request->params->get('id', false);

// すべてのパラメータを配列で取得します。
$all_params = $request->params->get();
?>
{% endhighlight %}

## Url

`$request->url` オブジェクトは2つのメソッドを持ちます:

- `get()` 完全なURL文字列を返します。もし引数にコンポーネント定数が渡された場合、
  該当する部分のURL文字列のみを返します。

- `isSecure()` SSL, TLS もしくはセキュアなプロトコルから転送されされたかどうかを判断し、リクエストが安全かどうかを返します。

{% highlight php %}
<?php

// 完全なURL文字列を取得します。
$string = $request->url->get();

// 特定部分のURLを取得します。コンポーネント定数については下記URLを確認してください。
// http://php.net/parse-url
$scheme   = $request->url->get(PHP_URL_SCHEME);
$host     = $request->url->get(PHP_URL_HOST);
$port     = $request->url->get(PHP_URL_PORT);
$user     = $request->url->get(PHP_URL_USER);
$pass     = $request->url->get(PHP_URL_PASS);
$path     = $request->url->get(PHP_URL_PATH);
$query    = $request->url->get(PHP_URL_QUERY);
$fragment = $request->url->get(PHP_URL_FRAGMENT);
?>
{% endhighlight %}
