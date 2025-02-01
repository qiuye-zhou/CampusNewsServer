import { register } from './global/register.global';

async function main() {
  register();
  const [{ bootstrap }] = await Promise.all([import('./bootstrap')]);
  bootstrap();
}

main();
