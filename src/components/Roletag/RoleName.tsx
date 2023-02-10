import type { V1Role } from '@gosaas/api';

export const getName = (intl: any, role: V1Role) => {
  if (role.isPreserved) {
    return intl.formatMessage({
      id: 'sys.role.preserved.' + role.name,
      defaultMessage: role.name,
    });
  }
  return role.name;
};
