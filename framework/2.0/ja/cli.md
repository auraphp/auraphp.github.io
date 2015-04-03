---
layout: docs2-ja
title: コマンドライン / CLI / コンソール
permalink: /framework/2.0/ja/cli/
previous_page: セッション
previous_page_url: /framework/2.0/ja/session/
next_page: バーチャルホストの設定
next_page_url: /framework/2.0/ja/setup/
---

# コマンドライン / CLI / コンソール

`aura/framework-project` / `aura/cli-project` は `aura/cli-kernel` に統合されました。

## Aura.Cliの機能

### Context
_Context_ オブジェクトはCLI環境の情報、フラグやオプションなどあらゆるものを提供します。
（これはコマンドライン環境において Web Request オブジェクトに相当するものです。）

`$_ENV`や`$_SERVER`、`$argv`はそれぞれ、`$env`、`$server`、`$argv`としてアクセスすることができます。（Note: これらのプロパティは _Context_ がインストールされた時の状態のスーパーグローバル変数が格納されます。）また、これらの値が存在しない時に利用されるデフォルト値を渡すこともできます。

{% highlight php %}
<?php
// スーパーグローバル変数をコピー
$env    = $context->env->get();
$server = $context->server->get();
$argv   = $context->argv->get();

// これは以下と同様です：
// $value = isset($_ENV['key']) ? $_ENV['key'] : null;
$value = $context->env->get('key');

// これは以下と同様です：
// $value = isset($_ENV['key']) ? $_ENV['key'] : 'other_value';
$value = $context->env->get('key', 'other_value');
?>
{% endhighlight %}

### Getopt サポート

