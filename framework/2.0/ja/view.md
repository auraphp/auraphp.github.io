---
layout: docs2-ja
title: ビュー
permalink: /framework/2.0/ja/view/
previous_page: ディペンデンシーインジェクション
previous_page_url: /framework/2.0/ja/di/
next_page: フォーム
next_page_url: /framework/2.0/ja/forms/
---

# ビュー

`"foa/html-view-bundle": "2.*"` を `composer.json` に追加し `composer update` を実行してインストールしましょう。

## 出力をエスケープする

テンプレートで値を出力する際は、セキュリティのため **常に** 適切なエスケープを行うようにしましょう。 HTMLテンプレートなら、HTMLエスケーピング、 CSSテンプレートならCSSエスケーピング、XMLテンプレートならXMLエスケーピング、 PDFテンプレートならPDFエスケーピング、 RTFテンプレートならRTFエスケーピング...という事です。

## ビューテンプレートの登録

_Aura\View\View_ オブジェクトを持っていると仮定しましょう、ビューレジストリへテンプレートを登録してみます。 これは一般的にPHPファイルへのパスを設定しますが、クロージャを使う事も出来ます。 一般的な例を下記に示します。:

{% highlight php %}
<?php
$view_registry = $view->getViewRegistry();
$view_registry->set('browse', '/path/to/views/browse.php');
?>
{% endhighlight %}

`browse.php` は下記のようなファイルです。:

