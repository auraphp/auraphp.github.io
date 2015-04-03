---
layout: docs2-ja
title: コンフィギュレーション
permalink: /framework/2.x/ja/configuration/
previous_page: イントロダクション
previous_page_url: /framework/2.x/ja/
next_page: ルーティング
next_page_url: /framework/2.x/ja/router/
---

# コンフィギュレーション

コンフィギュレーションはプロジェクト全体の関心事ですが、各auraのweb、 cli カーネル、そしてプロジェクトは同じ方法で扱います。

## コンフィグモードの設定

サーバーの環境変数、またはプロジェクト全体の環境 `config/_env.php` ファイルで
`$_ENV['AURA_CONFIG_MODE']` を使ってコンフィグのモードを設定しましょう。
それぞれのAuraプロジェクトには、あらかじめ`dev` (ローカルデベロップメント), `test` (テスト/ステージング), そして `prod` (プロダクション) が定義されています。

## 設定ファイルの場所

プロジェクト全体のコンフィグファイルは、`config/` ディレクトリにあります。各コンフィグファイルは _Aura\\Di\\Config_ を継承するクラスであり、それぞれコンフィグのモードを表します。コンフィグクラスは2つのメソッドを持っています。

- `define()`, プロジェクトの _Container_ へパラメーター、セッター、サービスを定義します。

- `modify()`, プログラムによる変更のため、 _Container_ からオブジェクトを呼び出します。 (これは _Container_ がロックされてから行われます。よってここで新しいサービスやパラメータ、セッターの変更は出来ません。)

この2段階構成ではライブラリー、カーネルそしてプロジェクトの順番にコンフィグクラスをロードし、それから全ての `define()` メソッドを実行します。
コンテナーをロックし、最後に `modify()` メソッドを実行します。

## モードからクラスへのマッピング

コンフィグのモードは、プロジェクトの `composer.json` ファイルの `extra:aura:config` ブロックでそれぞれ関連したコンフィグのクラスにマッピングされます。
エントリーのキーがモードで、それに対応する値がそのモードで利用されるクラスになります。

{% highlight json %}
{
    "autoload": {
        "psr-0": {
            "": "src/"
        },
        "psr-4": {
            "Aura\\Web_Project\\_Config\\": "config/"
        }
    },
    "extra": {
        "aura": {
            "type": "project",
            "config": {
                "common": "Aura\\Web_Project\\_Config\\Common",
                "dev": "Aura\\Web_Project\\_Config\\Dev",
                "test": "Aura\\Web_Project\\_Config\\Test",
                "prod": "Aura\\Web_Project\\_Config\\Prod"
            }
        }
    }
}
{% endhighlight %}

プロジェクトネームスペース内のPSR-4 エントリーを通してコンフィグクラスがオートロードされます。

 "common" のコンフィグクラスはモードに関わらず常にロードされます。
例えばコンフィグのモードが `dev`の場合は、はじめに _Common_ クラスがロードされ、それから
 _Dev_ クラスがロードされます。


## コンフィグ設定の変更

まずはじめに、モードに応じたコンフィグファイルを開いてください。
パラメーター、セッター、サービスを変更したい場合は `define()` メソッドを編集しましょう。
全ての定義が読み込まれた後、プログラムで変更するような場合は `modify()` メソッドで行うようにしましょう。

## コンフィグモードの追加

コンフィギュレーションのモードを追加する場合、3つのステップが必要になります。
ここでは `qa` モードで作成してみます。

まず初めに、 `config/` ディレクトリにコンフィグクラスを作成してみましょう。

{% highlight php %}
<?php
namespace Aura\Web_Project\_Config;

use Aura\Di\Config;
use Aura\Di\Container;

class Qa extends Config
{
    public function define(Container $di)
    {
        // パラメーター、セッター、サービスをここに定義します。
    }

    public function modify(Container $di)
    {
        // 定義したサービスを変更する場合はここに定義します。
    }
}
?>
{% endhighlight %}

次に、プロジェクトの `composer.json` ファイルを開き、新しいコンフィグのモードと対応するクラスを追加しましょう。

{% highlight json %}
{
    "extra": {
        "aura": {
            "type": "project",
            "config": {
                "common": "Aura\\Web_Project\\_Config\\Common",
                "dev": "Aura\\Web_Project\\_Config\\Dev",
                "test": "Aura\\Web_Project\\_Config\\Test",
                "prod": "Aura\\Web_Project\\_Config\\Prod",
                "qa": "Aura\\Web_Project\\_Config\\Qa"
            }
        }
    }
}
{% endhighlight %}

最後に、`composer update` を実行するとComposerが必要な変更をオートローダーに適用します。
