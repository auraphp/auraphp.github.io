# The View #

AuraフレームワークはAura.Viewをデフォルトのテンプレートとして使用します。
しかし[Hari.Extras](https://github.com/harikt/Hari.Extras)で行っている様に他のテンプレートシステムを使う事もできます。
Aura Viewパッケージは[`TemplateView`](http://martinfowler.com/eaaCatalog/templateView.html)パターンの実装です。
これには自動エスペープや"path stacks"、ヘルパー等のサポートも含まれています。

「PHPをプレゼンテーションロジックのために使用する」という方針を固持していますが、[`Savant`](http://phpsavant.com)、[`Zend_View`](http://framework.zend.com/manual/en/zend.view.html)、それに
[`Solar_View`](http://solarphp.com/class/Solar_View)などで置き換えることができます。

## Assigning Data from controller ##

    [php]
    $this->data = [
        'foo' => 'value of foo',
        'bar' => 'value of bar',
    ];

`$this`を使ってテンプレートスクリプトからプロパティを利用するこができます。：

    [php]
    // template script
    <?= $this->foo; ?>
    <?= $this->bar; ?>

## Writing Template Scripts ##

Aura Viewテンプレートスクリプトは素のPHPで書かれ新しいマークアップ言語を必要としません。
テンプレートスクリプトは`Template`オブジェクトスコープ内部で実行されます。 
そのとき`$this`は`Template` オブジェクトを指しています。以下にスクリプト例を示します。

    [php]
    <html>
    <head>
        <title><?= $this->title; ?></title>
    </head>
    <body>
        <p><?= "Hello " . $this->var . '!'; ?></p>
    </body>
    </html>

We can use any PHP code we would normally use. (This will require discipline
on the part of the template script author to restrict himself to
presentation-related logic only.)

PHPコードを通常通りに使用します（ここにはプレゼンテーションのためのロジックしか記述しません）
条件分岐やループのための表記はこのようになります。

    [php]
    <?php if ($this->model->hasMessage()): ?>
        <p>The message is <?= $this->model->getMessage(); ?></p>
    <?php endif; ?>

    <ul>
    <?php foreach ($this->list as $item): ?>
        <li><?= $item; ?></li>
    <?php endforeach; ?>
    </ul>

## Escaping Output ##


***Aura View はテンプレートにアサインされたデータをアクセスする時に自動でエスケープ処理が行われます。***通常はテンプレート内で手動で適用する必要はありません

- アサインされた文字列はアクセスに応じて自動的にエスペープされます：
  integers, floats, booleans, それに nulls と not

- もし配列がアサインされたらそのキーと値はアクセスされたときにエスペープされます

- もしオブジェクトがアサインされたらプロパティとメソッドの返り値はアクセスされたときにエスケープされます

ビジネスロジックのデータがテンプレートにアサインされた例です ...

    [php]
    <?php
    /**
     * @var object $obj An object with properties and methods.
     * @var array $arr An associative array.
     * @var string $str A string.
     * @var int|float $num An actual number (not a string representation).
     * @var bool $bool A boolean.
     * @var null $null A null value.
     */
    $this->data = [
        'obj'  => $obj,
        'arr'  => $arr,
        'str'  => $str,
        'num'  => $num,
        'bool' => $bool,
        'null' => null,
    ];


... そしてこれはテンプレートでの自動エスケープの例です。

    [php]
    <?php
    // strings are auto-escaped whenever you access them
    echo $this->str;

    // integers, floats, booleans, nulls, and resources are not escaped
    if ($this->null === null || $this->bool === false) {
        echo $this->num;
    }

    // array keys and values are auto-escaped per the string/number/etc
    // rules listed above
    foreach ($this->arr as $key => $val) {
        // the key and value are already escaped for us
        echo $key . ': ' . $val;
    }

    // object properties and method returns are auto-escaped per the 
    // string/number/etc rules listed above
    echo $this->obj->property;
    echo $this->obj->method();

    // if the object implements Iterator or IteratorAggregate,
    // the iterator keys and values are auto-escaped as well
    foreach ($this->obj as $key => $val) {
        echo $key . ': ' . $val;
    }

エスケープは*アクセス*時に行われ、*アサイン*の時では無いのに注意してください。
*テンプレートにアサインされた値*にアクセスした時のみに行われます。

## Manual Escaping ##

もしテンプレート内で作成した値があれば、`escape()` ヘルパーを使って自身でエスケープする必要があります。

    [php]
    <?php
    $var = "this & that";
    echo $this->escape($var);


## Raw Data ##

もしエスケープしない値をアクセスしたときには`__raw()`メソッドを使います。

    [php]
    <?php
    // get the raw assigned string
    echo $this->__raw()->str;

    // get the count of an assigned array or object
    echo count($this->__raw()->arr);

    // see if the assigned array is empty
    if (! $this->__raw()->arr) {
        echo "Array is empty.";
    }

    // get a raw property from an assigned object;
    // either of the following will work:
    echo $this->__raw()->obj->property;
    echo $this->obj->__raw()->property;

    // get a raw method result from an assigned object;
    // either of the following will work:
    echo $this->__raw()->obj->method();
    echo $this->obj->__raw()->method();

    // check if an object is an instanceof SomeClass
    if ($this->__raw()->obj instanceof SomeClass) {
        // ...
    }


配列や`Countable`オブジェクトから`count()`を求めるには生の値が必要です。
これは元の値にエスケープをするオブジェクトがラッピング（デコレーティング）され自動エスケープが行われてしまうためです。
このデコレーションは配列のキーと値、オブエクとのプロパティとメソッドに対して自動エスケープする事を可能にしますが、
一方`implements` や `instanceof`といった事ができる機能が利用できなくなってしまいます事に注意が必要です。

## Double Escaping ##

There is an escaping "gotcha" to look out for when manipulating values after
they are assigned to a template. If you use an assigned value and re-assign
it to the template, the new value will be double-escaped when you access it.

テンプレートにアサインされた後の値を操作したときに、エスケープが面倒な事にならないように注意する必要がありあmす。
もしアサインされた値を再びアサインすると新しい値はアクセスしたときに二重エスケープされてしまうでしょう。

例えばこのようなビジネスロジックが与えられたとします ...

    [php]
    <?php
    // business logic
    $this->data->foo = "this & that";

    
.. テンプレートスクリプトはこれです ...

    [php]
    <?php
    // template script
    $this->bar = $this->foo . " & the other";
    echo $this->bar;

... この時、アウトプットは二重エスケープされた`"this &amp;amp; that &amp; the other"`になってしまいます。
これは`$this->foo` をアクセスしたときにエスケープされた後、出力のときに`$this->bar`がアクセスされたときに
更に自動エスケープされてしまうためです。

`__raw()`このような操作を行うときには`__raw()`の値を使います：


    [php]
    <?php
    // template script
    $this->bar = $this->__raw()->foo . " & the other";
    echo $this->bar;


これで出力は`"this &amp; that &amp; the other"`と正しく一度だけ行われる様になりました。

## Using Helpers ##

Aura View は様々な `Helper` クラスを共通のプレゼンテーションロジックに利用する事ができます。
これらのヘルパーは`Template`オブジェクトに`HelperLocator`を通じてマップされています。
コールする方法は二通りです：

- `Template` オブジェクトのメソッドとして

- オブジェクトがもつ`getHelper()`でヘルパーを取得します 

We have already discussed the `escape()` helper above. Other helpers that are
part of Aura View include:
`escape()`ヘルパーを利用した例は見てきました。Aura Viewの他のヘルパーは以下のようなものがあります。

- `$this->anchor($href, $text)`は`<a href="$href">$text</a>`タグを返します。

- `$this->attribs($list)`は`$list`からキー/バリューのペアの空白区切りのリストを返します。

- `$this->base($href)`は `<base href="$href" />`タグを返します。

- `$this->datetime($datestr, $format)`はフォーマットされたdatetime文字列を返します。

- `$this->image($src)` は `<img src="$src" />` タグを返します。

- `$this->input($attribs, $value, $label, $label_attribs)` は `<input>`タグを返しますが、オプションで `<label>` タグを返す事もできます。
   `$this->input(['type' => $type], $value, $label, $label_attribs)` の中で `$value`, `$label` and `$label_attribs` はオプションです。
    
    Supported types:
　　サポートするタイプ
　　
    - `button` : クリックできるボタン
    - `checkbox` : チェクボックス
    - `color` : カラーピッカー
    - `date` : 日付コントロール（年、月、日）
    - `datetime` : 日付と時間のコントロール（年、月、日、時間、分、秒、秒以下の値、UTCタイムゾーン）
    - `datetime-local` : 日付と時間のコントロール（年、月、日、時間、分、秒、秒以下の値、タイムゾーンは含まない）
    - `email` : e-mailアドレス
    - `file` : ファイルアップロードのための"Browse..." ボタン
    - `hidden` : hiddenインプットフィールド
    - `image` : サブミット用の画像 
    - `month` : 月日コントロール(タイムゾーンなし)
    - `number` : 数値入力
    - `password` : パスワードフィールド
    - `radio` : ラジオボタン
    - `range` : 正確な値を必要としない（スライダーのような）数値入力コントロール
    - `reset` : リセットボタン（全てのフォームをデフォルト値にリセット）
    - `search` : 検索文字列を入力するためのテキストフィールド
    - `submit` : 送信ボタン
    - `tel` : 電話番号
    - `text` : (デフォルト) 単一行のテキストフィールド
    - `time` : タイムコントロール（タイムゾーンなし）
    - `url` : URLフィールド
    - `week` : 週と年のコントロール (タイムゾーンなし)
    
    このような例になります
    
    - `$this->input(['type' => 'text', ... ], 'field value')`
    
    - `$this->input(['type' => 'checkbox', 'value' => 'yes'], 'yes')`


- `$this->metas()` は`<meta ... />` タグを取得したり追加できるオブジェクトを用意します。

    - `$this->metas()->addHttp($http_equiv, $content)`  HTTP-equivalent メタタグをヘルパーに追加します。

    - `$this->metas()->addName($name, $content)` メタ名のタグをヘルパーに追加します
    
    - `$this-metas()->get()` 追加された全てのタグを取得します。


    - `$this->scripts()` は`<meta ... />` タグを取得したり追加できるオブジェクトを用意します。` タグを取得したり追加できるオブジェクトを用意します。

    - `$this->scripts()->add($src)` はヘルパーにスクリプトタグを追加します。
    
    - `$this->scripts()->addCond($exp, $src)` 条件式のスクリプトタグを追加します。
    
    - `$this->scripts()->get()` ヘルパーに追加された全てのタグを返します。
    

- `$this->styles()` provides an object with methods that add to, and then
  retrieve, a series of `<link rel="stylesheet" ... />` tags.

    - `$this->styles()->add($href)` adds a style tag to the helper.
    
    - `$this->styles()->get()` returns all the added tags from the helper.


- `$this->textarea($attribs, $html)` Returns a `<textarea>`. `$html` is optional.

- `$this->title()` provides an object with methods that manipulate the
  `<title>...</title>` tag.

    - `$this->title()->set($title)` sets the title value.
    
    - `$this->title()->append($suffix)` adds on to the end of title value.
    
    - `$this->title()->prepend($prefix)` adds on to the beginning of the title
      value.
    
    - `$this->title()->get()` returns the title tag and value.


## Template Composition ##

It often makes sense to split one template up into multiple pieces. This
allows us to keep logical separations between different pieces of content. We
might have a header section, a navigation section, a sidebar, and so on.

We can use the `$this->find()` method in a template script to find a template,
and then `include` it wherever we like. For example:

    [php]
    <html>
    <head>
        <?php include $this->find('head'); ?>
    </head>
    <body>
        <?php include $this->find('branding'); ?>
        <?php include $this->find('navigation'); ?>
        <p>Hello, <?= $this->var; ?>!</p>
        <?php include $this->find('foot'); ?>
    </body>
    </html>


Templates that we `include` in this way will share the scope of the template
they are included from.


## Template Partials ##

Template partials are a scope-separated way of splitting up templates. In
doing so, we can pass an array of variables to be used in the partial
template; they will be available under `$this` **in place of** the parent
template variables. For example, given the following partial template ...

    [php]
    <?php
    // partial template named '_item.php'.
    echo "    <li>{$this->item}</li>" . PHP_EOL;


... we can use it from within another template as a partial:

    [php]
    <?php
    // main template. assume $this->list is an array of items.
    foreach ($this->list as $item) {
        $template_name = '_item';
        $template_vars = ['item' => $item];
        echo $this->partial($template_name, $template_vars);
    }


That will run the `$template_name` template script in a separate scope, and
the `$template_vars` array will be available as `$this` properties within that
separate scope.

> N.b.: We can also `fetch()` other templates from within a template;
> template scripts that are fetched in this way will *not* share the scope
> of the template they are called from (although `$this` will still be
> available).


## Writing Helpers ##

There are two steps to adding new helpers:

1. Write a helper class

2. Add that class as a service in the `HelperLocator`

Writing a helper class is straightforward: extend `AbstractHelper` with an
`__invoke()` method. The following helper, for example, applies ROT-13 to a
string.

    [php]
    <?php
    namespace Vendor\Package\View\Helper;
    
    use Aura\View\Helper\AbstractHelper;
    
    class Obfuscate extends AbstractHelper
    {
        public function __invoke($string)
        {
            return str_rot13($input);
        }
    }


Now that we have a helper class, you can add it as a service in the
`HelperLocator` like so:

    [php]
    <?php
    // business logic
    $di->params['Aura\View\HelperLocator']['registry']['obfuscate'] = function () use ($di) {
        return $di->newInstance('Vendor\Package\View\Helper\Obfuscate');
    };
    
The service name in the `HelperLocator` doubles as a method name on the
`Template` object. This means we can call the helper via `$this->obfuscate()`:

    [php]
    <?php
    // template script
    echo $this->obfuscate('plain text');


Note that we can use any method name for the helper, although it is generally
useful to name the service for the helper class.

Please examine the classes in `Aura\View\Helper` for more complex and powerful
examples.
