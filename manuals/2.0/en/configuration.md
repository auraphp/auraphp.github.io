---
layout: docs2-en
title: Configuration
permalink: /manuals/2.0/en/configuration/
previous_page: Introduction
previous_page_url: /manuals/2.0/en/
next_page: Routing
next_page_url: /manuals/2.0/en/router/
---

# Configuration

Although configuration is a project-level concern, each aura web and cli kernel and project handles it in the same way.

## Setting The Config Mode

Set the configuration mode using `$_ENV['AURA_CONFIG_MODE']`, either via a server variable or the project-level `config/_env.php` file. Each Aura project comes with `dev` (local development), `test` (shared testing/staging), and `prod` (production) modes pre-defined.

## Config File Location

Project-level configuration files are located in the project-level `config/` directory. Each configuration file is a class that extends _Aura\\Di\\Config_, and represents a configuration mode. Each configuration class has two methods:

- `define()`, which allows you to define params, setters, and services in the project _Container_; and

- `modify()`, which allows you to pull objects out of the _Container_ for programmatic modification. (This happens after the _Container_ is locked, so you cannot add new services or change params and setters here.)

The two-stage configuration system loads all the configuration classes in order by library, kernel, and project, then runs all the `define()` methods, locks the container, and finally runs all the `modify()` methods.

## Mapping Config Modes To Classes

The config modes are mapped to their related config class files via the project-level `composer.json` file in the `extra:aura:config` block. The entry key is the config mode, and the entry value is the class to use for that mode.

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

Config classes are autoloaded via a PSR-4 entry for that project namespace.

The "common" config class is always loaded regardless of the actual
config mode.  For example, if the config mode is `dev`, first the
_Common_ class is loaded, and then the _Dev_ class.


## Changing Config Settings

First, open the config file for the related config mode. To change
configuration params, setters, and services, edit the `define()` method.
To programmatically change a service after all definitions are complete,
edit the `modify()` method.

## Adding A Config Mode

If you want to add a new configuration mode, say `qa`, you need to do three things.

First, create a config class for it in `config/`:

{% highlight php %}
<?php
namespace Aura\Web_Project\_Config;

use Aura\Di\Config;
use Aura\Di\Container;

class Qa extends Config
{
    public function define(Container $di)
    {
        // define params, setters, and services here
    }

    public function modify(Container $di)
    {
        // modify existing services here
    }
}
?>
{% endhighlight %}

Next, edit the project-level `composer.json` file to add the new config
mode with its related class:

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

Finally, run `composer update` so that Composer makes the necessary changes
to the autoloader system.
