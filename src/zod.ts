import { z } from "zod";

type IsNullable<T> = Extract<T, null> extends never ? false : true;
type IsOptional<T> = Extract<T, undefined> extends never ? false : true;

type ZodWithEffects<T extends z.ZodTypeAny> =
  | T
  | z.ZodEffects<T, unknown, unknown>;

export type ToZodSchema<T extends Record<string, any>> = {
  [K in keyof T]-?: IsNullable<T[K]> extends true
    ? ZodWithEffects<z.ZodNullable<z.ZodType<T[K]>>>
    : IsOptional<T[K]> extends true
      ? ZodWithEffects<z.ZodOptional<z.ZodType<T[K]>>>
      : ZodWithEffects<z.ZodType<T[K]>>;
};
