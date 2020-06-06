# slim php membuat controller

**composer.json**

```json
{
    "require": {
        "slim/slim": "3.*",
        "slim/twig-view": "^2.0",
        "simplon/mysql": "^2.2"
    },
    "autoload": {
        "classmap": [
            "controller"
        ],
        "psr-4": {
            "Apa\\":"controller"
        }
    }
}
```

> composer dump-autoload -o

**home_controller.php**

> controllser/home_controller.php

```php
<?php
namespace Apa;

use Psr\Container\ContainerInterface;

class HomeController
{
   protected $container;

   // constructor receives container instance
   public function __construct(ContainerInterface $container) {
       $this->container = $container;
   }

   public function home($request, $response, $args) {
        // your code
        // to access items in the container... $this->container->get('');
        return $response->write('apa kabar');
   }

   public function contact($request, $response, $args) {
        $response->write('ini kontak');
        return $response;
   }
}
```

**route**

> public/index.php

```php
<?php

require __DIR__ .'/../vendor/autoload.php';

use \Apa\HomeController;
$configuration = [
    'settings' => [
        'displayErrorDetails' => true,
    ],
];
$con = new Container($configuration);
$app = new App($con);
$con = $app->getContainer();

$con['HomeController'] = function($con) {
    return new HomeController($con);
};

$app->get('/contact', 'HomeController:contact');

$app->run();
```

