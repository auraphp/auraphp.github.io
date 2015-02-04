---
layout: docs-ja
title: Validation and Sanitization
permalink: /manuals/2.0/ja/validation/
---

# バリデーションとサニタイゼーション #

Aura Filterパッケージはデータオブジェクトと配列のためのバリデーションとサニタイゼーションの機能を提供します。

## データオブジェクトに対するルールの適用 ##

### ソフト、ハード、ストップルール ###

三種類のルール処理を適用することができます。

- `addSoftRule()`メソッドはソフトなルールを追加します：もしこのルールが失敗しても
そのフィールドに残っているフィルターと他の全てのフィールドに適用します。

- `addHardRule()`はハードなルールを加えます。もし失敗するとフィルターはそれ以上、
他のルールはそのフィールドに適用しませんが他のフィールドには適用します。

- `addStopRule()` メソッドは停止するルールを加えます。もしルールが失敗するとデータオブジェクトに対する
全てのフィルターを停止します。


## バリデーションとサイニタイジング ##

これらの条件ののうち一つをルールに適用してデータをバリデーションします：

- `RuleCollection::IS`はフィールドの値がルールにマッチしなければなりません。

- `RuleCollection::IS_NOT`はフィールドの値がルールにマッチ*してはなりません*。

- `RuleCollection::IS_BLANK_OR`はフィールドの値がblank*または*ルールにマッチするか。
これはフィールドの値がオプションの時に便利です。

以下の変換のうち一つをルールに適用してデータをサニタイズします。

- `RuleCollection::FIX`はフィールドの値を強制的に適合し変換してしまいます。
いくつかの変換は不可能で、その場合はフィールドはエラーメッセーになります。

- `RuleCollection::FIX` to force the field value to comply with the
  rule; this may forcibly transform the value. Some transformations are not
  possible, so sanitizing the field may result in an error message.

- `RuleCollection::FIX_BLANK_OR`はブランクの値を`null`に変えます；ブランクでないフィールドはルールが強制的に適用されます。
これはルールに適用するかしないか定かでないオプションのフィールド値のサニタイズに便利です。

それぞれのフィールドが適切にサニタイズされます; （つまりデータオブジェクトは適切に直接変更されます）

## ブランクの値 ##

Aura Filterには`isset()` や `empty()`ではない"blank"値のコンセプトがあります。
もしそれが`null`であったり空文字列やホワイトスペースの文字列だけで構成されていたならそうです。
以下もまたブランクです：

{% highlight php %}
<?php
$blank = [
    null,           // a null value
    '',             // an empty string
    " \r \n \t ",   // a whitespace-only string
];
{% endhighlight %}

Integers、floats、boolean、それに他の文字列でないものは決してブランクになることはありません。もしそれがゼロと評価されてもです：

{% highlight php %}
<?php
$not_blank = [
    0,              // integer
    0.00,           // float
    false,          // boolean false
    [],             // empty array
    (object) [],    // an object
];
{% endhighlight %}

## 利用可能なルール ##

- `alnum`: alphanumeric（文字列と数字）のみの値。alphanumeric文字だけを残します；
仕様法：

        $filter->addSoftRule('field', $filter::IS, 'alnum');

- `alpha`: アルファベットの値のみ。アルファベット文字列だけを残します。
仕様法：

        $filter->addSoftRule('field', $filter::IS, 'alpha');

- `between`: 値を最少から最大の値の値にバリデートします。
もしレンジ以下の値があれば強制的に最小値に、レンジ以上の値があれば最大値になります。
仕様法：

        $filter->addSoftRule('field', $filter::IS, 'between', $max, $min);

- `blank`: Validate the value as being blank. Sanitize to `null`. Usage:
- `blank`: ブランクとしてバリデートし、`null`にサニタイズします。
仕様法：
        $filter->addSoftRule('field', $filter::IS, 'blank');

- `bool`: booleanとしてバリデート、または'1','y','yes'それに'true'などをbooleanに見立ててバリデーとします;
'0', 'n', 'no', それに 'false'はfalseになります。PHPのstrictなbooleanもサニタイズします。
仕様法：

        $filter->addSoftRule('field', $filter::IS, 'bool');

- `creditCard`: クレジットカード番号としてバリデートします。値はサニタイズされません。
仕様法：

        $filter->addSoftRule('field', $filter::IS, 'creditCard');

- `dateTime`: dateやtimeを表す値としてバリデートされます。特定のフォーマットとしてもサニタイズされます。
デフォルトは`'Y-m-d H:i:s'`です。
仕様法（これはバリデーションではなくサニタイズです）：

        $filter->addSoftRule('field', $filter::FIX, 'dateTime', $format);

