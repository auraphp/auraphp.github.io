---
layout: docs
title: Creating Forms
permalink: /framework/1.x/en/forms/
---

# Creating Forms #

Every webpage needs some sort of forms. Please do read chapter on
Dependency Injection and Generic Factory.

## Form class ##

In-order to create forms, we need to extend `Aura\Input\Form` class
and override the `init()` method.

We use `setField` method to add an input type.

Let us create an example form

{% highlight php %}
<?php
namespace Example\Package\Input;

use Aura\Input\Form;

class ContactForm extends Form
{
    public function init()
    {
        $states = array(
            'AL' => 'Alabama',
            'AK' => 'Alaska',
            'AZ' => 'Arizona',
            'AR' => 'Arkansas',
            // ...
         );

        // set input fields
        // hint the view layer to treat the first_name field as a text input,
        // with size and maxlength attributes
        $this->setField('first_name', 'text')
             ->setAttribs(array(
                'size' => 20,
                'maxlength' => 20,
             ));

        // hint the view layer to treat the state field as a select, with a
        // particular set of options (the keys are the option values, and the values
        // are the displayed text)
        $this->setField('state', 'select')
             ->setOptions($states);

        $this->setField('message', 'textarea')
            ->setAttribs([
                'cols' => 40,
                'rows' => 5,
            ]);
        // etc.

        // set input filters
        $filter = $this->getFilter();
        $filter->addSoftRule('first_name', $filter::IS, 'string');
        $filter->addSoftRule('first_name', $filter::IS, 'strlenMin', 4);
        $filter->addSoftRule('state', $filter::IS, 'inKeys', $states);
        $filter->addSoftRule('message', $filter::IS, 'string');
        $filter->addSoftRule('message', $filter::IS, 'strlenMin', 6);
    }
}
{% endhighlight %}

> Read passing options into forms, to see how the states can also be provided.

## Setting Filters On The Form ##

The aura framework uses Aura.Filter package for form validation and
sanitization. The `Aura\Input\Form` object has `getFilter()` method
which is an object of `Aura\Framework\Input\Filter` an extended class of
`Aura\Filter\RuleCollection`.

Look into Validation and Sanitization for
the different types of Rules, how you can create your own rules.

## Extended Controller for form creation ##

The aura framework has a very basic controller. You need to extend
the controller according to your needs.

{% highlight php %}
<?php
namespace Example\Package\Web;

use Aura\Framework\Web\Controller\AbstractPage;
use Aura\Input\FormFactory;

abstract class PageController extends AbstractPage
{
    protected $form_factory;

    public function setFormFactory(FormFactory $form_factory)
    {
        $this->form_factory = $form_factory;
    }

    public function getFormFactory()
    {
        return $this->form_factory;
    }
}
{% endhighlight %}

## Configuration ##

In-order to make use of the dependency injection, we need to map the
form names to `Aura\Input\FormFactory`.

{% highlight php %}
$di->setter['Example\Package\Web\PageController']['setFactory'] =
    $di->lazyGet('input_form_factory');
{% endhighlight %}

You can map as many forms into the `FormFactory` as

{% highlight php %}
$di->params['Aura\Input\FormFactory']['map']['form.contact'] =
    $di->newFactory('Example\Package\Input\ContactForm');
{% endhighlight %}

## Form object ##

Form objects can then be created in the extend class
`Example\Package\Web\PageController` of controller as

{% highlight php %}
$form = $this->getFormFactory()->newInstance('form.contact');
{% endhighlight %}

## Populating and Validating User Input ##

We can fill the form with user input and see if the user input is valid.
First, we use the `fill()` method to set the input values.
We then call the `filter()` method to see if the user input is valid;
if not, we show the messages for the inputs
that did not pass their filter rules.

{% highlight php %}
<?php
// fill the form with $_POST array elements
// that match the form input names.
$form->fill($this->context->getPost());

// apply the filters
$pass = $form->filter();

// did all the filters pass?
if ($pass) {
    // yes
    echo "User input is valid." . PHP_EOL;
} else {
    // no; get the messages.
    echo "User input is not valid." . PHP_EOL;
    foreach ($form->getMessages() as $name => $messages) {
        foreach ($messages as $message) {
            echo "Input '{$name}': {$message}" . PHP_EOL;
        }
    }
}
{% endhighlight %}

## Applying CSRF Protections ##

