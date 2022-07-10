import React from 'react';
import type { V1Role } from '@kit/api';
import { Tag } from 'antd';
import { useIntl } from 'umi';
type RoleTagProps = {
  role: V1Role;
};

const RoleTag: React.FC<RoleTagProps> = (props: RoleTagProps) => {
  const intl = useIntl();

  if (props.role.isPreserved) {
    return (
      <Tag color="blue">
        {intl.formatMessage({
          id: 'sys.role.preserved.' + props.role.name,
          defaultMessage: props.role.name,
        })}
      </Tag>
    );
  }
  return <Tag>{props.role.name}</Tag>;
};

export default RoleTag;
