export {};

declare global {
  export type Writable<T> = {
    -readonly [P in keyof T]: T[P];
  };

  declare type Nullable<T> = T | null;
  declare type NonNullable<T> = T extends null | undefined ? never : T;
  declare type Recordable<T = any> = Record<string, T>;
  declare type ReadonlyRecordable<T = any> = Readonly<Record<string, T>>;
  declare type Indexable<T = any> = Record<string, T>;
  declare type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
  };
  declare type TimeoutHandle = ReturnType<typeof setTimeout>;
  declare type IntervalHandle = ReturnType<typeof setInterval>;

  interface Window {
    microApp: any;
    __MICRO_APP_NAME__?: string;
    __MICRO_APP_ENVIRONMENT__: boolean;
    __MICRO_APP_BASE_ROUTE__: string;
    __MICRO_APP_PUBLIC_PATH__: string;
    __MICRO_APP_BASE_APPLICATION__?: boolean;
    rawWindow?: Window;
  }
}
