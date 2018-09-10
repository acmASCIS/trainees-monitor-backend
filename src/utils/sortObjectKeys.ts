export function sortObjectKeys(obj: any) {
  const newObject: any = {};
  Object.keys(obj)
    .sort()
    .forEach(key => (newObject[key] = obj[key]));
  return newObject;
}
