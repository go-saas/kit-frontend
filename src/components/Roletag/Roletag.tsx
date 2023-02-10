import React from 'react';
import type { V1Role } from '@gosaas/api';
import { Tag } from 'antd';
import { useIntl } from 'umi';
import { getName } from './RoleName';
type RoleTagProps = {
  role: V1Role;
};

const RoleTag: React.FC<RoleTagProps> = (props: RoleTagProps) => {
  const intl = useIntl();

  if (props.role.isPreserved) {
    return <Tag color="blue">{getName(intl, props.role)}</Tag>;
  }
  return <Tag>{getName(intl, props.role)}</Tag>;
};

export default RoleTag;
