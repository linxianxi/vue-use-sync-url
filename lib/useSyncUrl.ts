import { usePopStateListener } from "./usePopStateListener";
import { isObj } from "./utils";
import { useRoute, useRouter } from "vue-router";
import { EncodeResult, ExtraValues, useSyncUrlOptions } from "./type";

export const useSyncUrl = ({ configs, onDecodeSuccess }: useSyncUrlOptions) => {
  const route = useRoute();
  const router = useRouter();

  const handleDecode = (isPopState: boolean) => {
    const searchParams = new URL(location.href).searchParams;
    const allParams: Record<string, string | string[]> = {};
    for (const key of searchParams.keys()) {
      const paramsForKey = searchParams.getAll(key);
      allParams[key] =
        paramsForKey.length > 1 ? paramsForKey : searchParams.get(key) || "";
    }
    configs.forEach((config) => {
      const params = searchParams.getAll(config.name);
      if (params.length > 1) {
        config.decode(params, allParams, isPopState);
      } else {
        const value = searchParams.get(config.name);
        config.decode(value, allParams, isPopState);
      }
    });

    onDecodeSuccess?.(isPopState);
  };

  const setSearchParams = (
    searchParams: URLSearchParams,
    name: string,
    value: EncodeResult,
    omitEmptyString = true,
    omitNull = true,
    omitUndefined = true
  ) => {
    if (Array.isArray(value)) {
      value.forEach((value) => {
        if (typeof value === "object" && value !== null) {
          throw new Error("please check type");
        }
        searchParams.append(name, String(value));
      });
    } else {
      if (typeof value === "object" && value !== null) {
        throw new Error("please check type");
      }

      if (value === "") {
        if (omitEmptyString) {
          searchParams.delete(name);
        } else {
          searchParams.set(name, value);
        }
      } else if (value === null) {
        if (omitNull) {
          searchParams.delete(name);
        } else {
          searchParams.set(name, String(value));
        }
      } else if (value === undefined) {
        if (omitUndefined) {
          searchParams.delete(name);
        } else {
          searchParams.set(name, String(value));
        }
      } else {
        searchParams.set(name, String(value));
      }
    }
  };

  const syncToUrl = (extraValues?: ExtraValues) => {
    const url = new URL(location.href);

    configs.forEach(
      ({ name, encode, omitEmptyString, omitNull, omitUndefined }) => {
        const encodeRes = encode();
        if (isObj(encodeRes)) {
          if (!Object.keys(encodeRes as Record<string, EncodeResult>).length) {
            url.searchParams.delete(name);
            return;
          }
          Object.keys(encodeRes as Record<string, EncodeResult>).forEach(
            (name) => {
              setSearchParams(
                url.searchParams,
                name,
                (encodeRes as Record<string, EncodeResult>)[name],
                omitEmptyString,
                omitNull,
                omitUndefined
              );
            }
          );
        } else {
          setSearchParams(
            url.searchParams,
            name,
            encodeRes as EncodeResult,
            omitEmptyString,
            omitNull,
            omitUndefined
          );
        }
      }
    );

    if (extraValues) {
      if (Array.isArray(extraValues)) {
        extraValues.forEach(
          ({ name, value, omitEmptyString, omitNull, omitUndefined }) => {
            setSearchParams(
              url.searchParams,
              name,
              value,
              omitEmptyString,
              omitNull,
              omitUndefined
            );
          }
        );
      } else {
        const names = Object.keys(extraValues);
        if (names.length) {
          names.forEach((name) => {
            setSearchParams(url.searchParams, name, extraValues[name]);
          });
        }
      }
    }

    if (location.search !== url.search) {
      // vue-router bug, can not use history.pushState
      // https://github.com/vuejs/router/issues/1678
      // history.pushState({}, "", url.toString());
      router.push(route.path + url.search);
    }
  };

  handleDecode(false);

  usePopStateListener(() => {
    handleDecode(true);
  });

  return syncToUrl;
};
