---
layout: docs2-ja
title: 国際化
permalink: /framework/2.0/ja/intl/
previous_page: バリデーション
previous_page_url: /framework/2.0/ja/validation/
next_page: セッション
next_page_url: /framework/2.0/ja/session/
---

# 国際化

Aura.Intl パッケージは国際化 (I18N) ツールを提供します。具体的には、ロケールごとにメッセージ翻訳を行うパッケージ指向のツールです。

> `foa/filter-input-bundle` と `foa/filter-input-bundle` をインストールしたと仮定します。

{% highlight json %}
{
    // more
    "require": {
        // more
        "foa/filter-input-bundle": "~1.1",
        "foa/filter-intl-bundle": "~1.1"
    }
}
{% endhighlight %}

## サービス

次のようにメソッド中で `intl_translator_locator` サービスを取得することができます。


{% highlight bash %}
$translators = $di->get('intl_translator_locator');
{% endhighlight %}

## パッケージにローカライズしたメッセージを設定

translator locator から取得した `PackageLocator` オブジェクトを介して、ローカライズした
メッセージをパッケージに設定することができます。メッセージをセットした `Package` を
作成し、それをコールバックロケーターとして登録します。messagesは メッセージキーと
メッセージ文字列 という形をとります。

{% highlight php %}
<?php
use Aura\Intl\Package;

// package locatorを取得
$packages = $translators->getPackages();

// place into the locator for Vendor.Package
$packages->set('Vendor.Package', 'en_US', function() {
    // アメリカ英語のメッセージセットを作成
    $package = new Package;
    $package->setMessages([
        'FOO' => 'The text for "foo."';
        'BAR' => 'The text for "bar."';
    ]);
    return $package;
});

// place into the locator for a Vendor.Package
$packages->set('Vendor.Package', 'pt_BR', function() {
    // ブラジルのポルトガル語のメッセージセット
    $package = new Package;
    $package->setMessages([
        'FOO' => 'O texto de "foo".';
        'BAR' => 'O texto de "bar".';
    ]);
    return $package;
});
?>
{% endhighlight %}

## デフォルトロケールの設定

`setLocale()` メソッドを使うことで翻訳のデフォルトロケールを設定することできます:

{% highlight php %}
<?php
$translators->setLocale('pt_BR');
?>
{% endhighlight %}

## ローカライズされたメッセージを取得

トランスレーターロケーターはメッセージとデフォルトロケールを持っているので、
単一のパッケージトランスレーターを取得することができます。パッケージトランス
レーターは他のクラスに注入したり、単体での利用に向いています。
サービスを返すトランスレーターヘルパーを作成する必要があるかもしれません。

{% highlight php %}
<?php
// デフォルトロケール pt_BR で呼び出す
$translator = $translators->get('Vendor.Package');
echo $translator->translate('FOO'); // 'O texto de "foo".'
?>
{% endhighlight %}

デフォルトロケール以外のtranslatorを取得することもできます:

{% highlight php %}
<?php
$translator = $translators->get('Vendor.Package', 'en_US');
echo $translator->translate('FOO'); // 'The text for "foo."'
?>
{% endhighlight %}


## メッセージトーケンを値で置き換える

翻訳メッセージではよく動的な値を使う必要があります。はじめに、メッセージ文字列は
動的な値に置き換えるためのトークンプレースホルダーを持つ必要があります。

{% highlight php %}
<?php
// translator locator からpackagesを取得
$packages = $translators->getPackages();

$packages->set('Vendor.Dynamic', 'en_US', function() {

    // アメリカ英語のメッセージ
    $package = new Package;
    $package->setMessages([
        'PAGE' => 'Page {page} of {pages} pages.';
    ]);
    return $package;
});

$packages->set('Vendor.Dynamic', 'pt_BR', function() {
    // ブラジルのポルトガル語メッセージ
    $package = new Package;
    $package->setMessages([
        'PAGE' => 'Página {page} de {pages} páginas.';
    ]);
    return $package;
});
?>
{% endhighlight %}

それから、メッセージの翻訳をするときには、トークンと置換する値の配列を渡します。
そうすればメッセージ文字列に変換されます。

{% highlight php %}
<?php
// デフォルトロケールは pt_BR であることを思い出そう
$translator = $translators->get('Vendor.Dynamic');
echo $translator->translate('PAGE', [
    'page' => 1,
    'pages' => 1,
]); // 'Página 1 de 1 páginas.'
?>
{% endhighlight %}

## 複数形のメッセージ

値が単数形や複数形の場合、通常異なるメッセージを使う必要があります。
`BasicFormatter` は異なるトークン値に応じて異なるメッセージを表示することができません。
`IntlFormatter` *であれば* 表示することができますが、利用するためには PHP
[`intl`](http://php.net/intl) エクステンションが読み込まれている必要があり、
パッケージのカタログに `intl` formatter を記述する必要があります。

次の例のように、`IntlFormatter` を使えば、単数または複数形のメッセージを表示するように
メッセージ文字列を組み立てることができます。

{% highlight php %}
<?php
// translator locatorからpackagesを取得
$packages = $translators->getCatalog();

// of # instead of {pages} herein; using the placeholder
// "inside itself" with the Intl formatter causes trouble.
// en_US ロケールの Vendor.Dynamic パッケージを取得し、複数型の
// メッセージを設定します。ここでは {pages} の代わりに # を使用
// していることに注目してください。Intl formatter において、
//  プレースホルダを "自身の内部で" 使うと問題を引き起こします。
$package->setMessages([
    'PAGE' => '{pages,plural,'
            . '=0{No pages.}'
            . '=1{One page only.}'
            . 'other{Page {page} of # pages.}'
            . '}'
]);

// このパッケージとロケールで 'intl' formatter を使用する
$package->setFormatter('intl');

// 複数形のメッセージを追加したので
// パッケージからアメリカ英語のtranslatorを取得する
$translator = $translators->get('Vendor.Dynamic', 'en_US');

// 0の翻訳
echo $translator->translate('PAGE', [
    'page' => 0,
    'pages' => 0,
]); // 'No pages.'

// 単数形の翻訳
echo $translator->translate('PAGE', [
    'page' => 1,
    'pages' => 1,
]); // 'One page only.'

// 複数形の翻訳
echo $translator->translate('PAGE', [
    'page' => 3,
    'pages' => 10,
]); // 'Page 3 of 10 pages.'
?>
{% endhighlight %}

より複雑なメッセージを組み立てるために、複数形のトークン文字列中で他のトークンを
使うこともできます。詳細については、以下を参照してください。:

<http://icu-project.org/apiref/icu4j/com/ibm/icu/text/MessageFormat.html>
