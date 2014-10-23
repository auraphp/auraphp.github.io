---
layout: docs2-en
title: Setting up your virtual host
permalink: /manuals/2.0/en/setup/
previous_page: Models
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

In ubuntu 12.04 the configuration file is under `/etc/nginx/sites-available`

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
        fastcgi_pass unix:/var/run/php5-fpm.sock;
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
{% endhighlight %}

Check `http://aura.localhost` in your favourite browser.