Aura.Input comes with an interface for implementations that prevent
[cross-site request forgery](https://www.owasp.org/index.php/Cross-Site_Request_Forgery)
attacks.  To make use of this interface, we will need to provide our own
CSRF implementation; this is because it depends on two things that Aura.Input
cannot provide: an object that tells us if the user is authenticated or not,
and an object to generate and retain a cryptographically secure random value
for the CSRF token value.  A pseudo-implementation follows.

{% highlight php %}
<?php
namespace Example\Package\Input;

use Aura\Input\AntiCsrfInterface;
use Aura\Input\Fieldset;
use Example\Package\CsrfObject;
use Example\Package\UserObject;

class AntiCsrf implements AntiCsrfInterface
{
    // a user object indicating if the user is authenticated or not
    protected $user;

    // a csrf value generation object
    protected $csrf;

    public function __construct(UserObject $user, CsrfObject $csrf)
    {
        $this->user = $user;
        $this->csrf = $csrf;
    }

    // implementation of setField(); adds a CSRF token field to the fieldset.
    public function setField(Fieldset $fieldset)
    {
        if (! $this->user->isAuthenticated()) {
            // user is not authenticated so CSRF cannot occur
            return;
        }

        // user is authenticated, so add a CSRF token
        $fieldset->setField('__csrf_token', $this->csrf->getValue());
    }

    // implementation of isValid().  return true if CSRF token is present
    // and of the correct value, or return false if not.
    public function isValid(array $data)
    {
        if (! $this->user->isAuthenticated()) {
            // user is not authenticated so CSRF cannot occur
            return true;
        }

        // user is authenticated, so check to see if input has a CSRF token
        // of the correct value
        return isset($data['__csrf_token'])
            && $data['__csrf_token'] == $this->csrf->getValue();
    }
}
{% endhighlight %}

We can then pass an instance of the implementation into our form using the
`setAntiCsrf()` method.


{% highlight php %}
<?php
$form = $this->getFactory()->newInstance('form.contact');
$anti_csrf = new AntiCsrf(new UserObject, new CsrfObject);
$form->setAntiCsrf($anti_csrf);
{% endhighlight %}

Calling `setAntiCsrf()` adds a CSRF field to the form.

When we call `fill()` on the form, it will check the CSRF value in the data
to make sure it is correct.  If not, the form will not fill in the data, and
throw an exception and will not fill in the data.


## In The View Layer ##

The Aura.Input package only describes the user inputs and their values. It
does not render forms or fields; that task is for the view layer. However,
Aura.Input does allow for "hints" that the view layer can use for rendering.

When defining a field, we can set the type as the second parameter to the
`setField()` method. This can be an HTML input type, an HTML tag name, a
custom name that the view layer recognizes, or anything else; recall that
these are only hints for the view, and are not strict. In addition, we can use
fluent methods to set attributes and options on the field.

{% highlight php %}
// hint the view layer to treat the state field as a select, with a
// particular set of options (the keys are the option values, and the values
// are the displayed text)
$this->setField('state', 'select')
     ->setOptions(array(
        'AL' => 'Alabama',
        'AK' => 'Alaska',
        'AZ' => 'Arizona',
        'AR' => 'Arkansas',
        // ...
     ));
{% endhighlight %}

In our view layer, we can extract the hints for a field using the `get()`
method.

{% highlight php %}
<?php
// get the hints for the state field
$hints = $form->get('state');

// the hints array looks like this:
// $hints = array(
//     'type' => 'select',      # the input type
//     'name' => 'state',       # the input name
//     'attribs' => array(           # attributes as key-value pairs
//         // ...
//     ),
//     'options' => array(           # options as key-value pairs
//         'AL' => 'Alabama',
//         'AZ' => 'Arizona',
//         // ...
//     ),
//     'value' => '',           # the current value of the input
// );
{% endhighlight %}

The [Aura.View](http://github.com/auraphp/Aura.View) package comes with a
series of helpers that can translate the hints array to HTML.

Assuming you have assigned the form object to the view from controller
action as

{% highlight php %}
$this->data->form = $form;
{% endhighlight %}

then from view, you can display the form as

{% highlight php %}
echo $this->field($this->form->get('state'));
{% endhighlight %}

## Passing Options Into Forms ##

Frequently, the application using the inputs will have a standard set of
options used across all forms and filters. It would be inconvenient to have
to duplicate those standard options for each different form, so Aura.Input
allows us to pass in any object at all as a container for application-wide
options.  We can then use those options for building the inputs.

For example, we would construct our `ContactForm` with an arbitrary options
object ...

{% highlight php %}
<?php
namespace Example\Package;

class Options
{
    protected $states = array(
        'AL' => 'Alabama',
        'AK' => 'Alaska',
        'AZ' => 'Arizona',
        'AR' => 'Arkansas',
        // ...
    );

    public function getStates()
    {
        return $this->states;
    }
}
{% endhighlight %}

... and then use it in the `init()` method of form remove the `$states`
array with `$options->getStates()`.

{% highlight php %}
<?php
namespace Example\Package;

use Aura\Input\Form;

class ContactForm extends Form
{
    protected function init()
    {
        // the options object injected via constructor
        $options = $this->getOptions();

        $states = $options->getStates();

        // set input fields
        $this->setField('state', 'select')
             ->setOptions($states);
    }
}
{% endhighlight %}

## Configuration for Options ##

{% highlight php %}
$di->set('contact_options', function () use ($di) {
    return $di->newInstance('Example\Package\Options');
});

$di->params['Example\Package\ContactForm']['options'] = $di->lazyGet('contact_options');
{% endhighlight %}
