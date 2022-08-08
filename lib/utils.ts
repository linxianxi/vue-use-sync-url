export function isObj(value: any) {
  return Object.prototype.toString.call(value) === "[object Object]";
}
