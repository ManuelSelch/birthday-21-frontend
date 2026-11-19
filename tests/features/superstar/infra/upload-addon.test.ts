import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const addon = new URL('../../../../docs/superstar-cockpit/cockpit-superstar/', import.meta.url);
test('Superstar upload addon explicitly registers its route with Cockpit authentication and app context', async () => {
  const source = await readFile(new URL('bootstrap.php', addon), 'utf8');

  assert.match(source, /on\('restApi\.config'/);
  assert.match(source, /addEndPoint\('\/superstar\/upload'/);
  assert.match(source, /'POST'\s*=>/);
  assert.match(source, /include \$file/);
  assert.match(source, /\)->call\(\$app\)/);
});

test('adapted uploader retains portfolio security, validation and deduplication but isolates the Superstar folder', async () => {
  const source = await readFile(new URL('api/upload.post.php', addon), 'utf8');

  assert.match(source, /HTTP_API_KEY/);
  assert.match(source, /\$key === 'public'/);
  assert.match(source, /param\('api_key', null\)/);
  assert.match(source, /isAllowed\('assets\/upload', \$role\)/);
  assert.match(source, /is_uploaded_file/);
  assert.match(source, /FILEINFO_MIME_TYPE/);
  assert.match(source, /getimagesize/);
  assert.match(source, /20000000/);
  assert.match(source, /'name' => 'superstar', '_p' => ''/);
  assert.match(source, /'_hash' => md5_file/);
  assert.match(source, /'reused' => true/);
  assert.doesNotMatch(source, /projects|portfolio|superstar\/uploadKey|\$_GET/);
});
