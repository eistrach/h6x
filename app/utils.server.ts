import { z } from "zod";
import qs from "qs";
import { Params } from "@remix-run/react";

type SchemaError = {
  path: string[];
  message: string;
};

export type SuccessResult<Schema extends z.ZodTypeAny> = {
  success: true;
  data: z.infer<Schema>;
};

export type ErrorResult = {
  success: false;
  errors: SchemaError[];
};

export type ValidationResult<Schema extends z.ZodTypeAny> =
  | SuccessResult<Schema>
  | ErrorResult;

export const validateForm = async <Schema extends z.ZodTypeAny>(
  request: Request,
  schema: Schema
): Promise<ValidationResult<Schema>> => {
  const form = await request.clone().formData();
  const data = qs.parse(new URLSearchParams(form as any).toString());
  const result = await schema.safeParseAsync(data);

  if (!result.success) {
    return {
      success: false,
      errors: formatSchemaErrors(result.error.issues),
    };
  }
  return {
    success: true,
    data: result.data,
  };
};

export function requireParam(params: Params, name: string): string {
  const param = params[name];
  if (!param) {
    throw new Error(`Missing parameter ${name}`);
  }
  return param;
}

export function errorResult(path: string, message: string): ErrorResult {
  return {
    success: false,
    errors: [{ path: [path], message }],
  };
}

const formatSchemaErrors = (errors: z.ZodIssue[]): SchemaError[] =>
  errors.map((error) => {
    const { path, message } = error;
    return { path: path.map(String), message };
  });
