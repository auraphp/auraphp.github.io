---
layout: docs-ja
title: The aura framework Controller
permalink: /manuals/v1/ja/controller/
---

# Controller #
 Aura Framework controller はアクションメソッドドのための`AbstractPage`やリクエストを扱う`Context`、HTTPレスポンスを転送する`Response`転送オブジェクトを含んだwebページコントローラーを作成するために必要なAura Web の拡張版です。（`Response`転送オブジェクトはHTTPレスポンスそのものでは無い事に注意してください)
これにはコントローラにフック処理をするための`Signal`インターフェイスや複数のレンダリング方法を提供する`Renderer`インタフェースも含まれます。

## Creating your controller ##
 `Aura\Framework\Web\Controller\AbstractPage` を拡張して独自のコントローラーを作成します。

{% highlight php %}
<?php
namespace Vendor\Package\Web;

use Aura\Web\Controller\AbstractPage;

class Page extends AbstractPage
{
    
}
{% endhighlight %}
    
## The Execution Cycle ##

ページコントローラーには実行サイクルがあります。

`exec()`サイクルが実行されると ...

- まず `preExec()` フックが全体の実行のために準備されます。

- 次に `preAction()` フックがアクションのために準備されます。

- `action()` `'action'`パラメータの値で決定されたメソッドが実行されます。

- 続いて`postAction()` がフックされ、

- `preRender()` フックがレンダリングのために準備されます。

- `render()` メソッドでプレゼンテーションがレンダリングされます（ディベロッパーが作成することもできます）

- 続いて`postRender()` がフックされ、

- `postExec()` は全体の実行の終わりにフックされます。

## Action Methods ##

この時点で `exec()`が呼ばれても何も起こりません。一致するアクションメソッドが無いからです。
ページコントローラーにアクションメソッドを追加するには必要な引数を追加した`action*()`メソッドを作成します。

{% highlight php %}
<?php
namespace Example\Package\Web\;

use Aura\Web\Controller\AbstractPage;

class Page extends AbstractPage
{
    public function actionHello($noun = null)
    {
        $noun = htmlspecialchars($noun, ENT_QUOTES, 'UTF-8');
        $content = "Hello, {$noun}!";
        $this->data->content = $content;
    }
} 
{% endhighlight %}

## The Response Transfer Object ##

  レスポンスを操作するためには`$this->response` 転送オブジェクトを使います。重要なメソッドはのいくつかは以下のとおりです。

- `setContent()`: コンテント本体をセットします

- `setHeader()`: 単一のヘッダーをセットします

- `setCookie()`: 単一のcookieをセットします

- `setRedirect()`: `Location:` ヘッダーをリダイレクトのためにセットします (デフォルトは `'302 Found'`.)

- `setStatusCode()` と `setStatusText()`　はHTTPのステータスコードとメッセージをセットします

 詳細については、 [Response](https://github.com/auraphp/Aura.Web/blob/master/src/Aura/Web/Response.php) クラスを確認してください。

## The Context Object ##
 webのリクエスト状況は `$this->context`オブジェクトで知る事ができます。重要なメソッドのいくつかは以下のとおりです。

- `getQuery()`: $_GET の値を取得します

- `getPost()`: $_POST の値を取得します

- `getFiles()`: $_FILES vの値を取得します

- `getInput()`: 生の `php://input` の値を取得します

- `getJsonInput()`: 生の `php://input` の値と `json_decode()` の値を取得します

- `isGet()`, `isPut()`, `isXhr()`, 等: メソッドが `GET`, `PUT`, あるいは `Xml-HTTP-Request`等かを返します

 詳細については、 [Context](https://github.com/auraphp/Aura.Web/blob/master/src/Aura/Web/Context.php) 
 クラスご確認ください。 "terms" クエリー文字列をつかった"search" アクションのコード例は以下の様になるでしょう。

{% highlight php %}
<?php
public function actionSearch()
{
    $terms = $this->context->getQuery('terms');
    if ($terms) {
        // ... now search a database ...
    }
}
{% endhighlight %}

`'?terms=foo+bar+baz'`というクエリーのついたURIが与えられると `$terms`変数は `'foo bar baz'`になります。もしクエリーに `'terms'`がないと`$terms`はnullになります。

## The Accept Object ##
 `$this->accept`オブジェクトをつかってクライアントが何をアクセプトしているかを知る事ができます。
 
- `getContentType()`: 利用可能なメディアタイプを返します

- `getCharset()`: 利用可能なキャラクターセットを返します

- `getEncoding()`: 利用可能なエンコーディングを返します

- `getLanguage()`: 利用可能な言語を返します

## Data and Rendering ##

通常は`Response`の内容をアクションメソッドで直接操作したいとは思わないでしょう。ほとんどの場合は、アクションメソッドの内部でデータを集めて、表示のためにレンダリングシステムにデータを渡します。`AbstractPage`は`$data`プロパティと`Renderer` を提供します。 `$data`プロパティを単純に使用する例は、次のとおりです。

{% highlight php %}
<?php
namespace Vendor\Package\Web\Greet;

use Aura\Web\Controller\AbstractPage;

class Page extends AbstractPage
{
    public function actionHello($noun = null)
    {
        $this->data->noun = $noun;
    }
}
{% endhighlight %}

## View template and layout ##

適切なテンプレートでレンダリングするためには、レンダリングに必要なビューとレイアウトのアサインが必要です。
 レンダーに必要な値はこのようにアサインします。 `$this->view = 'viewname'`
レイアウトに必要なアサインはこのようにします。`$this->layout = 'layout-name'`.

{% highlight php %}
<?php
namespace Vendor\Package\Web\Greet;

use Aura\Web\Controller\AbstractPage;

class Page extends AbstractPage
{
    public function actionHello($noun = null)
    {
        $this->data->noun = $noun;
        // only one view
        // $this->view = 'greet';
        
        $this->view = [
            '.html' => 'greet.html.php',
            '.json' => 'greet.json.php',
            '.xml' => 'greet.xml.php'
        ];
        
        // only one layout
        // $this->layout = 'layout-name';

        // if you have multiple alyouts for different formats
        $this->layout = [
            '.html' => 'default.php',
            '.json' => '',
            '.xml' => ''
        ];
    }
}
{% endhighlight %}

## Configuration ##
 ここでは、二つのことを追加する必要があります。 Add your controller to the map in the `config/default.php` ファイルでコントローラーをマップして加える事です。
.

{% highlight php %}
$di->params['Aura\Framework\Web\Controller\Factory']['map']['<name>'] = 
    'Vendor\Package\Web\Greet\Page';
{% endhighlight %}
    
上記コントローラで指定した同じ名前でルートを追加します。

{% highlight php %}
$di->get('router_map')->add('<unique-route-name>', '/registered', [
    'values' => [
        'controller' => '<name>',
        'action' => 'hello',
    ],
]);
{% endhighlight %}

ルートの詳細については、ルーティングの章を読んでみてください。
