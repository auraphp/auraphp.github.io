---
layout: docs-ja
title: Package Organization
permalink: /framework/v1/ja/package-organization/
---

# Package Organization #

Auraではすべてのコードはパッケージにとして分類されます。ライブラリパッケージ、サポートパッケージ、Webパッケージなど - これらはすべて同じで単に &quot;パッケージ&quot;です。

パッケージのディレクトリ構造は次のようになります。


    Vendor.Package/
        cli/                        # command-line script invokers
        composer.json               # composer/packagist file
        config/                     # package-level configs
            default.php             # default configs
            test.php                # configs for &quot;test&quot; mode
        meta/                       # metadata for packaging scripts
        LICENSE                     # license file
        README.md                   # readme file
        src/                        # the actual source code organized for PSR-0
            Vendor/
                Package/
                    Class.php
        tests/                      # test files for phpunit
            Vendor/
                Package/
                    ClassTest.php
            bootstrap.php
            phpunit.xml
        web/                        # public web assets
            styles/                 # css files
            images/                 # image files
            scripts/                # javascript (or other script) files


通常`src/`はこのように構成されます：


    Vendor/
        Package/
            Cli/                    # all CLI commands
                CommandName/        # a particular CLI command and its support files
                    Command.php     # the actual command logic
                    data/           # other data for the command
            Web/                    # all web pages
                PageName/           # a particular web page and its support files
                    Page.php        # the actual page action logic
                    views/          # views for the page
                    layouts/        # layouts for the page
                    data/           # other data for the page
            View/
                Helper/
                    HelperName.php  # a view helper


パッケージに他のライブラリを配置することは自由にできます。

## Creating your Package ##

パッケージを作成してみます。ここでは「挨拶」をするためにパッケージとページコントローラーを作成しましょう。
## Package Structure ##

まず、パッケージ構造（必要な部分だけ）を作成します：


    $ mkdir -p package/Example.Package/src/Example/Package/Web/Greet/views
    $ mkdir package/Example.Package/config

注：* nixの場合は、-pコマンドが使えます。Windoesの場合は各ディレクトリを別々に作成します。

## Page Controller and View ##

コントローラを作成してみましょう。好きなエディタで以下のコードを入力して&#39;Page.php&#39;として `package/Example.Package/src/Example/Package/Web/Greet/`フォルダに保存します。

{% highlight php %}
<?php
namespace Example\Package\Web\Greet;
use Aura\Framework\Web\Controller\AbstractPage;
class Page extends AbstractPage
{
    public function actionIndex()
    {
        $this->data->message = $this->context->getQuery('name', 'guys!');
        $this->view = 'index';
    }
}
{% endhighlight %}

次に、アクション用のビューを作成します。
以下のコードを貼り付けます

{% highlight php %}
<?php
$this->title()->set('Welcome to the world of Aura Framework!');
?>
<h1>Hey good day <?= $this->message; ?></h1>
<form method="get" action="<?php echo $this->route('example_package_greet'); ?>" class="form-search">
    <input type="text" name="name" id="name" class="input-medium search-query" placeholder="Name" />
    <input type="submit" name="greet" id="greet" value="Greet" class="btn" />
</form>
{% endhighlight %}

 `package/Example.Package/src/Example/Package/Web/Greet/views`フォルダに`index.php`として保存します。
この時点で、あなたのパッケージディレクトリは次のようになります。


    Example.Package/
        src/
            Example/
                Package/
                    Web/
                        Greet/
                            Page.php
                            views/
                                index.php

## Configuration ##

私たちはまだオートローダーに任意のファイルを追加していないし、ルートも指定していません。それではそれらの設定を追加してみましょう。
エディタを開き、以下の内容を貼り付けます。

{% highlight php %}
<?php
/** Example Package configs */

// add the package to the autoloader
$loader->add('Example\Package\\', dirname(__DIR__) . DIRECTORY_SEPARATOR . 'src');

// add a route to the page and action
$di->get('router_map')->add('example_package_greet', '/greet', [
    'values' => [
        'controller' => 'greet',
        'action' => 'index',
    ],
]);

// map the 'greet' controller value to a page controller class
$di->params['Aura\Framework\Web\Controller\Factory']['map']['greet'] = 'Example\Package\Web\Greet\Page';
{% endhighlight %}

`Example.Package/config`フォルダに` default.php `としてファイルを保存します。

## Loading your package ##

フレームワークにパッケージと設定ファイルをロードするため、`{$system}/config/_packages`ファイルをパッケージに追加する必要があります。
いくつかのパッケージは、別のパッケージに依存しているため設定を最初にロードする必要があります。パッケージは `{$system}/config/_packages` ファイルで書かれている順番で読み込まれます。

## Try it out ##

これまでにした事を確認してみましょう。PHPのCLIで利用できる組み込みのサーバ機能を使用してみましょう。

    $ php -S localhost:8000 web/index.php

`http://localhost:8000/greet`のURLを参照して`Hey good day` と表示されます。その時`Bpb`とinput boxにテキストを入力して送信した場合は`Hey good day Bob`と表示されるでしょう。
