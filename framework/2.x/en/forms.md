---
layout: docs2-en
title: Forms
permalink: /framework/2.x/en/forms/
previous_page: View
previous_page_url: /framework/2.x/en/view/
next_page: Validation
next_page_url: /framework/2.x/en/validation/
---

# Forms

Forms are an integral part of web application. Add `foa/filter-input-bundle` and `foa/filter-input-bundle` to your `composer.json` and install the dependencies.

{% highlight json %}
{
    // more
    "require": {
        // more
        "foa/filter-input-bundle": "~1.1",
        "foa/filter-intl-bundle": "~1.1"
    }
}
{% endhighlight %}

## Usage

Inorder to create a form, we need to extend the `Aura\Input\Form` class and override the `init()` method.

An example is shown below.

{% highlight php %}
<?php
/**
 * {$PROJECT_PATH}/src/App/Input/ContactForm.php
 */
namespace App\Input;

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
        // this will make sure all field names are setup as an array so you can get all fields through $_POST['contact']
        $this->setName('contact');
        // set input fields
        // hint the view layer to treat the first_name field as a text input,
        // with size and maxlength attributes
        $this->setField('first_name', 'text')
            ->setAttribs(array(
                'id' => 'first_name',
                'size' => 20,
                'maxlength' => 20,
            ));

        // hint the view layer to treat the state field as a select, with a
        // particular set of options (the keys are the option values,
        // and the values are the displayed text)
        $this->setField('state', 'select')
            ->setAttribs(array(
                 'id' => 'state',
            ))
            ->setOptions($states);

        $this->setField('message', 'textarea')
            ->setAttribs([
                'id' => 'message',
                'cols' => 40,
                'rows' => 5,
            ]);
        // etc.

        // get filter object
        $filter = $this->getFilter();
        // set your filters.
        $filter->addSoftRule('first_name', $filter::IS, 'string');
        $filter->addSoftRule('first_name', $filter::IS, 'strlenMin', 4);
        $filter->addSoftRule('state', $filter::IS, 'inKeys', array_keys($states));
        $filter->addSoftRule('message', $filter::IS, 'string');
        $filter->addSoftRule('message', $filter::IS, 'strlenMin', 6);
    }
}
{% endhighlight %}

> Note : We are using v1 components of input, intl, filter.

## Configuration

If you have type hinted in the constructor where you need `App\Input\ContactForm` the [di](/framework/2.x/en/di/) is smart enough to inject the dependencies.

You can also do as below

{% highlight php %}
$di->params['Vendor\Package\SomeDomain']['contact_form'] = $di->lazyNew('App\Input\ContactForm');
{% endhighlight %}

## Populating

Form can be populated using `fill()` method.

{% highlight php %}
$this->contact_form->fill($_POST['contact']);
{% endhighlight %}

> In aura term it will be [$this->request->post->get()](/framework/2.x/en/request/)

## Validating User Input

You can validate the form via the `filter()` method.

{% highlight php %}
// apply the filters
$pass = $this->contact_form->filter();

// did all the filters pass?
if ($pass) {
    // yes input is valid.
} else {
    // no; user input is not valid.
}
{% endhighlight %}

## Rendering

Assuming you have passed the `ContactForm` object, and the variable assigned is `contact_form` you can use the `get` method on the form object to get the hints of field, and pass to input helper.

An example is given below :

{% highlight php %}
echo $this->input($this->contact_form->get('first_name'));
{% endhighlight %}
