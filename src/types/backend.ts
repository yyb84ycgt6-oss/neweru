import type { AppEntityRecord, AppParams, AppUser } from './app';

export type EntityFilter = Record<string, unknown>;
export type EntityPayload<TRecord extends AppEntityRecord = AppEntityRecord> = Partial<TRecord> & Record<string, unknown>;
export type SubscriptionCallback = (...args: unknown[]) => void;

export interface EntityClient<TRecord extends AppEntityRecord = AppEntityRecord> {
  list(sort?: string, limit?: number): Promise<TRecord[]>;
  filter(filter: EntityFilter, sort?: string, limit?: number): Promise<TRecord[]>;
  get(id: string): Promise<TRecord>;
  create(payload: EntityPayload<TRecord>): Promise<TRecord>;
  update(id: string, payload: EntityPayload<TRecord>): Promise<TRecord>;
  delete(id: string): Promise<unknown>;
  bulkCreate?(payload: EntityPayload<TRecord>[]): Promise<TRecord[]>;
  subscribe?(callback: SubscriptionCallback): () => void;
}

export interface AuthClient<TUser extends AppUser = AppUser> {
  me(): Promise<TUser>;
  updateMe(payload: Partial<TUser> & Record<string, unknown>): Promise<TUser>;
  loginViaEmailPassword(email: string, password: string): Promise<unknown>;
  loginWithProvider(providerId: string, redirectTo?: string): Promise<unknown>;
  register(payload: Record<string, unknown>): Promise<unknown>;
  verifyOtp(payload: Record<string, unknown>): Promise<{ access_token?: string } & Record<string, unknown>>;
  resendOtp(email: string): Promise<unknown>;
  resetPasswordRequest(email: string): Promise<unknown>;
  resetPassword(payload: Record<string, unknown>): Promise<unknown>;
  logout(redirectTo?: string): void;
  redirectToLogin(redirectTo?: string): void;
  setToken(token: string): void;
}

export interface FunctionsClient {
  invoke<TResponse = unknown>(name: string, payload?: Record<string, unknown>): Promise<TResponse>;
}

export interface CoreIntegrationsClient {
  InvokeLLM<TResponse = unknown>(payload: Record<string, unknown>): Promise<TResponse>;
  UploadFile<TResponse extends { file_url?: string } = { file_url?: string }>(payload: { file: File | Blob | unknown } & Record<string, unknown>): Promise<TResponse>;
}

export interface IntegrationsClient {
  Core: CoreIntegrationsClient;
  [key: string]: Record<string, (...args: any[]) => Promise<unknown>> | CoreIntegrationsClient;
}

export interface ServiceRoleClient {
  entities: Record<string, EntityClient>;
}

export interface AppBackendClient<TUser extends AppUser = AppUser> {
  auth: AuthClient<TUser>;
  entities: Record<string, EntityClient>;
  functions: FunctionsClient;
  integrations: IntegrationsClient;
  asServiceRole: ServiceRoleClient;
  appParams?: AppParams;
}
