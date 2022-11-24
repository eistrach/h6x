export type UnpackArray<T> = T extends (infer U)[] ? U : T;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExtractReturnType<T extends (...args: any) => any> = UnpackArray<
  Awaited<ReturnType<T>>
>;
