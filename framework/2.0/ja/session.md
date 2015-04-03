---
layout: docs2-ja
title: セッション
permalink: /framework/2.0/ja/session/
previous_page: 国際化
previous_page_url: /framework/2.0/ja/intl/
next_page: コマンドライン / CLI / コンソール
next_page_url: /framework/2.0/ja/cli/
---

# セッション

セッション管理のための機能セットを提供します。具体的には、レイジーセッションスタート、セッションセグメント、次のリクエストまでしか有効ではない「フラッシュ」値、およびCSRF対策のツールです。

## インストール

`aura/session` バージョン `2.0.*@beta` をインストールします。

`composer.json` に下記を追加します。

{% highlight json %}
{
    "require": {
        //
        "aura/session": "2.0.*@beta"
    }
}
{% endhighlight %}

インストールを実行します。

{% highlight bash %}
composer update
{% endhighlight %}

## サービス

Aura.Session には、_Aura\\Session\\Session_ のオブジェクトである `aura/session:session` サービスが最初から用意されています。
このサービスをレスポンダーやビューヘルパーに注入することで、_Aura\\Session\\Session_ オブジェクトを使うことができます。

## セグメント

PHP標準の機能で、セッションの値は `$_SESSION` 配列によって維持されます。
しかし、さまざまなライブラリやプロジェクトが同じキー群に対して書き換えを行おうとした場合に、衝突が発生し、予期しない振る舞いを引き起こすことになってしまうでしょう。
この問題を解決するために、 _Segment_ （セグメント）オブジェクトを使います。
各 _Segment_ は、名前を付けたキーを使って `$_SESSION` 配列内部にアクセスします。これにより衝突が回避されます。
たとえば、`Vendor\Package\ClassName` で _Segment_ を使うのであれば、 `$_SESSION['Vendor\Package\ClassName']` への参照が使われることになります。
_Segment_ で `set()` したり `get()` したりすると、この参照への操作によってセッション配列の値が維持されます。


{% highlight php %}
<?php
// Segment オブジェクトを取得
$segment = $session->getSegment('Vendor\Package\ClassName');

// セグメントから値を取得する
// （存在しない場合は、代わりの値を取得することもできる）
echo $segment->get('foo'); // null
echo $segment->get('baz', 'not set'); // 'not set'

// セグメントに値を設定する
$segment->set('foo', 'bar');
$segment->set('baz', 'dib');

// $_SESSION 配列は今こうなっている
// $_SESSION = array(
//      'Vendor\Package\ClassName' => array(
//          'foo' => 'bar',
//          'baz' => 'dib',
//      ),
// );

// セグメントから値を再度取得する
echo $segment->get('foo'); // 'bar'

// セグメントは $_SESSION の参照なので、
// スーパーグローバル変数で直接変更すると、セグメントの値にも同じ変更が行われている
$_SESSION['Vendor\Package\ClassName']['zim'] = 'gir'
echo $segment->get('zim'); // 'gir'
?>
{% endhighlight %}

セッションセグメントの利点は、スーパーグローバル変数 `$_SESSION` でキー名の衝突が避けられることです。キーにはクラス名（もしくは何らかのユニークな名前）をセグメント名として使います。
セグメントを使えば、さまざまなパッケージがスーパーグローバル変数 `$_SESSION` を扱っていても、お互いが干渉し合ってしまうようなことはありません。

_Segment_ の値をすべて削除するには、`clear()` メソッドを使います。

## レイジーセッションスタート

`session_start()` をまだ *呼び出さずに*、単に _Session_ マネージャのインスタンス作成や、 _Segment_ の取得だけを行うことができます。
`session_start()` は、下記のような特定の状況下においてだけ実行されるのです。

- _Segment_ の読み込み時（例：`get()`）、 _Session_ はセッションCookieがすでに設定されているかどうかを判定します。設定済みであった場合は、`session_start()` を前回開始したセッションを再開することで呼び出します。
セッションCookieがまだ設定されていない場合は、`$_SESSION` 変数の値がまだ無いということなので、 `session_start()` の呼び出しを行いません。

- _Segment_ の書き込み時（例：`set()`）、_Session_ は必ず `session_start()` を呼び出します。
前回セッションが存在している場合には再開し、存在していなかった場合には新しいセッションを開始します。

