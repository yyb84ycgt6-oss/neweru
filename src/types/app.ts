export type BackendProvider = 'base44' | 'supabase';

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
export interface JsonObject {
  [key: string]: JsonValue;
}

export interface AppEntityRecord extends Record<string, unknown> {
  id?: string;
  created_date?: string;
  updated_date?: string;
}

export interface AppUser extends AppEntityRecord {
  email?: string | null;
  display_name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  roles?: string[];
  permissions?: string[];
}

export interface AppParams {
  appId: string | null;
  token: string | null;
  fromUrl: string | null;
  functionsVersion: string | null;
  appBaseUrl: string | null;
  backendProvider: BackendProvider;
}
