---
layout: docs-ja
title: セッション
permalink: /framework/1.x/ja/session/
---

# セッション #

Aura フレームワークでは、Aura.Session を使うことができます。
セッションセグメント、1回限りの（フラッシュ）値読み込み、CSRFツール、遅延セッションスタートを含む
セッション管理機能が用意されています。

## コントローラ内 ##

コントローラは、`Aura\Session\Manager`オブジェクトを持ちません。
`setSessionManager`メソッドをコントローラに追加して、セッターインジェクションを使います。

{% highlight php %}
<?php
namespace Example\Package\Web;

use Aura\Framework\Web\Controller\AbstractPage;
use Aura\Session\Manager as SessionManager;

abstract class PageController extends AbstractPage
{
    protected $session_manager;

    public function setSessionManager(SessionManager $session_manager)
    {
        $this->session_manager = $session_manager;
    }

    public function getSessionManager()
    {
        return $this->session_manager;
    }

    // .. 他のメソッド
}
{% endhighlight %}

### 設定 ###

{% highlight php %}
// セッションマネージャ
$di->setter['Example\Package\Web\PageController']['setSessionManager'] = $di->lazyGet('session_manager');
{% endhighlight %}

上記で、`Aura\Session\Manager`のオブジェクトをコントローラ内で取得できます。

{% highlight php %}
$session = $this->getSessionManager();
{% endhighlight %}

このようにして使います。

## ビュー内 ##

セッションマネージャを取得するには、ビューヘルパーを追加して、`Aura\Session\Manager` オブジェクトを注入します。

{% highlight php %}
<?php
namespace Example\Package\View\Helper;

use Aura\View\Helper\AbstractHelper;
use Aura\Session\Manager;

class SessionManager extends AbstractHelper
{
    protected $session_manager;

    public function __construct(Manager $session_manager)
    {
        $this->session_manager = $session_manager;
    }

    public function __invoke()
    {
        return $this->session_manager;
    }
}
{% endhighlight %}

### 設定 ###

{% highlight php %}
$di->params['Example\Package\View\Helper\SessionManager']['session_manager'] = $di->lazyGet('session_manager');

$di->params['Aura\View\HelperLocator']['registry']['sessionManager'] = function () use ($di) {
    return $di->newInstance('Example\Package\View\Helper\SessionManager');
};
{% endhighlight %}

このように一度設定すると、`Aura\Session\Manger` オブジェクトをビュー内で次のように取得できます。

{% highlight php %}
    $this->sessionManger();
{% endhighlight %}

## セグメント ##

セッションセグメントとは、スーパーグローバル変数 `$_SESSION` における配列キーに対する参照です。
例えば、`ClassName` と命名したセグメントを使う場合、`$_SESSION['ClassName']` への参照になります。
`ClassName` セグメントでは、キーの配下にすべての値が配列で格納されます。

{% highlight php %}
<?php
// セッションセグメントを取得。まだ無い場合はセッションが開始される。
// $_SESSION のキーがまだ無い場合は作成される。
$segment = $session->newSegment('Vendor\Package\ClassName');

// セグメントに値を設定
$segment->foo = 'bar';
$segment->baz = 'dib';

// 今、スーパーグローバル $_SESSION は次のようになっている：
// $_SESSION = [
//      'Vendor\Package\ClassName' => [
//          'foo' => 'bar',
//          'baz' => 'dib',
//      ],
// ];

// セグメントから値を取得
echo $segment->foo; // 'bar'

// セグメントは $_SESSION の参照なので、
// スーパーグローバルを直接変更できるし、セグメント値も変更される
$_SESSION['Vendor\Package\ClassName']['zim'] = 'gir'
echo $segment->zim; // 'gir'
{% endhighlight %}

セッションセグメントの利点は、クラス名（または何らかのユニークな名前）をセグメント名として使うことにより、
スーパーグローバル `$_SESSION` でキーを衝突させないことができることです。
別のパッケージとも、お互いに干渉することなくスーパーグローバル `$_SESSION` を使うことができます。

