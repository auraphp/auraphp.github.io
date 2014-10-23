---
layout: docs2-en
title: Dependency Injection
permalink: /manuals/2.0/en/di/
previous_page: Response
previous_page_url: /manuals/2.0/en/response/
next_page: View
next_page_url: /manuals/2.0/en/view/
---

# Dependency Injection

Aura.Di is a dependency injection container system with the following features:

* constructor and setter injection

* explicit and implicit auto-resolution of typehinted constructor parameter values

* configuration of setters across interfaces and traits

* inheritance of constructor parameter and setter method values

* lazy-loaded services, values, and instances

* instance factories

We will concentrate on constructor and setter injection in this chapter for easiness.
It is recommend you should read [Aura.Di documentation](https://github.com/auraphp/Aura.Di/blob/develop-2/README.md)

## Setting And Getting Services

A "service" is an object stored in the _Container_ under a unique name.
Any time you `get()` the named service, you always get back the same object instance.

{% highlight php %}
<?php
// define the Example class
class Example
{
    // ...
}

// set the service
$di->set('service_name', new Example);

// get the service
$service1 = $di->get('service_name');
$service2 = $di->get('service_name');

// the two service objects are the same
var_dump($service1 === $service2); // true
?>
{% endhighlight %}

That usage is great if we want to create the _Example_ instance at the same time we set the service. However, we generally want to create the service instance at the moment we *get* it, not at the moment we *set* it.

The technique of delaying instantiation until `get()` time is called "lazy loading." To lazy-load an instance, use the `lazyNew()` method on the _Container_ and give it the class name to be created:

{% highlight php %}
<?php
// set the service as a lazy-loaded new instance
$di->set('service_name', $di->lazyNew('Example'));
?>
{% endhighlight %}

Now the service is created only when we we `get()` it, and not before.
This lets us set as many services as we want, but only incur the overhead of creating the instances we actually use.

## Constructor Injection

When we use the _Container_ to instantiate a new object, we often need
to inject (i.e., set) constructor parameter values in various ways.

## Default Parameter Values

We can define default values for constructor parameters using the `$di->params` array on the _Container_.

Let's look at a class that takes some constructor parameters:

{% highlight php %}
<?php
class ExampleWithParams
{
    protected $foo;
    protected $bar;
    public function __construct($foo, $bar)
    {
        $this->foo = $foo;
        $this->bar = $bar;
    }
}
?>
{% endhighlight %}

If we were to try to set a service using `$di->lazyNew('ExampleWithParams')`,
the instantiation would fail. The `$foo` param is required, and the _Container_
does not know what to use for that value.

To remedy this, we tell the _Container_ what values to use for
each _ExampleWithParams_ constructor parameter by name using the `$di->params` array:

{% highlight php %}
<?php
$di->params['ExampleWithParams']['foo'] = 'foo_value';
$di->params['ExampleWithParams']['bar'] = 'bar_value';
?>
{% endhighlight %}

Now when a service is defined with `$di->lazyNew('ExampleWithParams')`,
the instantiation will work correctly. Each time we create an
_ExampleWithParams_ instance through the _Container_, it will apply
the `$di->params['ExampleWithParams']` values.

## Instance-Specific Parameter Values

If we want to override the default `$di->params` values for a specific
new instance, we can pass a `$params` array as the second argument to
`lazyNew()` to merge with the default values. For example:

{% highlight php %}
<?php
$di->set('service_name', $di->lazyNew(
    'ExampleWithParams',
    array(
        'bar' => 'alternative_bar_value',
    )
));
?>
{% endhighlight %}

This will leave the `$foo` parameter default in place, and override
the `$bar` parameter value, for just that instance of the _ExampleWithParams_.

## Lazy-Loaded Services As Parameter Values

Sometimes a class will need another service as one of its parameters.
By way of example, the following class needs a database connection:

{% highlight php %}
<?php
class ExampleNeedsService
{
    protected $db;
    public function __construct($db)
    {
        $this->db = $db;
    }
}
?>
{% endhighlight %}

To inject a shared service as a parameter value, use `$di->lazyGet()`
so that the service object is not created until the _ExampleNeedsService_ object is created:

{% highlight php %}
<?php
$di->params['ExampleNeedsService']['db'] = $di->lazyGet('db_service');
?>
{% endhighlight %}

This keeps the service from being created until the very moment it is needed. If we never instantiate anything that needs the service, the service itself will never be instantiated.

## Setter Injection

This package supports setter injection in addition to constructor injection. (These can be combined as needed.)

## Setter Method Values

After the _Container_ constructs a new instance of an object, we can specify that certain methods should be called with certain values immediately after instantiation by using the `$di->setter` array.  Say we have class like the following:

{% highlight php %}
<?php
class ExampleWithSetter
{
    protected $foo;

    public function setFoo($foo)
    {
        $this->foo = $foo;
    }
}
?>
{% endhighlight %}

We can specify that, by default, the `setFoo()` method should be called with a specific value after construction like so:

{% highlight php %}
<?php
$di->setter['ExampleWithSetter']['setFoo'] = 'foo_value';
?>
{% endhighlight %}

The value can be any valid value: a literal, a call to `lazyNew()` or `lazyGet()`, and so on.

Note, however, that auto-resolution *does not apply* to setter methods.
This is because the _Container_ does not know which methods are setters
and which are "normal use" methods.

Note also that this works only with explicitly-defined setter methods.
Setter methods that exist only via magic `__call()` will not be honored.

## Instance-Specific Setter Values

As with constructor injection, we can note instance-specific setter
values to use in place of the defaults. We do so via the third
argument to `$di->lazyNew()`. For example:

{% highlight php %}
<?php
$di->set('service_name', $di->lazyNew(
    'ExampleWithSetters',
    array(), // no $params overrides
    array(
        'setFoo' => 'alternative_foo_value',
    )
));
?>
{% endhighlight %}
