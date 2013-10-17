---
layout: docs-ja
title: Dependency Injection
permalink: /manuals/v1/ja/di/
---

# Dependency Injection #

Aura DIパッケージが提供するDIコンテナシステムはこのようなの特徴があります。

- コンストラクタの他にもとセッターインジェクションもサポートします。

- サービスはレイジーローディングされます。

- 継承可能なコンストラクタとセッターのパラメーター

ファクトリークラスが合成される時にオブジェクトの構成、オブジェクトの生成、オブジェクトの利用は完全に分離されます。
高い柔軟性とテスト可能性を可能にします。

DIの性質と利点を最大限理解するために、"inversion of control" や "dependency injection"を<http://martinfowler.com/articles/injection.html> by Martin Fowlerで調べて下さい。

## コンテナの生成 ##

Aura DIパッケージは新規のDIインスタンスを返すスクリプトが含まれています：

{% highlight php %}
<?php
$di = require '/path/to/Aura.Di/scripts/instance.php';
{% endhighlight %}

あるいはAura DIの`'src/'`ディレクトリをあなたのオートローダーに追加して、自身でインスタンス生成します：

{% highlight php %}
<?php
use Aura\Di\Container;
use Aura\Di\Forge;
use Aura\Di\Config;

$di = new Container(new Forge(new Config));
{% endhighlight %}

`Container`はDIコンテナです。サポートするオブジェクトは：

- `Config`オブジェクト。セッターやコンストラクタの引き数のコレクションや取得、マージします。

- `Forge` は `Config`の値を使いオブジェクトを生成します。

これらのサポートオブジェクトを直接利用することはありません。 `Container` のメソッドがそれらのオブジェクトをアクセスします。

## サービスの設定 ##

以下の例のではデータベース接続を返すサービスをセットする必要があります。例えばデータベースの接続クラスは以下のようになります：

{% highlight php %}
<?php
namespace Example\Package;

class Database
{
    public function __construct($hostname, $username, $password)
    {
        // ... make the database connection
    }
}
{% endhighlight %}

ごく単純なやり方から洗練された方法に移行するために４つのステップを踏みます。
どのDIコンテナの利用でも利点と弱点があります。

## 方法 1: 早期読み込み (eager loading) ##

この方法では `new` 演算子でインスタンスをつくりサービスを生成します。

{% highlight php %}
<?php
$di->set('database', new \Example\Package\Database(
    'localhost', 'user', 'passwd'
));
{% endhighlight %}

この方法ではサービスを *セットするタイミングで* データベースオブジェクトが作られます。
つまりコンテナから取り出される事がなくても生成されるということです。

## Variation 2: Lazy Loading ##
## 方法 2: 遅延読み込み (lazy loading) ##

この方法では `new` で生成するサービスをクロージャでラップして生成します。

{% highlight php %}
<?php
$di->set('database', function () {
    return new \Example\Package\Database('localhost', 'user', 'passwd');
});
{% endhighlight %}

この方法ではデータベースオブジェクトはコンテナから`$di->get('database')`で *取得* する時に生成されます。
オブジェクト生成をクロージャをラッピングすることでデータベースオブジェクトの読み込みを遅延読み込みする事ができます。

もし`$di->get('database')`を行う事がなければオブジェクトが生成される事はありません。

## Variation 3: Constructor Params ##
## 方法 3:　コンストラクタ引数 ##

この方法では`new` 演算子を取り除きます。その代わりに`$di->newInstance()`メソッドを使用します。
遅延読み込みと同じように生成をクロージャでラップします。

{% highlight php %}
<?php
$di->set('database', function () use ($di) {
    return $di->newInstance('Example\Package\Database', [
        'hostname' => 'localhost',
        'username' => 'user',
        'password' => 'passwd',
    ]);
});
{% endhighlight %}

`newInstance()`メソッドは`Forge`オブジェクトを使ってコンストラクタメソッドを反映させオブジェクトを生成するために使われます。

コンストラクタには 名前-値 とペアになった連想配列を渡します。順序は関係ありません。
存在しないパラメータはクラスコンストラクタで定義されているデフォルトが使われます。


## Variation 4: Class Constructor Params ##
## 方法４: クラスコンストラクタ引数 ##

この方法では`Database` クラスの設定を`Database`オブジェクトの遅延生成から分離して定義します。

{% highlight php %}
<?php
$di->params['Example\Package\Database'] = [
    'hostname' => 'localhost',
    'username' => 'user',
    'password' => 'passwd',
];

$di->set('database', function () use ($di) {
    return $di->newInstance('Example\Package\Database');
});
{% endhighlight %}


オブジェクトの生成プロセスの中で `Forge`クラスは`$di->params`の値をクラスを生成するために調べます。
その値はクラスコンストラクタのデフォルト引数の値とマージされ、コンストラクタに渡します。
（順序は関係ありません。引数の名前が一致するかを調べます）

オブジェクトの設定と生成をうまく分け、またコンテナからサービスオブジェクトが遅延読み込みできています。

## 方法 5: lazyNew() メソッドのコール ##

