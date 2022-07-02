export interface PermissionAcl {
  namespace: string;
  resource: string;
  action: string;
  effect: PermissionEffect;
}

export interface PermissionRequirement {
  namespace: string;
  resource: string;
  action: string;
}

export enum PermissionEffect {
  UNKNOWN = 'UNKNOWN',
  GRANT = 'GRANT',
  FORBIDDEN = 'FORBIDDEN',
}

export interface RoleInfo {
  id: string;
  name: string;
  isPreserved: boolean;
}

export interface TenantInfo {
  id: string;
  name: string;
  displayName: string;
  region: string;
  logo?: BlobFile;
}

export interface BlobFile {
  url?: string;
}
export interface UserTenantInfo {
  isHost: boolean;
  tenant?: TenantInfo;
}

export interface UserInfo {
  id: string | number;
  username: string;
  name: string;
  avatar: string;
  roles: RoleInfo[];
  tenants: UserTenantInfo[];
  currentTenant: UserTenantInfo;
}
