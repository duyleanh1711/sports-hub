import { z } from "zod";

export const filterOpSchema = z.enum([
  "==",
  "!=",
  ">",
  "<",
  ">=",
  "<=",
  "in",
  "not in",
  "between",
  "between_exclusive",
  "is null",
  "is not null",
  "is empty string",
  "is not empty string",
]);

export const filterSchema = z.discriminatedUnion("op", [
  z.object({
    field: z.string(),
    op: z.enum(["==", "!=", ">", "<", ">=", "<="]),
    value: z.any(),
  }),

  z.object({
    field: z.string(),
    op: z.enum(["in", "not in"]),
    value: z.array(z.any()),
  }),

  z.object({
    field: z.string(),
    op: z.enum(["between", "between_exclusive"]),
    value: z.tuple([z.any(), z.any()]),
  }),

  z.object({
    field: z.string(),
    op: z.enum([
      "is null",
      "is not null",
      "is empty string",
      "is not empty string",
    ]),
    value: z.undefined().optional(),
  }),
]);

export const filtersSchema = z.array(filterSchema);

export type Filter = z.infer<typeof filterSchema>;
export type FilterOp = Filter["op"];
