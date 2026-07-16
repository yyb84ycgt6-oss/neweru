import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';
import type { AppBackendClient } from '@/types/backend';

const { appId, token, functionsVersion, appBaseUrl } = appParams;

export const base44 = createClient({
  appId,
  token,
  functionsVersion,
  serverUrl: '',
  requiresAuth: false,
  appBaseUrl,
}) as unknown as AppBackendClient;
