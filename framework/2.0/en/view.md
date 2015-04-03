---
layout: docs2-en
title: View
permalink: /framework/2.0/en/view/
previous_page: Dependency Injection
previous_page_url: /framework/2.0/en/di/
next_page: Forms
next_page_url: /framework/2.0/en/forms/
---

# View

Add `"foa/html-view-bundle": "2.*"` to your `composer.json` and run `composer update` to install the dependencies.

## Escaping Output

When you generate output via templates, you **must** escape it appropriately for security purposes. This means that HTML templates should use HTML escaping, CSS templates should use CSS escaping, XML templates should use XML escaping, PDF templates should use PDF escaping, RTF templates should use RTF escaping, and so on.

## Registering View Templates

Assuming you have a _Aura\View\View_ object, we need to add named templates to its view template registry. These are typically PHP file paths, but templates can also be closures.  For example:

{% highlight php %}
<?php
$view_registry = $view->getViewRegistry();
$view_registry->set('browse', '/path/to/views/browse.php');
?>
{% endhighlight %}

The `browse.php` file may look something like this:

{% highlight php %}
<?php
foreach ($this->items as $item) {
    $id = $this->escape()->html($item['id']);
    $name = $this->escape()->html($item['name']);
    echo "Item ID #{$id} is '{$name}'." . PHP_EOL;
?>
{% endhighlight %}

Note that we use `echo`, and not `return`, in templates.

> The template logic will be executed inside the _View_ object scope,
> which means that `$this` in the template code will refer to the _View_
> object. The same is true for closure-based templates.

## Setting Data

We will almost always want to use dynamic data in our templates. To assign a data collection to the _View_, use the `setData()` method and either an array or an object. We can then use data elements as if they are properties on the
_View_ object.

{% highlight php %}
<?php
$view->setData(array(
    'items' => array(
        array(
            'id' => '1',
            'name' => 'Foo',
        ),
        array(
            'id' => '2',
            'name' => 'Bar',
        ),
        array(
            'id' => '3',
            'name' => 'Baz',
        ),
    )
));
?>
{% endhighlight %}

> Recall that `$this` in the template logic refers to the _View_ object,
> so that data assigned to the _View_ can be accessed as properties on `$this`.

The `setData()` method will overwrite all existing data in the _View_ object. The `addData()` method, on the other hand, will merge with existing data in the _View_ object.

## Invoking A One-Step View

Now that we have registered a template and assigned some data to the _View_, we tell the _View_ which template to use, and then invoke the _View_:

{% highlight php %}
<?php
$view->setView('browse');
$output = $view->__invoke(); // or just $view()
?>
{% endhighlight %}

The `$output` in this case will be something like this:

{% highlight php %}
Item #1 is 'Foo'.
Item #2 is 'Bar'.
Item #3 is 'Baz'.
{% endhighlight %}

## Using Sub-Templates (aka "Partials")

Sometimes we will want to split a template up into multiple pieces. We can
render these "partial" template pieces using the `render()` method in our main template code.

First, we place the sub-template in the view registry (or in the layout registry if it for use in layouts). Then we `render()` it from inside the main template code. Sub-templates can use any naming scheme we like. Some systems use the convention of prefixing partial templates with an underscore, and the following example will use that convention.

Second, we can pass an array of variables to be extracted into the local scope of the partial template. (The `$this` variable will always be available regardless.)

For example, let's split up our `browse.php` template file so that it uses a sub-template for displaying items.

{% highlight php %}
<?php
// add templates to the view registry
$view_registry = $view->getViewRegistry();

// the "main" template
$view_registry->set('browse', '/path/to/views/browse.php');

// the "sub" template
$view_registry->set('_item', '/path/to/views/_item.php');
?>
{% endhighlight %}

We extract the item-display code from `browse.php` into `_item.php`:

{% highlight php %}
<?php
$id = $this->escape()->html($item['id']);
$name = $this->escape()->html($item['name']);
echo "Item ID #{$id} is '{$name}'." . PHP_EOL;
?>
{% endhighlight %}

Then we modify `browse.php` to use the sub-template:

{% highlight php %}
<?php
foreach ($this->items as $item) {
    echo $this->render('_item', array(
        'item' => $item,
    ));
?>
{% endhighlight %}

The output will be the same as earlier when we invoke the view.

> Alternatively, we can use `include` or `require` to execute a
> PHP file directly in the current template scope.


## Using Sections

Sections are similar to sub-templates (aka "partials") except that they are captured inline for later use. In general, they are used by view templates to capture output for layout templates.

For example, we can capture output in the view template to a named section ...

{% highlight php %}
<?php
// begin buffering output for a named section
$this->beginSection('local-nav');

echo "<div>";
// ... echo the local navigation output ...
echo "</div>";

// end buffering and capture the output
$this->endSection();
?>
{% endhighlight %}

... and then use that output in a layout template:

{% highlight php %}
<?php
if ($this->hasSection('local-nav')) {
    echo $this->getSection('local-nav');
} else {
    echo "<div>No local navigation.</div>";
}
?>
{% endhighlight %}

In addition, the `setSection()` method can be used to set the section body directly, instead of capturing it:

{% highlight php %}
<?php
$this->setSection('local-nav', $this->render('_local-nav.php'));
?>
{% endhighlight %}

## Rendering a Two-Step View

To wrap the main content in a layout as part of a two-step view, we register
layout templates with the _View_ and then call `setLayout()` to pick one of
them for the second step. (If no layout is set, the second step will not be
executed.)

Let's say we have already set the `browse` template above into our view registry. We then set a layout template called `default` into the layout registry:

{% highlight php %}
<?php
$layout_registry = $view->getLayoutRegistry();
$layout_registry->set('default', '/path/to/layouts/default.php');
?>
{% endhighlight %}

The `default.php` layout template might look like this:

{% highlight php %}
<html>
<head>
    <title>My Site</title>
</head>
<body>
<?= $this->getContent(); ?>
</body>
</html>
{% endhighlight %}

We can then set the view and layout templates on the _View_ object and then invoke it:

{% highlight php %}
<?php
$view->setView('browse');
$view->setLayout('default');
$output = $view->__invoke(); // or just $view()
?>
{% endhighlight %}

The output from the inner view template is automatically retained and becomes available via the `getContent()` method on the _View_ object. The layout template then calls `getContent()` to place the inner view results in the outer layout template.

> We can also call `setLayout()` from inside the view template, allowing
> us to pick a layout as part of the view logic.

The view template and the layout template both execute inside the same _View_ object. This means:

- All data values are shared between the view and the layout. Any data assigned to the view, or modified by the view, is used as-is by the layout.

- All helpers are shared between the view and the layout. This sharing situation allows the view to modify data and helpers before the layout is executed.

- All section bodies are shared between the view and the layout. A section that is captured from the view template can therefore be used by the layout template.

## Closures As Templates

The view and layout registries accept closures as templates. For example, these are closure-based equivlents of the `browse.php` and `_item.php` template files above:

{% highlight php %}
<?php
$view_registry->set('browse', function () {
    foreach ($this->items as $item) {
        echo $this->render('_item', array(
            'item' => $item,
        ));
    }
);

$view_registry->set('_item', function (array $vars) {
    extract($vars, EXTR_SKIP);
    $id = $this->escape()->html($item['id']);
    $name = $this->escape()->html($item['name']);
    echo "Item ID #{$id} is '{$name}'." . PHP_EOL;
);
?>
{% endhighlight %}

When registering a closure-based template, continue to use `echo` instead of `return` when generating output. The closure is rebound to the _View_ object, so `$this` in the closure will refer to the _View_ just as it does in a file-based template.

A bit of extra effort is required with closure-based sub-templates (aka "partials"). Whereas file-based templates automatically extract the passed array of variables into the local scope, a closure-based template must:

1. Define a function parameter to receive the injected variables (the `$vars` param in the `_item` template); and,

2. Extract the injected variables using `extract()`. Alternatively, the closure may use the injected variables parameter directly.

Aside from that, closure-based templates work exactly like file-based templates.

## Built in Helpers via Aura.Html

## Escaper

Escaping output is **absolutely necessary** from a security perspective. This package comes with an `escape()` helper that has four escaping methods:

- `$this->escape()->html('foo')` to escape HTML values
- `$this->escape()->attr('foo')` to escape unquoted HTML attributes
- `$this->escape()->css('foo')` to escape CSS values
- `$this->escape()->js('foo')` to escape JavaScript values

Here is a contrived example of the various `escape()` helper methods:

{% highlight php %}
<head>

    <style>
        body: {
            color: <?= $this->escape()->css($theme->color) ?>;
            font-size: <?= $this->escape()->css($theme->font_size) ?>;
        }
    </style>

    <script language="javascript">
        var foo = "<?= $this->escape()->js($js->foo); ?>";
    </script>

</head>

<body>

    <h1><?= $this->escape()->html($blog->title) ?></h1>

    <p class="byline">
        by <?= $this->escape()->html($blog->author) ?>
        on <?= $this->escape()->html($blog->date) ?>
    </p>

    <div id="<?php $this->escape()->attr($blog->div_id) ?>">
        <?= $blog->raw_html ?>
    </div>

</body>
{% endhighlight %}

Unfortunately, escaper functionality is verbose, and can make the template code look cluttered.  There are two ways to mitigate this.

The first is to assign the `escape()` helper to a variable, and then invoke it as a callable. Here is a contrived example of the various escaping methods as callables:


{% highlight php %}
<?php
// assign the escaper helper properties to callable variables
$h = $this->escape()->html;
$a = $this->escape()->attr;
$c = $this->escape()->css;
$j = $this->escape()->js;
?>

<head>

    <style>
        body: {
            color: <?= $c($theme->color) ?>;
            font-size: <?= $c($theme->font_size) ?>;
        }
    </style>

    <script language="javascript">
        var foo = "<?= $j($js->foo); ?>";
    </script>

</head>

<body>

    <h1><?= $h($blog->title) ?></h1>

    <p class="byline">
        by <?= $h($blog->author) ?>
        on <?= $h($blog->date) ?>
    </p>

    <div id="<?php $a($blog->div_id) ?>">
        <?= $blog->raw_html ?>
    </div>

</body>
{% endhighlight %}

Alternatively, the _Escaper_ class used by the `escape()` helper comes with four static methods to reduce verbosity and clutter:  `h()`, `a()`, `c()`, `j()`, and. These escape values for HTML content values, unquoted HTML attribute values, CSS values, and JavaScript values, respectively.

> N.b.: In Aura, we generally avoid static methods. However, we feel the tradeoff of less-cluttered templates can be worth using static methods in this one case.

To call the static _Escaper_ methods in a PHP-based template, `use` the _Escaper_ as a short alias name, then call the static methods on the alias.  (If you did not instantiate a _HelperLocatorFactory_, you will need to prepare the static escaper methods by calling `Escaper::setStatic(new Escaper)`.)

Here is a contrived example of the various static methods:

{% highlight php %}
<?php use Aura\Html\Escaper as e; ?>

<head>

    <style>
        body: {
            color: <?= e::c($theme->color) ?>;
            font-size: <?= e::c($theme->font_size) ?>;
        }
    </style>

    <script language="javascript">
        var foo = "<?= e::j($js->foo); ?>";
    </script>

</head>

<body>

    <h1><?= e::h($blog->title) ?></h1>

    <p class="byline">
        by <?= e::h($blog->author) ?>
        on <?= e::h($blog->date) ?>
    </p>

    <div id="<?php e::a($blog->div_id) ?>">
        <?= $blog->raw_html ?>
    </div>

</body>
{% endhighlight %}

## Tag Helpers

Use a helper by calling it as a method on the _HelperLocator_. The available helpers are:

- [a/anchor](#a)
- [base](#base)
- [img/image](#img)
- [label](#label)
- [links](#links)
- [metas](#metas)
- [ol](#ol)
- [scripts / scriptsfoot](#scripts)
- [ul](#ul)
- [styles](#styles)
- [tag](#tag)
- [title](#title)

There is also a series of [helpers for forms](#form-helpers).

### a

Helper for `<a>` tags.

{% highlight php %}
<?php
echo $this->a(
    'http://auraphp.com',       // (string) href
    'Aura Project',             // (string) text
    array('id' => 'aura-link')  // (array) optional attributes
);
?>
<a href="http://auraphp.com" id="aura-link">Aura Project</a>
{% endhighlight %}

### base

Helper for `<base>` tags.

{% highlight php %}
<?php
echo $this->base(
    '/base' // (string) href
);
?>
<base href="/base" />
{% endhighlight %}

### img

Helper for `<img>` tags.

{% highlight php %}
<?php
echo $this->img(
    '/images/hello.jpg',            // (string) image href src
    array('id' => 'image-id');      // (array) optional attributes
?>
<!-- if alt is not specified, uses the basename of the image href -->
<img src="/images/hello.jpg" alt="hello" id="image-id">

{% endhighlight %}

### label

Helper for `<label>` tags.

{% highlight php %}
<?php
echo $this->label(
    'Label For Field',          // (string) label text
    array('for' => 'field'));   // (array) optional attributes
?>
<label for="field">Label For Field</label>

<?php
// wrap html with the label before the html
echo $this->label('Foo: ')
            ->before($this->input(array(
                'type' => 'text',
                'name' => 'foo',
            )));
?>
<label>Foo: <input type="text" name="foo" value="" /></label>

<?php
// wrap html with the label after the html
echo $this->label(' (Foo)')
            ->after($this->input(array(
                'type' => 'text',
                'name' => 'foo',
            )));
?>
<label><input type="text" name="foo" value="" /> (Foo)</label>
{% endhighlight %}

### links

Helper for a set of generic `<link>` tags. Build a set of links with `add()` then output them all at once.

{% highlight php %}
<?php
// build the array of links with add()
$this->links()->add(array(
    'rel' => 'prev',                // (array) link attributes
    'href' => '/path/to/prev',
));

$this->links()->add(array(        // (array) link attributes
    'rel' => 'next',
    'href' => '/path/to/next',
));

// output the links
echo $this->links();
?>
<link rel="prev" href="/path/to/prev" />
<link ref="next" href="/path/to/next" />

<?php
// alternatively, echo a chain of add() calls
echo $this->links()
    ->add(array(                    // (array) link attributes
        'rel' => 'prev',
        'href' => '/path/to/prev',
    ))
    ->add(array(                    // (array) link attributes
        'rel' => 'next',
        'href' => '/path/to/next',
    ));
?>
<link rel="prev" href="/path/to/prev" />
<link ref="next" href="/path/to/next" />
{% endhighlight %}

### metas

Helper for a set of `<meta>` tags. Build a set of metas with `add*()` then output them all at once.

{% highlight php %}
<?php
// add an http-equivalent meta
$this->metas()->addHttp(
    'Location',         // (string) header label
    '/redirect/to/here' // (string) header value
);

// add a name meta
$this->metas()->addName(
    'foo',              // the meta name
    'bar'               // the meta content
);

// output the metas
echo $this->meta();
?>
<meta http-equiv="Location" content="/redirect/to/here">
<meta name="foo" content="bar">

<?php
// alternatively, echo a chain of add calls
echo $this->metas()
    ->addHttp(
        'Location',         // (string) header label
        '/redirect/to/here' // (string) header value
    )
    ->addName(
        'foo',              // the meta name
        'bar'               // the meta content
    );
?>
<meta http-equiv="Location" content="/redirect/to/here">
<meta name="foo" content="bar">
{% endhighlight %}

### ol

Helper for `<ol>` tags with `<li>` items.  Build the set of items (both raw and escaped) then output them all at once.

{% highlight php %}
<?php
// start the list of items
$this->ol(array(                  // (array) optional attributes
    'id' => 'test',
));

// add a single item to be escaped
$this->ol()->item(
    'foo',                          // (string) the item text
    array('id' => 'foo')            // (array) optional attributes
);

// add several items to be escaped
$this->ol()->items(array(         // (array) the items to add
    'bar',                          // the item text, no item attributes
    'baz' => array('id' => 'baz'),  // item text with item attributes
));

// add a single raw item not to be escaped
$this->ol()->rawItem(
    '<a href="/first">First</a>',   // (string) the raw item html
    array('id' => 'first')          // (array) optional attributes
);

// add several raw items not to be escaped
$this->ol()->rawItems(array(         // (array) the raw items to add
    '<a href="/prev">Prev</a>',     // the item text, no item attributes
    '<a href="/next">Next</a>',
    '<a href="/last">Last</a>' => array('id' => 'last') // text and attributes
));

// output the list
echo $this->ol();
?>
<ol id="test">
    <li id="foo">foo</li>
    <li>bar</li>
    <li id="baz">baz</li>
    <li><a href="/first">First</a></li>
    <li><a href="/pref">First</a></li>
    <li><a href="/next">First</a></li>
    <li><a href="/last">First</a></li>
</ol>
{% endhighlight %}

### scripts

Helper for a set of `<script>` tags. Build a set of script links, then output them all at once.

{% highlight php %}
<?php
// add a single script
$this->scripts()->add('/js/middle.js');

// add another script after that one
$this->add('/js/last.js');

// add another at a specific priority order
echo $this->scripts(
    '/js/first.js',     // (string) the script src
    50                  // (int) optional priority order (default 100)
);

// add a conditional script
$this->scripts->addCond(
    'ie6',              // (string) the condition
    '/js/ie6.js',       // (string) the script src
    25                  // (int) optional priority order (default 100)
));

?>
<!--[if ie6]><script src="/js/ie6.js" type="text/javascript"></script><![endif]-->
<script src="/js/first.js" type="text/javascript"></script>
<script src="/js/middle.js" type="text/javascript"></script>
<script src="/js/last.js" type="text/javascript"></script>
{% endhighlight %}

The `scriptsFoot()` helper works the same way, but is intended for placing a separate set of scripts at the end of the HTML body.

### ul

Helper for `<ul>` tags with `<li>` items.  Build the set of items (both raw and escaped) then output them all at once.

{% highlight php %}
<?php
// start the list of items
$this->ul(array(                  // (array) optional attributes
    'id' => 'test',
));

// add a single item to be escaped
$this->ul()->item(
    'foo',                          // (string) the item text
    array('id' => 'foo')            // (array) optional attributes
);

// add several items to be escaped
$this->ul()->items(array(         // (array) the items to add
    'bar',                          // the item text, no item attributes
    'baz' => array('id' => 'baz'),  // item text with item attributes
));

// add a single raw item not to be escaped
$this->ul()->rawItem(
    '<a href="/first">First</a>',   // (string) the raw item html
    array('id' => 'first')          // (array) optional attributes
);

// add several raw items not to be escaped
$this->ul()->rawItems(array(      // (array) the raw items to add
    '<a href="/prev">Prev</a>',     // the item text, no item attributes
    '<a href="/next">Next</a>',
    '<a href="/last">Last</a>' => array('id' => 'last') // text and attributes
));

// output the list
echo $this->ul();
?>
<ul id="test">
    <li id="foo">foo</li>
    <li>bar</li>
    <li id="baz">baz</li>
    <li><a href="/first">First</a></li>
    <li><a href="/prev">Prev</a></li>
    <li><a href="/next">Next</a></li>
    <li><a href="/last">Last</a></li>
</ul>
{% endhighlight %}

### styles

Helper for a set of `<link>` tags for stylesheets. Build a set of style links, then output them all at once. As with the `script` helper, you can optionally set the priority order for each stylesheet.

{% highlight php %}
<?php
// add a stylesheet link
$this->styles()->add(
    '/css/middle.css',          // (string) the stylesheet href
    array('media' => 'print')   // (array) optional attributes
);

// add another one after that
$this->styles()->add('/css/last.css');

// add one at a specific priority order
$this->styles()->add(
    '/css/first.css',           // (string) the stylesheet href
    null,                       // (array) optional attributes
    50                          // (int) optional priority order (default 100)
);

// add a conditional stylesheet
$this->styles()->addCond(
    'ie6',                      // (string) the condition
    '/css/ie6.css',             // (string) the stylesheet href
    array('media' => 'print'),  // (array) optional attributes
    25                          // (int) optional priority order (default 100)
);

// output the stylesheet links
echo $this->styles();
?>
<!--[if ie6]><link rel="stylesheet" href="/css/ie6.css" type="text/css" media="print" /><![endif]-->
<link rel="stylesheet" href="/css/first.css" type="text/css" media="screen" />
<link rel="stylesheet" href="/css/middle.css" type="text/css" media="print" />
<link rel="stylesheet" href="/css/last.css" type="text/css" media="screen" />
?>
{% endhighlight %}

### tag

A generic tag helper.

{% highlight php %}
<?php
echo $this->tag(
    'div',                  // (string) the tag name
    array('id' => 'foo')    // (array) optional array of attributes
);
echo $this->tag('/div');
?>
<div id="foo"></div>
{% endhighlight %}

### title

Helper for the `<title>` tag.

{% highlight php %}
<?php
// escaped variations (can be intermixed with raw variations)

// set the title
$this->title()->set('This & That');

// append the title
$this->title()->append(' > Suf1');
$this->title()->append(' > Suf2');

// prepend the title
$this->title()->prepend('Pre1 > ');
$this->title()->prepend('Pre2 > ');

echo $this->title();
?>
<title>Pre2 &gt; Pre1 &gt; This &amp; That &gt; Suf1 &gt; Suf2</title>

<?php
// raw variations (can be intermixed with escaped variations):

// set the title
$this->title()->set('This & That');

// append the title
$this->title()->append(' > Suf1');
$this->title()->append(' > Suf2');

// prepend the title
$this->title()->prepend('Pre1 > ');
$this->title()->prepend('Pre2 > ');

echo $this->title();
?>
<title>Pre2 > Pre1 > This & That > Suf1 > Suf2</title>
{% endhighlight %}

## Form Helpers

## The Form Element

Open and close a form element like so:

{% highlight php %}
<?php
echo $this->form(array(
    'id' => 'my-form',
    'method' => 'put',
    'action' => '/hello-action',
));

echo $this->tag('/form');
?>
<form id="my-form" method="put" action="/hello-action" enctype="multipart/form-data"></form>
{% endhighlight %}

## HTML 5 Input Elements

All of the HTML 5 input helpers use the same method signature: a single descriptor array that formats the input element.

{% highlight php %}
<?php
echo $this->input(array(
    'type'    => $type,     // (string) the element type
    'name'    => $name,     // (string) the element name
    'value'   => $value,    // (string) the current value of the element
    'attribs' => array(),   // (array) element attributes
    'options' => array(),   // (array) options for select and radios
));
?>
{% endhighlight %}

The array is used so that other libraries can generate form element descriptions without needing to depend on Aura.Html for a particular object.

The available input element `type` values are:

- [button](#button)
- [checkbox](#checkbox)
- [color](#color)
- [date](#date)
- [datetime](#datetime)
- [datetime-local](#datetime-local)
- [email](#email)
- [file](#file)
- [hidden](#hidden)
- [image](#image)
- [month](#month)
- [number](#number)
- [password](#password)
- [radio](#radio)
- [range](#range)
- [reset](#reset)
- [search](#search)
- [select](#select) (including options)
- [submit](#submit)
- [tel](#tel)
- [text](#text)
- [textarea](#textarea)
- [time](#time)
- [url](#url)
- [week](#week)

### button

{% highlight php %}
<?php
echo $this->input(array(
    'type'    => 'button',
    'name'    => 'foo',
    'value'   => 'bar',
    'attribs' => array()
));
?>
<input type="button" name="foo" value="bar" />
{% endhighlight %}

### checkbox

The `checkbox` type honors the `value_unchecked` pseudo-attribute as a way to specify a `hidden` element for the (you guessed it) unchecked value. It also honors the pseudo-element `label` to place a label after the checkbox.

{% highlight php %}
<?php
echo $this->input(array(
    'type'    => 'checkbox',
    'name'    => 'foo',
    'value'   => 'y',               // the current value
    'attribs' => array(
        'label' => 'Check me',      // the checkbox label
        'value' => 'y',             // the value when checked
        'value_unchecked' => '0',   // the value when unchecked
    ),
));
?>
<input type="hidden" name="foo" value="n" />
<label><input type="checkbox" name="foo" value="y" checked /> Check me</label>
{% endhighlight %}

### color

{% highlight php %}
<?php
echo $this->input(array(
    'type'    => 'color',
    'name'    => 'foo',
    'value'   => 'bar',
    'attribs' => array()
));
?>
<input type="color" name="foo" value="bar" />
{% endhighlight %}

### date

{% highlight php %}
<?php
echo $this->input(array(
    'type'    => 'date',
    'name'    => 'foo',
    'value'   => 'bar',
    'attribs' => array()
));
?>
<input type="date" name="foo" value="bar" />
{% endhighlight %}

### datetime

{% highlight php %}
<?php
echo $this->input(array(
    'type'    => 'datetime',
    'name'    => 'foo',
    'value'   => 'bar',
    'attribs' => array()
));
?>
<input type="datetime" name="foo" value="bar" />
{% endhighlight %}

### datetime-local

{% highlight php %}
<?php
echo $this->input(array(
    'type'    => 'datetime-local',
    'name'    => 'foo',
    'value'   => 'bar',
    'attribs' => array()
));
?>
<input type="datetime-local" name="foo" value="bar" />
{% endhighlight %}

### email

{% highlight php %}
<?php
echo $this->input(array(
    'type'    => 'email',
    'name'    => 'foo',
    'value'   => 'bar',
    'attribs' => array()
));
?>
<input type="email" name="foo" value="bar" />
{% endhighlight %}

### file

{% highlight php %}
<?php
echo $this->input(array(
    'type'    => 'file',
    'name'    => 'foo',
    'value'   => 'bar',
    'attribs' => array()
));
?>
<input type="file" name="foo" value="bar" />
{% endhighlight %}

### hidden

{% highlight php %}
<?php
echo $this->input(array(
    'type'    => 'hidden',
    'name'    => 'foo',
    'value'   => 'bar',
    'attribs' => array()
));
?>
<input type="hidden" name="foo" value="bar" />
{% endhighlight %}

### image

{% highlight php %}
<?php
echo $this->input(array(
    'type'    => 'image',
    'name'    => 'foo',
    'value'   => 'bar',
    'attribs' => array()
));
?>
<input type="image" name="foo" value="bar" />
{% endhighlight %}

### month

{% highlight php %}
<?php
echo $this->input(array(
    'type'    => 'month',
    'name'    => 'foo',
    'value'   => 'bar',
    'attribs' => array()
));
?>
<input type="month" name="foo" value="bar" />
{% endhighlight %}

### number

{% highlight php %}
<?php
echo $this->input(array(
    'type'    => 'number',
    'name'    => 'foo',
    'value'   => 'bar',
    'attribs' => array()
));
?>
<input type="number" name="foo" value="bar" />
{% endhighlight %}

### password

{% highlight php %}
<?php
echo $this->input(array(
    'type'    => 'password',
    'name'    => 'foo',
    'value'   => 'bar',
    'attribs' => array()
));
?>
<input type="password" name="foo" value="bar" />
{% endhighlight %}

### radio

This element type allows you to generate a single radio input, or multiple radio inputs if you pass an `options` element.

{% highlight php %}
<?php
echo $this->input(array(
    'type'    => 'radio',
    'name'    => 'foo',
    'value'   => 'bar',     // (string) the currently selected radio
    'attribs' => array(),
    'options' => array(     // (array) `value => label` pairs
        'bar' => 'baz',
        'dib' => 'zim',
        'gir' => 'irk',
    ),
));
?>
<label><input type="radio" name="foo" value="bar" checked /> baz</label>
<label><input type="radio" name="foo" value="dib" /> zim</label>
<label><input type="radio" name="foo" value="gir" /> irk</label>
{% endhighlight %}

### range

{% highlight php %}
<?php
echo $this->input(array(
    'type'    => 'range',
    'name'    => 'foo',
    'value'   => 'bar',
    'attribs' => array()
));
?>
<input type="range" name="foo" value="bar" />
{% endhighlight %}

### reset

{% highlight php %}
<?php
echo $this->input(array(
    'type'    => 'reset',
    'name'    => 'foo',
    'value'   => 'bar',
    'attribs' => array()
));
?>
<input type="reset" name="foo" value="bar" />
{% endhighlight %}

### search

{% highlight php %}
<?php
echo $this->input(array(
    'type'    => 'search',
    'name'    => 'foo',
    'value'   => 'bar',
    'attribs' => array()
));
?>
<input type="search" name="foo" value="bar" />
{% endhighlight %}

### select

Helper for a `<select>` tag with `<option>` tags. The pseudo-attribute `placeholder` is honored as a placeholder label when no option is selected. Using the attribute `'multiple' => true` will set up a multiple select, and automatically add `[]` to the name if it is not already there.

{% highlight php %}
<?php
echo $this->input(array(
    'type'    => 'select',
    'name'    => 'foo',
    'value'   => 'bar',
    'attribs' => array(
        'placeholder' => 'Please pick one',
    ),
    'options' => array(
        'baz' => 'Baz Label',
        'dib' => 'Dib Label',
        'bar' => 'Bar Label',
        'zim' => 'Zim Label',
    ),
));
?>
<select name="foo">
    <option disabled value="">Please pick one</option>
    <option value="baz">Baz Label</option>
    <option value="dib">Dib Label</option>
    <option value="bar" selected>Bar Label</option>
    <option value="zim">Zim Label</option>
</select>

<?php
// programatically build option-by-option
$select = $this->input(array(
    'type'    => 'select',
    'name'    => 'foo',
));

// set the currently selected value(s)
$select->selected('bar');   // (string|array) the currently selected value(s)

// set attributes for the select tag
$select->attribs(array(
    'placeholder' => 'Please pick one',
));

// add a single option
$select->option(
    'baz',                  // (string) the option value
    'Baz Label',            // (string) the option label
    array()                 // (array) optional attributes for the option tag
);

// add several options
$select->options(array(
    'dib' => 'Dib Label',
    'bar' => 'Bar Label',
    'zim' => 'Zim Label',
));

// output the select
echo $select;
?>
<select name="foo">
    <option disabled value="">Please pick one</option>
    <option value="baz">Baz Label</option>
    <option value="dib">Dib Label</option>
    <option value="bar" selected>Bar Label</option>
    <option value="zim">Zim Label</option>
</select>
{% endhighlight %}

The helper also supports option groups. If an `options` array value is itself an array, the key for that element will be used as an `<optgroup>` label and the array of values will be options under that group.

{% highlight php %}
<?php
echo $this->input(array(
    'type'    => 'select',
    'name'    => 'foo',
    'value'   => 'bar',
    'attribs' => array(),
    'options' => array(
        'Group A' => array(
            'baz' => 'Baz Label',
            'dib' => 'Dib Label',
        ),
        'Group B' => array(
            'bar' => 'Bar Label',
            'zim' => 'Zim Label',
        ),
    ),
));
?>
<select name="foo">
    <optgroup label="Group A">
        <option value="baz">Baz Label</option>
        <option value="dib">Dib Label</option>
    </optgroup>
    <optgroup label="Group B">
        <option value="bar" selected>Bar Label</option>
        <option value="zim">Zim Label</option>
    </optgroup>
</select>

<?php
// or do so programmatically
$select = $this->input(array(
    'type'    => 'select',
    'name'    => 'foo',
));

// set the currently selected value(s)
$select->selected('bar');   // (string|array) the currently selected value(s)

// start an option group
$select->optgroup('Group A');

// add several options
$select->options(array(
    'baz' => 'Baz Label',
    'dib' => 'Dib Label',
));

// start another option group (sub-groups are not allowed by HTML spec)
$select->optgroup('Group B');

// add a single option
$select->option(
    'bar',                  // (string) the option value
    'Bar Label',            // (string) the option label
    array()                 // (array) optional attributes for the option tag
);

// add a single option
$select->option(
    'zim',                  // (string) the option value
    'Zim Label',            // (string) the option label
    array()                 // (array) optional attributes for the option tag
);

// output the select
echo $select;
?>
<select name="foo">
    <optgroup label="Group A">
        <option value="baz">Baz Label</option>
        <option value="dib">Dib Label</option>
    </optgroup>
    <optgroup label="Group B">
        <option value="bar" selected>Bar Label</option>
        <option value="zim">Zim Label</option>
    </optgroup>
</select>
{% endhighlight %}

### submit

{% highlight php %}
<?php
echo $this->input(array(
    'type'    => 'submit',
    'name'    => 'foo',
    'value'   => 'bar',
    'attribs' => array()
));
?>
<input type="submit" name="foo" value="bar" />
{% endhighlight %}

### tel

{% highlight php %}
<?php
echo $this->irnput(array(
    'type'    => 'tel',
    'name'    => 'foo',
    'value'   => 'bar',
    'attribs' => array()
));
?>
<input type="tel" name="foo" value="bar" />
{% endhighlight %}

### text

{% highlight php %}
<?php
echo $this->input(array(
    'type'    => 'text',
    'name'    => 'foo',
    'value'   => 'bar',
    'attribs' => array()
));
?>
<input type="text" name="foo" value="bar" />
{% endhighlight %}

### textarea

{% highlight php %}
<?php
echo $this->input(array(
    'type'    => 'textarea',
    'name'    => 'foo',
    'value'   => 'bar',
    'attribs' => array()
));
?>
<textarea name="foo">bar</textarea>
{% endhighlight %}

### time

{% highlight php %}
<?php
echo $this->input(array(
    'type'    => 'time',
    'name'    => 'foo',
    'value'   => 'bar',
    'attribs' => array()
));
?>
<input type="time" name="foo" value="bar" />
{% endhighlight %}

### url

{% highlight php %}
<?php
echo $this->input(array(
    'type'    => 'url',
    'name'    => 'foo',
    'value'   => 'bar',
    'attribs' => array()
));
?>
<input type="url" name="foo" value="bar" />
{% endhighlight %}

### week

{% highlight php %}
<?php
echo $this->input(array(
    'type'    => 'week',
    'name'    => 'foo',
    'value'   => 'bar',
    'attribs' => array()
));
?>
<input type="week" name="foo" value="bar" />
{% endhighlight %}

## Custom Helpers

There are two steps to adding your own custom helpers:

1. Write a helper class.

2. Set a factory for that class into the _HelperLocator_ under a service name.

A helper class needs only to implement the `__invoke()` method.
We suggest extending from _Aura\Html\AbstractHelper_ to get access to indenting,
escaping, etc., but it's not required.

We are going to create a router helper which can return the router object, and from which we can generate routes from the already defined routes.

{% highlight php %}
<?php
<?php
// {$PROJECT_PATH}/src/App/Html/Helper/Router.php
namespace App\Html\Helper;

use Aura\Html\Helper\AbstractHelper;
use Aura\Router\Router as AuraRouter;

class Router
{
    protected $router;

    public function __construct(AuraRouter $router)
    {
        $this->router = $router;
    }

    public function __invoke()
    {
        return $this->router;
    }
}
{% endhighlight %}

Now that we have a helper class, we set a factory for it into the
_HelperLocator_ under a service name.
Therein, we create **and return** the helper class.

Edit `{$PROJECT_PATH}/config/Common.php`

{% highlight php %}
<?php
namespace Aura\Web_Project\_Config;

use Aura\Di\Config;
use Aura\Di\Container;

class Common extends Config
{
    public function define(Container $di)
    {
        // ...
        $di->params['App\Html\Helper\Router']['router'] = $di->lazyGet('aura/web-kernel:router');
        $di->params['Aura\Html\HelperLocator']['map']['router'] = $di->lazyNew('App\Html\Helper\Router');
    }
    // ...
}
{% endhighlight %}

The service name in the _HelperLocator_ doubles as a method name.
This means we can call the helper via `$this->router()`:

{% highlight php %}
<?php echo $this->router()->generate('blog.read', array('id', 2)); ?>
{% endhighlight %}

Note that we can use any service name for the helper, although it is generally useful to name the service for the helper class, and for a word that can be called as a method.
