import { onUnmounted } from "vue";

export const usePopStateListener = (listener: () => void) => {
  window.addEventListener("popstate", listener);

  onUnmounted(() => {
    window.removeEventListener("popstate", listener);
  });
};