つまり、各 _Segment_ を任意のタイミングで作成して良いというわけです。
_Segment_ で決まった手順で実際にやり取りが発生するまでの間は、`session_start()` が呼ばれることはないのです。セッション開始に関わるリソースを効率良く使っていると言えます。

もちろん、セッションの開始を強制的に行うこともできますし、_Session_ `start()` メソッドを呼ぶことでセッションを再開させることもできます。
しかし、そのやり方だと、セッションレイジーロード方式のもともとの目的を達成することはできません。

## セッションの保存、クリア、破棄

> 以下のメソッドは、セグメントを使った全てのセッションデータ、およびフラッシュに対して使います

セッションデータを保存して、以降は現在のリクエストで使わないようにするには、_Session_ マネージャで `commit()` メソッドを呼び出します。

{% highlight php %}
<?php
$session->commit(); // session_write_close() にあたる
?>
{% endhighlight %}

> `commit()` メソッドは `session_write_close()` に相当します。
> セッションのコミットをしないと、後からセッションを続ける際にセッションの値が利用できません。


現在のリクエストでセッションを張ったまま、全セッションデータをクリアするには、_Session_ マネージャで `clear()` メソッドを使います。

{% highlight php %}
<?php
$session->clear();
?>
{% endhighlight %}

すべてのフラッシュ値をクリアするには、`clearFlash()` メソッドを使います。

データをクリアして、かつ以降のリクエストでセッションを終了させるには、つまり、完全に破棄するには、 `destroy()` メソッドを呼び出します。

{% highlight php %}
<?php
$session->destroy(); // session_destroy() に当たる
?>
{% endhighlight %}

`destroy()` を呼ぶと、`setcookie()` を通じてセッションCookieも併せて削除されます。
Cookie 削除をほかのやり方で行うには、_SessionFactory_ のメソッド `newInstance()` の第2引数に callable を渡します。
callable は３つのパラメータを取ります。Cookieの名前、パスと、ドメインです。

{% highlight php %}
<?php
// $response はフレームワークのレスポンスオブジェクト。
// セッションCookieの削除で使う。
$delete_cookie = function ($name, $path, $domain) use ($response) {
    $response->cookies->delete($name, $path, $domain);
}

$session = $session_factory->newInstance($_COOKIE, $delete_cookie);
?>
{% endhighlight %}

## セッションのセキュリティ

### セッションIDの再生成

ユーザの権限を変更した時、たとえば、システムへのアクセス権限を付与したり剥奪したりした場合には、必ずセッションIDを再生成しなければなりません。

{% highlight php %}
<?php
$session->regenerateId();
?>
{% endhighlight %}

> `regenerateId()` メソッドは、CSRF トークン値の再生成も兼ねます。

### クロスサイトリクエストフォージェリ（CSRF）

「クロスサイトリクエストフォージェリ」は、悪意あるJavaScript等を使ったセキュリティ上の攻撃手法です。
認証済みとなっているユーザのサーバ宛てに、クライアントブラウザが裏でリクエストを送信させられます。
リクエストは妥当であるかのよう *見える* ものの、そうではなくて、強要されたものです。
ユーザは実際にはリクエストを行っておらず、悪意あるJavaScriptが行っているのです。

<http://ja.wikipedia.org/wiki/%E3%82%AF%E3%83%AD%E3%82%B9%E3%82%B5%E3%82%A4%E3%83%88%E3%83%AA%E3%82%AF%E3%82%A8%E3%82%B9%E3%83%88%E3%83%95%E3%82%A9%E3%83%BC%E3%82%B8%E3%82%A7%E3%83%AA>

#### CSRF対策

CSRF攻撃を防ぐには、サーバサイドのロジックを下記のようにする必要があります。

1. ユニークなトークン値を認証済みユーザのセッションに対して発行し、フォームに埋め込む。

2. すべてのPOST/PUT/DELETE（すなわち、危険な）リクエストについて、トークン値が含まれていることを確認する。

> アプリケーションが GET リクエストをリソースの変更に使う場合は（そもそも不適切なGETの使い方ではありますが）、
> 認証済みユーザによる GET リクエストについてもCSRFの検証をするべきです。

下記の例では、フォームフィールド名が `__csrf_value` となります。
CSRF攻撃から防御したいすべてのフォームにおいて、セッションのCSRFトークン値をフォームのフィールドに埋め込みます。

{% highlight php %}
<?php
/**
 * @var Vendor\Package\User $user ユーザ認証オブジェクト
 * @var Aura\Session\Session $session セッション管理オブジェクト
 */
