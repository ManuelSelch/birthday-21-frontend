<?php
// Install this directory under Cockpit addons/cockpit-superstar/.
$app = $this;
// Use the REST dispatcher so Cockpit authenticates API tokens before dispatch.
$app->on('restApi.config', function ($restApi) {
    $file = __DIR__ . '/api/upload.post.php';
    $restApi->addEndPoint('/superstar/upload', [
        'POST' => function ($params, $app) use ($file) {
            return (function () use ($file) {
                return include $file;
            })->call($app);
        },
    ]);
});
