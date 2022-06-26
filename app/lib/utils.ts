import { DataFunctionArgs } from "@remix-run/node";

export type UnpackData<F extends (...args: any) => any> = Exclude<
  Awaited<ReturnType<F>>,
  Response
>;

export type LoaderArgs = DataFunctionArgs;
export type ActionArgs = DataFunctionArgs;
