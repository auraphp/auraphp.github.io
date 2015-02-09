---
layout: docs2-ja
title: Dependency Injection
permalink: /manuals/2.0/ja/di/
previous_page: Response
previous_page_url: /manuals/2.0/ja/response/
next_page: View
next_page_url: /manuals/2.0/ja/view/
---

# ディペンデンシー・インジェクション

Aura.Diは以下の機能があるデペンデンシーテンテナシステムです。

* コンストラクター＆セッターインジェクション

*タイプヒントされたコンストラクタ引数の明示的、非明示的な自動解決

* インターフェイスとトレイトによるコンフィギュレーション

* コンストラクタ引数とセッターメソッドの値の継承

* サービス、値、インスタンスの遅延評価

* インスタンスファクトリー

この章では簡単にするためにコンストラクターとセッタージェクションを取り上げます。
[Aura.Di documentation](https://github.com/auraphp/Aura.Di/blob/develop-2/README.md)を読むことをお勧めします。

## サービスのセットと取得

"サービス"は_コンテナ_にユニークな名前をつけて格納されるオブジェクトです。
名付けられたサービスはいつでも `get()` することができ、いつでも同じオブジェクトのインスタンスが取得できます。

{% highlight php %}
<?php
// Exampleクラスを定義
class Example
{
    // ...
}

// サービスをセットする
$di->set('service_name', new Example);

//　サービスを取得する
$service1 = $di->get('service_name');
$service2 = $di->get('service_name');

// ２つのサービスは同一
var_dump($service1 === $service2); // true
?>
{% endhighlight %}

この使い方はサービスをセットしたときと同じ_Example_インスタンスをつくるのには素晴らしい、しかし*セット*した時でなく、*取得*する時のインスタンスが欲しい場合もあります。

The technique of delaying instantiation until `get()` time is called "lazy loading." To lazy-load an instance, use the `lazyNew()` method on the _Container_ and give it the class name to be created:
このテクニックは

{% highlight php %}
<?php
// 遅延評価されるインスタンスとしてサービスをセットする
$di->set('service_name', $di->lazyNew('Example'));
?>
{% endhighlight %}

Now the service is created only when we we `get()` it, and not before.
This lets us set as many services as we want, but only incur the overhead of creating the instances we actually use.
サービスはあらかじめつくられるものではなく、`get()`の時に作られるようになりました。
実際に使うときだけオーバーヘッドがかかります。

## コンストラクターインジェクション

_コンテナ_から新しいオブジェクトを生成するときに、様々な方法でコンストラクタ引数にインジェクト（セット）する必要があります。

## 引数のデフォルト値

`$di->params`配列を使って_Container_にデフォルト値を定義することができます。

コンストラクタ引数を必要とするクラスをみてみましょう。

{% highlight php %}
<?php
class ExampleWithParams
{
    protected $foo;
    protected $bar;
    public function __construct($foo, $bar)
    {
        $this->foo = $foo;
        $this->bar = $bar;
    }
}
?>
{% endhighlight %}

この場合、`$di->lazyNew('ExampleWithParams')`を使ってサービスをセットするとインスタンス生成は失敗します。`$foo`引数が必要で_Container_はどうやって値を用意するのか分かりません。

To remedy this, we tell the _Container_ what values to use for
each _ExampleWithParams_ constructor parameter by name using the `$di->params` array:

これに対処するためには、 _ExampleWithParams_クラスのコンストラクタ引数に`$di->params`配列を使って_Container_クラスに伝えます。

{% highlight php %}
<?php
$di->params['ExampleWithParams']['foo'] = 'foo_value';
$di->params['ExampleWithParams']['bar'] = 'bar_value';
?>
{% endhighlight %}

Now when a service is defined with `$di->lazyNew('ExampleWithParams')`,
the instantiation will work correctly. Each time we create an
_ExampleWithParams_ instance through the _Container_, it will apply
the `$di->params['ExampleWithParams']` values.

サービスが`$di->lazyNew('ExampleWithParams')`で定義されると、正しくインスタンス生成されます。
_Container_を通じて_ExampleWithParams_インスタンスを作るたびに`$di->params['ExampleWithParams']`の値が適用されます。

## 特定インスタンスの引数値

特定の新しいインスタンスのために`$di->params`のデファルトの値を上書きしたいときには、
`$params`配列の２番目の引数で`lazyNew()`をデフォルトの値にマージします。

例）

{% highlight php %}
<?php
$di->set('service_name', $di->lazyNew(
    'ExampleWithParams',
    array(
        'bar' => 'alternative_bar_value',
    )
));
?>
{% endhighlight %}

`$foo`引数をデフォルトのままにしますが、_ExampleWithParams_がインスタンス化されるときに`$bar`引数の値が上書きされます。

## 引数の値として遅延評価されるサービス

クラスは他のサービスを引数として必要とすることがあります。
例えば、以下のクラスはデータベース接続が必要です。


{% highlight php %}
<?php
class ExampleNeedsService
{
    protected $db;
    public function __construct($db)
    {
        $this->db = $db;
    }
}
?>
{% endhighlight %}

共有されるサービスとして引数にインジェクトするためには`$di->lazyGet()`を使います。
その場合_ExampleNeedsService_オブジェクトがつくられるまでサービスオブジェクトはつくられません。


{% highlight php %}
<?php
$di->params['ExampleNeedsService']['db'] = $di->lazyGet('db_service');
?>
{% endhighlight %}

これはサービスが必要とされる時まで作成されません。（もしサービスが必要でなければ生成されません）

## セッターインジェクション

コンストラクターインジェクションに加えてセッターインジェクションもサポートします。

## セッターメソッドの値


_Container_が新しいオブジェクトのインスタンスを作成したあとに、特定のメソッドに特定の値を`$di->setter`配列に渡して呼ぶことができます。
例えば以下のようなクラスを考えてみます。

{% highlight php %}
<?php
class ExampleWithSetter
{
    protected $foo;

    public function setFoo($foo)
    {
        $this->foo = $foo;
    }
}
?>
{% endhighlight %}

We can specify that, by default,
the `setFoo()` method should be called with a specific value after construction like so:

`setFoo()`メソッドはコンストラクタの後に特定の値で呼ばれれます。


{% highlight php %}
<?php
$di->setter['ExampleWithSetter']['setFoo'] = 'foo_value';
?>
{% endhighlight %}

値は何でも有効です。リテラルや`lazyNew()`、 `lazyGet()`を呼ぶことなどです。

しかしながらauto-resolutioんはセッターメソッドには*適用できません*
なぜなら、これは_Container_がどのメソッドがセッターメソッドで、どれが”普通の"メソッドか分からないためです。

明示的に定義されたセッターメソッドに限って利用できます。

## インスタンスに特定されたセッター値

コンストラクターインジェクションで行ったように、特定のデフォルトの値をセッターインジェクションでも指定することができます。
三番の引数に`$di->lazyNew()`で指定します。

例）

{% highlight php %}
<?php
$di->set('service_name', $di->lazyNew(
    'ExampleWithSetters',
    array(), // no $params overrides
    array(
        'setFoo' => 'alternative_foo_value',
    )
));
?>
{% endhighlight %}
