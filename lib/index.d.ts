import { Either } from 'fp-ts/lib/Either';
import { Option } from 'fp-ts/lib/Option';
import { Predicate } from 'fp-ts/lib/function';
export interface ContextEntry {
    readonly key: string;
    readonly type: Any;
}
export declare type Context = Array<ContextEntry>;
export interface ValidationError {
    readonly value: any;
    readonly context: Context;
}
export declare type Validation<T> = Either<Array<ValidationError>, T>;
export declare type Validate<T> = (value: any, context: Context) => Validation<T>;
export declare type Any = Type<any>;
export declare type TypeOf<RT extends Any> = RT['_A'];
export interface Type<A> {
    readonly _A: A;
    readonly name: string;
    readonly validate: Validate<A>;
}
export declare const _A: never;
export declare function getFunctionName(f: any): string;
export declare function failure<T>(value: any, context: Context): Validation<T>;
export declare function success<T>(value: T): Validation<T>;
export declare function validate<T>(value: any, type: Type<T>): Validation<T>;
export declare function is<T>(value: any, type: Type<T>): value is T;
declare module 'fp-ts/lib/HKT' {
    interface HKT<A> {
        'io-ts/Type': Type<A>;
    }
}
export declare const URI = "io-ts/Type";
export declare type URI = typeof URI;
export interface MapType<RT extends Any, B> extends Type<B> {
    readonly _tag: 'MapType';
    readonly type: RT;
    readonly f: (a: TypeOf<RT>) => B;
}
export declare function map<RT extends Any, B>(f: (a: TypeOf<RT>) => B, type: RT): MapType<RT, B>;
export declare function mapWithName<RT extends Any, B>(f: (a: TypeOf<RT>) => B, type: RT, name: string): MapType<RT, B>;
export interface NullType extends Type<null> {
    readonly _tag: 'NullType';
}
declare const nullType: NullType;
export interface UndefinedType extends Type<undefined> {
    readonly _tag: 'UndefinedType';
}
declare const undefinedType: UndefinedType;
export interface AnyType extends Type<any> {
    readonly _tag: 'AnyType';
}
export declare const any: AnyType;
export interface NeverType extends Type<never> {
    readonly _tag: 'NeverType';
}
export declare const never: NeverType;
export interface StringType extends Type<string> {
    readonly _tag: 'StringType';
}
export declare const string: StringType;
export interface NumberType extends Type<number> {
    readonly _tag: 'NumberType';
}
export declare const number: NumberType;
export interface BooleanType extends Type<boolean> {
    readonly _tag: 'BooleanType';
}
export declare const boolean: BooleanType;
export interface AnyArrayType extends Type<Array<any>> {
    readonly _tag: 'AnyArrayType';
}
declare const arrayType: AnyArrayType;
export interface AnyDictionaryType extends Type<{
    [key: string]: any;
}> {
    readonly _tag: 'AnyDictionaryType';
}
export declare const Dictionary: AnyDictionaryType;
export interface FunctionType extends Type<Function> {
    readonly _tag: 'FunctionType';
}
declare const functionType: FunctionType;
export interface RefinementType<RT extends Any> extends Type<TypeOf<RT>> {
    readonly _tag: 'RefinementType';
    readonly type: RT;
    readonly predicate: Predicate<TypeOf<RT>>;
}
export declare function refinement<RT extends Any>(type: RT, predicate: Predicate<TypeOf<RT>>, name?: string): RefinementType<RT>;
export declare const Integer: RefinementType<NumberType>;
export declare type GetOption<S, A> = (s: S) => Option<A>;
export interface PrismType<RT extends Any, B> extends Type<B> {
    readonly _tag: 'PrismType';
    readonly type: RT;
    readonly getOption: GetOption<TypeOf<RT>, B>;
}
export declare function prism<RT extends Any, B>(type: RT, getOption: GetOption<TypeOf<RT>, B>, name?: string): PrismType<RT, B>;
export interface LiteralType<T> extends Type<T> {
    readonly _tag: 'LiteralType';
    readonly value: T;
}
export declare function literal<T extends string | number | boolean>(value: T): LiteralType<T>;
export interface KeyofType<D extends {
    [key: string]: any;
}> extends Type<keyof D> {
    readonly _tag: 'KeyofType';
    readonly keys: D;
}
export declare function keyof<D extends {
    [key: string]: any;
}>(keys: D, name?: string): KeyofType<D>;
export declare function recursion<T>(name: string, definition: (self: Any) => Any): Type<T>;
export interface ArrayType<RT extends Any> extends Type<Array<TypeOf<RT>>> {
    readonly _tag: 'ArrayType';
    readonly type: RT;
}
export declare function array<RT extends Any>(type: RT, name?: string): ArrayType<RT>;
export declare type Props = {
    [key: string]: Any;
};
export declare type InterfaceOf<P extends Props> = {
    [K in keyof P]: TypeOf<P[K]>;
};
export interface InterfaceType<P extends Props> extends Type<InterfaceOf<P>> {
    readonly _tag: 'InterfaceType';
    readonly props: P;
}
export declare function interfaceType<P extends Props>(props: P, name?: string): InterfaceType<P>;
export declare type PartialOf<P extends Props> = {
    [K in keyof P]?: TypeOf<P[K]>;
};
export declare type PartialPropsOf<P extends Props> = {
    [K in keyof P]: UnionType<[P[K], Type<undefined>], [TypeOf<P[K]>, undefined]>;
};
export interface PartialType<P extends Props> extends Type<PartialOf<P>> {
    readonly _tag: 'PartialType';
    readonly props: PartialPropsOf<P>;
}
export declare function partial<P extends Props>(props: P, name?: string): PartialType<P>;
export interface DictionaryType<D extends Type<string>, C extends Any> extends Type<{
    [key: string]: TypeOf<C>;
}> {
    readonly _tag: 'DictionaryType';
    readonly domain: D;
    readonly codomain: C;
}
export declare function dictionary<D extends Type<string>, C extends Any>(domain: D, codomain: C, name?: string): DictionaryType<D, C>;
export interface UnionType<RTS extends Array<Any>, U> extends Type<U> {
    readonly _tag: 'UnionType';
    readonly types: RTS;
}
export declare function union<A extends Any, B extends Any, C extends Any, D extends Any, E extends Any>(types: [A, B, C, D, E], name?: string): UnionType<[A, B, C, D, E], TypeOf<A> | TypeOf<B> | TypeOf<C> | TypeOf<D> | TypeOf<E>>;
export declare function union<A extends Any, B extends Any, C extends Any, D extends Any>(types: [A, B, C, D], name?: string): UnionType<[A, B, C, D], TypeOf<A> | TypeOf<B> | TypeOf<C> | TypeOf<D>>;
export declare function union<A extends Any, B extends Any, C extends Any>(types: [A, B, C], name?: string): UnionType<[A, B, C], TypeOf<A> | TypeOf<B> | TypeOf<C>>;
export declare function union<A extends Any, B extends Any>(types: [A, B], name?: string): UnionType<[A, B], TypeOf<A> | TypeOf<B>>;
export declare function union<A extends Any>(types: [A], name?: string): UnionType<[A], TypeOf<A>>;
export interface IntersectionType<RTS extends Array<Any>, I> extends Type<I> {
    readonly _tag: 'IntersectionType';
    readonly types: RTS;
}
export declare function intersection<A extends Any, B extends Any, C extends Any, D extends Any, E extends Any>(types: [A, B, C, D, E], name?: string): IntersectionType<[A, B, C, D, E], TypeOf<A> & TypeOf<B> & TypeOf<C> & TypeOf<D> & TypeOf<E>>;
export declare function intersection<A extends Any, B extends Any, C extends Any, D extends Any>(types: [A, B, C, D], name?: string): IntersectionType<[A, B, C, D], TypeOf<A> & TypeOf<B> & TypeOf<C> & TypeOf<D>>;
export declare function intersection<A extends Any, B extends Any, C extends Any>(types: [A, B, C], name?: string): IntersectionType<[A, B, C], TypeOf<A> & TypeOf<B> & TypeOf<C>>;
export declare function intersection<A extends Any, B extends Any>(types: [A, B], name?: string): IntersectionType<[A, B], TypeOf<A> & TypeOf<B>>;
export declare function intersection<A extends Any>(types: [A], name?: string): IntersectionType<[A], TypeOf<A>>;
export interface TupleType<RTS extends Array<Any>, I> extends Type<I> {
    readonly _tag: 'TupleType';
    readonly types: RTS;
}
export declare function tuple<A extends Any, B extends Any, C extends Any, D extends Any, E extends Any>(types: [A, B, C, D, E], name?: string): TupleType<[A, B, C, D, E], [TypeOf<A>, TypeOf<B>, TypeOf<C>, TypeOf<D>, TypeOf<E>]>;
export declare function tuple<A extends Any, B extends Any, C extends Any, D extends Any>(types: [A, B, C, D], name?: string): TupleType<[A, B, C, D], [TypeOf<A>, TypeOf<B>, TypeOf<C>, TypeOf<D>]>;
export declare function tuple<A extends Any, B extends Any, C extends Any>(types: [A, B, C], name?: string): TupleType<[A, B, C], [TypeOf<A>, TypeOf<B>, TypeOf<C>]>;
export declare function tuple<A extends Any, B extends Any>(types: [A, B], name?: string): TupleType<[A, B], [TypeOf<A>, TypeOf<B>]>;
export declare function tuple<A extends Any>(types: [A], name?: string): TupleType<[A], [TypeOf<A>]>;
export interface ReadonlyType<RT extends Any> extends Type<Readonly<TypeOf<RT>>> {
    readonly _tag: 'ReadonlyType';
    readonly type: RT;
}
export declare function readonly<RT extends Any>(type: RT, name?: string): ReadonlyType<RT>;
export interface ReadonlyArrayType<RT extends Any> extends Type<ReadonlyArray<TypeOf<RT>>> {
    readonly _tag: 'ReadonlyArrayType';
    readonly type: RT;
}
export declare function readonlyArray<RT extends Any>(type: RT, name?: string): ReadonlyArrayType<RT>;
export { nullType as null, undefinedType as undefined, arrayType as Array, functionType as Function, interfaceType as interface };
