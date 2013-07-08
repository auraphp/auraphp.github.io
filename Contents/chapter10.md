# Connecting to Database #

Before you read this chapter, please familarize yourself reading previous 
chapters on Dependency Injection container, Generic Factory.

Aura framework doesn't force you to use Aura.Sql and how you need to work
on the models. It is your taste whether you need to work with Propel, 
Doctrine or native PDO itself.

In this we are going to make use of Aura.Sql to connect to the database.

## Database Connection ##

Let us create an AbstractModel.php file with contents and save in folder
`package/Example.Package/src/Example/Package/Model`

    [php]
    <?php
    namespace Example\Package\Model;
    
    use Aura\Sql\ConnectionLocator;
    
    abstract class AbstractModel
    {
        /**
         * 
         * The connections to connect to database
         * 
         * @var ConnectionLocator
         * 
         */
        protected $connection_locator;
        
        /**
         * 
         * Constructor
         * 
         * @param ConnectionLocator $connection_locator Set the db connection
         * 
         */
        public function __construct(ConnectionLocator $connection_locator)
        {
            $this->connection_locator = $connection_locator;
        }
        
        /**
         * 
         * Returns an \Aura\Sql\Connection\AbstractConnection object
         * 
         * @param string $type The type of connection. master / slave
         * 
         * @param string $name The name of the connection for master / slave
         * 
         * @return \Aura\Sql\Connection\AbstractConnection
         * 
         */
        public function getConnection($type = null, $name = null)
        {
            switch ($type) {
                case 'master':
                    $connection = 'getMaster';
                    break;
                case 'slave':
                    $connection = 'getSlave';
                    break;
                default:
                    $connection = 'getDefault';
                    break;
            }
            return $this->connection_locator->$connection($name);
        }
    }

## Creating your models ##

If your models need database connection, you can extend the class with
`Example\Package\Model\AbstractModel` and use the `getConnection()` method
and query database.

    [php]
    <?php
    namespace Example\Package\Model;
    
    use Example\Package\Model\AbstractModel;
    
    class User extends AbstractModel
    {
        protected $table = 'user';
        
        public function insert($bind)
        {
            $connection = $this->getConnection();
            // create a new Insert object
            $insert = $connection->newInsert();
    
            // INSERT INTO foo (name, email, username, password, created_at) 
            // VALUES (:name, :email, :username, NOW());
            $insert->into($this->table)
                   ->cols(['name', 'email', 'username'])
                   ->set('created_at', 'NOW()');
    
            $stmt = $connection->query($insert, $bind);
            return $stmt;
        }
        
        public function update($bind)
        {
            $connection = $this->getConnection();
            // create a new Update object
            $update = $connection->newUpdate();
    
            $cols = ['name', 'email', 'username'];
            $update->table($this->table)
                   ->cols($cols)
                   ->set('updated_at', 'NOW()')
                   ->where('id = :id');
    
            $stmt = $connection->query($update, $bind);
            return $stmt;
        }
    }

## Configuration ##

You can keep the connection configuration information in the 
`{$system}/config/default.php`.

    [php]
    // database
    $di->set('connection_factory', function () use ($di) {
        return $di->newInstance('Aura\Sql\ConnectionFactory');
    });
    
    $di->set('connection_locator', function () use ($di) {
        return $di->newInstance('Aura\Sql\ConnectionLocator');
    });
    
    // default params for the AbstractModel class
    $di->params['Example\Package\Model\AbstractModel'] = [
        'connection_locator' => $di->lazyGet('connection_locator')
    ];
    
    $di->params['Aura\Sql\ConnectionLocator'] = [
        'connection_factory' => $di->lazyGet('connection_factory'),
        'default' => [
            'adapter' => 'mysql',
            'dsn' => 'host=db-host;dbname=db-name',
            'username' => 'db-username',
            'password' => 'dbpassword',
            'options' => []
        ],
        'masters' => [],
        'slaves' => []
    ];

> Change the `adapter`, `db-host`, `db-name`, `db-username`, `db-password`
according to yours.

And we need to map the `Example\Package\GenericFactory` in-order to create 
model objects from the controller. Save the below contents in the 
`config/default.php` of your package or in the `$system`.

    [php]
    $di->params['Example\Package\GenericFactory']['map']['user'] = $di->newFactory('Example\Package\Model\User');
    // add more like this
    // $di->params['Example\Package\GenericFactory']['map'][<name>] = $di->newFactory(<the-class-name>);

Now if you have the GenericFactory injected to the controller as we 
did in chapter6, then we can call

    [php]
    $this->factory->newInstance(<name>);
    $this->getFactory()->newInstance(<name>);
    // $this->factory->newInstance('user');

That's it for now!.
