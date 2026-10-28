// Override both ports when running browser tests in parallel worktrees.
export const appPort = Number(process.env.ADMIN_TEST_PORT ?? 3187);
export const cockpitPort = Number(process.env.COCKPIT_TEST_PORT ?? 3188);
export const browserOrigin = `http://localhost:${appPort}`;
export const cockpitOrigin = `http://127.0.0.1:${cockpitPort}`;
