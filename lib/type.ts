export type EncodeResult =
  | string
  | number
  | boolean
  | undefined
  | null
  | (string | number | boolean | undefined | null)[];

export type ExtraValues =
  | Record<string, EncodeResult>
  | {
      name: string;
      value: EncodeResult;
      omitEmptyString?: boolean;
      omitUndefined?: boolean;
      omitNull?: boolean;
    }[];

interface SyncUrlConfig {
  name: string;
  omitEmptyString?: boolean;
  omitUndefined?: boolean;
  omitNull?: boolean;
  encode: () => EncodeResult | Record<string, EncodeResult>;
  decode: (
    value: null | string | string[],
    allValues: Record<string, string | string[]>,
    isPopState: boolean
  ) => void;
}

export interface useSyncUrlOptions {
  configs: SyncUrlConfig[];
  onDecodeSuccess?: (isPopState: boolean) => void;
}
