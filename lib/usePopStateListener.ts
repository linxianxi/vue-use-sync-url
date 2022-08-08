import { onMounted, onUnmounted } from "vue";

export const usePopStateListener = (listener: () => void) => {
  onMounted(() => {
    window.addEventListener("popstate", listener);
  });

  onUnmounted(() => {
    window.removeEventListener("popstate", listener);
  });
};