?>
<form method="post">

    <?php if ($user->auth->isValid()) {
        $csrf_value = $session->getCsrfToken()->getValue();
        echo '<input type="hidden" name="__csrf_value" value="'
           . htmlspecialchars($csrf_value, ENT_QUOTES, 'UTF-8')
           . '"></input>';
    } ?>

    <!-- その他のフォームフィールド -->

</form>
{% endhighlight %}

リクエストを処理する時に、入力されてきたCSRFトークンが妥当であるかどうかを認証済みユーザについて検証します。

{% highlight php %}
<?php
/**
 * @var Vendor\Package\User $user ユーザ認証オブジェクト
 * @var Aura\Session\Session $session セッション管理オブジェクト
 */

$unsafe = $_SERVER['REQUEST_METHOD'] == 'POST'
       || $_SERVER['REQUEST_METHOD'] == 'PUT'
       || $_SERVER['REQUEST_METHOD'] == 'DELETE';

if ($unsafe && $user->auth->isValid()) {
    $csrf_value = $_POST['__csrf_value'];
    $csrf_token = $session->getCsrfToken();
    if (! $csrf_token->isValid($csrf_value)) {
        echo "このリクエストはクロスサイトリクエストフォージェリのようです。";
    } else {
        echo "正当なリクエストのようです。";
    }
} else {
    echo "CSRF攻撃は認証済みユーザによる危険なリクエストに対してのみ行われます。";
}
?>
{% endhighlight %}

#### CSRF 値の生成

CSRFトークンを利用するには、ランダムで暗号学的にセキュアな値を得る必要があります。
`mt_rand()` のような仕組みを使うのでは不適切です。
Aura.Session には、 `RandvalInterface` の実装である `Randval` クラスが付属していて、
`openssl` か `mcrypt` 拡張のどちらかをランダム値の生成に使います。
もしこれらの拡張をインストールしていないのであれば、`RandvalInterface` を実装して自前でランダム値を組む必要があるでしょう。
私たちは[RandomLib](https://github.com/ircmaxell/RandomLib)のラッパを作ることを推奨します。

## フラッシュ値

_Segment_ 値はセッションがクリアまたは破棄されるまでの間は保存されています。
しかし、値の設定が次回リクエストまでの間だけ伝わって、それ以降は破棄される方が都合が良いケースもあります。
これは「フラッシュ」値と呼ばれます。


### フラッシュ値の設定と取得

_Segment_ にフラッシュ値を設定するには、 `setFlash()` メソッドを使います。

{% highlight php %}
<?php
$segment = $session->getSegment('Vendor\Package\ClassName');
$segment->setFlash('message', 'Hello world!');
?>
{% endhighlight %}

そして、次のリクエストでは、 `getFlash()` を使ってフラッシュ値を読み込みます。

{% highlight php %}
<?php
$segment = $session->getSegment('Vendor\Package\ClassName');
$message = $segment->getFlash('message'); // 'Hello world!'
?>√
{% endhighlight %}

> `get()` では、フラッシュキーが存在しなかった場合、代わりの値を取得することができます。
> たとえば、 `getFlash('foo', 'not set')` は、もし 'foo' キーが利用可能でなければ
> 'not set' を返します。

`setFlash()` を使うと、現在のリクエストではなく *次の* リクエストでだけ、フラッシュ値が利用可能となります。
次回リクエストだけでなく今すぐフラッシュ値を作成したいのであれば、 `setFlashNow($key, $val)` を使います。

`getFlash()` を使うと、前回リクエストで設定された現在利用可能な値だけが返されます。
値を次のリクエストで利用できるように読み込むには、 `getFlashNext($key, $alt)` を使います。


### フラッシュ値の維持とクリア

フラッシュ値を現在のリクエストから次のリクエストへ維持させたいこともあるでしょう。
セグメント単位で維持するには、 _Segment_ の `keepFlash()` メソッドを呼び出します。
すべてのセグメントの全フラッシュ値を維持するには、 _Session_ の `keepFlash()` メソッドを呼び出します。


同様に、フラッシュ値をセグメント単位、またはセッション全体でクリアすることができます。
`clearFlash()` メソッドは、 _Segment_ ではセグメントに対してだけクリアを行い、同じメソッド名で _Session_ ではすべてのセグメントの全フラッシュ値をクリアします。
