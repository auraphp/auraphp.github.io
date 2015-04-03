---
layout: docs-ja
title: Creating Forms
permalink: /framework/1.x/ja/forms/
---

# フォーム作成 #

webページにはフォームが必要です。ディペンデンシーインジェクションのチャプターをお読みください。

## フォームクラス ##

フォームを作る為に`Aura\Input\Form`クラスを拡張して`init()`メソッドをオーバーライドする必要があります。

`setField`を使ってinput typeを加えます。

サンプルのフォームを作ってみましょう
FormFactory
{% highlight php %}
<?php
namespace Example\Package\Input;

use Aura\Input\Form;

class ContactForm extends Form
{
    public function init()
    {
        $states = array(
            'AL' => 'Alabama',
            'AK' => 'Alaska',
            'AZ' => 'Arizona',
            'AR' => 'Arkansas',
            // ...
         );

        // set input fields
        // hint the view layer to treat the first_name field as a text input,
        // with size and maxlength attributes
        $this->setField('first_name', 'text')
             ->setAttribs(array(
                'size' => 20,
                'maxlength' => 20,
             ));

        // hint the view layer to treat the state field as a select, with a
        // particular set of options (the keys are the option values, and the values
        // are the displayed text)
        $this->setField('state', 'select')
             ->setOptions($states);

        $this->setField('message', 'textarea')
            ->setAttribs([
                'cols' => 40,
                'rows' => 5,
            ]);
        // etc.

        // set input filters
        $filter = $this->getFilter();
        $filter->addSoftRule('first_name', $filter::IS, 'string');
        $filter->addSoftRule('first_name', $filter::IS, 'strlenMin', 4);
        $filter->addSoftRule('state', $filter::IS, 'inKeys', $states);
        $filter->addSoftRule('message', $filter::IS, 'string');
        $filter->addSoftRule('message', $filter::IS, 'strlenMin', 6);
    }
}
{% endhighlight %}

> ステータスがどのように準備されるかをみて フォームに渡されたオプションを読みます

## フォームのフィルターのセット ##

auraフレームワークはAura.Filterパッケージを使ってバリデーションにとサニタイズを行います。
`Aura\Input\Form`オブジェクトは`Aura\Filter\RuleCollection`クラスを拡張した`Aura\Framework\Input\Filter`オブジェクトの`getFilter()`メソッドを持っています。

違ったタイプのルールのサニタイズやバリデーションを参考にして、独自のルールを作成することができます。

## フォーム作成のためのコントローラー拡張 ##

Auraフレームワークはとても基本的なコントローラーを持っています。必要に応じてコントローラーを拡張することができます。

{% highlight php %}
<?php
namespace Example\Package\Web;

use Aura\Framework\Web\Controller\AbstractPage;
use Aura\Input\FormFactory;

abstract class PageController extends AbstractPage
{
    protected $form_factory;

    public function setFormFactory(FormFactory $form_factory)
    {
        $this->form_factory = $form_factory;
    }

    public function getFormFactory()
    {
        return $this->form_factory;
    }
}
{% endhighlight %}

## コンフィギュレーション ##

DIのためにフォームの名前を`Aura\Input\FormFactory`をマップする必要があります。

{% highlight php %}
$di->setter['Example\Package\Web\PageController']['setFactory'] =
    $di->lazyGet('input_form_factory');
{% endhighlight %}

`FormFactory`に複数のフォームをマップすることができます。

{% highlight php %}
$di->params['Aura\Input\FormFactory']['map']['form.contact'] =
    $di->newFactory('Example\Package\Input\ContactForm');
{% endhighlight %}

## フォームオブジェクト ##

フォームオブジェクトは`Example\Package\Web\PageController`を拡張して作ります。

{% highlight php %}
$form = $this->getFormFactory()->newInstance('form.contact');
{% endhighlight %}

## ユーザー入力のバリデーションとセット ##

ユーザー入力が有効ならフォームに格納することができます。
最初に`fill()` メソッドを使って入力した値をセットします。それから`filter()`メソッドを使って入力が有効かを見ます。
もし有効でないならメッセージを表示し、フィルタールールに渡さないようにします。

{% highlight php %}
<?php
// fill the form with $_POST array elements
// that match the form input names.
$form->fill($this->context->getPost());

// apply the filters
$pass = $form->filter();

// did all the filters pass?
if ($pass) {
    // yes
    echo "User input is valid." . PHP_EOL;
} else {
    // no; get the messages.
    echo "User input is not valid." . PHP_EOL;
    foreach ($form->getMessages() as $name => $messages) {
        foreach ($messages as $message) {
            echo "Input '{$name}': {$message}" . PHP_EOL;
        }
    }
}
{% endhighlight %}

## CSRFプロテクションの適用 ##

