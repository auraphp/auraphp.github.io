# The View #

The aura framework make use of Aura.View as the default templating, 
but you can also make use of other templating as done in 
[Hari.Extras](https://github.com/harikt/Hari.Extras).
The Aura View package is an implementation of the
[`TemplateView`](http://martinfowler.com/eaaCatalog/templateView.html) pattern,
with support for automatic escaping, path stacks, and helpers. It adheres to
the "use PHP for presentation logic" ideology, and is preceded by systems such
as [`Savant`](http://phpsavant.com),
[`Zend_View`](http://framework.zend.com/manual/en/zend.view.html), and
[`Solar_View`](http://solarphp.com/class/Solar_View).

## Assigning Data from controller ##

    [php]
    $this->data = [
        'foo' => 'value of foo',
        'bar' => 'value of bar',
    ];

We can then refer to the data as properties from within the template script
using `$this`:

    [php]
    // template script
    <?= $this->foo; ?>
    <?= $this->bar; ?>

## Writing Template Scripts ##

Aura View template scripts are written in plain PHP and do not require a new
markup language. The template scripts are executed inside the `Template`
object scope, so use of `$this` refers to the `Template` object. The following
is an example script:

    [php]
    <html>
    <head>
        <title><?= $this->title; ?></title>
    </head>
    <body>
        <p><?= "Hello " . $this->var . '!'; ?></p>
    </body>
    </html>

We can use any PHP code we would normally use. (This will require discipline
on the part of the template script author to restrict himself to
presentation-related logic only.)

We may wish to use the alternative PHP syntax for conditionals and loops:

    [php]
    <?php if ($this->model->hasMessage()): ?>
        <p>The message is <?= $this->model->getMessage(); ?></p>
    <?php endif; ?>

    <ul>
    <?php foreach ($this->list as $item): ?>
        <li><?= $item; ?></li>
    <?php endforeach; ?>
    </ul>

## Escaping Output ##

***Aura View automatically escapes data assigned to the template when you
access that data.*** So, in general, you do not need to manually apply escaping
in your template scripts.

- Strings assigned to the template are automatically escaped as you access
  them; integers, floats, booleans, and nulls are not.

- If you assign an array to the template, its keys and values will be escaped
  as you access them.

- If you assign an object to the template, its properties and method returns
  will also be escaped as you access them.

Here is an example of the business logic to assign data to the template ...

    [php]
    <?php
    /**
     * @var object $obj An object with properties and methods.
     * @var array $arr An associative array.
     * @var string $str A string.
     * @var int|float $num An actual number (not a string representation).
     * @var bool $bool A boolean.
     * @var null $null A null value.
     */
    $this->data = [
        'obj'  => $obj,
        'arr'  => $arr,
        'str'  => $str,
        'num'  => $num,
        'bool' => $bool,
        'null' => null,
    ];


... and here is an example of the automatic escaping in the template:

    [php]
    <?php
    // strings are auto-escaped whenever you access them
    echo $this->str;

    // integers, floats, booleans, nulls, and resources are not escaped
    if ($this->null === null || $this->bool === false) {
        echo $this->num;
    }

    // array keys and values are auto-escaped per the string/number/etc
    // rules listed above
    foreach ($this->arr as $key => $val) {
        // the key and value are already escaped for us
        echo $key . ': ' . $val;
    }

    // object properties and method returns are auto-escaped per the 
    // string/number/etc rules listed above
    echo $this->obj->property;
    echo $this->obj->method();

    // if the object implements Iterator or IteratorAggregate,
    // the iterator keys and values are auto-escaped as well
    foreach ($this->obj as $key => $val) {
        echo $key . ': ' . $val;
    }


Note that automatic escaping occurs at *access* time, not at *assignment*
time, and only occurs when accessing *values assigned to the template*.

## Manual Escaping ##

If you create a variable of your own inside a template, you will need to
escape it yourself using the `escape()` helper:

    [php]
    <?php
    $var = "this & that";
    echo $this->escape($var);


## Raw Data ##

If you want to access the assigned data without escaping applied, use the
`__raw()` method:

    [php]
    <?php
    // get the raw assigned string
    echo $this->__raw()->str;

    // get the count of an assigned array or object
    echo count($this->__raw()->arr);

    // see if the assigned array is empty
    if (! $this->__raw()->arr) {
        echo "Array is empty.";
    }

    // get a raw property from an assigned object;
    // either of the following will work:
    echo $this->__raw()->obj->property;
    echo $this->obj->__raw()->property;

    // get a raw method result from an assigned object;
    // either of the following will work:
    echo $this->__raw()->obj->method();
    echo $this->obj->__raw()->method();

    // check if an object is an instanceof SomeClass
    if ($this->__raw()->obj instanceof SomeClass) {
        // ...
    }

    
Using the raw data is the only way to get a `count()` on an array or a
`Countable` object, or to find the class type of the underlying variable. This
is because the automatic escaping works by wrapping ("decorating") the
underlying variable with an escaper object. The decoration makes it possible
to auto-escape array keys and values, and object properties and methods, but
unfortunately hides things like `implements` and `instanceof` from PHP.

## Double Escaping ##

There is an escaping "gotcha" to look out for when manipulating values after
they are assigned to a template. If you use an assigned value and re-assign
it to the template, the new value will be double-escaped when you access it.

For example, given this business logic ...

    [php]
    <?php
    // business logic
    $this->data->foo = "this & that";

    
... and this template script ...

    [php]
    <?php
    // template script
    $this->bar = $this->foo . " & the other";
    echo $this->bar;


... the output will be `"this &amp;amp; that &amp; the other"`. The output was
double-escaped; this is because the template escaped `$this->foo` for us when
we accessed it and assigned it to `$this->bar`, and then escaped `$this->bar`
for output as well.

When performing manipulations of this kind, use the `__raw()` values instead:

    [php]
    <?php
    // template script
    $this->bar = $this->__raw()->foo . " & the other";
    echo $this->bar;


Now the output will be `"this &amp; that &amp; the other"`, correctly escaped
only once.

## Using Helpers ##

Aura View comes with various `Helper` classes to encapsulate common
presentation logic. These helpers are mapped to the `Template` object through
a `HelperLocator`. We can call a helper in one of two ways:

- As a method on the `Template` object

- Via `getHelper()` to get the helper as an object of its own

We have already discussed the `escape()` helper above. Other helpers that are
part of Aura View include:

- `$this->anchor($href, $text)` returns an `<a href="$href">$text</a>` tag

- `$this->attribs($list)` returns a space-separated attribute list from a
  `$list` key-value pair

- `$this->base($href)` returns a `<base href="$href" />` tag

- `$this->datetime($datestr, $format)` returns a formatted datetime string.

- `$this->image($src)` returns an `<img src="$src" />` tag.

- `$this->input($attribs, $value, $label, $label_attribs)` 
returns an `<input>` tag, optionally wrapped in a `<label>` tag
    
    In general `$this->input(['type' => $type], $value, $label, $label_attribs)` 
    
    `$value`, `$label` and `$label_attribs` are optional.
    
    Supported types:
    
    - `button` : clickable button
    - `checkbox` : checkbox
    - `color` : color picker
    - `date` : date control (year, month and day)
    - `datetime` : date and time control (year, month, day, hour, 
    minute, second, and fraction of a second, UTC time zone)
    - `datetime-local` : date and time control (year, month, day, 
    hour, minute, second, and fraction of a second, no time zone)
    - `email` : e-mail address
    - `file` : file-select field and a "Browse..." button for file uploads
    - `hidden` : hidden input field
    - `image` : image as the submit button
    - `month` : month and year control (no time zone)
    - `number` : field for entering a number
    - `password` : password field
    - `radio` : radio button
    - `range` : control for entering a number whose exact value is not 
    important (like a slider control)
    - `reset` : reset button (resets all form values to default values)
    - `search` : text field for entering a search string
    - `submit` : submit button
    - `tel` : telephone number
    - `text` : (default) single-line text field
    - `time` : time control (no time zone)
    - `url` : URL field
    - `week` : week and year control (no time zone)
    
    Examples are 
    
    - `$this->input(['type' => 'text', ... ], 'field value')`
    
    - `$this->input(['type' => 'checkbox', 'value' => 'yes'], 'yes')`


- `$this->metas()` provides an object with methods that add to, and then
  retrieve, a series of `<meta ... />` tags.

    - `$this->metas()->addHttp($http_equiv, $content)` adds an HTTP-equivalent
      meta tag to the helper.
    
    - `$this->metas()->addName($name, $content)` adds a meta-name tags to the
      helper.
    
    - `$this-metas()->get()` returns all the added tags from the helper.


- `$this->scripts()` provides an object with methods that add to, and then
  retrieve, a series of `<script ... ></script>` tags.

    - `$this->scripts()->add($src)` adds a script tag to the helper.
    
    - `$this->scripts()->addCond($exp, $src)` adds a script tag inside a
      conditional expression to the helper.
    
    - `$this->scripts()->get()` returns all the added tags from the helper.
    

- `$this->styles()` provides an object with methods that add to, and then
  retrieve, a series of `<link rel="stylesheet" ... />` tags.

    - `$this->styles()->add($href)` adds a style tag to the helper.
    
    - `$this->styles()->get()` returns all the added tags from the helper.


- `$this->textarea($attribs, $html)` Returns a `<textarea>`. `$html` is optional.

- `$this->title()` provides an object with methods that manipulate the
  `<title>...</title>` tag.

    - `$this->title()->set($title)` sets the title value.
    
    - `$this->title()->append($suffix)` adds on to the end of title value.
    
    - `$this->title()->prepend($prefix)` adds on to the beginning of the title
      value.
    
    - `$this->title()->get()` returns the title tag and value.


## Template Composition ##

It often makes sense to split one template up into multiple pieces. This
allows us to keep logical separations between different pieces of content. We
might have a header section, a navigation section, a sidebar, and so on.

We can use the `$this->find()` method in a template script to find a template,
and then `include` it wherever we like. For example:

    [php]
    <html>
    <head>
        <?php include $this->find('head'); ?>
    </head>
    <body>
        <?php include $this->find('branding'); ?>
        <?php include $this->find('navigation'); ?>
        <p>Hello, <?= $this->var; ?>!</p>
        <?php include $this->find('foot'); ?>
    </body>
    </html>


Templates that we `include` in this way will share the scope of the template
they are included from.


## Template Partials ##

Template partials are a scope-separated way of splitting up templates. In
doing so, we can pass an array of variables to be used in the partial
template; they will be available under `$this` **in place of** the parent
template variables. For example, given the following partial template ...

    [php]
    <?php
    // partial template named '_item.php'.
    echo "    <li>{$this->item}</li>" . PHP_EOL;


... we can use it from within another template as a partial:

    [php]
    <?php
    // main template. assume $this->list is an array of items.
    foreach ($this->list as $item) {
        $template_name = '_item';
        $template_vars = ['item' => $item];
        echo $this->partial($template_name, $template_vars);
    }


That will run the `$template_name` template script in a separate scope, and
the `$template_vars` array will be available as `$this` properties within that
separate scope.

> N.b.: We can also `fetch()` other templates from within a template;
> template scripts that are fetched in this way will *not* share the scope
> of the template they are called from (although `$this` will still be
> available).


## Writing Helpers ##

There are two steps to adding new helpers:

1. Write a helper class

2. Add that class as a service in the `HelperLocator`

Writing a helper class is straightforward: extend `AbstractHelper` with an
`__invoke()` method. The following helper, for example, applies ROT-13 to a
string.

    [php]
    <?php
    namespace Vendor\Package\View\Helper;
    
    use Aura\View\Helper\AbstractHelper;
    
    class Obfuscate extends AbstractHelper
    {
        public function __invoke($string)
        {
            return str_rot13($input);
        }
    }


Now that we have a helper class, you can add it as a service in the
`HelperLocator` like so:

    [php]
    <?php
    // business logic
    $di->params['Aura\View\HelperLocator']['registry']['obfuscate'] = function () use ($di) {
        return $di->newInstance('Vendor\Package\View\Helper\Obfuscate');
    };
    
The service name in the `HelperLocator` doubles as a method name on the
`Template` object. This means we can call the helper via `$this->obfuscate()`:

    [php]
    <?php
    // template script
    echo $this->obfuscate('plain text');


Note that we can use any method name for the helper, although it is generally
useful to name the service for the helper class.

Please examine the classes in `Aura\View\Helper` for more complex and powerful
examples.
