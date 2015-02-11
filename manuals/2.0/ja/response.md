---
layout: docs2-ja
title: レスポンス
permalink: /manuals/2.0/ja/response/
previous_page: リクエスト
previous_page_url: /manuals/2.0/ja/request/
next_page: ディペンデンシーインジェクション
next_page_url: /manuals/2.0/ja/di/
---

# レスポンス

_Response_ オブジェクトはクライアントにどのようなwebレスポンスを送るのかを表します。
HTTPレスポンスそのものでは**ありません**。
その代わりHTTPレスポンスを組み立ててるため必要なヒントがセットになっています。

_Response_オブジェクトに値をセットすればクライントに値が送られるわけでは**ありません**。
_Response_は出力されることなしに正しい値がセットされてるかを検査することができます。

_Response_オエブジェクトはDIで取得できます。

{% highlight php %}
<?php
$di->get('aura/web-kernel:response');

// あるいは他のクラスにインジェクトできるように
$di->lazyGet('aura/web-kernel:response');
{% endhighlight %}

_Response_オブジェクトはレスポンスの要素をプロパティで表します。

- `$response->status` はステータスコード、ステタースフレーズ、それにHTTPバージョンを表します。

- `$response->headers` クッキー以外のヘッダーです。

- `$response->cookies` クッキーのヘッダーです。

- `$response->content` はレスポンスのコンテンツを表します。content typeや、charset、disposition、filenameなどに便利です。

- `$response->cache`キャッシュヘッダーに便利なメソッドです。

- `$response->redirect` LocationとStatusに使われます。


## ステータス

`$response->status`オブジェクトは以下のように使われます。

{% highlight php %}
<?php
// ステータスコードとメッセージ、それにバージョンを一度にセット
$response->status->set('404', 'Not Found', '1.1');

// 個別にセット
$response->status->setCode('404');
$response->status->setPhrase('Not Found');
$response->status->setVersion('1.1');

// ステータスを（メッセージを含めて）取得
$status = $response->status->get(); // "HTTP/1.1 404 Not Found"

// 値を個別に取得
$code    = $response->status->getCode();
$phrase  = $response->status->getPhrase();
$version = $response->status->getVersion();
?>
{% endhighlight %}

## ヘッダー

`$response->headers`オブジェクトは以下のメソッドがあります。

- `set()`は以前にセットされていた１つの値をリセットし、ヘッダーをセットします。

- `get()` は１つのあるいは全てのヘッダーを取得します。

{% highlight php %}
<?php
// X-Header-Value: foo
$response->headers->set('X-Header-Value', 'foo');

// X-Header-Valueを取得
$value = $response->headers->get('X-Header-Value');

// 全てのヘッダーを取得
$all_headers = $response->headers->get();
?>
{% endhighlight %}

ヘッダーの値をnull、falseあるいは空の文字列をセットするとヘッダーから取り除かれます。0にセットするのでは**除かれません**。

## クッキー

`$response->cookies`オブジェクトは以下のメソッドを持ちます。

- `setExpire()`はクッキーのデフォルトの有効期限をセットします。

- `setPath()` はクッキーのデフォルトのパスをセットします。

- `setDomain()` はクッキーのデフォルトのドメインをセットします。

- `setSecure()` はクッキーのデフォルトのセキュリティーをセットします。

- `setHttpOnly()`はクッキーがHTTPによってのみ送られるかのデフォルトをセットします。