Aura.Inputは[クロスサイトリクエストフォージェリ(cross-site request forgery)](https://www.owasp.org/index.php/Cross-Site_Request_Forgery)攻撃を防御するインターフェイスが用意されています。
このインターフェイスを使用するために独自のCSRF実装を用意する必要があります。Aura.Inputは「ユーザーが認証されたどうかを伝えるオブジェクト」または「暗号化されたセキュアなランダム値をもつCSRFトークンの値を生成・保持するオブジェクト」を提供できないからです。


{% highlight php %}
<?php
namespace Example\Package\Input;

use Aura\Input\AntiCsrfInterface;
use Aura\Input\Fieldset;
use Example\Package\CsrfObject;
use Example\Package\UserObject;

class AntiCsrf implements AntiCsrfInterface
{
    // a user object indicating if the user is authenticated or not
    protected $user;

    // a csrf value generation object
    protected $csrf;

    public function __construct(UserObject $user, CsrfObject $csrf)
    {
        $this->user = $user;
        $this->csrf = $csrf;
    }

    // implementation of setField(); adds a CSRF token field to the fieldset.
    public function setField(Fieldset $fieldset)
    {
        if (! $this->user->isAuthenticated()) {
            // user is not authenticated so CSRF cannot occur
            return;
        }

        // user is authenticated, so add a CSRF token
        $fieldset->setField('__csrf_token', $this->csrf->getValue());
    }

    // implementation of isValid().  return true if CSRF token is present
    // and of the correct value, or return false if not.
    public function isValid(array $data)
    {
        if (! $this->user->isAuthenticated()) {
            // user is not authenticated so CSRF cannot occur
            return true;
        }

        // user is authenticated, so check to see if input has a CSRF token
        // of the correct value
        return isset($data['__csrf_token'])
            && $data['__csrf_token'] == $this->csrf->getValue();
    }
}
{% endhighlight %}

`setAntiCsrf()`メソッドを使ってフォームにインスタンスを渡します。


{% highlight php %}
<?php
$form = $this->getFactory()->newInstance('form.contact');
$anti_csrf = new AntiCsrf(new UserObject, new CsrfObject);
$form->setAntiCsrf($anti_csrf);
{% endhighlight %}

`setAntiCsrf()`をコールするとフォームにCSRFフィールドが追加されます。

フォームの`fill()`をコールするとデータのCSRF値をチェックして正しいかを確認します。
正しくないときは例外が投げられデータは入力されません。

## ビューレイヤー ##

Aura.Inputパッケージはユーザー入力とその値を取り扱います。フィールドのレンダリングは行いません。
それはビューレイヤーのタスクです。しかしながらAura.Inputはレンダリングを行うビューレイヤーのために"ヒント"を提供します。

フィールドを定義するときに、二番目のパラメーターとして型を`setField()` メソッドで指定することができます。
これはHTMLのインプットタイプでHTMLのタグ名、ビューレイヤーが認識するカスタム名、あるいはその他のものです。
ビューのためのヒントに過ぎない点に注意してください。厳密なものではありません。
属性とオプションをフィールドに加えるためにフルーエントメソッドを使う事もできます。


{% highlight php %}
// hint the view layer to treat the state field as a select, with a
// particular set of options (the keys are the option values, and the values
// are the displayed text)
$this->setField('state', 'select')
     ->setOptions(array(
        'AL' => 'Alabama',
        'AK' => 'Alaska',
        'AZ' => 'Arizona',
        'AR' => 'Arkansas',
        // ...
     ));
{% endhighlight %}

ビューレイヤーでは`get()`メソッドを使ってフィールドからヒントを引き出します。


{% highlight php %}
<?php
// get the hints for the state field
$hints = $form->get('state');

// the hints array looks like this:
// $hints = array(
//     'type' => 'select',      # the input type
//     'name' => 'state',       # the input name
//     'attribs' => array(           # attributes as key-value pairs
//         // ...
//     ),
//     'options' => array(           # options as key-value pairs
//         'AL' => 'Alabama',
//         'AZ' => 'Arizona',
//         // ...
//     ),
//     'value' => '',           # the current value of the input
// );
{% endhighlight %}

[Aura.View](http://github.com/auraphp/Aura.View)パッケージはこれらのヒントからHTMLに変換するヘルパーが付属します。

フォームオブジェクトはコントローラーからビューにこのようにアサインされます。

{% highlight php %}
$this->data->form = $form;
{% endhighlight %}

そしてビューからはこのようにしてフォームを表示します。

{% highlight php %}
echo $this->field($this->form->get('state'));
{% endhighlight %}

## フォームオプションの通知 ##

アプリケーションが使うインプットは全てのフォームとフィルターに使う標準的なオプションのセットを使用するのはよくある事ですが、これらをフォーム毎に複製するのは不便です。
Aura.Inputはアプリケーション共通のコンテナを使ってこれらのオブジェクトを渡す事ができます。これらのオプションを使ってインプットを組み立てます。

例として`ContactForm`任意のオプションをで作成してみましょう。

{% highlight php %}
<?php
namespace Example\Package;

class Options
{
    protected $states = array(
        'AL' => 'Alabama',
        'AK' => 'Alaska',
        'AZ' => 'Arizona',
        'AR' => 'Arkansas',
        // ...
    );

    public function getStates()
    {
        return $this->states;
    }
}
{% endhighlight %}


そして`init()`メソッドで`$states` 配列の代わりに`$options->getStates()`で得られた値に変更します。

{% highlight php %}
<?php
namespace Example\Package;

use Aura\Input\Form;

class ContactForm extends Form
{
    protected function init()
    {
        // the options object injected via constructor
        $options = $this->getOptions();

        $states = $options->getStates();

        // set input fields
        $this->setField('state', 'select')
             ->setOptions($states);
    }
}
{% endhighlight %}

## オプションの設定 ##

{% highlight php %}
$di->set('contact_options', function () use ($di) {
    return $di->newInstance('Example\Package\Options');
});

$di->params['Example\Package\ContactForm']['options'] = $di->lazyGet('contact_options');
{% endhighlight %}
