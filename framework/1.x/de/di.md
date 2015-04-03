---
layout: docs-de
title: Dependency Injection
permalink: /framework/1.x/de/di/
---

# Dependency Injection #

Das Aura DI package stellt einen Dependency Injection Container
([Mehr Infos](https://de.wikipedia.org/wiki/Dependency_Injection))
mit den folgenden Funktionen:

- Native Unterstützung von Konstruktor- und Setter-basierender Injektion

- "lazy-loading" von "Services"

- Vererbbare Konfirguration von Konstruktor und Setter Paramtern

Wenn man dieses Package mit Factory Klassen kombiniert,
kann man die Objekt Konfiguration, Konstruktion und Nutzung trennen.
Dies ermöglicht große Flexibilität und "Überprüfbarkeit" (Unit-Tests).

Es würde den Rahmen dieser Dokumentation sprengen, die Design-Pattern
wie "Inversion of Control" oder "Dependency Injection" zu erklären.
Ein guter Artikel dazu ist hier zu finden:
<http://martinfowler.com/articles/injection.html> by Martin Fowler.

## Instanziierung den Container ##

Das Aura DI package kommt mit einem Instanz-Skript, welches eine neue
DI Instanz zurückgibt:

{% highlight php %}
<?php
$di = require '/path/to/Aura.Di/scripts/instance.php';
{% endhighlight %}

Alternativ kannst Du die Aura DI `'src/'`  zu deinem Autoloader hinzufügen
und anschließend es selber instantiieren:

{% highlight php %}
<?php
use Aura\Di\Container;
use Aura\Di\Forge;
use Aura\Di\Config;

$di = new Container(new Forge(new Config));
{% endhighlight %}

Der `Container` ist der "Haupt-Behälter".  Unterstützende Objekte sind:

- ein `Config` Objekt zum Sammeln, Wiedergeben und Kombinierung von Settern und Konstruktor Paramteren

- ein `Forge` zur Objekt-Erstellung unter Berücksichtung der `Config` Werte.

Wir werden diese Objekte garnicht gebrauchen, da der `Container` dies für
uns übernimmt.


## Setting Services ##

Für das folgende Beispiel erstellen wir ein Service der eine Datenbank
Verbindung zurückgibt. Diese hypotetische Verbindungs-Klasse ist folgendermaßen
definiert:

{% highlight php %}
<?php
namespace Beispiel\Package;

class Database
{
    public function __construct($hostname, $username, $password)
    {
        // ... make the database connection
    }
}
{% endhighlight %}

Von diesem einfachen Service kommen wir direkt zu einem sehr komplexen
in vier Schritten. Jede dieser Variationen ist eine korrekte Nutzung
des DI Containers; jedes mit seinen eigenen Stärken und Schwächen.

## Variation 1: Eager Loading ##

In dieser Variation erstellen wir ein neues Objekt mittels des
`new` Operators.

{% highlight php %}
<?php
$di->set('database', new \Beispiel\Package\Database(
    'localhost', 'user', 'passwd'
));
{% endhighlight %}

Jetzt wird das Datenbank Objekt erstellt, sobald wir es in den Container *packen*.
Das bedeuted aber auch, dass es immer erstellt wird, auch wenn wir es nie nutzen.

## Variation 2: Lazy Loading ##

Diesmal sieht es sehr ähnlich aus, aber wir umschließen unser Statement mit einer
anonymen Funktion.

{% highlight php %}
<?php
$di->set('database', function () {
    return new \Beispiel\Package\Database('localhost', 'user', 'passwd');
});
{% endhighlight %}

Jetzt wird das Objekt erstellt, wenn wir es aus dem Container *bekommen*,
indem wir `$di->get('database')` ausführen. Dieses Prinzip nennt man
lazy-loading, da das Objekt erst dann erstellt wird, wenn wir es brauchen.

## Variation 3: Konstrukto Parameter ##

Nun brauchen wir den `new` Operator garnicht, sondern nutzen die
`$di->newInstance()` Methode. Wir nutzen trotzdem noch die anonyme Funktion,
um vom lazy-loading gebrauch zu machen.

{% highlight php %}
<?php
$di->set('database', function () use ($di) {
    return $di->newInstance('Beispiel\Package\Database', [
        'hostname' => 'localhost',
        'username' => 'user',
        'password' => 'passwd',
    ]);
});
{% endhighlight %}

Die `newInstance()` Methode nutzt das `Forge` Objekt um den Konstruktor zu reflektieren
(PHP Reflections). Wir können also Argumente als assoziativen Array angeben.
Die Reihenfolge im Array ist hierbei egal. Leere Parameter werden mit den
Standart Werten (falls definiert) ausgefüllt.

## Variation 4: Klassen Konstrukto Parameter ##

Hier definieren wir eine Konfiguration für die `Database` Klasse
seperat von der lazy-loaded Objekt-Erstellung.

{% highlight php %}
<?php
$di->params['Beispiel\Package\Database'] = [
    'hostname' => 'localhost',
    'username' => 'user',
    'password' => 'passwd',
];

$di->set('database', function () use ($di) {
    return $di->newInstance('Beispiel\Package\Database');
});
{% endhighlight %}

Bei der Objekt-Erstellung überprüft das `Forge` Objekt die `$di->params`
Werte für die Klasse die gerade initiziert wird. Diese Werte werden kombiniert
mit den Standart-Werten des Konstruktors bei der Erstellung und werden diesem
mit eingeführt. (erneut, die Reihenfolge spielt dabei keine Rolle, die Schlüssel des Arrays
müssen mit den Parameter-Namen übereinstimmen).

Nun haben wir erfolgreich die Konfiguration und Erstellung des Objektes
seperiert und lazy-loading von Objekten ermöglicht.

## Variation 5: Die lazyNew() Methode ##

Diesmal rufen wir die `lazyNew()` Methode auf, welche das
"use a closure to return a new instance" (auf Deutsch:
"Nutze eine anonyme Funktion zum Erstellen einer neuen Instanz")
Idiom  folgt.

{% highlight php %}
<?php
$di->params['Beispiel\Package\Database'] = [
    'hostname' => 'localhost',
    'username' => 'user',
    'password' => 'passwd',
];

$di->set('database', $di->lazyNew('Beispiel\Package\Database'));
{% endhighlight %}


## Variation 5a: Überschreibe Klassen Konstruktor Parameter ##

`$di->params` Werte werden diesmal überschrieben.

{% highlight php %}
<?php
$di->params['Beispiel\Package\Database'] = [
    'hostname' => 'localhost',
    'username' => 'user',
    'password' => 'passwd',
];

$di->set('database', $di->lazyNew('Beispiel\Package\Database', [
    'hostname' => 'example.com',
]);
{% endhighlight %}

Werte, die bei der Erstellung übergeben werden, werden bevorzugt genutzt
gegenüber der Konfiguration und jene gegenüber Standart-Werten.


## Services Nutzen ##

Um einen Service aus dem Container zu bekommen, rufen wir `$di->get()` auf.

{% highlight php %}
<?php
$db = $di->get('database');
{% endhighlight %}

Dies wird den Datenbank Service aus dem Container holen; sollte jener
mittels Closure definiert sein, so wird diese ausgeführt und das Objekt
im Container gespeichert.
Von nun an wird immer das gleiche Objekt zurückgegeben.

## Constructor Params Inheritance ##

For the following examples, we will add an `AbstractModel` class and two
concrete classes called `BlogModel` and `WikiModel`. The idea is that all
`AbstractModel` classes need a `Database` connection to interact with one or
more tables in the database.

{% highlight php %}
<?php
namespace Beispiel\Package;

abstract class AbstractModel
{
    protected $db;

    public function __construct(Database $db)
    {
        $this->db = $db;
    }
}

class BlogModel extends AbstractModel
{
    // ...
}

class WikiModel extends AbstractModel
{
    // ...
}
{% endhighlight %}

We will create services for the `BlogModel` and `WikiModel`, and inject the
database service into them as part of the service definition. Using config
inheritance provided by the DI container, we can define the database service
injection through class configuration.

{% highlight php %}
<?php
// default params for the Database class
$di->params['Beispiel\Package\Database'] = [
    'hostname' => 'localhost',
    'username' => 'user',
    'password' => 'passwd',
];

// default params for the AbstractModel class
$di->params['Beispiel\Package\AbstractModel'] = [
    'db' => $di->lazyGet('database'),
];

// define the database service
$di->set('database', $di->lazyNew('Beispiel\Package\Database'));

// define the blog_model service
$di->set('blog_model', $di->lazyNew('Beispiel\Package\BlogModel'));

// define the wiki_model service
$di->set('wiki_model', $di->lazyNew('Beispiel\Package\WikiModel'));
{% endhighlight %}

We do not need to set the value of the `'db'` param for the `BlogModel` and
`WikiModel` directly. Instead, the params for the `AbstractModel` class are
automatically inherited by the child `BlogModel` and `WikiModel` classes, so
the `'db'` constructor param for all `Model` classes automatically gets the
`'database'` service. (We can override that at instantiation time if we like.)

Note the use of the `lazyGet()` method. This is a special method intended for
use with params and setters. If we used `$di->get()`, the container would
instantiate the service at that time. However, using `$di->lazyGet()` allows
the service to be instantiated only when the object being configured is
instantiated. Think of it as a lazy-loading wrapper around the service (which
itself may be lazy-loaded).

We do not need to write our classes in any special way to get the benefit of
this configuration system. Any class with constructor params will be
recognized by the configuration system, so long as we instantiate it via
`$di->newInstance()`or `$di->lazyNew()`.


## Factories and Dependency Fulfillment ##

Creating a service for each of the model objects in our application can become
tiresome. We may need to create other models, and we don't want to have to
create a separate service for each one. In addition, we may need to create
model objects from within another object. Finally, we don't want to create
model objects until we actually need them. This is where we can make use of
factories.

Below, we will define three new classes: a factory to create model objects for
us, an abstract `PageController` class that uses the model factory, and a
`BlogController` class that needs an instance of a blog model. We will
populate the `ModelFactory` with a map of model names to factory objects that
will create the mapped objects.

{% highlight php %}
<?php
namespace Beispiel\Package;

class ModelFactory
{
    // a map of model names to factory closures
    protected $map = [];

    public function __construct($map = [])
    {
        $this->map = $map;
    }

    public function newInstance($model_name)
    {
        $factory = $this->map[$model_name];
        $model = $factory();
        return $model;
    }
}

abstract class PageController
{
    protected $model_factory;

    public function __construct(ModelFactory $model_factory)
    {
        $this->model_factory = $model_factory;
    }
}

class BlogController extends PageController
{
    public function exec()
    {
        $blog_model = $this->model_factory('blog');
        // ... get data from the blog model and return it ...
    }
}
{% endhighlight %}

Now we can set up the DI container as follows:

{% highlight php %}
<?php
// default params for database connections
$di->params['Beispiel\Package\Database'] = [
    'hostname' => 'localhost',
    'username' => 'user',
    'password' => 'passwd',
];

// default params for the AbstractModel class
$di->params['Beispiel\Package\AbstractModel'] = [
    'db' => $di->lazyGet('database'),
];

// default params for the model factory
$di->params['Beispiel\Package\ModelFactory'] = [
    // a map of model names to model factories
    'map' => [
        'blog' => $di->newFactory('Beispiel\Package\BlogModel'),
        'wiki' => $di->newFactory('Beispiel\Package\WikiModel'),
    ],
];

// default params for page controllers
$di->params['Beispiel\Package\PageController'] = [
    'model_factory' => $di->lazyGet('model_factory'),
];

// the database service; note that we can use lazyNew() and the
// forge will do all the setup for us
$di->set('database', $di->lazyNew('Beispiel\Package\Database'));

// the model factory service
$di->set('model_factory', $di->lazyNew('Beispiel\Package\ModelFactory'));
{% endhighlight %}

When we create an instance of the `BlogController` and run it ...

{% highlight php %}
<?php
$blog_controller = $di->newInstance('Aura\Example\BlogController');
echo $blog_controller->exec();
{% endhighlight %}

... a series of events occurs to fulfill all the dependencies in two steps.
The first step is the instantiation of the `BlogController`:

- The `BlogController` instance inherits its params from `PageController`

- The `PageController` params get the `'model_factory'` service

- The `ModelFactory` params get the `Database` object, creating the
  database connection at that time

The second step is the invocation of `ModelFactory::newInstance()` within
`BlogController::exec()`:

- `BlogController::exec()` invokes `ModelFactory::newInstance()`

- `ModelFactory::newInstance()` creates a new class and passes in the
  `Database` object

At the end of all this, the `BlogController::exec()` method has been able to
retrieve a fully-configured `BlogModel` object without having to specify any
configuration locally.


## Setter Injection ##

Until this point, we have been working via constructor injection. However, we
can work via setter injection as well.

Given the following example class ...

{% highlight php %}
<?php
namespace Example\Package;

class Foo {

    protected $db;

    public function setDb(Database $db)
    {
        $this->db = $db;
    }
}
{% endhighlight %}

... we can define values that should be injected via setter methods:


{% highlight php %}
<?php
// after construction, the Forge will call Foo::setDb()
// and inject the 'database' service object
$di->setter['Example\Package\Foo']['setDb'] = $di->lazyGet('database');

// create a foo_service; on get('foo_service'), the Forge will create the
// Foo object, then call setDb() on it per the setter specification above.
$di->set('foo_service', $di->lazyNew('Example\Package\Foo'));
{% endhighlight %}

Note that we use `lazyGet()` for the injection. As with constructor params, we
could tell the class to use a new `Database` object instead of the shared one
in the `Container`:

{% highlight php %}
<?php
// after construction, call Foo::setDb() and inject a service object.
// we override the default 'hostname' param for the instantiation.
$di->setter['Example\Package\Foo']['setDb'] = $di->lazyNew('Example\Package\Database', [
    'hostname' => 'example.com',
]);

// create a foo_service; on get('foo_service'), the Forge will create the
// Foo object, then call setDb() on it per the setter specification above.
$di->set('foo_service', $di->lazyNew('Example\Package\Foo'));
{% endhighlight %}

Setter configurations are inherited. If you have a class that extends
`Example\Package\Foo` like so ...

{% highlight php %}
<?php
namespace Example\Package;
class Bar extends Foo
{
// ...
}
{% endhighlight %}

... you do not need to add a new setter value for it; the `Forge` reads all
parent setters and applies them. (If you do add a setter value for that class,
it will override the parent setter.)

## Conclusion ##

If we construct our dependencies properly with params, setters, services, and
factories, we will only need to get one object directly from DI container. All
object creation will then happen through the DI container via factory objects
and/or the `Forge` object. We will never need to use the DI container itself
in any of the created objects.
