/*
 * To keep this code short I am not dealing with error handling, security details, etc.
 */

const run = require('/usr/src/app/run');

(async () => {
  const stdin = 'hello world';
  const stdout = await run(stdin);

  console.log(stdout);
})();