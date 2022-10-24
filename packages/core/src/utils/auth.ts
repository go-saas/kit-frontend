import { Storage } from './storage';
import { ACCESS_TOKEN_KEY, TENANT_KEY, USER_INFO_KEY, PERMISSION_KEY } from '@/enums/cacheEnum';
import type { PermissionAcl } from '@/permission/types';
import type { UserInfo } from '@/permission';
export function getSettingTenantId(): Nullable<string> {
  return Storage.get(TENANT_KEY);
}
export function setSettingTenantId(v?: Nullable<string>) {
  Storage.set(TENANT_KEY, v);
}

export function getAccessToken(): Nullable<string> {
  return Storage.get<Nullable<string>>(ACCESS_TOKEN_KEY);
}

export function setAccessToken(v?: Nullable<string>) {
  Storage.set(ACCESS_TOKEN_KEY, v);
}

export function getUserInfo(): Nullable<UserInfo> {
  return Storage.get<Nullable<UserInfo>>(USER_INFO_KEY);
}

export function setUserInfo(v?: Nullable<UserInfo>) {
  Storage.set(USER_INFO_KEY, v);
}

export interface PermissionStoreModel {
  values: PermissionAcl[];
}

export function getPermission(): Nullable<PermissionStoreModel> {
  return Storage.get<Nullable<PermissionStoreModel>>(PERMISSION_KEY);
}

export function setPermission(v?: Nullable<PermissionStoreModel>) {
  Storage.set(PERMISSION_KEY, v);
}
