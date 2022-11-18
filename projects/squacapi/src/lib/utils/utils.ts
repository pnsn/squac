/**
 * Takes inputed string and capitalizes first letter
 * @param word - string to capitalize first letter
 */
export function titleCaseWord(word: string): string {
  return !word ? word : word[0].toUpperCase() + word.substring(1).toLowerCase();
}
// // App wide helper functions
// //stringify array using ids of T
// declare global {
//   interface idType {
//     id: number | string;
//   }

//   /* eslint-disable-next-line unused-imports/no-unused-vars */
//   interface Array<T> {
//     toIdString(): string;
//     mapIds(): Array<number>;
//   }
// }

// Array.prototype.toIdString = function <T extends idType>(this: T[]): string {
//   return this.reduce((previous: string, current: T) => {
//     if (!current) {
//       return previous;
//     }
//     return previous
//       ? previous + "," + current.id.toString()
//       : current.id.toString();
//   }, "");
// };

// Array.prototype.mapIds = function <T extends idType>(this: T[]): Array<number> {
//   return this.map((T) => +T.id);
// };
