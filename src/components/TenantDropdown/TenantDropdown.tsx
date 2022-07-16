import React from 'react';
import { useModel } from 'umi';
import { Dropdown, Menu } from 'antd';
import { FormattedMessage } from 'umi';
import { DownOutlined } from '@ant-design/icons';

export type TenantDropdownProps = {
  logo: React.ReactNode | string;
  title: React.ReactNode | string;
};

const TenantDropdown: React.FC<TenantDropdownProps> = (props) => {
  const { initialState } = useModel('@@initialState');

  const allTenants = initialState?.currentUser?.tenants ?? [];
  const expectNow = allTenants.filter(
    (p) => p.tenant?.id != initialState?.currentUser?.currentTenant?.tenant?.id,
  );
  const menuItems = expectNow.map((p) => {
    return {
      key: p.tenant?.id ?? '',
      label: (
        <a
          onClick={() => {
            //change tenant
            initialState?.changeTenant?.(p.tenant?.id ?? '');
          }}
        >
          {p.isHost ? (
            <FormattedMessage id="saas.switch.backToHost" defaultMessage="Back to Host" />
          ) : (
            p.tenant?.displayName
          )}
        </a>
      ),
    };
  });

  const menus = <Menu items={menuItems} />;
  return (
    <a>
      {initialState?.currentTenant?.tenant?.logo?.url ? (
        <img src={initialState?.currentTenant?.tenant?.logo?.url} />
      ) : (
        props.logo
      )}
      <Dropdown overlay={menus}>
        <a onClick={(e) => e.preventDefault()}>
          {initialState?.currentTenant?.tenant?.displayName ? (
            <h1>{initialState?.currentTenant?.tenant?.displayName}</h1>
          ) : (
            props.title
          )}
          <DownOutlined style={{ paddingLeft: 8 }} />
        </a>
      </Dropdown>
    </a>
  );
};

export default TenantDropdown;
