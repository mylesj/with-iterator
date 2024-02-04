export interface Empty {
    toString(): string
}

export interface Undefined extends Empty {
    valueOf(): undefined
}

export interface Null extends Empty {
    valueOf(): null
}

export type Boxed<T> = T extends undefined
    ? Undefined
    : T extends null
      ? Null
      : T extends string
        ? String
        : T extends number
          ? Number
          : T extends boolean
            ? Boolean
            : T

export declare function valueOf<T>(
    input: T,
): T extends Undefined
    ? undefined
    : T extends Null
      ? null
      : T extends String
        ? string
        : T extends Number
          ? number
          : T extends Boolean
            ? boolean
            : T

export declare function isIterable<T>(
    input: T,
): T extends Iterable<unknown> ? true : boolean

export declare function getIterator<T>(
    input: T,
): T extends Iterable<infer U> ? () => Generator<U> : unknown

export declare function withIterator<T = unknown, U = unknown>(
    factory: () => Generator<T>,
    input: U,
    descriptor?: PropertyDescriptor,
): Boxed<U> & Iterable<T>

export declare function withIterator<T = unknown, U = unknown>(
    input: U extends Function ? () => Generator<T> : U,
): U extends Function
    ? <V>(input: V, descriptor?: PropertyDescriptor) => Boxed<V> & Iterable<T>
    : Boxed<U> & Iterable<U>
