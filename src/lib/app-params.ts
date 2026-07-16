import type { AppParams, BackendProvider } from '@/types/app';

class MemoryStorage {
  private store = new Map<string, string>();

  getItem(key: string) {
    return this.store.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.store.set(key, value);
  }

  removeItem(key: string) {
    this.store.delete(key);
  }
}

const isNode = typeof window === 'undefined';
const storage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> = isNode
  ? new MemoryStorage()
  : window.localStorage;

const toSnakeCase = (value: string) => value.replace(/([A-Z])/g, '_$1').toLowerCase();

interface AppParamOptions {
  defaultValue?: string | null;
  removeFromUrl?: boolean;
}

const getWindowLocationHref = () => (typeof window === 'undefined' ? null : window.location.href);

const getAppParamValue = (
  paramName: string,
  { defaultValue = null, removeFromUrl = false }: AppParamOptions = {},
): string | null => {
  if (isNode) {
    return defaultValue;
  }

  const storageKey = `base44_${toSnakeCase(paramName)}`;
  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get(paramName);

  if (removeFromUrl) {
    urlParams.delete(paramName);
    const newUrl = `${window.location.pathname}${urlParams.toString() ? `?${urlParams.toString()}` : ''}${window.location.hash}`;
    window.history.replaceState({}, document.title, newUrl);
  }

  if (searchParam) {
    storage.setItem(storageKey, searchParam);
    return searchParam;
  }

  if (defaultValue) {
    storage.setItem(storageKey, defaultValue);
    return defaultValue;
  }

  return storage.getItem(storageKey);
};

const getBackendProvider = (): BackendProvider => {
  const provider = getAppParamValue('backend_provider', { defaultValue: 'base44' });
  return provider === 'supabase' ? 'supabase' : 'base44';
};

const getAppParams = (): AppParams => {
  if (getAppParamValue('clear_access_token') === 'true') {
    storage.removeItem('base44_access_token');
    storage.removeItem('token');
  }

  return {
    appId: getAppParamValue('app_id', { defaultValue: import.meta.env.VITE_BASE44_APP_ID ?? null }),
    token: getAppParamValue('access_token', { removeFromUrl: true }),
    fromUrl: getAppParamValue('from_url', { defaultValue: getWindowLocationHref() }),
    functionsVersion: getAppParamValue('functions_version', {
      defaultValue: import.meta.env.VITE_BASE44_FUNCTIONS_VERSION ?? null,
    }),
    appBaseUrl: getAppParamValue('app_base_url', {
      defaultValue: import.meta.env.VITE_BASE44_APP_BASE_URL ?? null,
    }),
    backendProvider: getBackendProvider(),
  };
};

export const appParams: AppParams = getAppParams();
