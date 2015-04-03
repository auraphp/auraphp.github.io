---
layout: docs
title: The aura framework Controller
permalink: /framework/v1/en/controller/
---

# Controller #

The Aura Framework controller is the extended version of Aura Web
package, which provides tools to build web page controllers, including
an `AbstractPage` for action methods, a `Context` class for discovering the
request environment, and a `Response` transfer object that describes the
eventual HTTP response. (Note that the `Response` transfer object is not
itself an HTTP response.) It also includes a `Signal` interface to handle
calls to controller hooks, as well as a `Renderer` interface to allow for
different rendering strategies.

## Creating your controller ##

Let us create a page controller class of our own, extending the
`Aura\Framework\Web\Controller\AbstractPage`


{% highlight php %}
<?php
namespace Vendor\Package\Web;

use Aura\Web\Controller\AbstractPage;

class Page extends AbstractPage
{

}
{% endhighlight %}


## The Execution Cycle ##

The heart of the page controller is its execution cycle.

The `exec()` cycle runs ...

- the `preExec()` hook to prepare for overall execution,

- the `preAction()` hook to prepare for the action,

- the `action()` method to invoke the method determined by the `'action'`
  param value

- the `postAction()` hook,

- the `preRender()` hook to prepare for rendering,

- the `render()` method to render a presentation (this is up to the developer
  to create),

- the `postRender()` hook, and

- the `postExec()` hook to do work after overall execution.

## Action Methods ##

At this point, calling `exec()` on the page controller will do nothing,
because there are no corresponding action methods. To add an action method to
the page controller, create it as a method named `action*()` with any
parameters it needs:


{% highlight php %}
<?php
namespace Example\Package\Web;

use Aura\Web\Controller\AbstractPage;

class Page extends AbstractPage
{
    public function actionHello($noun = null)
    {
        $noun = htmlspecialchars($noun, ENT_QUOTES, 'UTF-8');
        $content = "Hello, {$noun}!";
        $this->data->content = $content;
    }
}
{% endhighlight %}


## The Response Transfer Object ##

To manipulate the response description, use the `$this->response` transfer
object. Some of the important methods are:

- `setContent()`: sets the body content

- `setHeader()`: sets a single header value

- `setCookie()`: sets a single cookie

- `setRedirect()`: sets a `Location:` header for redirect, with an optional
  status code and message (default is `'302 Found'`.)

- `setStatusCode()` and `setStatusText()`: sets the HTTP status code and
  message

For more information, please review the
[Response](https://github.com/auraphp/Aura.Web/blob/master/src/Aura/Web/Response.php) class.


## The Context Object ##

You can discover the web request environment using the `$this->context`
object. Some of the important methods are:

- `getQuery()`: gets a `$_GET` value

- `getPost()`: gets a `$_POST` value

- `getFiles()`: gets a `$_FILES` value

- `getInput()`: gets the raw `php://input` value

- `getJsonInput()`: gets the raw `php://input` value and `json_decode()` it

- `isGet()`, `isPut()`, `isXhr()`, etc.: Tells if the request method was
  `GET`, `PUT`, an `Xml-HTTP-Request`, etc.

For more information, please review the
[Context](https://github.com/auraphp/Aura.Web/blob/master/src/Aura/Web/Context.php) class.

An example "search" action using a "terms" query string parameter might look
like this:


{% highlight php %}
<?php
public function actionSearch()
{
    $terms = $this->context->getQuery('terms');
    if ($terms) {
        // ... now search a database ...
    }
}
{% endhighlight %}


Given a URI with the query string `'?terms=foo+bar+baz'`, the `$terms`
variable would be `'foo bar baz'`. If there was no `'terms'` item in the query
string, `$terms` would be null.

## The Accept Object ##

You can discover what the client will accept using the `$this->accept` object.

- `getContentType()`: returns the accepted media types

- `getCharset()`: returns the accepted character sets

- `getEncoding()`: returns the accepted encodings

- `getLanguage()`: returns the accepted languages


## Data and Rendering ##

Usually, you will not want to manipulate the `Response` content directly in
the action method. It is almost always the case that you will collect data
inside the action method, then hand off to a rendering system to present that
data. The `AbstractPage` provides a `$data` property and a `Renderer` strategy
system for just that purpose.

Here is a naive example of how to use the `$data` property:


{% highlight php %}
<?php
namespace Vendor\Package\Web\Greet;

use Aura\Web\Controller\AbstractPage;

class Page extends AbstractPage
{
    public function actionHello($noun = null)
    {
        $this->data->noun = $noun;
    }
}
{% endhighlight %}

## View template and layout ##

In-order to render the proper template, we need to assign which view and
layout need to be rendered.

You can assign which view it needs to render as `$this->view = 'viewname'`
and which layout need to be assigned via `$this->layout = 'layout-name'`.

If we have multiple views for a single action, ie `json`, `xml`, `html`
we can pass like

{% highlight php %}
$this->view = [
    '.html' => 'greet.html.php',
    '.json' => 'greet.json.php',
    '.xml' => 'greet.xml.php'
];
{% endhighlight %}


{% highlight php %}
<?php
namespace Vendor\Package\Web\Greet;

use Aura\Web\Controller\AbstractPage;

class Page extends AbstractPage
{
    public function actionHello($noun = null)
    {
        $this->data->noun = $noun;
        // only one view
        // $this->view = 'greet';

        $this->view = [
            '.html' => 'greet.html.php',
            '.json' => 'greet.json.php',
            '.xml' => 'greet.xml.php'
        ];

        // only one layout
        // $this->layout = 'layout-name';

        // if you have multiple layouts for different formats
        $this->layout = [
            '.html' => 'default.php',
            '.json' => '',
            '.xml' => ''
        ];
    }
}
{% endhighlight %}

## Configuration ##

Now we need to add two things.

Add your controller to the map in the `config/default.php` file.


{% highlight php %}
<?php
$di->params['Aura\Framework\Web\Controller\Factory']['map']['<name>'] = 'Vendor\Package\Web\Greet\Page';
{% endhighlight %}

Add a route, with the same name of the controller you have specified
above


{% highlight php %}
<?php
$di->get('router_map')->add('<unique-route-name>', '/registered', [
    'values' => [
        'controller' => '<name>',
        'action' => 'hello',
    ],
]);
{% endhighlight %}

Consider reading routing chapter for more information on routes.