{% highlight php %}
<?php
foreach ($this->items as $item) {
    $id = $this->escape()->html($item['id']);
    $name = $this->escape()->html($item['name']);
    echo "Item ID #{$id} is '{$name}'." . PHP_EOL;
?>
{% endhighlight %}

テンプレートで、`return` ではなく、`echo` を使用している事に注目してください。

> テンプレートのロジックは、 _View_ オブジェクトのスコープ内で実行されます,
> これはテンプレート内の `$this` が _View_ オブジェクトを参照する事を意味します。
> クロージャベースのテンプレートも同じです。

## データのセット

大抵の場合、テンプレートにはダイナミックなデータを使用したいと思うでしょう。データを _view_ へセットするには、`setdata()` メソッドを使用します。 配列でもオブジェクトでも大丈夫です。そしてこれらのデータは _view_ オブジェクトのプロパティとして利用できます。

{% highlight php %}
<?php
$view->setData(array(
    'items' => array(
        array(
            'id' => '1',
            'name' => 'Foo',
        ),
        array(
            'id' => '2',
            'name' => 'Bar',
        ),
        array(
            'id' => '3',
            'name' => 'Baz',
        ),
    )
));
?>
{% endhighlight %}

> テンプレートロジック内の `$this` は _View_ オブジェクトを参照する事を覚えていますか？
> _View_ へ設定されたデータは `$this` のプロパティとしてアクセスできます。

`setData()` メソッドは_View_ オブジェクトの全てのデータを上書きします。一方で、`addData()` メソッドは _View_ オブジェクトへ設定されているデータとマージします。

## ビューの呼び出し

さあ、テンプレートを登録していくつかデータを _View_ にセットしてきました、_View_ に描画するテンプレートを設定し、invoke(呼び出し)してみましょう！

{% highlight php %}
<?php
$view->setView('browse');
$output = $view->__invoke(); // あるいは単に $view() とする事も出来ます。
?>
{% endhighlight %}

`$output` は下記のような出力になります。

{% highlight php %}
Item #1 is 'Foo'.
Item #2 is 'Bar'.
Item #3 is 'Baz'.
{% endhighlight %}

## サブテンプレートを使う ("パーシャル")

テンプレートを部分的に分割したいというような時があります。こういった部分的な "パーシャル" テンプレートは、メインテンプレート内で `render()` メソッドを使用して描画を行います。

まずはじめに、ビューレジストリへサブテンプレートを登録します。（レイアウトのために使用する場合はレイアウトレジストリになります）
それから、メインテンプレート内で `render()` を実行します。サブテンプレートには好きなネームスキームを使用できます。 いくつかのシステムでは、アンダースコアをプレフィックスに使用する習慣があります。下記の例もそのようにしてあります。

次に、パーシャルテンプレートで利用するために、変数群の配列を渡します。(`$this` 変数は常に利用できます)

例として, `browse.php` テンプレートを分割してアイテムを表示する部分をサブテンプレートとして切り出してみましょう。

{% highlight php %}
<?php
// ビューレジストリへテンプレートを登録します。
$view_registry = $view->getViewRegistry();

// メインテンプレート
$view_registry->set('browse', '/path/to/views/browse.php');

// サブテンプレート
$view_registry->set('_item', '/path/to/views/_item.php');
?>
{% endhighlight %}

`browse.php` からアイテム表示を行うコードを `_item.php` へ移行します。:

{% highlight php %}
<?php
$id = $this->escape()->html($item['id']);
$name = $this->escape()->html($item['name']);
echo "Item ID #{$id} is '{$name}'." . PHP_EOL;
?>
{% endhighlight %}

それから、 `browse.php` をサブテンプレートを使うように変更します。:

{% highlight php %}
<?php
foreach ($this->items as $item) {
    echo $this->render('_item', array(
        'item' => $item,
    ));
?>
{% endhighlight %}

出力は前例でビューを呼び出した時の物と同じになります。

> または、 `include` あるいは `require` を使って
> 現在のテンプレートスコープで直接PHPファイルを実行する事も出来ます。


## セクションを使う

セクションはサブテンプレートと似ていますが、セクションについては後々の描画のために出力のキャプチャーを行う点が異なります。 一般的に、ビューテンプレートに使用され、レイアウトテンプレートのために出力をキャプチャーします。

例えば、ビューテンプレートの出力を指定のセクションにキャプチャーします ...


{% highlight php %}
<?php
// 指定されたセクションへの出力のバッファリングを行います。
$this->beginSection('local-nav');

echo "<div>";
// ... ナビゲーションを出力します ...
echo "</div>";

// バッファリングを終了して、出力をキャプチャーします。
$this->endSection();
?>
{% endhighlight %}

... それからレイアウトテンプレートで出力します。

{% highlight php %}
<?php
if ($this->hasSection('local-nav')) {
    echo $this->getSection('local-nav');
} else {
    echo "<div>No local navigation.</div>";
}
?>
{% endhighlight %}

加えて、`setSection()` メソッドはキャプチャーの代わりに、直接下記のように設定することも出来ます。

{% highlight php %}
<?php
$this->setSection('local-nav', $this->render('_local-nav.php'));
?>
{% endhighlight %}

## 2ステップビューの描画

レイアウトの中でメインコンテンツをラップするために、まずレイアウトテンプレートを
_View_ に登録して、`setLayout()` メソッドを使いセットします。(もしレイアウトが設定されていなければ、実行されません。)

ビューレジストリへ `browse` テンプレートを登録していると仮定します。`default` レイアウトテンプレートをレイアウトレジストリへ登録してみましょう。:


{% highlight php %}
<?php
$layout_registry = $view->getLayoutRegistry();
$layout_registry->set('default', '/path/to/layouts/default.php');
?>
{% endhighlight %}

`default.php` レイアウトテンプレートは下記のようなファイルです。:

{% highlight php %}
<html>
<head>
    <title>My Site</title>
</head>
<body>
<?= $this->getContent(); ?>
</body>
</html>
{% endhighlight %}

それから _View_　オブジェクトに、ビューとレイアウトを設定して呼び出します。

{% highlight php %}
<?php
$view->setView('browse');
$view->setLayout('default');
$output = $view->__invoke(); // あるいは単に $view() とする事も出来ます。
?>
{% endhighlight %}

内側のビューテンプレートからの出力は保持され _View_ オブジェクトの `getContent()` メソッドから利用できるようになります。レイアウトテンプレートはそれから `getContent()` を呼び出しレイアウトテンプレートに、ビューの結果を出力します。

> ビューテンプレートから、`setLayout()` を呼ぶ事も出来ます。
> ビューロジックの一部としてレイアウトを選択する事が可能です。

ビューテンプレートとレイアウトテンプレートは同じ _View_ オブジェクトの中で実行されます。つまり：

- 全てのデータは、ビューとレイアウト間で共有されます。ビューにセットされたデータや、ビューによって変更されたデータはレイアウトからもそのまま使えます。

- 全てのヘルパーは、ビューとレイアウト間で共有されます。レイアウトが実行されるまえにビューからデータやヘルパーを変更できます。

- 全てのセクションボディは、ビューとレイアウト間で共有されます。よって、ビューテンプレートからキャプチャーされたセクションがレイアウトテンプレートからも利用できます。

## テンプレートとしてのクロージャ

ビュー、及びレイアウトレジストリにはクロージャもテンプレートとして登録する事が出来ます。
下記は、 `browse.php` と `_item.php` テンプレートでクロージャを利用した例です。

{% highlight php %}
<?php
$view_registry->set('browse', function () {
    foreach ($this->items as $item) {
        echo $this->render('_item', array(
            'item' => $item,
        ));
    }
);

$view_registry->set('_item', function (array $vars) {
    extract($vars, EXTR_SKIP);
    $id = $this->escape()->html($item['id']);
    $name = $this->escape()->html($item['name']);
    echo "Item ID #{$id} is '{$name}'." . PHP_EOL;
);
?>
{% endhighlight %}

クロージャベースのテンプレートを登録する時は、出力時に `return` ではなく `echo` を使うようにしましょう。 クロージャは _View_ オブジェクトに返るので、
ファイルベースのテンプレートと同様にクロージャの `$this` も _View_ を参照するようになります。

クロージャベースでサブテンプレートを利用する場合は少し追加の作業が必要になります。ファイルベースのテンプレートでは、セットされたデータを含む配列を自動的にローカルスコープに展開してくれますが、クロージャベースのテンプレートでは以下の作業が必要になります:

1. 注入された変数を受け取るパラメーターを関数に定義しましょう。(`_item` テンプレート内の `$vars` パラメーターです)

2. `extract()`を使って注入された変数を展開します。または、注入された変数をそのまま直接使う事も出来ます。

上記を除き、クロージャベースのテンプレートはファイルベースのテンプレートと同様に機能します。

## Aura.Htmlでのビルトインヘルパー

## エスケーパー

出力のエスケープは、セキュリティの観点から **絶対に必要不可欠** です。このパッケージの、`escape()` ヘルパーには4つのメソッドがあります:

- `$this->escape()->html('foo')` HTMLのエスケープに使用します。
- `$this->escape()->attr('foo')` HTML属性のエスケープに使用します。
- `$this->escape()->css('foo')` CSSのエスケープに使用します。
- `$this->escape()->js('foo')` JavaScriptのエスケープに使用します。

下記にいくつか `escape()` ヘルパーの使用例を示します:

{% highlight php %}
<head>

    <style>
        body: {
            color: <?= $this->escape()->css($theme->color) ?>;
            font-size: <?= $this->escape()->css($theme->font_size) ?>;
        }
    </style>

    <script language="javascript">
        var foo = "<?= $this->escape()->js($js->foo); ?>";
    </script>

</head>

<body>

    <h1><?= $this->escape()->html($blog->title) ?></h1>

    <p class="byline">
        by <?= $this->escape()->html($blog->author) ?>
        on <?= $this->escape()->html($blog->date) ?>
    </p>

    <div id="<?php $this->escape()->attr($blog->div_id) ?>">
        <?= $blog->raw_html ?>
    </div>

</body>
{% endhighlight %}

不幸なことに、エスケープの処理はくどく、テンプレートのコードは酷く散らかったように見えます。これを和らげるために、2つの方法があります。

１つ目の方法は、`escape()` ヘルパーを変数にセットして、呼び出すようにする事です。下記は例です。

{% highlight php %}
<?php
// エスケープヘルパーを呼び出し可能な変数にセットします。
$h = $this->escape()->html;
$a = $this->escape()->attr;
$c = $this->escape()->css;
$j = $this->escape()->js;
?>

<head>

    <style>
        body: {
            color: <?= $c($theme->color) ?>;
            font-size: <?= $c($theme->font_size) ?>;
        }
    </style>

    <script language="javascript">
        var foo = "<?= $j($js->foo); ?>";
    </script>

</head>

<body>

    <h1><?= $h($blog->title) ?></h1>

    <p class="byline">
        by <?= $h($blog->author) ?>
        on <?= $h($blog->date) ?>
    </p>

    <div id="<?php $a($blog->div_id) ?>">
        <?= $blog->raw_html ?>
    </div>

</body>
{% endhighlight %}

２つ目の方法は、 `escape()` ヘルパーに使用される _Escaper_ クラスに実装されている4つのstaticメソッドを使う事です。:`h()`, `a()`, `c()`, `j()`
順番に、HTMLのエスケープ、HTML属性のエスケープ、CSSのエスケープ、JavaScriptのエスケープを行います。

> 注意 : Auraでは、基本的にstaticメソッドの利用を避けています。しかし、この場合ではテンプレートの可読性のためのトレードオフです。

PHPベースのテンプレートで、static _Escaper_ メソッドを呼び出すためには、`use` を使って _Escaper_ のエイリアスを定義します。それから、エイリアスからstaticメソッドを呼び出します。 (もし、_HelperLocatorFactory_ のインスタンスを生成していない場合は、`Escaper::setStatic(new Escaper)` を呼び出す必要があります。)


下記は、staticメソッドを使用した例です:

{% highlight php %}
<?php use Aura\Html\Escaper as e; ?>

<head>

    <style>
        body: {
            color: <?= e::c($theme->color) ?>;
            font-size: <?= e::c($theme->font_size) ?>;
        }
    </style>

    <script language="javascript">
        var foo = "<?= e::j($js->foo); ?>";
    </script>

</head>

<body>

    <h1><?= e::h($blog->title) ?></h1>

    <p class="byline">
        by <?= e::h($blog->author) ?>
        on <?= e::h($blog->date) ?>
    </p>

    <div id="<?php e::a($blog->div_id) ?>">
        <?= $blog->raw_html ?>
    </div>

</body>
{% endhighlight %}

## タグヘルパー

_HelperLocator_ のメソッドとしてヘルパーを使用できます。 利用できるヘルパーの一覧です:


- [a/anchor](#a)
- [base](#base)
- [img/image](#img)
- [label](#label)
- [links](#links)
- [metas](#metas)
- [ol](#ol)
- [scripts / scriptsfoot](#scripts)
- [ul](#ul)
- [styles](#styles)
- [tag](#tag)
- [title](#title)

[フォームのためのヘルパー](#form-helpers) もあります。

### a

`<a>` タグヘルパー

{% highlight php %}
<?php
echo $this->a(
    'http://auraphp.com',       // (string) href
    'Aura Project',             // (string) text
    array('id' => 'aura-link')  // (array) optional attributes
);
?>
<a href="http://auraphp.com" id="aura-link">Aura Project</a>
{% endhighlight %}

### base

`<base>` タグヘルパー

{% highlight php %}
<?php
echo $this->base(
    '/base' // (string) href
);
?>
<base href="/base" />
{% endhighlight %}

### img

`<img>` タグヘルパー

{% highlight php %}
<?php
echo $this->img(
    '/images/hello.jpg',            // (string) image href src
    array('id' => 'image-id');      // (array) optional attributes
?>
<!-- もし、alt属性が設定されていない場合は画像ファイル名を使用します。 -->
<img src="/images/hello.jpg" alt="hello" id="image-id">

{% endhighlight %}

### label

`<label>` タグヘルパー

{% highlight php %}
<?php
echo $this->label(
    'Label For Field',          // (string) label text
    array('for' => 'field'));   // (array) optional attributes
?>
<label for="field">Label For Field</label>

<?php
// ラベルタグで包括し、ラベルのテキストはinputタグの前に出力されます。
echo $this->label('Foo: ')
            ->before($this->input(array(
                'type' => 'text',
                'name' => 'foo',
            )));
?>
<label>Foo: <input type="text" name="foo" value="" /></label>

<?php
// ラベルタグで包括し、ラベルのテキストはinputタグの後に出力されます。
echo $this->label(' (Foo)')
            ->after($this->input(array(
                'type' => 'text',
                'name' => 'foo',
            )));
?>
<label><input type="text" name="foo" value="" /> (Foo)</label>
{% endhighlight %}

### links

`<link>` タグヘルパーです、 リンクを `add()` メソッドで追加し、それから出力します。

{% highlight php %}
<?php
// add() メソッドを使い、リンクを配列で追加します。
$this->links()->add(array(
    'rel' => 'prev',                // (array) link attributes
    'href' => '/path/to/prev',
));

$this->links()->add(array(        // (array) link attributes
    'rel' => 'next',
    'href' => '/path/to/next',
));

// リンクの出力をします。
echo $this->links();
?>
<link rel="prev" href="/path/to/prev" />
<link ref="next" href="/path/to/next" />

<?php
// また、add() コールをメソッドチェーンして出力する事も出来ます。
echo $this->links()
    ->add(array(                    // (array) link attributes
        'rel' => 'prev',
        'href' => '/path/to/prev',
    ))
    ->add(array(                    // (array) link attributes
        'rel' => 'next',
        'href' => '/path/to/next',
    ));
?>
<link rel="prev" href="/path/to/prev" />
<link ref="next" href="/path/to/next" />
{% endhighlight %}

### metas

`<meta>` タグヘルパーです。  `add*()` メソッドで追加し、出力します。

{% highlight php %}
<?php
// http-equivalent metaの追加をします。
$this->metas()->addHttp(
    'Location',         // (string) header label
    '/redirect/to/here' // (string) header value
);

// name metaの追加をします。
$this->metas()->addName(
    'foo',              // the meta name
    'bar'               // the meta content
);

// metasの出力をします。
echo $this->meta();
?>
<meta http-equiv="Location" content="/redirect/to/here">
<meta name="foo" content="bar">

<?php
// また、add() コールをメソッドチェーンして出力する事も出来ます。
echo $this->metas()
    ->addHttp(
        'Location',         // (string) header label
        '/redirect/to/here' // (string) header value
    )
    ->addName(
        'foo',              // the meta name
        'bar'               // the meta content
    );
?>
<meta http-equiv="Location" content="/redirect/to/here">
<meta name="foo" content="bar">
{% endhighlight %}

### ol

`<ol>` タグ 、及び `<li>` アイテムを出力するタグヘルパーです。タグを生成した後 (そのままの値かエスケープされた値) で出力を行います。

{% highlight php %}
<?php
// リストを開始します。
$this->ol(array(                  // (array) optional attributes
    'id' => 'test',
));

// アイテムを追加します。（エスケープされます）
$this->ol()->item(
    'foo',                          // (string) the item text
    array('id' => 'foo')            // (array) optional attributes
);

// いくつかのアイテムをまとめて追加します。（エスケープされます）
$this->ol()->items(array(         // (array) the items to add
    'bar',                          // the item text, no item attributes
    'baz' => array('id' => 'baz'),  // item text with item attributes
));

// アイテムを追加します。（エスケープされません）
$this->ol()->rawItem(
    '<a href="/first">First</a>',   // (string) the raw item html
    array('id' => 'first')          // (array) optional attributes
);

// いくつかのアイテムをまとめて追加します。（エスケープされません）
$this->ol()->rawItems(array(         // (array) the raw items to add
    '<a href="/prev">Prev</a>',     // the item text, no item attributes
    '<a href="/next">Next</a>',
    '<a href="/last">Last</a>' => array('id' => 'last') // text and attributes
));

// リストを出力します。
echo $this->ol();
?>
<ol id="test">
    <li id="foo">foo</li>
    <li>bar</li>
    <li id="baz">baz</li>
    <li><a href="/first">First</a></li>
    <li><a href="/pref">First</a></li>
    <li><a href="/next">First</a></li>
    <li><a href="/last">First</a></li>
</ol>
{% endhighlight %}

### scripts

`<script>` タグヘルパーです。リンクをセットして出力します。

{% highlight php %}
<?php
// scriptを追加します。
$this->scripts()->add('/js/middle.js');

// 続けてscriptを追加します。
$this->add('/js/last.js');

// 優先度を設定して追加します。
echo $this->scripts(
    '/js/first.js',     // (string) the script src
    50                  // (int) optional priority order (default 100)
);

// 条件に応じたscriptを追加します。
$this->scripts->addCond(
    'ie6',              // (string) the condition
    '/js/ie6.js',       // (string) the script src
    25                  // (int) optional priority order (default 100)
));

?>
<!--[if ie6]><script src="/js/ie6.js" type="text/javascript"></script><![endif]-->
<script src="/js/first.js" type="text/javascript"></script>
<script src="/js/middle.js" type="text/javascript"></script>
<script src="/js/last.js" type="text/javascript"></script>
{% endhighlight %}

`scriptsFoot()` ヘルパーも同じように機能します。ただし、このヘルパーはHTMLボディの最後に出力を行います。

### ul

`<ul>` タグ 、及び `<li>` アイテムを出力するタグヘルパーです。タグを生成した後 (そのままの値かエスケープされた値) で出力を行います。


{% highlight php %}
<?php
// リストを開始します。
$this->ul(array(                  // (array) optional attributes
    'id' => 'test',
));

// アイテムを追加します。（エスケープされます）
$this->ul()->item(
    'foo',                          // (string) the item text
    array('id' => 'foo')            // (array) optional attributes
);

// いくつかのアイテムをまとめて追加します。（エスケープされます）
$this->ul()->items(array(         // (array) the items to add
    'bar',                          // the item text, no item attributes
    'baz' => array('id' => 'baz'),  // item text with item attributes
));

// アイテムを追加します。（エスケープされません）
$this->ul()->rawItem(
    '<a href="/first">First</a>',   // (string) the raw item html
    array('id' => 'first')          // (array) optional attributes
);

// いくつかのアイテムをまとめて追加します。（エスケープされません）
$this->ul()->rawItems(array(      // (array) the raw items to add
    '<a href="/prev">Prev</a>',     // the item text, no item attributes
    '<a href="/next">Next</a>',
    '<a href="/last">Last</a>' => array('id' => 'last') // text and attributes
));

// リストを出力します。
echo $this->ul();
?>
<ul id="test">
    <li id="foo">foo</li>
    <li>bar</li>
    <li id="baz">baz</li>
    <li><a href="/first">First</a></li>
    <li><a href="/prev">Prev</a></li>
    <li><a href="/next">Next</a></li>
    <li><a href="/last">Last</a></li>
</ul>
{% endhighlight %}

### styles

`<link>` タグヘルパーです、リンクを生成した後、出力します。`script` ヘルパーと同じで、それぞれのスタイルシートに優先度を設定することも出来ます。

{% highlight php %}
<?php
// スタイルシートへのリンクを追加します。
$this->styles()->add(
    '/css/middle.css',          // (string) the stylesheet href
    array('media' => 'print')   // (array) optional attributes
);

// 続けて追加します。
$this->styles()->add('/css/last.css');

// 設定した優先度で追加します。
$this->styles()->add(
    '/css/first.css',           // (string) the stylesheet href
    null,                       // (array) optional attributes
    50                          // (int) optional priority order (default 100)
);

// 条件に応じて追加します。
$this->styles()->addCond(
    'ie6',                      // (string) the condition
    '/css/ie6.css',             // (string) the stylesheet href
    array('media' => 'print'),  // (array) optional attributes
    25                          // (int) optional priority order (default 100)
);

// 出力します。
echo $this->styles();
?>
<!--[if ie6]><link rel="stylesheet" href="/css/ie6.css" type="text/css" media="print" /><![endif]-->
<link rel="stylesheet" href="/css/first.css" type="text/css" media="screen" />
<link rel="stylesheet" href="/css/middle.css" type="text/css" media="print" />
<link rel="stylesheet" href="/css/last.css" type="text/css" media="screen" />
?>
{% endhighlight %}

### tag

一般的なタグのヘルパーです。

{% highlight php %}
<?php
echo $this->tag(
    'div',                  // (string) the tag name
    array('id' => 'foo')    // (array) optional array of attributes
);
echo $this->tag('/div');
?>
<div id="foo"></div>
{% endhighlight %}

### title

`<title>` タグのためのヘルパー

{% highlight php %}
<?php
// エスケープされたバージョン (部分的にエスケープしないようにする事も可能です)

// タイトルをセットします
$this->title()->set('This & That');

// appendはタイトルの後に追加します。
$this->title()->append(' > Suf1');
$this->title()->append(' > Suf2');

// prependはタイトルの前に追加します。
$this->title()->prepend('Pre1 > ');
$this->title()->prepend('Pre2 > ');

echo $this->title();
?>
<title>Pre2 &gt; Pre1 &gt; This &amp; That &gt; Suf1 &gt; Suf2</title>

<?php
// エスケープされないバージョン (部分的にエスケープする事も可能です):

// タイトルをセットします
$this->title()->set('This & That');

// appendはタイトルの後に追加します。
$this->title()->append(' > Suf1');
$this->title()->append(' > Suf2');

// prependはタイトルの前に追加します。
$this->title()->prepend('Pre1 > ');
$this->title()->prepend('Pre2 > ');

echo $this->title();
?>
<title>Pre2 > Pre1 > This & That > Suf1 > Suf2</title>
{% endhighlight %}

## フォームヘルパー

## フォームエレメント

formタグは下記のように利用します:

{% highlight php %}
<?php
echo $this->form(array(
    'id' => 'my-form',
    'method' => 'put',
    'action' => '/hello-action',
));

echo $this->tag('/form');
?>
<form id="my-form" method="put" action="/hello-action" enctype="multipart/form-data"></form>
{% endhighlight %}

## HTML 5 Input エレメント

全てのHTML 5 input ヘルパーは同じ用法で利用します。input エレメントのフォーマットに配列を使用します。

{% highlight php %}
<?php
echo $this->input(array(
    'type'    => $type,     // (string) the element type
    'name'    => $name,     // (string) the element name
    'value'   => $value,    // (string) the current value of the element
    'attribs' => array(),   // (array) element attributes
    'options' => array(),   // (array) options for select and radios
));
?>
{% endhighlight %}

配列を用いる事で特殊な用途においても、Aura.Html に依存する事なく他ライブラリがフォームのエレメントを生成する事が出来ます。

`type` の値で有効なinputのエレメント一覧:

- [button](#button)
- [checkbox](#checkbox)
- [color](#color)
- [date](#date)
- [datetime](#datetime)
- [datetime-local](#datetime-local)
- [email](#email)
- [file](#file)
- [hidden](#hidden)
- [image](#image)
- [month](#month)
- [number](#number)
- [password](#password)
- [radio](#radio)
- [range](#range)
- [reset](#reset)
- [search](#search)
- [select](#select) (including options)
- [submit](#submit)
- [tel](#tel)
- [text](#text)
- [textarea](#textarea)
- [time](#time)
- [url](#url)
- [week](#week)

### button

{% highlight php %}
<?php
echo $this->input(array(
    'type'    => 'button',
    'name'    => 'foo',
    'value'   => 'bar',
    'attribs' => array()
));
?>
<input type="button" name="foo" value="bar" />
{% endhighlight %}

### checkbox

`checkbox` タイプは擬似属性の `value_unchecked` 使って (もうお分りかもしれませんが)  `hidden` エレメントの未チェックの値を設定するために使用します。
また `label` 擬似属性は、チェックボックスの後に置かれるラベルテキストを設定することが出来ます。

{% highlight php %}
<?php
echo $this->input(array(
    'type'    => 'checkbox',
    'name'    => 'foo',
    'value'   => 'y',               // the current value
    'attribs' => array(
        'label' => 'Check me',      // the checkbox label
        'value' => 'y',             // the value when checked
        'value_unchecked' => '0',   // the value when unchecked
    ),
));
?>
<input type="hidden" name="foo" value="n" />
<label><input type="checkbox" name="foo" value="y" checked /> Check me</label>
{% endhighlight %}

### color

{% highlight php %}
<?php
echo $this->input(array(
    'type'    => 'color',
    'name'    => 'foo',
    'value'   => 'bar',
    'attribs' => array()
));
?>
<input type="color" name="foo" value="bar" />
{% endhighlight %}

### date

{% highlight php %}
<?php
echo $this->input(array(
    'type'    => 'date',
    'name'    => 'foo',
    'value'   => 'bar',
    'attribs' => array()
));
?>
<input type="date" name="foo" value="bar" />
{% endhighlight %}

### datetime

{% highlight php %}
<?php
echo $this->input(array(
    'type'    => 'datetime',
    'name'    => 'foo',
    'value'   => 'bar',
    'attribs' => array()
));
?>
<input type="datetime" name="foo" value="bar" />
{% endhighlight %}

### datetime-local

{% highlight php %}
<?php
echo $this->input(array(
    'type'    => 'datetime-local',
    'name'    => 'foo',
    'value'   => 'bar',
    'attribs' => array()
));
?>
<input type="datetime-local" name="foo" value="bar" />
{% endhighlight %}

### email

{% highlight php %}
<?php
echo $this->input(array(
    'type'    => 'email',
    'name'    => 'foo',
    'value'   => 'bar',
    'attribs' => array()
));
?>
<input type="email" name="foo" value="bar" />
{% endhighlight %}

### file

{% highlight php %}
<?php
echo $this->input(array(
    'type'    => 'file',
    'name'    => 'foo',
    'value'   => 'bar',
    'attribs' => array()
));
?>
<input type="file" name="foo" value="bar" />
{% endhighlight %}

### hidden

{% highlight php %}
<?php
echo $this->input(array(
    'type'    => 'hidden',
    'name'    => 'foo',
    'value'   => 'bar',
    'attribs' => array()
));
?>
<input type="hidden" name="foo" value="bar" />
{% endhighlight %}

### image

{% highlight php %}
<?php
echo $this->input(array(
    'type'    => 'image',
    'name'    => 'foo',
    'value'   => 'bar',
    'attribs' => array()
));
?>
<input type="image" name="foo" value="bar" />
{% endhighlight %}

### month

{% highlight php %}
<?php
echo $this->input(array(
    'type'    => 'month',
    'name'    => 'foo',
    'value'   => 'bar',
    'attribs' => array()
));
?>
<input type="month" name="foo" value="bar" />
{% endhighlight %}

### number

{% highlight php %}
<?php
echo $this->input(array(
    'type'    => 'number',
    'name'    => 'foo',
    'value'   => 'bar',
    'attribs' => array()
));
?>
<input type="number" name="foo" value="bar" />
{% endhighlight %}

### password

{% highlight php %}
<?php
echo $this->input(array(
    'type'    => 'password',
    'name'    => 'foo',
    'value'   => 'bar',
    'attribs' => array()
));
?>
<input type="password" name="foo" value="bar" />
{% endhighlight %}

### radio

このタイプは1つのラジオ、あるいは `options` を設定する事で複数のラジオを生成する事ができます。

{% highlight php %}
<?php
echo $this->input(array(
    'type'    => 'radio',
    'name'    => 'foo',
    'value'   => 'bar',     // (string) the currently selected radio
    'attribs' => array(),
    'options' => array(     // (array) `value => label` pairs
        'bar' => 'baz',
        'dib' => 'zim',
        'gir' => 'irk',
    ),
));
?>
<label><input type="radio" name="foo" value="bar" checked /> baz</label>
<label><input type="radio" name="foo" value="dib" /> zim</label>
<label><input type="radio" name="foo" value="gir" /> irk</label>
{% endhighlight %}

### range

{% highlight php %}
<?php
echo $this->input(array(
    'type'    => 'range',
    'name'    => 'foo',
    'value'   => 'bar',
    'attribs' => array()
));
?>
<input type="range" name="foo" value="bar" />
{% endhighlight %}

### reset

{% highlight php %}
<?php
echo $this->input(array(
    'type'    => 'reset',
    'name'    => 'foo',
    'value'   => 'bar',
    'attribs' => array()
));
?>
<input type="reset" name="foo" value="bar" />
{% endhighlight %}

### search

{% highlight php %}
<?php
echo $this->input(array(
    'type'    => 'search',
    'name'    => 'foo',
    'value'   => 'bar',
    'attribs' => array()
));
?>
<input type="search" name="foo" value="bar" />
{% endhighlight %}

### select

`<select>` タグ、及び `<option>` タグのヘルパーです。 擬似属性の `placeholder` は未選択時のプレイスホルダーとして扱われます。 `'multiple' => true` を
を設定すると複数選択可能になります。そしてもし設定されていなければ、自動的にname属性に `[]` を追加します。

{% highlight php %}
<?php
echo $this->input(array(
    'type'    => 'select',
    'name'    => 'foo',
    'value'   => 'bar',
    'attribs' => array(
        'placeholder' => 'Please pick one',
    ),
    'options' => array(
        'baz' => 'Baz Label',
        'dib' => 'Dib Label',
        'bar' => 'Bar Label',
        'zim' => 'Zim Label',
    ),
));
?>
<select name="foo">
    <option disabled value="">Please pick one</option>
    <option value="baz">Baz Label</option>
    <option value="dib">Dib Label</option>
    <option value="bar" selected>Bar Label</option>
    <option value="zim">Zim Label</option>
</select>

<?php
// selectタグを作成します。
$select = $this->input(array(
    'type'    => 'select',
    'name'    => 'foo',
));

// 現在選択されている値を設定できます。
$select->selected('bar');   // (string|array) the currently selected value(s)

// selectタグへ属性を設定します。
$select->attribs(array(
    'placeholder' => 'Please pick one',
));

// optionを追加します。
$select->option(
    'baz',                  // (string) the option value
    'Baz Label',            // (string) the option label
    array()                 // (array) optional attributes for the option tag
);

// 複数のoptionを追加します。
$select->options(array(
    'dib' => 'Dib Label',
    'bar' => 'Bar Label',
    'zim' => 'Zim Label',
));

// selectタグを出力します。
echo $select;
?>
<select name="foo">
    <option disabled value="">Please pick one</option>
    <option value="baz">Baz Label</option>
    <option value="dib">Dib Label</option>
    <option value="bar" selected>Bar Label</option>
    <option value="zim">Zim Label</option>
</select>
{% endhighlight %}

このヘルパーはoptionのグループ化にも対応しています。もし、`options` の値が配列の場合は配列のキーが `<optgroup>` のラベルに使用されます。

{% highlight php %}
<?php
echo $this->input(array(
    'type'    => 'select',
    'name'    => 'foo',
    'value'   => 'bar',
    'attribs' => array(),
    'options' => array(
        'Group A' => array(
            'baz' => 'Baz Label',
            'dib' => 'Dib Label',
        ),
        'Group B' => array(
            'bar' => 'Bar Label',
            'zim' => 'Zim Label',
        ),
    ),
));
?>
<select name="foo">
    <optgroup label="Group A">
        <option value="baz">Baz Label</option>
        <option value="dib">Dib Label</option>
    </optgroup>
    <optgroup label="Group B">
        <option value="bar" selected>Bar Label</option>
        <option value="zim">Zim Label</option>
    </optgroup>
</select>

<?php
// 別の例を示します。
$select = $this->input(array(
    'type'    => 'select',
    'name'    => 'foo',
));

// 現在選択されている値を設定できます。
$select->selected('bar');   // (string|array) the currently selected value(s)

// optionのグループを作成します。
$select->optgroup('Group A');

// 複数のoptionを追加します。
$select->options(array(
    'baz' => 'Baz Label',
    'dib' => 'Dib Label',
));

// 別のoptionのグループを作成します。 (サブグループはHTMLの規格上出来ません)
$select->optgroup('Group B');

// optionを追加します。
$select->option(
    'bar',                  // (string) the option value
    'Bar Label',            // (string) the option label
    array()                 // (array) optional attributes for the option tag
);

// optionを追加します。
$select->option(
    'zim',                  // (string) the option value
    'Zim Label',            // (string) the option label
    array()                 // (array) optional attributes for the option tag
);

// selectタグを出力します。
echo $select;
?>
<select name="foo">
    <optgroup label="Group A">
        <option value="baz">Baz Label</option>
        <option value="dib">Dib Label</option>
    </optgroup>
    <optgroup label="Group B">
        <option value="bar" selected>Bar Label</option>
        <option value="zim">Zim Label</option>
    </optgroup>
</select>
{% endhighlight %}

### submit

{% highlight php %}
<?php
echo $this->input(array(
    'type'    => 'submit',
    'name'    => 'foo',
    'value'   => 'bar',
    'attribs' => array()
));
?>
<input type="submit" name="foo" value="bar" />
{% endhighlight %}

### tel

{% highlight php %}
<?php
echo $this->irnput(array(
    'type'    => 'tel',
    'name'    => 'foo',
    'value'   => 'bar',
    'attribs' => array()
));
?>
<input type="tel" name="foo" value="bar" />
{% endhighlight %}

### text

{% highlight php %}
<?php
echo $this->input(array(
    'type'    => 'text',
    'name'    => 'foo',
    'value'   => 'bar',
    'attribs' => array()
));
?>
<input type="text" name="foo" value="bar" />
{% endhighlight %}

### textarea

{% highlight php %}
<?php
echo $this->input(array(
    'type'    => 'textarea',
    'name'    => 'foo',
    'value'   => 'bar',
    'attribs' => array()
));
?>
<textarea name="foo">bar</textarea>
{% endhighlight %}

### time

{% highlight php %}
<?php
echo $this->input(array(
    'type'    => 'time',
    'name'    => 'foo',
    'value'   => 'bar',
    'attribs' => array()
));
?>
<input type="time" name="foo" value="bar" />
{% endhighlight %}

### url

{% highlight php %}
<?php
echo $this->input(array(
    'type'    => 'url',
    'name'    => 'foo',
    'value'   => 'bar',
    'attribs' => array()
));
?>
<input type="url" name="foo" value="bar" />
{% endhighlight %}

### week

{% highlight php %}
<?php
echo $this->input(array(
    'type'    => 'week',
    'name'    => 'foo',
    'value'   => 'bar',
    'attribs' => array()
));
?>
<input type="week" name="foo" value="bar" />
{% endhighlight %}

## カスタムヘルパー

カスタムヘルパーは下記の2ステップで追加できます。

1. ヘルパークラスを作成します。

2. _HelperLocator_ へクラスのファクトリーをセットします。


ヘルパークラスに必要な事は、`__invoke()` メソッドを実装するだけです。
インデンティング、エスケーピングを利用したい場合は、 _Aura\Html\AbstractHelper_ を継承する事を推奨しますが、
必須ではありません。

ここでは、定義済みのルーターから、新しいルーターを作成するためにルーターオブジェクトを返すヘルパーを作成してみます。


{% highlight php %}
<?php
<?php
// {$PROJECT_PATH}/src/App/Html/Helper/Router.php
namespace App\Html\Helper;

use Aura\Html\Helper\AbstractHelper;
use Aura\Router\Router as AuraRouter;

class Router
{
    protected $router;

    public function __construct(AuraRouter $router)
    {
        $this->router = $router;
    }

    public function __invoke()
    {
        return $this->router;
    }
}
{% endhighlight %}

ヘルパークラスを作成したので、今度は _HelperLocator_ にファクトリーをセットしてみます。
作成したヘルパークラスを**返す**ように設定します。

`{$PROJECT_PATH}/config/Common.php` を編集します。

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
        $di->params['App\Html\Helper\Router']['router'] = $di->lazyGet('aura/web-kernel:router');
        $di->params['Aura\Html\HelperLocator']['map']['router'] = $di->lazyNew('App\Html\Helper\Router');
    }
    // ...
}
{% endhighlight %}

_HelperLocator_ のサービス名は、メソッド名も兼ねます。
これはヘルパーを `$this->router()` で呼び出せるという事です:

{% highlight php %}
<?php echo $this->router()->generate('blog.read', array('id', 2)); ?>
{% endhighlight %}

ヘルペーのサービス名は自由につける事が出来ます。ヘルパークラスにサービス名をつけられるだけでなく、同じ名前でメソッドとしてコールできるのです。
