/**
 * Replace underscore and return camelcased string
 *
 * @param str string to camel case
 * @returns camelcased string
 */
export function camelCase(str: string): string {
  return str.replace(/_([a-z])/g, (m, w) => {
    return w.toUpperCase();
  });
}
