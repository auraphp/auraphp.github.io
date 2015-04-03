---
layout: docs-ja
title: Installation
permalink: /framework/v1/ja/installation/
---

# インストール #

システム全体のtarballをダウンロードしてAuraフレームワークを使用することができます。またはsystemをcloneして手動でパッケージをインストールする事もできるし、composerを使ってインストールすることもできます。

## Tarball ##

-  [download](http://auraphp.com/system/downloads) から最新のtarballをダウンロード

- tarballをドキュメントルートへ解凍します。

-  `/path/to/system/web/index.php`をブラウズすると &quot;Hello World！&quot;が表示されます。


## Gitでクローン ##

これが機能するためには `git`コマンドが `$PATH`に存在する必要があります。

- ドキュメントルートに Auraの `system` リポジトリをcloneします。
`update.php`を実行して、システムのスケルトンを取得します。

        $ git clone https://github.com/auraphp/system.git

-    `php update.php` を実行してシステムの他のライブラリをインストールするには以下の様にします。

        $ cd system
        $ php update.php

`php update.php` コマンドはシステムを最新の状態に保ちます。（新しく利用可能になったパッケージのインストールも含みます）


 -    `/path/to/system/web/index.php`  をブラウズすると &quot;Hello World!&quot;.が表示されます。


## Composer ##

[composer](http://getcomposer.org) を使うとAuraフレームワークベースのプロジェクトを最も簡単に作成する事ができます。そのためには
[install composer](http://getcomposer.org/doc/00-intro.md#installation-nix) が必要です。

 -    Auraフレームワークの新しいベースプロジェクトを作成しましょう。ターミナルを開いて実行します。

        composer create-project -s dev aura/system

 -    `/path/to/system/web/index.php` をブラウズすると &quot;Hello World!&quot;.が表示されます。



上記のコマンドは、Auraのプロジェクトのすべての依存関係をインストールします。上記コマンドではこのような事が行われています。

    git clone https://github.com/auraphp/system.git
    cd
    composer install


> composer がグローバルにインストールされていると仮定しています。
