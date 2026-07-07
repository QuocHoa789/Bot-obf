let counter = 0;
export function randomName(prefix = 'l_'): string {
  return prefix + (counter++).toString(36) + Math.random().toString(36).substr(2, 5);
}
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
