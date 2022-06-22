import { DataFunctionArgs, json, redirect } from "@remix-run/node";
import { DomainFunction, inputFromForm } from "remix-domains";

export const executeAction = <T>(
  domainFunction: DomainFunction<T>,
  dataFunctionArgs: DataFunctionArgs,
  args?: {
    redirectTo?: string | ((data: T) => string);
    environmentFunction?: (args: DataFunctionArgs) => Promise<unknown>;
  }
) => {
  const { environmentFunction, redirectTo } = {
    environmentFunction: () => {},
    redirectTo: ".",
    ...args,
  };
  const actionFunction = async (args: DataFunctionArgs) => {
    const [input, environment] = await Promise.all([
      inputFromForm(args.request),
      environmentFunction(args),
    ]);

    console.log(input);

    const result = await domainFunction(
      input === undefined ? null : input,
      environment
    );

    if (!result.success) {
      return result;
    }
    const resolvedRedirectUrl =
      typeof redirectTo === "string" ? redirectTo : redirectTo(result.data);

    return redirect(resolvedRedirectUrl);
  };
  return actionFunction(dataFunctionArgs);
};

export const executeLoader = <T>(
  domainFunction: DomainFunction<T>,
  dataFunctionArgs: DataFunctionArgs,

  args?: {
    inputFunction?: (args: DataFunctionArgs) => Promise<unknown> | unknown;
    environmentFunction?: (args: DataFunctionArgs) => Promise<unknown>;
  }
) => {
  const { inputFunction, environmentFunction } = {
    inputFunction: () => {},
    environmentFunction: () => {},
    ...args,
  };
  const loaderFuntion = async (args: DataFunctionArgs) => {
    const [input, environment] = await Promise.all([
      inputFunction(args),
      environmentFunction(args),
    ]);

    const result = await domainFunction(
      input === undefined ? null : input,
      environment
    );

    if (!result.success) {
      console.debug(result);
      throw new Response("Not found", { status: 404 });
    }
    return json<T>(result.data);
  };
  return loaderFuntion(dataFunctionArgs);
};
