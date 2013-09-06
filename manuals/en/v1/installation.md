---
layout: site
title: Installation
---

# Installation #

You can use aura framework as a whole downloading the full system tarball
or by cloning the system and then manually install packages, or via composer.

## Tarball ##

 -    Download the latest tarball from the
      [downloads directory](http://auraphp.com/system/downloads).

 -    Uncompress the tarball to your document root.

 -    Browse to `/path/to/system/web/index.php` to see "Hello World!".


## Cloning via Git ##

The `git` command must be in your `$PATH` for this to work.

 -    Clone the Aura `system` repository to your document root. 
 This will give you the overall system skeleton along with an `update.php` script.

        $ git clone https://github.com/auraphp/system.git

 -    Run `php update.php` to install the remaining library packages from 
 the system as below.

        $ cd system
        $ php update.php
        
    You can subsequently update the system and all library packages (including
    installation of newly-available packages) with the same `php update.php`
    command.

 -    Browse to `/path/to/system/web/index.php` to see "Hello World!".
    
## Via Composer ##

The easiest way create an aura framework based project is via 
[composer](http://getcomposer.org). For this you need to 
[install composer](http://getcomposer.org/doc/00-intro.md#installation-nix)

 -    Let us create our new aura framework based project. Open the terminal and run 

{% highlight php %}
    composer create-project -s dev aura/system <your-project-dir>
{% endhighlight %}
    
 -    Browse to `/path/to/system/web/index.php` to see "Hello World!".
    
The above command will install all the dependencies for the aura project.
What it does under the hood is something like 

    git clone https://github.com/auraphp/system.git <your-project-dir>
    cd <your-project-dir>
    composer install

> Assuming you have composer installed globally.
