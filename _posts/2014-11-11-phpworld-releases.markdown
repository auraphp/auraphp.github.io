---
title: PHP World Releases!
layout: post
tags : [release]
author : Hari KT
---

This release is to remind about the [phpworld](http://world.phparch.com/) conference happening at Washington DC. If you are there [Paul M Jones](http://paul-m-jones.com), the creator and lead on Aura, is giving talks on [It Was Like That When I Got Here: Steps Toward Modernizing a Legacy Codebase](http://mlaphp.com/) and [Action-Domain-Responder: A Web-Specific Refinement of MVC](https://pmjones.github.io/adr). Check out the [schedule](http://world.phparch.com/speakers/#49998).

## Releases

Many of the Aura libraries got quick releases. It was busy days that we couldn't blog each one seprately. So here is a quick update on what is happening.

### Aura.Accept

[Aura.Accept](https://github.com/auraphp/Aura.Accept/releases/tag/2.0.0) as extracted from [Aura.Web](https://github.com/auraphp/Aura.Accept) got stable release.

An example how you could make use of content-negotiation is shown below.

{% highlight php %}
<?php
// assume the request indicates these Accept values (XML is best, then CSV,
// then anything else)
$_SERVER['HTTP_ACCEPT'] = 'application/xml;q=1.0,text/csv;q=0.5,*;q=0.1';

// create the accept factory
$accept_factory = new AcceptFactory($_SERVER);

// create the accept object
$accept = $accept_factory->newInstance();

// assume our application has `application/json` and `text/csv` available
// as media types, in order of highest-to-lowest preference for delivery
$available = array(
    'application/json',
    'text/csv',
);

// get the best match between what the request finds acceptable and what we
// have available; the result in this case is 'text/csv'
$media = $accept->negotiateMedia($available);
echo $media->getValue(); // text/csv
{% endhighlight %}

Consider looking into the docs [for more information](https://github.com/auraphp/Aura.Accept/blob/2.0.0/README.md#instantiation)

### Aura.Di

[Aura.Di](https://github.com/auraphp/Aura.Di/releases/tag/2.1.0) released 2.1.0 which incorporates functionality to optionally disable auto-resolution. By default it remains enabled, but this default may change in a future version. This is regarding the [issue 68](https://github.com/auraphp/Aura.Di/issues/68)

- Add Container::setAutoResolve(), Factory::setAutoResolve(), etc. to allow disabling of auto-resolution

- When auto-resolution is disabled, Factory::newInstance() now throws Exception\MissingParam when a constructor param has not been defined

- ContainerBuilder::newInstance() now takes a third param to enable/disable auto-resolution

- AbstractContainerTest now allows you to enable/disable auto-resolve for the tests via a new getAutoResolve() method

Consider looking into the docs [for more information](https://github.com/auraphp/Aura.Di/blob/2.1.0/README.md#a-note-about-auto-resolution)

### Aura.Auth

[Aura.Auth](https://github.com/auraphp/Aura.Auth/releases/tag/2.0.0-beta2) released beta-2.

The `PdoAdapter::buildSelectWhere()` now honors the custom column name provided by the user.

{% highlight php %}
<?php
$auth_factory = new \Aura\Auth\AuthFactory($_COOKIE);
$pdo = new \PDO(...);
$hash = new PasswordVerifier(PASSWORD_BCRYPT);
$cols = array('username', 'md5password');
$from = 'accounts';
$pdo_adapter = $auth_factory->newPdoAdapter($pdo, $hash, $cols, $from);
{% endhighlight %}

How to make use of [OAuth Adapters](https://github.com/auraphp/Aura.Auth/tree/2.0.0-beta2#oauth-adapters) is documented. Thanks to [Frost](https://github.com/mfrost503)

Before it is too late please give your feedback on [remember me functionality](https://github.com/auraphp/Aura.Auth/issues/4).

### Aura.Router

[Aura.Router](https://github.com/auraphp/Aura.Router/releases) getting more awesome!

- 2.1.0 : Added Router::generateRaw() to generate routes with raw data.

- 2.1.1 : Fixed allow simplest possible match of a single Accept header type without a Q value.

- [2.2.0](https://github.com/auraphp/Aura.Router/releases/tag/2.2.0) : Allow easier specification of $values['action'] directly from RouteCollection::add*() by passing a third param as the action value.

{% highlight php %}
<?php
$router->add(
    'say_hello',
    '/hello/{name}',
    function ($params) {
        // Do the needful escaping
        echo "Hello " . $params['name'];
    });
{% endhighlight %}

### Aura.Project_Kernel

[Aura.Project_Kernel](https://github.com/auraphp/Aura.Project_Kernel/releases/tag/2.1.0) now have `Factory::newKernel()` and `Factory::newContainer()` have an added param, `$auto_resolve`, to allow you enable/disable auto-resolution in the container.

### Other Releases

Other libraries that got doc update, turn off auto-resolution in tests and other minor issues fixed are:

- [Aura.Cli_Kernel](https://github.com/auraphp/Aura.Cli_Kernel/releases/tag/2.0.1)
- [Aura.Web_Kernel](https://github.com/auraphp/Aura.Web_Kernel/releases/tag/2.0.1)
- [Aura.Cli](https://github.com/auraphp/Aura.Cli/releases/tag/2.0.1)
- [Aura.Html](https://github.com/auraphp/Aura.Html/releases/tag/2.1.1)
- [Aura.Session](https://github.com/auraphp/Aura.Session/releases/tag/2.0.0-beta2)
- [Aura.View](https://github.com/auraphp/Aura.View/releases/tag/2.0.1)
- [Aura.Web](https://github.com/auraphp/Aura.Web/releases/tag/2.0.1).

## Framework documentation

Added [Quick start tutorial](http://auraphp.com/framework/2.x/en/quick-start/) without database connectivity for Version 2. The  [framework documentation](http://auraphp.com/framework/2.x/en/) has been updated. If you find something missing open an issue or [send pull requests](https://github.com/auraphp/auraphp.github.com/tree/master/framework/2.x/en)


## Other tutorials

Some were confused on the usage of Aura.View and Aura.Html so we have  [https://github.com/harikt/AuraViewExample](https://github.com/harikt/AuraViewExample)

How to make use of Aura.Router and Aura.Dispatcher [https://github.com/harikt/router-dispatcher](https://github.com/harikt/router-dispatcher)

### Conclusion

Thanks to [the many contributors in the Aura community](http://auraphp.com/community) who made these releases possible!
