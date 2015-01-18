---
layout: docs2-en
title: Setting up your virtual host
permalink: /manuals/2.0/en/setup/
previous_page: Command line / console
previous_page_url: /manuals/2.0/en/cli/
---

# Setting up your virtual host

## Apache

We are going to point the virtual host to `aura.localhost`.

Create a file `/etc/apache2/sites-available/aura.localhost` with the below contents.

> Depending upon your apache configuration you may need to add `.conf`

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

`path/to/project` is where you installed the `aura/web-project`.

**NOTE:** Apache 2.4 users might have to add `Require all granted` below `AllowOverride all` in order to prevent a 401 response caused by [the changes in access control](https://httpd.apache.org/docs/2.4/upgrading.html#access).

Enable the site using

{% highlight bash %}
a2ensite aura.localhost
{% endhighlight %}

and reload the apache

{% highlight bash %}
service apache2 reload
{% endhighlight %}

Before we go and check in browser add one more line in the `/etc/hosts`

{% highlight bash %}
127.0.0.1   aura.localhost www.aura.localhost
{% endhighlight %}

## Nginx

The following configuration assumes that you're using PHP as [FPM SAPI](http://php.net/install.fpm).

The configuration file is under `/etc/nginx/sites-available`

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

It could be that you are using old nginx version where `fastcgi.conf` isn't available at `/etc/nginx/`.
In this case you need to create `/etc/nginx/fastcgi.conf` with the following content:

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

# PHP only, required if PHP was built with --enable-force-cgi-redirect
fastcgi_param  REDIRECT_STATUS    200;
{% endhighlight %}

Check `http://aura.localhost` in your favourite browser.

When using configuration above you should set `cgi.fix_pathinfo=0` in `php.ini` in order to avoid numerous unnecessary system `stat()` calls.

Also note that if you plan running an HTTPS server, you have to add `fastcgi_param HTTPS on;` for its host.