## レイジーセッションスタート ##

単に `Manager` をインスタン化してセッションセグメントを取得するだけの場合、
セッションが自動的に開始されるわけではありません。
セッションセグメントに対して読み込み、書き込みをしたときに、はじめてセッションが開始されます。
セグメントを随時追加しても、読み込みまたは書き込みをするまでの間はセッションは開始されないということです。

セッションセグメントから読み込みすると、すでに利用可能なセッションが存在しているかチェックされて、
すでにあれば再利用されます。読み込みで新たなセッションが開始されることはありません。

セグメントに書き込みすると、前のセッションがあるかチェックされて、あれば再利用されます。
セッションがまだ存在しない場合は、新たなセッションが開始されて、書き込みが実行されます。

もちろん、セッションの開始、または再開を `Manager`の `start()` メソッド呼び出しで
強制させることもできるのですが、それだとレイジーロードのセッションをすることはできません。

## セッションのセキュリティ ##

セッションでデータを後から利用できるようにするには、`commit()` メソッドの呼び出しをして下さい。

{% highlight php %}
<?php
$session->commit();
{% endhighlight %}

Auraフレームワークはもともと `post_exec` シグナルの最後に `commit()` メソッドを持っています。

> 注: `commit()` メソッドは `session_write_close()` と等価です。
> セッションをコミットしないと、後からセッションを続けるときに値を利用することはできません。

ユーザの（システム内で付与されたり剥奪されたりする）権限を変更したら、必ずセッションIDを再生成します。

{% highlight php %}
<?php
$session->regenerateId();
{% endhighlight %}

> 注: `regenerateId()` メソッドはCSRFトークンの値も再生成します。

セッションを継続したままでメモリのセッションデータをクリアするには、`clear()` メソッドを使います。

{% highlight php %}
<?php
$session->clear();
{% endhighlight %}

セッションを終了して、コミットされた、もしくはメモリ上にあるデータを削除する場合は（よくあるのは、
ユーザがサインアウトした後や、認証のタイムアウトが発生したケースです）、`destroy()` メソッドを呼び出してください。

{% highlight php %}
<?php
$session->destroy();
{% endhighlight %}

## 1回限りの(フラッシュ)値読み込み ##

セッションセグメント値は、セッションがクリアまたは破壊されるまではずっと維持されます。
しかし、値が、使いたい時だけあって、自動的に自身をクリアしてくれる方が便利です。
フラッシュ（1回限りの）値です。

セグメントで1回限りの値を設定するには、`setFlash()` メソッドを使います。

{% highlight php %}
<?php
// セグメントを取得
$segment = $session->newSegment('Vendor\Package\ClassName');

// 1回限りの値をセグメントに設定
$segment->setFlash('message', 'Hello world!');
{% endhighlight %}

これで、セッションの後で `getFlash()` を使うことでフラッシュ値を読み込むことができます。

{% highlight php %}
<?php
// セグメントを取得
$segment = $session->newSegment('Vendor\Package\ClassName');

// 1回限りの値を取得
$message = $segment->getFlash('message'); // 'Hello world!'

// 再度読み込もうとすると、なくなっている
$not_there = $segment->getFlash('message'); // null
{% endhighlight %}

フラッシュ値が存在するかどうかを知りたい時もあります。まだ読み込みをしたいわけではありません
（読み込むと、セッションから値が削除されてしまいます）。
このようなケースでは、`hasFlash()` メソッドを使います。

{% highlight php %}
<?php
// セグメントを取得
$segment = $session->newSegment('Vendor\Package\ClassName');

// 1回限りの 'message' は利用可能か?
// このとき、読み込みによる削除は起こらない。
if ($segment->hasFlash('message')) {
    echo "Yes, there is a message available.";
} else {
    echo "No message available.";
}
{% endhighlight %}

すべてのフラッシュ値をクリアするためには、`clearFlash()` メソッドを使います。

