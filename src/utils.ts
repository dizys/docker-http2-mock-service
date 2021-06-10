export function camelToSnakeCase(text: string): string {
  return text.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

export function fatalError(message: string): never {
  console.error(message);
  process.exit(1);
}

export function waitFor(milliseconds: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });
}

export function getRandomString(length: number): string {
  let result = '';
  let characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
