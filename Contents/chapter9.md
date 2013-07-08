# Generic Factory #

If you are not familiar with dependency injection and how the dependency 
injection container works, please read Dependency injection chapter on 
Aura.Di.

In-order to make use of the dependency injection, when creating models, 
forms etc, it will be good to have a generic factory. The aura framework 
doesn't provide one. 

But let us create it

    [php]
    <?php
    namespace Example\Package;
    
    class GenericFactory
    {
        protected $map;
        
        public function __construct($map = []) 
        {
            $this->map = $map;
        }
        
        public function newInstance($name)
        {
            if (! isset($this->map[$name])) {
                throw new \Exception("$name not mapped");
            }
            $factory = $this->map[$name];
            $model = $factory();
            return $model;
        }
    }
    

Save the above contents as `GenericFactory.php` in 
`package/Example.Package/src/Example/Package` folder.

## Extending the controller ##

We can set `GenericFactory` as a setter injection on the controller.

    [php]
    <?php
    namespace Example\Package\Web;
    
    use Aura\Framework\Web\Controller\AbstractPage;
    abstract class PageController extends AbstractPage
    {        
        protected $factory;
    
        public function setFactory(GenericFactory $factory)
        {
            $this->factory = $factory;
        }
        
        public function getFactory()
        {
            return $this->factory;
        }
    }

Save the above contents as `PageController.php` in 
`package/Example.Package/src/Example/Package/Web` folder.

Let us modify our example to extend our `PageController`.
The `package/Example.Package/src/Example/Package/Web/Greet/Page.php` will 
look as below

    [php]
    <?php
    namespace Example\Package\Web\Quick;
    
    use Example\Package\Web\PageController;
    
    class Page extends PageController
    {
        public function actionIndex()
        {
            $this->data->message = $this->context->getQuery('name', 'guys!');
            $this->view = 'index';
        }
    }

## Configuration ##

So far we have not configured to set the `GenericFactory` object to 
`PageController`. Let us add in our `package/Example.Package/config/default.php`
the below contents.

    [php]
    // the generic factory service
    $di->set('generic_factory', function () use ($di) {
        return $di->newInstance('Example\Package\GenericFactory');
    });
    $di->setter['Example\Package\Web\PageController']['setFactory'] = $di->lazyGet('generic_factory');

Inorder to create the objects, you need to assign to the map.

    [php]
    // default params for the model factory
    $di->params['Example\Package\GenericFactory']['map']
        ['model.user'] = $di->newFactory('Example\Package\Model\User');
    $di->params['Example\Package\GenericFactory']['map']
        ['model.post'] = $di->newFactory('Example\Package\Model\Post');
    $di->params['Example\Package\GenericFactory']['map']
        ['form.user.login'] = $di->newFactory('Example\Package\Form\Login');
    
And now from the controller you can create objects like 

    [php]
    $user = $this->getFactory()->newInstance('model.user');
    $form = $this->getFactory()->newInstance('form.user.login');