- `set()` クッッキーの名前と値をメタデータと共にセットします。これはPHPの関数[setcookie()](http://php.net/setcookie)を真似たものです。
もしメタデータの値で、path、domain、secure、それにhttponlyが指定されていないとデフォルトの値が使われます。

- `get()` 名前でクッキーを返すか、全てのクッキーを一度に返します。

{% highlight php %}
<?php
// 特定のドメインとパスが１０分で切れるようにセット
$response->cookies->setDomain('example.com');
$response->cookies->setPath('/');
$response->cookies->setExpire('+600');

// ２つのクッキーをセット
$response->cookies->set('foo', 'bar');
$response->cookies->set('baz', 'dib');

// レスポンスからクッキー情報の配列を取得
$foo_cookie = $response->cookies->get('foo');

// 名前をキーにしたクッキー情報配列を全て取得
$cookies = $response->cookies->get();
?>
{% endhighlight %}

クッキー情報配列はこのようなものです。

{% highlight php %}
<?php
$cookies['foo'] = array(
    'value' => 'bar',
    'expire' => '+600', // UNIXタイムスタンプにstrtotime()を足した値です。
    'path' => '/',
    'domain' => 'example.com',
    'secure' => false,
    'httponly' => true,
);
?>
{% endhighlight %}


## コンテンツ

`$response->content`オブジェクトはレスポンスコンテントとレスポンスヘッダーのための便利なメソッドを持っています。

- `set()` レスポンスのコテント本体をセットします。（配列やcallable、オブジェクト、あるいは文字列なんでも構いません。適切に変換されます）

- `get()`は`set()`でセットされたレスポンスのコンテンツ本体を取得します。

- `setType()`は`Content-Type`ヘッダーをセットします。

- `getType()`が`Content-Type`を取得します。（charsetは含まれません）

- `setCharset()`は`Content-Type`をのためのcharacter setをセットします。

- `getCharset()`は `Content-Type`ヘッダーの`charset`の部分を取得します。

- `setDisposition()`は`Content-Disposition`タイプとファイル名をセットします。

- `setEncoding()`は`Content-Encoding`ヘッダーをセットします。

{% highlight php %}
<?php
// set the response content, type, and charset
$response->content->set(array('foo' => 'bar', 'baz' => 'dib'));
$response->content->setType('application/json');

// elsewhere, before sending the response, modify the content based on type
switch ($response->content->getType()) {
    case 'application/json':
        $json = json_encode($response->content->get());
        $response->content->set($json);
        break;
    // ...
}
?>
{% endhighlight %}


## キャッシュ

`$response->cache`オブジェクトはHTTPキャッシュヘッダーのいくつかの便利なメソッドを持っています。

- `reset()` は全てのキャッシュ関連のヘッダーを取り除きます。

- `disable()` は全てのキャッシュ関連のヘッダーを取り除き、以下をセットします。

        Cache-Control: max-age=0, no-cache, no-store, must-revalidate, proxy-revalidate
        Expires: Mon, 01 Jan 0001 00:00:00 GMT
        Pragma: no-cache

- `setAge()` は秒を単位とする`Age`ヘッダーをセットします。

- `setControl()`は一度に`Cache-Control`ヘッダーの配列全てをセットするかわりに、個別の方法の設定をセットします。

    - `setPublic()`と`setPrivate()`は`public`と`private`のキャッシュコントロールをセットします。（片方の機能をオフにします）

    - `setMaxAge()`と`setSharedMaxAge()`は`max-age`と`s-maxage`を指定します。（nullかfalseを取り除くためにセットします）

    - `setNoCache()`と`setNoStore()`は`no-cache`と`no-store`キを指定します。（nullかfalseを取り除くためにセットします）

    - `setMustRevalidate()`と`setProxyRevalidate()`は`must-revalidate` と `proxy-revalidate`を指定します。 （nullかfalseを取り除くためにセットします）

- `setEtag()`と`setWeakEtag()`は`ETag`ヘッダーの値をセットします。

- `setExpires()``Expires`ヘッダーの値をセットします。日付や`DateTime`オブジェクトは適切にフォーマットされたHTTP日付に変換されます。

- `setLastModified()`は`Last-Modified`ヘッダーの値をセットします。日付や`DateTime`オブジェクトは適切にフォーマットされたHTTP日付に変換されます。

- `setVary()`は`Vary`ヘッダーをセットします。コンマで分けられた配列を渡します。

キャッシュヘッダーについてさらにお知りになりたいときは[Palizine]の[HTTP 1.1 headers spec][]の記述をご覧ください。

  [HTTP 1.1 headers spec]: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html
  [Palizine]: http://palizine.plynt.com/issues/2008Jul/cache-control-attributes/


## リダイレクト

`$response->redirect`オブジェクトはリダイレクトのためのLocationヘッダーのいくつかの便利なメソッドを持っています。

  - `to($location, $code = 302, phrase = null)`はリダイレクトのためのステータスと任意のヘッダー、メッセージをセットします。

- `afterPost($location)`は`$location`に`303 See
Other`ステータスでリダイレクトします。これは自動的にHTTPキャッシュを無効にします。

- `created($location)`は`201 Created`で`$location`にリダイレクトします。

- `movedPermanently($location)`は`301 Moved Permanently`で`$location`にリダイレクトします。

- `found($location)`は`302 Found`で`$location`にリダイレクトします。

- `seeOther($location)`は`303 See Other`で`$location`にリダイレクトします。これは自動的にHTTPキャッシュを無効にします。

- `temporaryRedirect($location)`は`307 Temporary Redirect`で`$location`にリダイレクトします。

- `permanentRedirect($location)`は`308 Permanent Redirect`で`$location`にリダイレクトします。
