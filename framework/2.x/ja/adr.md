---
layout: docs2-ja
title: Action Domain Responder
---

# Action Domain Responder

It is recommend you read the [MVC to ADR draft](https://github.com/pmjones/adr).

Like Aura framework v2 cocoframework promote the usage of one action per class.

In ADR there are 3 components.

1. Action is the logic that connects the Domain and Responder. It uses the request input to interact with the Domain, and passes the Domain output to the Responder.

1. Domain is the logic to manipulate the domain, session, application, and environment data, modifying state and persistence as needed.

1. Responder is the logic to build an HTTP response or response description. It deals with body content, templates and views, headers and cookies, status codes, and so on.

Basically

1. The web handler receives a client request and dispatches it to an _Action_.

1. The _Action_ interacts with the _Domain_.

1. The _Action_ feeds data to the _Responder_. (N.b.: This may include results from the _Domain_ interaction, data from the client request, and so on.)

1. The _Responder_ builds a response using the data fed to it by the _Action_.

1. The web handler sends the response back to the client.

## Responder

Save at `{$PROJECT_PATH}/src/App/Responder/BlogRead.php`

{% highlight php %}
<?php
/**
 * {$PROJECT_PATH}/src/App/Responders/BlogRead.php
 */
namespace App\Responders;

use Aura\View\View;
use Aura\Web\Response;

class BlogRead
{
    protected $data;

    protected $response;

    protected $view;

    public function __construct(Response $response, View $view)
    {
        $this->response = $response;
        $this->view = $view;
        $this->data = (object) array();
        $this->init();
    }

    protected function init()
    {
        $view_registry = $this->view->getViewRegistry();
        $view_registry->set('read', __DIR__ . '/views/read.php');
    }

    public function __get($key)
    {
        return $this->data->$key;
    }

    public function __set($key, $val)
    {
        $this->data->$key = $val;
    }

    public function __isset($key)
    {
        return isset($this->data->$key);
    }

    public function __unset($key)
    {
        unset($this->data->$key);
    }

    public function __invoke()
    {
        $responded = $this->notFound('blog')
                  || $this->responseView('read');

        if ($responded) {
            return $this->response;
        }
    }

    protected function responseView($view)
    {
        $this->view->setView($view);
        $this->view->setData($this->data);
        $this->response->content->set($this->view->__invoke());
        return $this->response;
    }

    protected function notFound($key)
    {
        if (! $this->data->$key) {
            $this->response->status->set(404);
            $this->response->content->set("404 not found");
            return $this->response;
        }
    }
}
{% endhighlight %}

Now modify the actions class `{$PROJECT_PATH}/src/App/Actions/BlogRead.php` to inject the `BlogRead` responder. You also need to inject a _Domain_ service which can fetch the details of the id. We are skipping the service and assume you have some way to get the data.

Remove the _View_ and _Response_ objects from the action class because the responder is responsible for rendering the view and set the response. Now your modified action class will look like

{% highlight php %}
<?php
/**
 * {$PROJECT_PATH}/src/App/Actions/BlogRead.php
 */
namespace App\Actions;

use Aura\Web\Request;
use App\Responders\BlogRead as BlogReadResponder;

class BlogRead
{
    protected $request;

    protected $responder;

    public function __construct(
        Request $request,
        BlogReadResponder $responder
    ) {
        // you may want to inject some service in-order to fetch the details
        $this->request = $request;
        $this->responder = $responder;
    }

    public function __invoke($id)
    {
        $blog = (object) array(
            'id' => $id
        );
        // In real life you want to do something like
        // $blog = $this->service->fetchId($id);
        $this->responder->blog = $blog;
        return $this->responder;
    }
}
{% endhighlight %}

Modify our Closure as a view file and save in `{$PROJECT_PATH}/src/App/Responders/views/read.php`.

{% highlight php %}
<?php echo "Reading blog post {$this->blog->id}!"; ?>
{% endhighlight %}

Time to edit your configuration file `{$PROJECT_PATH}/config/Common.php` .

Modify the class params for `App\Actions\BlogRead` to reflect the changes made to the constructor.

{% highlight php %}
$di->params['App\Actions\BlogRead'] = array(
    'request' => $di->lazyGet('aura/web-kernel:request'),
    'responder' => $di->lazyNew('App\Responders\BlogRead'),
);

$di->params['App\Responders\BlogRead'] = array(
    'response' => $di->lazyGet('aura/web-kernel:response'),
    'view' => $di->lazyNew('Aura\View\View'),
);
{% endhighlight %}

Now time to browse the `http://localhost:8000/blog/read/1` .

### Questions

What have we achieved other than creating lots of classes ?

That is really a good question. We are moving the responsibility to its own layers which will help us in testing the application.
Web applications get evolved even we start small, so testing each and every part is always a great way to move forward.

This help us in to test the action classes, services etc. There are still more room to improve like moving the methods which are always needed for any responder to an _AbstractResponder_ etc.

## Abstract Responder

We have intentionally left not to make _AbstractResponder_ . We feel most of them who are reading the docs will be new
to the concept of ADR. So let us make the necessary changes like removing some of the methods to make an _AbstractResponder_
which can be extended by the _BlogRead_ responder.

{% highlight php %}
<?php
/**
 * {$PROJECT_PATH}/src/App/Responders/AbstractResponder.php
 */
namespace App\Responders;

use Aura\View\View;
use Aura\Web\Response;

abstract class AbstractResponder
{
    protected $data;

    protected $response;

    protected $view;

    public function __construct(Response $response, View $view)
    {
        $this->response = $response;
        $this->view = $view;
        $this->data = (object) array();
        $this->init();
    }

    protected function init()
    {
        // empty by default
    }

    public function __get($key)
    {
        return $this->data->$key;
    }

    public function __set($key, $val)
    {
        $this->data->$key = $val;
    }

    public function __isset($key)
    {
        return isset($this->data->$key);
    }

    public function __unset($key)
    {
        unset($this->data->$key);
    }

    abstract public function __invoke();

    protected function responseView($view)
    {
        $this->view->setView($view);
        $this->view->setData($this->data);
        $this->response->content->set($this->view->__invoke());
        return $this->response;
    }

    protected function notFound($key)
    {
        if (! $this->data->$key) {
            $this->response->status->set(404);
            return $this->response;
        }
    }
}
{% endhighlight %}

Edit your file `{$PROJECT_PATH}/src/App/Responders/BlogRead.php` keeping only an `init()` method and `__invoke()` method. The `init()` helps us to set the views and the path which need to be renderd by the responder.

{% highlight php %}
<?php
/**
 * {$PROJECT_PATH}/src/App/Responders/BlogRead.php
 */
namespace App\Responders;

use Aura\View\View;
use Aura\Web\Response;

class BlogRead extends AbstractResponder
{
    protected function init()
    {
        $view_registry = $this->view->getViewRegistry();
        $view_registry->set('read', __DIR__ . '/views/read.php');
    }

    public function __invoke()
    {
        $responded = $this->notFound('blog')
                  || $this->responseView('read');

        if ($responded) {
            return $this->response;
        }
    }
}
{% endhighlight %}

We also need to make some changes to the `{$PROJECT_PATH}/config/Common.php` file to make use of the inheritance for the DI container rather than we always set the _View_ and _Response_ object.

We are modifying

{% highlight php %}
$di->params['App\Responders\BlogRead'] = array(
    'response' => $di->lazyGet('aura/web-kernel:response'),
    'view' => $di->lazyNew('Aura\View\View'),
);
{% endhighlight %}

to

{% highlight php %}
$di->params['App\Responders\AbstractResponder'] = array(
    'response' => $di->lazyGet('aura/web-kernel:response'),
    'view' => $di->lazyNew('Aura\View\View'),
);
{% endhighlight %}

Basically only the `params['App\Responders\BlogRead']` is changed to `params['App\Responders\AbstractResponder']`

Try out and you will see things working again.