- `email`: 値を適切な形のemailアドレスとしてバリデーションっします。サニタイズはしません.
仕様法:

        $filter->addSoftRule('field', $filter::IS, 'email');

- `equalToField`: 値をデータオブジェクトの他の値と厳密でない方法で同値かバリデーションします。
仕様法:

        $filter->addSoftRule('field', $filter::IS, 'equalToField', 'other_field_name');

- `equalToValue`: 特定の値と厳密でない方法で同値かバリデーションします。特定の値にサニタイズされます。
仕様法:

        $filter->addSoftRule('field', $filter::IS, 'equalToValue', $other_value);

- `float`: floatかバリデーションします。値はfloatに変換されます。
仕様法:

        $filter->addSoftRule('field', $filter::IS, 'float');

- `inKeys`: 与えられた配列と厳密ではない方法で同値がバリデーションします。値はサニタイズされません。
仕様法:

        $filter->addSoftRule('field', $filter::IS, 'inKeys', $array);

- `inValues`: 与えられた配列と厳密な方法で同値がバリデーションします。値はサニタイズされません。
仕様法:

        $filter->addSoftRule('field', $filter::IS, 'inValues', $array);
        
- `int`: 値は整数としてバリデーションされます。値は整数にサニタイズされます。
仕様法:

        $filter->addSoftRule('field', $filter::IS, 'int');

- `ipv4`: 値はIPv4アドレスとしてバリデーションされます。値はサニタイズされません。
仕様法:

        $filter->addSoftRule('field', $filter::IS, 'ipv4');
        
- `locale`: 値はlocale文字列のリストとしてバリデーションされます。もしfalseがかえされなければ値はサニタイズされません。
仕様法:

        $filter->addSoftRule('field', $filter::IS, 'locale');

- `locale`: 値は最大値以下としてバリデーションされます。値は最大値にサニタイズされます。
仕様法:

        $filter->addSoftRule('field', $filter::IS, 'max', $max);

- `min`: 値は最大値以上としてバリデーションされます。値は最少値にサニタイズされます。
仕様法:

        $filter->addSoftRule('field', $filter::IS, 'min', $min);

- `regex`: `preg_match()`を使ってバリデーとされます. `preg_match()`を使った値にサニタイズされます。
仕様法:

        $filter->addSoftRule('field', $filter::IS, 'regex', $expr);
        
- `strictEqualToField`: データオブジェクトの他の値と厳密に同値かバリデーションされます。値はその他のフィールドにサニタイズされます。
仕様法:

        $filter->addSoftRule('field', $filter::IS, 'strictEqualToField', 'other_field_name');

- `equalToValue`: 特定の値と厳密な方法で同値かバリデーションします。特定の値にサニタイズされます。
仕様法:

        $filter->addSoftRule('field', $filter::IS, 'strictEqualToValue', $other_value);

- `string`: 文字列としてバリデーションされます。値は文字列にキャストされオプションで`str_replace().`を使われます。
仕様法:（これはサニタイズでバリデーションではありません）

        $filter->addSoftRule('field', $filter::FIX, 'string', $find, $replace);
    
- `strlen`: 特定の長さをもつ値としてバリデーションされます。その長さにサニタイズされ短い場合には`str_pad()`が使われサニタイズされます。
仕様法:

        $filter->addSoftRule('field', $filter::IS, 'strlen', $len);

- `strlenBetween`: 特定の長さの値にバリデーションされます。最大値より長い場合は値がカットされ、短い場合には`str_pad()`が使われサニタイズされます。
仕様法:

        $filter->addSoftRule('field', $filter::IS, 'strlenBetween', $min, $max);
        
- `strlenMax`: 文字列の長さが最大値を超えないようにバリデーションされます。最大値より長い場合は値がカットされます。
仕様法:

- `strlenMax`: Validate the value length as being no longer than a maximum.
  Sanitize the value to cut off values longer than the maximum. Usage:

        $filter->addSoftRule('field', $filter::IS, 'strlenMax', $max);
        
- `strlenMin`: 文字列の長さ最小値を下回らないようにバリデーションされます。最小値より短い場合には`str_pad()`が使われサニタイズされます。
仕様法:

        $filter->addSoftRule('field', $filter::IS, 'strlenMin', $min);
        
- `trim`: `trim()`メソッドを使ってバリデートされます。`trim()` によってサニタイズされます。オプションでtrimするキャラクターを指定する事が出来ます。
仕様法:

        $filter->addSoftRule('field', $filter::IS, 'trim', $chars);
        
- `upload`: PHPのアップロード情報配列としてバリデーションされます。ファイルはアップロードされたファイルです。これはサニタイズされません。
仕様法:

        $filter->addSoftRule('field', $filter::IS, 'upload');

- `url`: 値をWell-Formed（整形式）のURLとしてバリデーションします。これはサニタイズされません。
仕様法:

        $filter->addSoftRule('field', $filter::IS, 'url');

