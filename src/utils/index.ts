export function* keyGeneratorFunction(): Generator<number, void, unknown> {
  let id = 0;

  while (true) {
    yield ++id;
  }
}