この方法では`lazyNew()`メソッドをコールして「クロージャを使って新しいインスタンスを返す」と同様の事を行っています。

{% highlight php %}
<?php
$di->params['Example\Package\Database'] = [
    'hostname' => 'localhost',
    'username' => 'user',
    'password' => 'passwd',
];

$di->set('database', $di->lazyNew('Example\Package\Database'));
{% endhighlight %}

## 方法 5a: コンストラクタ引数のオーバーライド##

この方法では インスタンス化する時に使う`$di->params` をオーバーライドします。

{% highlight php %}
<?php
$di->params['Example\Package\Database'] = [
    'hostname' => 'localhost',
    'username' => 'user',
    'password' => 'passwd',
];

$di->set('database', $di->lazyNew('Example\Package\Database', [
    'hostname' => 'example.com',
]);
{% endhighlight %}


インスタンス時に指定する値はコンフィギュレーションでの値（コンストラクタのデフォルトより優先される）より優先されます。

## サービス取得 ##

コンテナからサービスを取得するために `$di->get()`と呼びます。
{% highlight php %}
<?php
$db = $di->get('database');
{% endhighlight %}

これでコンテナからサービスオブジェクトを取り出す事ができます。
もしそれがクロージャなら実行されオブジェクトが生成wqれます。
一旦オブジェクトが生成されるとその後何回取り出そうとしても同じインスタンスが返ります。

## コンストラクタ引数の継承 ##

この例にサンプルに従い`AbstractModel`を追加して、二つのコンクリートクラス`BlogModel`と`WikiModel`を追加します。
全ての`AbstractModel`クラスは 1つまたはそれ以上のテーブルのが必要な`Database`接続を必要としています。

{% highlight php %}
<?php
namespace Example\Package;

abstract class AbstractModel
{
    protected $db;
    
    public function __construct(Database $db)
    {
        $this->db = $db;
    }
}

class BlogModel extends AbstractModel
{
    // ...
}

class WikiModel extends AbstractModel
{
    // ...
}
{% endhighlight %}

`BlogModel` と `WikiModel`を作成します。そしてサービス定義に定義されてるようにそれらにデータベースサービスをインジェクトします。
DIコンテナによいって継承されたコンフィグを使って、クラスコンフィグにあるデータベースサービスを定義します。


{% highlight php %}
<?php
// default params for the Database class
$di->params['Example\Package\Database'] = [
    'hostname' => 'localhost',
    'username' => 'user',
    'password' => 'passwd',
];

// default params for the AbstractModel class
$di->params['Example\Package\AbstractModel'] = [
    'db' => $di->lazyGet('database'),
];

// define the database service
$di->set('database', $di->lazyNew('Example\Package\Database'));

// define the blog_model service
$di->set('blog_model', $di->lazyNew('Example\Package\BlogModel'));

// define the wiki_model service
$di->set('wiki_model', $di->lazyNew('Example\Package\WikiModel'));
{% endhighlight %}

`BlogModel`モデルや`WikiModel`のために直接`'db'`のパラメーターの値をセットしたりすることはありません。
その代わりに`BlogModel` と `WikiModel`クラスは`AbstractModel`クラスを継承するので、`'db'`をコンストラクタ引き数に持つ
全ての`Model`クラスは自動で`'database'` サービスを受け取る事ができます（インスタンス時に行う事もできます）


`lazyGet()`メソッドの利用に注意してください。この特別なメソッドはパラメーターとセッターのために使われます。
もし`$di->get()`を行うとコンテナはその時にサービスをインスタンス化します。
しかしながら`$di->lazyGet()`の利用ではオブジェクトが設定されている場合にのみサービスがインスタンス化されます。
（レイジーロードされる）サービスのレイジーローディングラッパーとして考えてみて下さい。

これらのコンフィギュレーションのため、特別な方法で私たちのクラスを記述する必要はありません。
どのクラスでもコンストラクタのパラメターはコンフィギュレーションによって取り扱われます。
だから`$di->newInstance()`や `$di->lazyNew()`でインスタンス化する事ができるのです。

## ファクトリーと依存解決 ##

我々のアプリケーションのそれぞれのモデルオブジェクトのサービスをつくるのはなかなか大変な事です。
モデルを作る必要はあるかもしれませんが、それぞれが必要とするサービスは別々につくりたくないものです。

加えて説明すると他のオブジェクトからモデルのオブジェクトをつくる必要はあります。
モデルのオブジェクトは本当に必要となるまでつくりたくありません。このためにファクトリーを使う事ができます。

下記のように３つの新しいクラスを定義します：
モデルオブジェクトをつくるファクトリークラス。
モデルファクトリーを使うアブストラクトの`PageController`クラス。
それにブログモデルのインスタンスを必要とする`BlogController`クラス。

モデル名にオブジェクトをつくるファクトリーをマップした`ModelFactory`が、マップされたオブジェクトを生成します。


{% highlight php %}
<?php
namespace Example\Package;

class ModelFactory
{
    // a map of model names to factory closures
    protected $map = [];
    
    public function __construct($map = [])
    {
        $this->map = $map;
    }
    
    public function newInstance($model_name)
    {
        $factory = $this->map[$model_name];
        $model = $factory();
        return $model;
    }
}

abstract class PageController
{
    protected $model_factory;
    
    public function __construct(ModelFactory $model_factory)
    {
        $this->model_factory = $model_factory;
    }
}

class BlogController extends PageController
{
    public function exec()
    {
        $blog_model = $this->model_factory('blog');
        // ... get data from the blog model and return it ...
    }
}
{% endhighlight %}

これでDIコンテナが以下のようにセットアップされています。

{% highlight php %}
<?php
// default params for database connections
$di->params['Example\Package\Database'] = [
    'hostname' => 'localhost',
    'username' => 'user',
    'password' => 'passwd',
];

// default params for the AbstractModel class
$di->params['Example\Package\AbstractModel'] = [
    'db' => $di->lazyGet('database'),
];

// default params for the model factory
$di->params['Example\Package\ModelFactory'] = [
    // a map of model names to model factories
    'map' => [
        'blog' => $di->newFactory('Example\Package\BlogModel'),
        'wiki' => $di->newFactory('Example\Package\WikiModel'),
    ],
];

// default params for page controllers
$di->params['Example\Package\PageController'] = [
    'model_factory' => $di->lazyGet('model_factory'),
];

// the database service; note that we can use lazyNew() and the
// forge will do all the setup for us
$di->set('database', $di->lazyNew('Example\Package\Database'));

// the model factory service
$di->set('model_factory', $di->lazyNew('Example\Package\ModelFactory'));
{% endhighlight %}

`BlogController`のインスタンスを作成して、実行します...


{% highlight php %}
<?php
$blog_controller = $di->newInstance('Aura\Example\BlogController');
echo $blog_controller->exec();
{% endhighlight %}

依存を満たす為に２つのステップでイベントが起こります。
最初のステップは`BlogController`のインスタンス化です。

- `BlogController`インスタンスは`PageController`からパラメーターを継承しています。

- `PageController` のパラメーターは`'model_factory'`サービスを取得します。

- `ModelFactory` パラメーターは`Database` オブジェクトを取得します。この時データベース接続が作られます。

The second step is the invocation of `ModelFactory::newInstance()` within
`BlogController::exec()`:

次のステップでは `ModelFactory::newInstance()`が`BlogController::exec()`の中で実行されます。

- `BlogController::exec()`は `ModelFactory::newInstance()`を実行

- `ModelFactory::newInstance()`は新しいクラスをつくって`Database` オブジェクトを渡します。


これら全てが終わると `BlogController::exec()`メソッドは全てが設定された`BlogModel`オブジェクトをローカルでは何の設定をすることなしに取得することができました。


## Setter Injection ##

これまで、コンストラクタインジェクションの動作を見て来ました。セッターインジェクションも同様に機能します。

以下のサンプルクラスが与えられます...


{% highlight php %}
<?php
namespace Example\Package;

class Foo {

    protected $db;

    public function setDb(Database $db)
    {
        $this->db = $db;
    }
}
{% endhighlight %}

... これでセッターメソッド経由でのインジェクションのための値を設定することができます。

{% highlight php %}
<?php
// after construction, the Forge will call Foo::setDb()
// and inject the 'database' service object
$di->setter['Example\Package\Foo']['setDb'] = $di->lazyGet('database');

// create a foo_service; on get('foo_service'), the Forge will create the
// Foo object, then call setDb() on it per the setter specification above.
$di->set('foo_service', $di->lazyNew('Example\Package\Foo'));
{% endhighlight %}
    
`lazyGet()`をインジェクションのために使ってる事に注意してください。
これはコンストラクタのパラメーターに`Container`で共有しているオブジェクトの代わりに、新しい`Database`オブジェクトを使うように支持しています。

{% highlight php %}
<?php
// after construction, call Foo::setDb() and inject a service object.
// we override the default 'hostname' param for the instantiation.
$di->setter['Example\Package\Foo']['setDb'] = $di->lazyNew('Example\Package\Database', [
    'hostname' => 'example.com',
]);

// create a foo_service; on get('foo_service'), the Forge will create the
// Foo object, then call setDb() on it per the setter specification above.
$di->set('foo_service', $di->lazyNew('Example\Package\Foo'));
{% endhighlight %}
    
セッターの設定は継承されます。もし`Example\Package\Foo` クラスのように継承したクラスなら...

{% highlight php %}
<?php
namespace Example\Package;
class Bar extends Foo
{
// ...
}
{% endhighlight %}

新しいセッターのための値を加える必要はありません。 `Forge` は全ての親クラスのセッターを読み込みそれらに適用します。
（もしセッターの値を追加したなら、親クラスのセッターもオーバーライドされます）

## Conclusion ##

パラメーター、セッター、サービス、ファクトリーで適切に依存を作成することができれば、DIコンテナからは直接オブジェクトを取得するのは１つのオブジェクトだけです。

全てのオブジェクトはファクトリーオブジェクトや`Forge`オブジェクトを通じてDIコンテナから生成されます。オブジェクト作成のためにDIコンテナが必要となることは決してありません。