- `url`: 値を`word characters`で構成された値としてバリデーションします。これはサニタイズされません。
仕様法:

        $filter->addSoftRule('field', $filter::IS, 'word');

- `url`: 値を正しい`isbn` (International Standard Book Number)としてバリデーションします。
仕様法:

        $filter->addSoftRule('field', $filter::IS, 'isbn');

- `any`: 値を指定のルールのいずれか一つ適用されるかバリデーションします。ルールは指定されたルールのいずれかです。

        $filter->addSoftRule('field', $filter::IS, 'any', [
                ['alnum'],
                ['email'],
                // more rules
            ]
        );

- `all`: 値を指定のルールセットでバリデーションします。エラーメッセージを個別にする事はできません。

        $filter->addSoftRule('field', $filter::IS, 'all', [
                // rules
            ]
        );
        
## カスタムメッセージ ##

デフォルトではルールが失敗するとメッセージは`intl/en_US.php`から取得します。しかし全ての失敗に対して１つのカスタムメッセージを使う事もできます。


{% highlight php %}
$filter->useFieldMessage('field', 'Custom Message');
{% endhighlight %}

例:

{% highlight php %}
$filter->addSoftRule('username', $filter::IS, 'alnum');
$filter->addSoftRule('username', $filter::IS, 'strlenBetween', 6, 12);
$data = (object) [
    'username' => ' sds',
];

$filter->useFieldMessage('username', 'User name already exists');
// filter the object and see if there were failures
$success = $filter->values($data);
if (! $success) {
    $messages = $filter->getMessages();
    var_export($messages);
}
{% endhighlight %}

As you have used `useFieldMessage` you will see 

{% highlight php %}
array (
  'username' => 
  array (
    0 => 'User name already exists',
  ),
)
{% endhighlight %}

instead of 

{% highlight php %}
array (
  'username' => 
  array (
    0 => 'Please use only alphanumeric characters.',
    1 => 'Please use between 6 and 12 characters.',
  ),
)
{% endhighlight %}

## カスタムルールの作成と利用 ##

新しいルールを使うために３つのステップがあります。

1. ルールクラスの記述

2. `RuleLocator`のサービスとしてそのクラスをセットする

3. フィルターチェーンで新しいルールを使う

## ルールクラスの記述 ##

ルールクラスの記述は明快です。

- `Aura\Filter\AbstractRule`をextendして`validate()` と `sanitize()`の２つのメソッドを追加します。

- それぞれのメソッドに必要なパラメーターを加えます。

- それぞれのメソッドはbooleanを返すようにします。trueが成功。falseは失敗です。

- バリデートするためには値を `getValue()`で取得します。サニタイズした値は`setValue()` でセットすることができます。

- `$message`プロパティを加えてバリデーションやサニタイズが失敗したときのメッセージを用意することができます。翻訳にも使えます。

hexadecimalのためのルールサンプルです。

{% highlight php %}    
<?php
namespace Example\Package\Filter\Rule;

use Aura\Filter\AbstractRule;

class Hex extends AbstractRule
{
    protected $message = 'FILTER_HEX';
    
    public function validate($max = null)
    {
        // must be scalar
        $value = $this->getValue();
        if (! is_scalar($value)) {
            return false;
        }
    
        // must be hex
        $hex = ctype_xdigit($value);
        if (! $hex) {
            return false;
        }
    
        // must be no longer than $max chars
        if ($max && strlen($value) > $max) {
            return false;
        }
    
        // done!
        return true;
    }

    public function sanitize($max = null)
    {
        // must be scalar
        $value = $this->getValue();
        if (! is_scalar($value)) {
            // sanitizing failed
            return false;
        }
    
        // strip out non-hex characters
        $value = preg_replace('/[^0-9a-f]/i', '', $value);
        if ($value === '') {
            // failed to sanitize to a hex value
            return false;
        }
    
        // now check length and chop if needed
        if ($max && strlen($value) > $max) {
            $value = substr($value, 0, $max);
        }
    
        // retain the sanitized value, and done!
        $this->setValue($value);
        return true;
    }
}
{% endhighlight %}

## サービスとしてクラスをセット ##

最初に`RuleLocator`にクラスをセットします。

{% highlight php %}
<?php
$locator = $filter->getRuleLocator();
$locator->set('hex', function () {
    return new Example\Package\Filter\Rule\Hex;
});
{% endhighlight %}

## 新しいルールの適用 ##

最後にフィルターでそのルールを使います。

{% highlight php %}
<?php
// the 'color' field must be a hex value of no more than 6 digits
$filter->addHardRule('color', $filter::IS, 'hex', 6);
{% endhighlight %}

以上です！！