{% highlight php %}
<?php
// セグメント取得
$segment = $session->newSegment('Vendor\Package\ClassName');

// すべてのフラッシュ値をクリアする。しかし、この場にある他のセグメント値はすべて維持される。
$segment->clearFlash();
{% endhighlight %}

## クロスサイトリクエストフォージェリ ##

「クロスサイトリクエストフォージェリ」は、攻撃者がJavaScriptやその他の手法で悪用するセキュリティ上の問題です。
クライアントブラウザでユーザがログインしているサーバに対して、気づかれないようにリクエストを発行します。
リクエストは見かけ上サーバには妥当であるように見えるのですが、実は偽物です。
ユーザは実際にはリクエストをしていません（罠のJavaScriptがしています）。

<http://ja.wikipedia.org/wiki/%E3%82%AF%E3%83%AD%E3%82%B9%E3%82%B5%E3%82%A4%E3%83%88%E3%83%AA%E3%82%AF%E3%82%A8%E3%82%B9%E3%83%88%E3%83%95%E3%82%A9%E3%83%BC%E3%82%B8%E3%82%A7%E3%83%AA>

## CSRF対策 ##

CSRF攻撃に対策するには、サーバサイドで次のような処理をするべきです。

1. 各フォームにおいて、ユーザセッションで認証をする毎に、トークン値を埋め込みます。

2. すべての入力POST/PUT/DELETE（安全ではない）リクエストがトークン値を持つことをチェックします

> 注: アプリケーションがリソースの変更でGETリクエストを使う場合（これはGETの不適切な使い方なのですけれど）、
>ログインユーザからのGETリクエストにもCSRFチェックをすべきです。

次の例では、フォームのフィールド名が `'__csrf_value''` となります。
CSRFから保護したいフォーム毎に、このフィールドでセッションCSRFトークン値を使います。

{% highlight php %}
<?php
/**
 * @var Vendor\Package\User $user ログインユーザオブジェクト
 * @var Aura\Session\Manager $session セッション管理オブジェクト
 */
?>
<form method="post">

    <?php if ($user->isAuthenticated()) {
        $csrf_value = $session->getCsrfToken()->getValue();
        echo '<input type="hidden" name="__csrf_value" value="'
           . $csrf_value
           . '"></input>';
    } ?>

    <!-- other form fields -->

</form>
{% endhighlight %}

リクエストを処理するとき、送られてきたCSRFトークンがログインユーザのものと一致しているか確認します。

{% highlight php %}
<?php
/**
 * @var Vendor\Package\User $user ログインユーザオブジェクト
 * @var Aura\Session\Manager $session セッション管理オブジェクト
 */

$unsafe = $_SERVER['REQUEST_METHOD'] == 'POST'
       || $_SERVER['REQUEST_METHOD'] == 'PUT'
       || $_SERVER['REQUEST_METHOD'] == 'DELETE';

if ($unsafe && $user->isAuthenticated()) {
    $csrf_value = $_POST['__csrf_value'];
    $csrf_token = $session->getCsrfToken();
    if (! $csrf_token->isValid($csrf_value)) {
        echo "クロスサイトリクエストフォージェリでしょう。";
    } else {
        echo "正当なリクエストでしょう。";
    }
} else {
    echo "CSRF攻撃は、ログインユーザからの安全ではないリクエストの場合のみ発生します。";
}
{% endhighlight %}

## CSRF値生成 ##

CSRFトークンを利用する際は、暗号的にセキュアでランダムな値でなければなりません。`mt_rand()` を使うようなやり方では不十分です。
Auraセッションには `RandvalInterface` を実装した `Randval` クラスがあります。
ランタム値の生成には、`openssl` か `mcrypt` 拡張を使うことができます。
これらの拡張がインストールされていない場合は、`RandvalInterface` を実装して自作でランダム値を得る必要があります。
[RandomLib](https://github.com/ircmaxell/RandomLib) のラッパを作るのが良いように思います。
