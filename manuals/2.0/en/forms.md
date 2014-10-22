---
layout: docs2-en
title: Forms
previous_page: View
previous_page_url: /manuals/2.0/en/view/
next_page: Validation
next_page_url: /manuals/2.0/en/validation/
---

# Forms

Forms are an integral part of web application. Add `foa/filter-input-bundle` and `foa/filter-input-bundle` to your `composer.json` and install the dependencies.

```json
{
    // more
    "require": {
        // more
        "foa/filter-input-bundle": "~1.1",
        "foa/filter-intl-bundle": "~1.1"
    }
}
```

## Usage

Inorder to create a form, we need to extend the `Aura\Input\Form` class and override the `init()` method.

An example is shown below.

```php
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

        // set input fields
        // hint the view layer to treat the first_name field as a text input,
        // with size and maxlength attributes
        $this->setField('first_name', 'text')
             ->setAttribs(array(
                 'name' => "contact[first_name]",
                 'id' => 'first_name',
                'size' => 20,
                'maxlength' => 20,
             ));

        // hint the view layer to treat the state field as a select, with a
        // particular set of options (the keys are the option values,
        // and the values are the displayed text)
        $this->setField('state', 'select')
             ->setAttribs(array(
                 'name' => "contact[state]",
                 'id' => 'state',
             ))
             ->setOptions($states);

        $this->setField('message', 'textarea')
            ->setAttribs([
                'name' => "contact[message]",
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
```

> Note : We are using v1 components of input, intl, filter.

## Configuration

If you have type hinted in the constructor where you need `App\Input\ContactForm` the [di](/manuals/2.0/en/di/) is smart enough to inject the dependencies.

You can also do as below

```php
$di->params['Vendor\Package\SomeDomain']['contact_form'] = $di->lazyNew('App\Input\ContactForm');
```

## Populating

Form can be populated using `fill()` method.

```php
$this->contact_form->fill($_POST);
```

> In aura/cocoframework term it will be [$this->request->post->get()](/manuals/2.0/en/request/)

## Validating User Input

You can validate the form via the `filter()` method.

```php
// apply the filters
$pass = $this->contact_form->filter();

// did all the filters pass?
if ($pass) {
    // yes input is valid.
} else {
    // no; user input is not valid.
}
```

## Rendering

Assuming you have passed the `ContactForm` object, and the variable assigned is `contact_form` you can use the `get` method on the form object to get the hints of field, and pass to input helper.

An example is given below :

```php
echo $this->input($this->contact_form->get('first_name'));
```
