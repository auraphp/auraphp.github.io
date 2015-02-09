---
layout: docs2-ja
title: Setting up your virtual host
permalink: /manuals/2.0/ja/setup/
previous_page: Command line / console
previous_page_url: /manuals/2.0/ja/cli/
---

# バーチャルホストの設定

## Apache

バーチャルホストを `aura.localhost` に設定します。

以下を含む `/etc/apache2/sites-available/aura.localhost` ファイルを作成します。

> Apache の設定によっては `.conf` が必要かも知れません

{% highlight bash %}
<VirtualHost *:80>
    ServerName aura.localhost
    ServerAlias www.aura.localhost
    DocumentRoot /path/to/project/web
    <Directory /path/to/project/web>
        DirectoryIndex index.php
        AllowOverride All
    </directory>
</VirtualHost>
{% endhighlight %}

`path/to/project` は `aura/web-project` をインストールした場所です。

**NOTE:** Apache 2.4 のユーザは、[アクセス制御の変更](https://httpd.apache.org/docs/2.4/upgrading.html#access) による 401 レスポンスを避けるために、`AllowOverride all` の下に `Require all granted` を追加しなければいけないかも知れません。

以下でサイトを有効にします

{% highlight bash %}
a2ensite aura.localhost
{% endhighlight %}

そして、Apache を再起動します

{% highlight bash %}
service apache2 reload
{% endhighlight %}

ブラウザでチェックする前に `/etc/hosts` に次の一行を追加します

{% highlight bash %}
127.0.0.1   aura.localhost www.aura.localhost
{% endhighlight %}

## Nginx

以下の設定は PHP を [FPM SAPI](http://php.net/install.fpm) として使っていることを前提としています。

設定ファイルは `/etc/nginx/sites-available` 以下にあります。

{% highlight bash %}
server {
    listen   80;
    root /path/to/aura-project/web;
    index index.php index.html index.htm;
    server_name aura.localhost;

    location / {
        try_files $uri $uri/ /index.php?$args;
    }

    error_page 404 /404.html;

    location ~ \.php$ {
        include fastcgi.conf;
        fastcgi_pass unix:/var/run/php5-fpm.sock;
        try_files $uri =404;
    }
}
{% endhighlight %}

もし `/etc/nginx/` の中に `fastcgi.conf` のない古いバージョンの Nginx を使っているなら、
以下を含む `/etc/nginx/fastcgi.conf` を作成する必要があります。

{% highlight bash %}
fastcgi_param  SCRIPT_FILENAME    $document_root$fastcgi_script_name;
fastcgi_param  QUERY_STRING       $query_string;
fastcgi_param  REQUEST_METHOD     $request_method;
fastcgi_param  CONTENT_TYPE       $content_type;
fastcgi_param  CONTENT_LENGTH     $content_length;

fastcgi_param  SCRIPT_NAME        $fastcgi_script_name;
fastcgi_param  REQUEST_URI        $request_uri;
fastcgi_param  DOCUMENT_URI       $document_uri;
fastcgi_param  DOCUMENT_ROOT      $document_root;
fastcgi_param  SERVER_PROTOCOL    $server_protocol;
fastcgi_param  HTTPS              $https if_not_empty;

fastcgi_param  GATEWAY_INTERFACE  CGI/1.1;
fastcgi_param  SERVER_SOFTWARE    nginx/$nginx_version;

fastcgi_param  REMOTE_ADDR        $remote_addr;
fastcgi_param  REMOTE_PORT        $remote_port;
fastcgi_param  SERVER_ADDR        $server_addr;
fastcgi_param  SERVER_PORT        $server_port;
fastcgi_param  SERVER_NAME        $server_name;

# PHP が --enable-force-cgi-redirect でビルドされている場合のみ必要
fastcgi_param  REDIRECT_STATUS    200;
{% endhighlight %}

お気に入りのブラウザで `http://aura.localhost` をチェックします。

上の設定を使う場合、不必要な非常に多くの `stat()` システムコールを避けるために、`php.ini` の中で `cgi.fix_pathinfo=0` を設定します。

また、HTTPS サーバを稼働する場合、そのホストに `fastcgi_param HTTPS on;` を追加する必要があることに注意してください。
