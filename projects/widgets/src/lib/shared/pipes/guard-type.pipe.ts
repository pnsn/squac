import { Pipe, PipeTransform } from "@angular/core";

export type TypeGuard<A, B extends A> = (a: A) => a is B;

/**
 * Type guard for union types
 */
@Pipe({
  name: "guardType",
})
export class GuardTypePipe implements PipeTransform {
  /**
   * Checks and returns type for member of union type
   *
   * @template A - union type
   * @param value - value to type check
   * @param typeGuard - typeguard function
   * @returns type B if value of type A is of type B, else undefined
   * @example "displayMap | guardType: isPiecewise as piecewise"
   */
  transform<A, B extends A>(
    value: A,
    typeGuard: TypeGuard<A, B>
  ): B | undefined {
    return typeGuard(value) ? value : undefined;
  }
}
