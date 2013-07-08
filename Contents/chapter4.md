# Package Organization #

In Aura, all code is grouped into packages. There is no difference between
library packages, support packages, web packages, and so on -- they are all
just "packages."

The package directory structure looks like this:

    [bash]
    Vendor.Package/
        cli/                        # command-line script invokers
        composer.json               # composer/packagist file
        config/                     # package-level configs
            default.php             # default configs
            test.php                # configs for "test" mode
        meta/                       # metadata for packaging scripts
        LICENSE                     # license file
        README.md                   # readme file
        src/                        # the actual source code organized for PSR-0
            Vendor/
                Package/
                    Class.php
        tests/                      # test files for phpunit
            Vendor/
                Package/
                    ClassTest.php
            bootstrap.php
            phpunit.xml
        web/                        # public web assets
            styles/                 # css files
            images/                 # image files
            scripts/                # javascript (or other script) files

In general, your `src/` files should be organized like so:

    [bash]
    Vendor/
        Package/
            Cli/                    # all CLI commands
                CommandName/        # a particular CLI command and its support files
                    Command.php     # the actual command logic
                    data/           # other data for the command
            Web/                    # all web pages
                PageName/           # a particular web page and its support files
                    Page.php        # the actual page action logic
                    views/          # views for the page
                    layouts/        # layouts for the page
                    data/           # other data for the page
            View/
                Helper/
                    HelperName.php  # a view helper

You can of course place other libraries in the package if you like.

## Creating your Package ##

Let's create a package and a page controller, to greet a person

## Package Structure ##

First, create the package structure (just the parts we need):

    [bash]
    $ mkdir -p package/Example.Package/src/Example/Package/Web/Greet/views
    $ mkdir package/Example.Package/config

    Note : If you are in *nix system the -p command works. If you are in 
    windows, you may want to create each directory seprately.

## Page Controller and View ##

Let us create our controller. Open your favourite editor and save the code
below

    [php]
    <?php
    namespace Example\Package\Web\Quick;
    use Aura\Framework\Web\Controller\AbstractPage;
    class Page extends AbstractPage
    {
        public function actionIndex()
        {
            $this->data->message = $this->context->getQuery('name', 'guys!');
            $this->view = 'index';
        }
    }

as `Page.php` in the folder `package/Example.Package/src/Example/Package/Web/Greet/`

Next, we need to create a view for the action. Paste the below code 

    [php]
    <?php
    $this->title()->set('Welcome to the world of Aura Framework!');
    ?>
    <h1>Hey good day <?= $this->message; ?></h1>
    <form method="get" action="<?php echo $this->route('example_package_greet'); ?>" class="form-search">
        <input type="text" name="name" id="name" class="input-medium search-query" placeholder="Name" />
        <input type="submit" name="greet" id="greet" value="Greet" class="btn" />
    </form>
    
and save it as `index.php` in `package/Example.Package/src/Example/Package/Web/Greet/views`
folder.

At this point your package directory should look like this:

    [bash]
    Example.Package/
        src/
            Example/
                Package/
                    Web/
                        Greet/
                            Page.php
                            views/
                                index.php

## Configuration ##

We have not added any files to the autoloader, and have not specified 
the routes. Its time to add it in the configuration.

Open the editor and paste the below contents 

    [php]
    <?php
    /** Example Package configs */
    
    // add the package to the autoloader
    $loader->add('Example\Package\\', dirname(__DIR__) . DIRECTORY_SEPARATOR . 'src');
    
    // add a route to the page and action
    $di->get('router_map')->add('example_package_greet', '/greet', [
        'values' => [
            'controller' => 'greet',
            'action' => 'index',
        ],
    ]);
    
    // map the 'greet' controller value to a page controller class
    $di->params['Aura\Framework\Web\Controller\Factory']['map']['greet'] = 'Example\Package\Web\Greet\Page';

Save the files as `default.php` in `Example.Package/config` folder.

## Loading your package ##

For the framework to load your package and the configuration files, 
you need to add your package in the `{$system}/config/_packages` file.

This is because some packages, depend on another package. So the configuration
needs to be loaded first. The packages are loaded in the order it is 
written in `{$system}/config/_packages` file.

## Try it out ##

It is time to see what we did so far.
Let us use the PHP's built in capability of running it as server from cli 

    $ php -S localhost:8000 web/index.php

Browse `http://localhost:8000/greet` URL and see `Hey good day` and if you 
insert `Bob` in the input box and submit, you will see `Hey good day Bob`
