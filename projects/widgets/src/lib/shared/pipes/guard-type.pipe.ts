import { Pipe, PipeTransform } from "@angular/core";

/**
 * Returns if a is of a type that extends B based on a condition
 *
 * @example
 * interface Parent {
 *  type: "Extended" | "other types";
 * }
 * interface Extended extends Parent {
 *  type: "Extended";
 * }
 * const isExtended: TypeGuard<Parent, Extended> = (
 * obj: Parent
 * ): obj is Extended2 => obj.type === "Extended2";
 */
export type TypeGuard<A, B extends A> = (a: A) => a is B;

/**
 * Type guard for union types
 * Checks if a value of type A is of type B, which extends A
 *
 * @example
 * interface A {}
 * interface B extends A {}
 * interface C extends A {}
 *
 * if you have an array typed to A[] (because the child can be any), typescript will not let you perform
 * B or C operations without checking
 */
@Pipe({
  name: "guardType",
})
export class GuardTypePipe implements PipeTransform {
  /**
   * Checks if given value of type A is of type B, where B extends A
   *
   * @template A union type
   * @param value value to type check
   * @param typeGuard typeguard function
   * @returns value as type B if value is of type B, else undefined
   * @example "displayMap | guardType: isPiecewise as piecewise"
   */
  transform<A, B extends A>(
    value: A,
    typeGuard: TypeGuard<A, B>
  ): B | undefined {
    return typeGuard(value) ? value : undefined;
  }
}