_Context_ オブジェクトはコマンドラインのオプションやパラメータ、[positional arguments](#positional-arguments) の取得をサポートします。

オプションやコマンドラインからパースされた `$argv` 引数を取得するには、 _Context_ オブジェクトの `getopt()` メソッドを利用します。このメソッドは _GetoptValues_ オブジェクトを返却します。

#### オプションやパラメータの定義
`getopt()` は渡された array of option definition によってコマンドラインオプションを認識しています。The definition array と似たフォーマットを持っていますが、正確には違います。こちらは[getopt()](http://php.net/getopt)によって利用されます。
その代わりに、文字列のshort flagsと 配列に分割された long options 、それらは両方とも単一配列の要素として定義されます。
`*`がオプション名のあとに示されると、それを何度も利用することできます。その値は配列として保存されます。

{% highlight php %}
<?php
$options = array(
    'a',        // short flag -a です。パラメータの指定を許可しません。
    'b:',       // short flag -b です。パラメータの指定は必須です。
    'c::',      // short flag -c です。パラメータの指定は任意です。
    'foo',      // long option --foo です。 パラメータの指定を許可しません。
    'bar:',     // long option --bar です。 パラメータの指定は必須です。
    'baz::',    // long option --baz パラメータの指定は任意です。
    'g*::',     // short flag -g です。 パラメータの指定は任意で複数指定できます。
);

$getopt = $context->getopt($options);
?>
{% endhighlight %}

> ここで "必須" と記載する場合、それは 「そのオプションが指定されたときパラメータを持っていなくてはいけない」ことを表します。「そのオプションを指定しないといけない」とは *違います*。
> それらはあくまでオプションであるからです。もし特定の値を指定することを強制したい場合、[positional arguments](#positional-arguments) の利用を検討すべきです。

Option valuesから取得された _GetoptValues_ オブジェクトの `get()`メソッドを利用してみましょう。Optionが存在しない場合のデフォルト値も設定することができます。

{% highlight php %}
<?php
$a   = $getopt->get('-a', false); // -a が指定されている場合は true, 指定されていなければfalseです。
$b   = $getopt->get('-b');
$c   = $getopt->get('-c', 'default value');
$foo = $getopt->get('--foo', 0); // --foo が指定されていれば true, 逆の場合 false です。
$bar = $getopt->get('--bar');
$baz = $getopt->get('--baz', 'default value');
$g   = $getopt->get('-g', []);
?>
{% endhighlight %}

もしオプション名のエイリアスを設定したい場合、カンマ区切りで2つの名前を指定することができます。値はそれぞれの名前で保存されます。

{% highlight php %}
<?php
// -fは--fooのエイリアスです。
$options = array(
    'foo,f:',  // long option --foo か shot flag -f で指定可能、パラメータは必須です。
);

$getopt = $context->getopt($options);

$foo = $getopt->get('--foo'); // -f も --foo も同じ値です。
$f   = $getopt->get('-f'); // -f も --foo も同じ値です。
?>
{% endhighlight %}

もし何度も同じオプションを指定することを許可したい場合、オプション名の最後に '*' を付与します。

{% highlight php %}
<?php
$options = array(
    'f*',
    'foo*:'
);

$getopt = $context->getopt($options);

// もし script が以下の指定とともに実行された場合 :
// php script.php --foo=foo --foo=bar --foo=baz -f -f -f
$foo = $getopt->get('--foo'); // ['foo', 'bar', 'baz']
$f   = $getopt->get('-f'); // [true, true, true]
?>
{% endhighlight %}

もしユーザが定義に従わないオプションを指定した場合、 _GetoptValues_ オブジェクトは解析されたエラーに関する様々なエラーを保持します。それらの場合、 `hasErrors()` は `true` を返却し、エラーを確認することができます。（そのエラーは実際には `AUra\Cli\Exception` オブジェクトですが、エラーが起こった時点では throw されません。これはエラーを無視するかどうかを自由に決定するためです。）

{% highlight php %}
<?php
$getopt = $context->getopt($options);
if ($getopt->hasErrors()) {
    $errors = $getopt->getErrors();
    foreach ($errors as $error) {
        // Stdioオブジェクトを使った stderr エラーを発行します。
        $stdio->errln($error->getMessage());
    }
};
?>
{% endhighlight %}

#### positional arguments
コマンドラインに渡されたpositional argumentsを取得する場合、 `get` メソッドを利用すると特定の引数のpositionを取得することができます。

{% highlight php %}
<?php
$getopt = $context->getopt();

// このスクリプトが以下の指定とともに実行された場合:
// php script.php arg1 arg2 arg3 arg4

$val0 = $getopt->get(0); // script.php
$val1 = $getopt->get(1); // arg1
$val2 = $getopt->get(2); // arg2
$val3 = $getopt->get(3); // arg3
$val4 = $getopt->get(4); // arg4
?>
{% endhighlight %}

定義されたオプションは引数から自動で削除されます。

{% highlight php %}
<?php
$options = array(
    'a',
    'foo:',
);

$getopt = $context->getopt($options);

// このscriptが以下の指定とともに実行された場合:
// php script.php arg1 --foo=bar -a arg2
$arg0 = $getopt->get(0); // script.php
$arg1 = $getopt->get(1); // arg1
$arg2 = $getopt->get(2); // arg2
$foo  = $getopt->get('--foo'); // bar
$a    = $getopt->get('-a'); // 1
?>
{% endhighlight %}

> もし short flag がオプションパラメータを持っていた場合、その引数はオプション値として扱われます。引数としては扱われません。

### 標準入力 / 出力ストリーム
_Stdio_ オブジェクト は標準入出力ストリームとともに動作します。（これはコマンドライン環境における Web Response オブジェクトと同等のものです。）

標準では `php://stdin`、`php://stdout`、そして `php://stderr` が利用されますが、 好きなストリームを `newStdio()` メソッドに渡すパラメータとして指定できます。

_Stdio オブジェクトは以下のメソッドを持ちます。

- `getStdin()`, `getStdout()`, `getStderr()` はそれぞれの _Handle_ オブジェクトをを返却します。
- `outln()`, `out()` は _stdout_ に line encoding あり、もしくはなしで出力します。
- `errln()`, `err()` は _stdout_ に line encoding あり、もしくはなしで出力します。
- `inln()`, `in()` は _stdin_ からユーザからの入力を読み取ります。`inln()` は `in()` では除去される行末文字も含めます。

出力やエラー文字に対して、テキストカラーやテキストサイズ、背景色などのフォーマットマークアップを設定できます。
こちらも参照してください。 [formatter cheat sheet](#formatter-cheat-sheet)

{% highlight php %}
<?php
// stdoutに出力します
$stdio->outln('これはノーマルテキストです。');

// stderrに出力します
$stdio->errln('<<red>>これは赤色のエラーです。');
$stdio->errln('フォーマットが再度変更されるまで出力は赤色のままです。<<reset>>');
?>
{% endhighlight %}

### 終了コード
本ライブラリは終了ステータスコードを _Status_ クラスが定義しています。可能な限りそれを利用すべきです。
例えば、コマンドが間違った引数の数や不適切なオプションフラグで利用された場合、　`Status::USAGE` とともに `exit()` を実行します。終了ステータスコードはこちらで確認できます。
[sysexits.h](http://www.unix.com/man-page/freebsd/3/sysexits/)

### コマンドの作成
Aura.Cli は 抽象クラスやベースコマンドクラスを利用しませんが、その代わりに簡単にコマンドを実装できます。
これはクラスを使ったロジックと似たスタンドアローンコマンドスクリプトです。`hello` とファイル名を付けて以下のように実行してみてください。
`php hello [-v,--verbose] [name]`.

{% highlight php %}
<?php
use Aura\Cli\CliFactory;
use Aura\Cli\Status;

require '/path/to/Aura.Cli/autoload.php';

// contextとstdioオブジェクトを取得
$cli_factory = new CliFactory;
$context = $cli_factory->newContext($GLOBALS);
$stdio = $cli_factory->newStdio();

// getoptでオプションと名前付き引数を定義
$options = ['verbose,v'];
$getopt = $context->getopt($options);

// 誰にhelloと出力するか？
$name = $getopt->get(0);
if (! $name) {
    // エラー出力
    $stdio->errln("Please give a name to say hello to.");
    exit(Status::USAGE);
}

// say hello
if ($getopt->get('--verbose')) {
    // 詳細エラー
    $stdio->outln("Hello {$name}, it's nice to see you!");
} else {
    // エラー
    $stdio->outln("Hello {$name}!");
}

// done!
exit(Status::SUCCESS);
?>
{% endhighlight %}

### コマンドヘルプの作成
コマンドに対して便利なヘルプを出力したい時があると思います。
Aura.Cli では _Help_ オブジェクトが実装すべきコマンドとの分離を行います。継承して利用します。

例えば _Help_ オブジェクトを継承し _init()_ メソッドをオーバーライドします。

{% highlight php %}
<?php
use Aura\Cli\Help;

class MyCommandHelp extends Help
{
    protected function init()
    {
        $this->setSummary('A single-line summary.');
        $this->setUsage('<arg1> <arg2>');
        $this->setOptions(array(
            'f,foo' => "The -f/--foo option description",
            'bar::' => "The --bar option description",
        ));
        $this->setDescr("A multi-line description of the command.");
    }
}
?>
{% endhighlight %}
このクラスをインスタンス化して `getHelp()` を実行すれば _Stdio_ を通して出力されます。

{% highlight php %}
<?php
use Aura\Cli\CliFactory;
use Aura\Cli\Context\OptionFactory;

$cli_factory = new CliFactory;
$stdio = $cli_factory->newStdio();

$help = new MyCommandHelp(new OptionFactory);
$stdio->outln($help->getHelp('my-command'));
?>
{% endhighlight %}

> - コマンド名をhelpクラスの外部で保持するのは、そのコマンド名が違うプロジェクトで異なったマッピングをされるかもしれないからです。
>
> - _Help_ オブジェクトに _GetoptParser_ が渡されるのはオプション定義をパースできるようにするためです。
>
> - _Help_ オブジェクトの外で　`getOptions()` を使ってオプション定義を取得できるのは、 仮コマンドオブジェクトに対して _Help_ オブジェクトを渡すことを許可していることに加え、定義を再利用するためです。

出力はこのようになります。

{% highlight bash %}
SUMMARY
    my-command -- A single-line summary.

USAGE
    my-command <arg1> <arg2>

DESCRIPTION
    A multi-line description of the command.

OPTIONS
    -f
    --foo
        The -f/--foo option description.

    --bar[=<value>]
        The --bar option description.
{% endhighlight %}

### formatter cheat sheet
POSIXターミナルでは `<<markup>>` 文字列が表示を変更します。Note: これらはHTMLをタグではありません。この文字列はターミナルコントロールコードに変換されますが、閉じられることはありません。好きなスペース区切りのマークアップコードをdouble angle-brackets(<< >>)で指定できます。

    reset       表示をデフォルトに戻す

    black       黒色文字
    red         赤色文字
    green       緑色文字
    yellow      黄色文字
    blue        青色文字
    magenta     マゼンタ（紫）色文字
    cyan        シアン（水）色文字
    white       白色文字

    blackbg     黒色背景
    redbg       赤色背景
    greenbg     緑色背景
    yellowbg    黄色背景
    bluebg      青色背景
    magentabg   マゼンタ（紫）背景
    cyanbg      シアン（水）色背景
    whitebg     白色背景

    bold        文字を太字
    dim         文字をdim
    ul          文字にアンダーライン
    blink       文字を点滅
    reverse     文字と背景を反転

例えば出力やエラー文字列に、太字と白文字を赤の背景色にセットしたい場合、`<<bold white redbg>>` を指定します。
標準に戻すには `<<reset>>` を指定します。

## サービス
Aura.Cli_Kernel は次の _Container_ に格納されたサービスオブジェクトを定義します。

- `aura/cli-kernel:dispatcher`: _Aura\\Dispatcher\\Dispatcher_ インスタンス
- `aura/cli-kernel:context`: _Aura\\Cli\\Context_ インスタンス
- `aura/cli-kernel:stdio`: _Aura\\Cli\\Stdio_ インスタンス
- `aura/cli-kernel:help_service`: _Aura\\Cli_Kernel\\HelpService_ インスタンス
- `aura/project-kernel:logger`: `Monolog\\Logger` インスタンス

## クイックスタート
Dependency Injection _Container_ は aura framework projectの処理における絶対的な中心です。項目を進める前にこちらを参照してください。 [ディペンデンシーインジェクション](/framework/2.0/ja/di/)

Aura.Cli の _Context_, _Stdio_, _Status_ オブジェクトを理解するには [Dispatching](/framework/2.0/ja/dispatching/) も参照してください。

## プロジェクトの設定
全てのAuraプロジェクトは同じ設定方法を用います。[こちら](/framework/2.0/ja/configuration/)も参照してください。

## ロギング
ログは自動で `{$PROJECT_PATH}/tmp/log/{$mode}.log` に出力されます。もしロギングの挙動を変更したい場合、関連する設定ファイル（例えば `config/Dev.php`）で `aura/project-kernel:logger` サービスを変更することで設定することが出来ます。

## コマンド
コマンドはプロジェクトの `config/` により設定されます。もしコマンドが全ての設定モードで必要な場合、プロジェクトの `config/Common.php` クラスを変更してください。もしそれが特定のモードだけの場合、例えば `dev` モードの場合そのモードに対する設定ファイルを変更してください。
こちらは2つの異なるスタイルでのコマンド定義です。

## マイクロフレームワークスタイル
以下の例は `aura/cli-kernel:context` サービスと `aura/cli-kernel:stdio` サービスを使った、通常終了コードを出力するコマンドの例です。（このディスパッチャーにセットされる名前はコマンド名と対になっています。）

{% highlight php %}
<?php
namespace Aura\Famework_Project\_Config;

use Aura\Di\Config;
use Aura\Di\Container;

class Common extends Config
{
    // ...

    public function modifyCliDispatcher(Container $di)
    {
        $context = $di->get('aura/cli-kernel:context');
        $stdio = $di->get('aura/cli-kernel:stdio');
        $dispatcher = $di->get('aura/cli-kernel:dispatcher');
        $dispatcher->setObject(
            'foo',
            function ($id = null) use ($context, $stdio) {
                if (! $id) {
                    $stdio->errln("Please pass an ID.");
                    return \Aura\Cli\Status::USAGE;
                }

                $id = (int) $id;
                $stdio->outln("You passed " . $id . " as the ID.");
            }
        );
    }
?>
{% endhighlight %}

このコマンドを実行すると以下の通り出力されます。

    cd {$PROJECT_PATH}
    php cli/console.php foo 88

（もしID引数を指定していない場合エラーメッセージが表示されるはずです。）

## フルスタックスタイル
マイクロフレームワークスタイルからフルスタックスタイルに変更する（もしくは最初からフルスタックで始める）ことも出来ます。
まずはじめに、コマンドクラスの定義そしてプロジェクトの `src/` ディレクトリへの配置を行います。

{% highlight php %}
<?php
/**
 * {$PROJECT_PATH}/src/App/Command/FooCommand.php
 */
namespace App\Command;

use Aura\Cli\Stdio;
use Aura\Cli\Context;
use Aura\Cli\Status;

class FooCommand
{
    public function __construct(Context $context, Stdio $stdio)
    {
        $this->context = $context;
        $this->stdio = $stdio;
    }

    public function __invoke($id = null)
    {
        if (! $id) {
            $this->stdio->errln("Please pass an ID.");
            return Status::USAGE;
        }

        $id = (int) $id;
        $this->stdio->outln("You passed " . $id . " as the ID.");
    }
}
?>
{% endhighlight %}

次にDI _Container_ に _FooCommand_ のビルド方法を伝えます。 `config/Common.php` を編集し、 _Container_ に対して `aura/cli-kernel:context` サービスと `aura/cli-kernel:stdio` サービスを _FooCommand_ のコンストラクタに渡すように設定します。そして _App\Command\FooCommand_ オブジェクトを `foo` という名前のディスパッチャーに対して遅延インストールします。

{% highlight php %}
<?php
namespace Aura\Famework_Project\_Config;

use Aura\Di\Config;
use Aura\Di\Container;

class Common extends Config
{
    public function define(Container $di)
    {
        $di->set('aura/project-kernel:logger', $di->newInstance('Monolog\Logger'));

        $di->params['App\Command\FooCommand'] = array(
            'context' => $di->lazyGet('aura/cli-kernel:context'),
            'stdio' => $di->lazyGet('aura/cli-kernel:stdio'),
        );
    }

    // ...

    public function modifyCliDispatcher(Container $di)
    {
        $dispatcher = $di->get('aura/cli-kernel:dispatcher');

        $dispatcher->setObject(
            'foo',
            $di->lazyNew('App\Command\FooCommand')
        );
    }
?>
{% endhighlight %}

このコマンドを実行すると以下の通り出力されます。

    cd {$PROJECT_PATH}
        php cli/console.php foo 88

（もしID引数を指定していない場合エラーメッセージが表示されるはずです。）