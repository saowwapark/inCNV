// Return true if param iss null or undefined.
export const isNullOrUndefined = (value: any): value is null | undefined =>
  value === null || typeof value === 'undefined';
// Return ture if param is an object.
export const isObject = (value: any): boolean =>
  value && value.constructor === Object;
// Return true if param doesn't have value.
export const isBlank = (value: any): boolean =>
  isNullOrUndefined(value) ||
  (isObject(value) && Object.keys(value).length === 0) ||
  value.toString().trim() === '';
// Return true if param has value.
export const isPresent = (value: any): boolean => !isBlank(value);

export const isEqualObj = (a: Object, b: Object): boolean => {
  // Create arrays of property names
  const aProps = Object.getOwnPropertyNames(a);
  const bProps = Object.getOwnPropertyNames(b);

  // If number of properties is different,
  // objects are not equivalent
  if (aProps.length !== bProps.length) {
    return false;
  }

  for (const propName of aProps) {
    // If values of same property are not equal,
    // objects are not equivalent
    if (a[propName] !== b[propName]) {
      return false;
    }
  }

  // If we made it this far, objects
  // are considered equivalent
  return true;
};

export const isEqual = (
  a: Object | string | number,
  b: Object | string | number
): boolean => {
  if (typeof a === typeof b) {
    if (typeof a === 'object') {
      return isEqualObj(a, b);
    } else if (typeof a === 'number' || typeof a === 'string') {
      if (a === b) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
};
export const isIncludedInList = (value: string, list: string[]): boolean => {
  let included = false;
  list.forEach(element => {
    if (element.toLowerCase() === value.toLowerCase()) {
      included = true;
    }
  });
  return included;
};

export const findDuplicates = (arr: any[]) =>
  arr.filter((item: any, index: number) => arr.indexOf(item) !== index);
