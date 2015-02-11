---
layout: docs2-ja
title: 国際化
permalink: /manuals/2.0/ja/intl/
previous_page: バリデーション
previous_page_url: /manuals/2.0/ja/validation/
next_page: セッション
next_page_url: /manuals/2.0/ja/session/
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

次のように修正しているメソッド中で `intl_translator_locator` サービスを取得することができます。


{% highlight bash %}
$translators = $di->get('intl_translator_locator');
{% endhighlight %}

## パッケージにローカライズしたメッセージを設定

We can set localized messages for a package through the `PackageLocator` object
from the translator locator. We create a new `Package` with messages and place
it into the locator as a callable. The messages take the form of a message key and
and message string.

{% highlight php %}
<?php
use Aura\Intl\Package;

// package locatorを取得
$packages = $translators->getPackages();

// place into the locator for Vendor.Package
$packages->set('Vendor.Package', 'en_US', function() {
    // create a US English message set
    $package = new Package;
    $package->setMessages([
        'FOO' => 'The text for "foo."';
        'BAR' => 'The text for "bar."';
    ]);
    return $package;
});

// place into the locator for a Vendor.Package
$packages->set('Vendor.Package', 'pt_BR', function() {
    // a Brazilian Portuguese message set
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
レーターは他のクラスに注入したり、スタンドアローンの利用に向いています。
サービスを返すトランスレーターヘルパーを作成する必要があるかもしれません。

{% highlight php %}
<?php
// recall that the default locale is pt_BR
$translator = $translators->get('Vendor.Package');
echo $translator->translate('FOO'); // 'O texto de "foo".'
?>
{% endhighlight %}

You can get a translator for a non-default locale as well:

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
// get the packages out of the translator locator
$packages = $translators->getPackages();

$packages->set('Vendor.Dynamic', 'en_US', function() {

    // US English messages
    $package = new Package;
    $package->setMessages([
        'PAGE' => 'Page {page} of {pages} pages.';
    ]);
    return $package;
});

$packages->set('Vendor.Dynamic', 'pt_BR', function() {
    // Brazilian Portuguese messages
    $package = new Package;
    $package->setMessages([
        'PAGE' => 'Página {page} de {pages} páginas.';
    ]);
    return $package;
});
?>
{% endhighlight %}

Then, when we translate the message, we provide an array of tokens and
replacement values.  These will be interpolated into the message string.

{% highlight php %}
<?php
// recall that the default locale is pt_BR
$translator = $translators->get('Vendor.Dynamic');
echo $translator->translate('PAGE', [
    'page' => 1,
    'pages' => 1,
]); // 'Página 1 de 1 páginas.'
?>
{% endhighlight %}

## 複数形のメッセージ

値が単数形や複数形の場合、普通は異なるメッセージを使う必要があります。
`BasicFormatter` は異なるトークン値に基づいた異なるメッセージを表示することができません。
`IntlFormatter`は表示することができますが、利用するためには PHP [`intl`](http://php.net/intl)
エクステンションが読み込まれている必要があり、 カタログにパッケージ向けの `intl` formatter
を記述する必要があります。

When using the `IntlFormatter`, we can build our message strings to present
singular or plural messages, as in the following example:

{% highlight php %}
<?php
// get the packages out of the translator locator
$packages = $translators->getCatalog();

// get the Vendor.Dynamic package en_US locale and set
// US English messages with pluralization. note the use
// of # instead of {pages} herein; using the placeholder
// "inside itself" with the Intl formatter causes trouble.
$package->setMessages([
    'PAGE' => '{pages,plural,'
            . '=0{No pages.}'
            . '=1{One page only.}'
            . 'other{Page {page} of # pages.}'
            . '}'
]);

// use the 'intl' formatter for this package and locale
$package->setFormatter('intl');

// now that we have added the pluralizable messages,
// get the US English translator for the package
$translator = $translators->get('Vendor.Dynamic', 'en_US');

// zero translation
echo $translator->translate('PAGE', [
    'page' => 0,
    'pages' => 0,
]); // 'No pages.'

// singular translation
echo $translator->translate('PAGE', [
    'page' => 1,
    'pages' => 1,
]); // 'One page only.'

// plural translation
echo $translator->translate('PAGE', [
    'page' => 3,
    'pages' => 10,
]); // 'Page 3 of 10 pages.'
?>
{% endhighlight %}

Note that you can use other tokens within a pluralized token string to build
more complex messages. For more information, see the following:

<http://icu-project.org/apiref/icu4j/com/ibm/icu/text/MessageFormat.html>
