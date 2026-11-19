<?php
// Install as Cockpit config/api/superstar-upload.post.php.
// Configure 'superstar/uploadKey' with the same server-only key used by Next.js.
$expected = $this->retrieve('superstar/uploadKey', '');
$provided = $_SERVER['HTTP_API_KEY'] ?? '';
if (!is_string($expected) || !$expected || !is_string($provided) || !hash_equals($expected, $provided)) {
    $this->response->status = 401;
    return ['error' => 'Unauthorized'];
}

$files = $_FILES['files'] ?? null;
if (!$files || !is_array($files['name'] ?? null) || count($files['name']) !== 1 ||
    ($files['error'][0] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
    $this->response->status = 400;
    return ['error' => 'One image is required'];
}
$tmp = $files['tmp_name'][0];
if (!is_uploaded_file($tmp) || filesize($tmp) > 10 * 1024 * 1024) {
    $this->response->status = 413;
    return ['error' => 'Image exceeds 10 MB'];
}
$info = @getimagesize($tmp);
$mime = (new finfo(FILEINFO_MIME_TYPE))->file($tmp);
$extensions = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];
if (!$info || !isset($extensions[$mime]) || ($info['mime'] ?? '') !== $mime ||
    $info[0] * $info[1] > 40000000) {
    $this->response->status = 400;
    return ['error' => 'Invalid image'];
}
// Do not trust a user-supplied extension or filename.
$files['name'][0] = bin2hex(random_bytes(12)) . '.' . $extensions[$mime];
try {
    $result = $this->module('assets')->upload($files);
    if (!empty($result['failed']) || count($result['assets'] ?? []) !== 1) {
        $this->response->status = 502;
        return ['error' => 'Upload not confirmed'];
    }
    return $result;
} catch (Throwable $error) {
    $this->response->status = 502;
    return ['error' => 'Upload failed'];
}
