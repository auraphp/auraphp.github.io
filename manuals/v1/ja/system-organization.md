---
layout: docs-ja
title: System Organization
permalink: /manuals/v1/ja/system-organization/
---

# System Organization #

システムのディレクトリは理解の容易な単純な構造です：

    {$system}/
        config/                     # mode-specific config files
            _mode                   # The config mode, &#39;default&#39; by default
            _packages               # Load these packages in order
            default.php             # default config overrides
            dev.php                 # shared development server
            local.php               # local (individual) development server
            prod.php                # production
            stage.php               # staging
            test.php                # testing
        include/                    # generic include-path directory
        package/                    # Aura packages
        tmp/                        # temporary files
        vendor/                     # Composer vendors
        web/                        # web server document root
            .htaccess               # mod_rewrite rules
            cache/                  # public cached files
            favicon.ico             # favicon to reduce error_log lines
            index.php               # bootstrap script


`config`: すべてのパッケージに共通する設定ファイル

`Package`: Aura.Autoload, Aura.Di, Aura.Routerのような既存のすべてのAuraパッケージ、それにAuraパッケージとして作成するパッケージ

`tmp`: キャッシュや設定ファイルなどのテンポラリーファイル

`vendor`: Doctrine, Propel, Twigなどすべてのサードパーティのライブラリとcomposerでインストールするライブラリあなたには、作曲家を介してインストールするすべてのもの。

`web`: webフォルダはユーザーに公開されます

パッケージの構成の詳細とどのようにあなた自身のパッケージを作成するかは次の章で紹介します。
