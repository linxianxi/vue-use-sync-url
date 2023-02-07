export function isObj(value: any) {
  return Object.prototype.toString.call(value) === "[object Object]";
}

export function toBoolean(value: string) {
  const booleanValues = { true: true, false: false };
  return (booleanValues as any)[value];
}
