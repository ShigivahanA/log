import { useRegisterSW } from "virtual:pwa-register/react";

export function usePWAUpdate() {
  const {
    needRefresh,
    updateServiceWorker,
  } = useRegisterSW({
    immediate: false,
  });

  return {
    needRefresh,
    refresh: () => updateServiceWorker(true),
  };
}
