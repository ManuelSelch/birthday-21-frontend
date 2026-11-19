<?php
// Isolated registration/authentication test. No CMS, credentials or database writes.
class SuperstarFixtureAuth {
    public function __construct(private $app) {}
    public function getUser($field) { return $this->app->role; }
}
class SuperstarFixtureAcl {
    public function __construct(private $app) {}
    public function isAllowed($permission, $role) {
        return $permission === 'assets/upload' && $role === 'superstar-uploader' && $this->app->allowed;
    }
}
class SuperstarFixtureApp {
    public array $hooks = [];
    public object $response;
    public object $request;
    public ?string $role = 'superstar-uploader';
    public bool $allowed = true;
    public $override = null;
    public function __construct() {
        $this->response = (object) ['status' => 200];
        $this->request = (object) ['method' => 'POST', 'server' => [], 'files' => []];
    }
    public function on($event, $handler) { $this->hooks[$event] = $handler; }
    public function param($name, $default = null) { return $this->override ?? $default; }
    public function helper($name) { return $name === 'auth' ? new SuperstarFixtureAuth($this) : new SuperstarFixtureAcl($this); }
    public function install() { include __DIR__ . '/../bootstrap.php'; }
}
class SuperstarFixtureDispatcher {
    public array $routes = [];
    public function addEndPoint($path, $methods) { $this->routes[$path] = $methods; }
}
function expect($condition, $message) {
    if (!$condition) throw new RuntimeException($message);
}
$app = new SuperstarFixtureApp();
$app->install();
$dispatcher = new SuperstarFixtureDispatcher();
expect(isset($app->hooks['restApi.config']), 'Missing registration hook');
($app->hooks['restApi.config'])($dispatcher);
expect(array_keys($dispatcher->routes) === ['/superstar/upload'], 'Unexpected routes');
$methods = $dispatcher->routes['/superstar/upload'];
expect(array_keys($methods) === ['POST'], 'Only POST should be registered');
$call = function ($status) use ($methods, $app) {
    $app->response->status = 200;
    $result = $methods['POST']([], $app);
    expect($app->response->status === $status, 'Unexpected status: ' . $app->response->status);
    expect(isset($result['error']), 'Expected an error response from the handler in app context');
};
$call(401);
$app->request->server['HTTP_API_KEY'] = 'public';
$call(401);
$app->request->server['HTTP_API_KEY'] = 'fixture-token';
$app->override = 'query-token';
$call(401);
$app->override = null;
$app->allowed = false;
$call(403);
$app->allowed = true;
$app->role = null;
$call(403);
$app->role = 'superstar-uploader';
$call(400);
$app->request->method = 'GET';
$call(405);
echo "PASS Superstar route registration, app context, method, header, override and role guards\n";
