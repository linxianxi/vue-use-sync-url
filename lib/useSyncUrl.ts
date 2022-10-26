import { onMounted, reactive } from "vue";
import { usePopStateListener } from "./usePopStateListener";
import { isObj } from "./utils";

type EncodeResult = string | number | boolean | (string | number | boolean)[];

interface useSyncUrlConfig {
  key: string;
  decodeKeys?: string[];
  omitEmptyString?: boolean;
  omitUndefined?: boolean;
  omitNull?: boolean;
  decode?: (value: any) => any;
  encode?: (value: any) => EncodeResult | Record<string, EncodeResult>;
}

interface useSyncUrlOptions {
  mode?: "history" | "hash";
  configs: useSyncUrlConfig[];
  onDecode: (params: Record<string, any>, isPopState: boolean) => void;
}

export const useSyncUrl = (options: useSyncUrlOptions) => {
  const { mode = "history", configs, onDecode } = options;

  const searchParams: Record<string, string[] | string> = reactive({});

  function getRawParams() {
    if (mode === "history") {
      return window.location.search || "";
    }
    const hash = window.location.hash || "";
    const index = hash.indexOf("?");
    return index > 0 ? hash.slice(index) : "";
  }

  function constructQuery(params: URLSearchParams) {
    const stringified = params.toString();

    if (mode === "history")
      return `${stringified ? `?${stringified}` : ""}${location.hash || ""}`;
    const hash = window.location.hash || "#";
    const index = hash.indexOf("?");
    if (index > 0)
      return `${hash.slice(0, index)}${stringified ? `?${stringified}` : ""}`;
    return `${hash}${stringified ? `?${stringified}` : ""}`;
  }

  function read() {
    return new URLSearchParams(getRawParams());
  }

  function write(params: URLSearchParams) {
    const unusedKeys = new Set(Object.keys(searchParams));
    for (const key of params.keys()) {
      const paramsForKey = params.getAll(key);
      searchParams[key] =
        paramsForKey.length > 1 ? paramsForKey : params.get(key) || "";
      unusedKeys.delete(key);
    }
    Array.from(unusedKeys).forEach((key) => delete searchParams[key]);
  }

  const handleDecode = (isPopState: boolean) => {
    const result: Record<string, any> = {};
    configs.forEach((config) => {
      if (config.decode) {
        if (config.decodeKeys) {
          const keys = Object.keys(searchParams).filter((key) =>
            config.decodeKeys?.includes(key)
          );
          if (keys.length) {
            keys.forEach((key) => {
              result[key] = searchParams[key];
            });
          }
        } else {
          if (config.key in searchParams) {
            result[config.key] = config.decode(searchParams[config.key]);
          }
        }
      } else {
        if (config.key in searchParams) {
          result[config.key] = searchParams[config.key];
        }
      }
    });
    onDecode(result, isPopState);
  };

  const initial = read();
  if (initial.keys().next().value) {
    write(initial);
  }

  handleDecode(false);

  usePopStateListener(() => {
    write(read());
    handleDecode(true);
  });

  const syncToUrl = (searchValues: Record<string, any>) => {
    const params = new URLSearchParams("");
    configs.forEach((config) => {
      const key = config.key;
      const mapEntry = searchValues[key];
      if (config.encode) {
        const transformRes = config.encode(mapEntry);
        if (isObj(transformRes)) {
          Object.keys(transformRes).forEach((_key) => {
            const value = (transformRes as Record<string, EncodeResult>)[_key];
            if (Array.isArray(value)) {
              value.forEach((val) => params.append(key, String(val)));
            } else {
              params.set(_key, String(value));
            }
          });
        } else {
          if (Array.isArray(transformRes)) {
            transformRes.forEach((value) => params.append(key, String(value)));
          } else {
            params.set(key, String(transformRes));
          }
        }
      } else {
        if (Array.isArray(mapEntry)) {
          mapEntry.forEach((value) => {
            if (typeof value === "object" && mapEntry !== null) {
              throw new Error("please check your type or use encode");
            }
            params.append(key, value);
          });
        } else {
          if (typeof mapEntry === "object" && mapEntry !== null) {
            throw new Error("please check your type or use encode");
          }
          const omitEmptyString = config.omitEmptyString ?? true;
          const omitNull = config.omitNull ?? true;
          const omitUndefined = config.omitUndefined ?? true;
          if (mapEntry === "") {
            !omitEmptyString && params.set(key, mapEntry);
          } else if (mapEntry === null) {
            !omitNull && params.set(key, mapEntry);
          } else if (mapEntry === undefined) {
            !omitUndefined && params.set(key, mapEntry);
          } else {
            params.set(key, mapEntry);
          }
        }
      }
    });

    // otherParams
    Object.keys(searchParams).forEach((key) => {
      if (!configs.some((config) => config.key === key)) {
        const mapEntry = searchParams[key];
        if (Array.isArray(mapEntry)) {
          mapEntry.forEach((value) => params.append(key, value));
        } else {
          params.set(key, mapEntry);
        }
      }
    });

    write(params);
    const search = constructQuery(params);
    const previousSearch =
      mode === "history" ? window.location.search : window.location.hash;
    if (previousSearch !== search) {
      window.history.pushState(
        window.history.state,
        window.document.title,
        window.location.pathname + search
      );
    }
  };

  return { searchParams, syncToUrl };
};
