import { z } from "zod";

type IsNullable<T> = Extract<T, null> extends never ? false : true
type IsOptional<T> = Extract<T, undefined> extends never ? false : true


type ZodWithEffects<T extends z.ZodTypeAny> = T | z.ZodEffects<T, unknown, unknown>

export type ToZodSchema<T extends Record<string, any>> = {
  [K in keyof T]-?: IsNullable<T[K]> extends true
    ? ZodWithEffects<z.ZodNullable<z.ZodType<T[K]>>>
    : IsOptional<T[K]> extends true
      ? ZodWithEffects<z.ZodOptional<z.ZodType<T[K]>>>
      : ZodWithEffects<z.ZodType<T[K]>>
}

interface Foo {
  bar: string
  withEffects: string
  nullable: number | null
  optional?: string
  optionalNullable?: string | null
  omitted?: string
}

const schema = z.object({
  bar: z.string(),
  withEffects: z.preprocess(val => val, z.string()),
  // bar: z.number() // Type 'ZodNumber' is not assignable to type 'ZodType<string, ZodTypeDef, string>'.
  // baz: z.number(), // Object literal may only specify known properties, and 'baz' does not exist in type 'Schema<Foo>'.ts(2353)
  nullable: z.number().nullable(),
  optional: z.string().optional(),
  optionalNullable: z.string().optional().nullable(), // should chain optional first
  omitted: z.string().optional(),
} satisfies ToZodSchema<Foo>)



const UserSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  age: z.number().positive("Age must be positive"),
  email: z.string().email("Invalid email format"),
  weight: z.coerce.number(),
});



