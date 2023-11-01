import React, { useState } from 'react';
import { useIntl, useModel } from '@umijs/max';
import { Dropdown, Space, Image } from 'antd';
import { FormattedMessage } from '@umijs/max';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import CreateTenantModal from './CreateTenantModal';

export type TenantDropdownProps = {
  logo: React.ReactNode | string;
  title: React.ReactNode | string;
};

const TenantDropdown: React.FC<TenantDropdownProps> = (props) => {
  const { initialState } = useModel('@@initialState');

  const allTenants = initialState?.currentUser?.tenants ?? [];
  const expectNow = allTenants.filter(
    (p) => p.tenant?.id !== initialState?.currentUser?.currentTenant?.tenant?.id,
  );
  const intl = useIntl();
  const [createModalVisible, handleCreateModalVisible] = useState<boolean>(false);

  const menuItems = [
    ...expectNow.map((p) => {
      return {
        key: p.tenant?.id ?? '',
        label: (
          <a
            onClick={(e) => {
              e.preventDefault();
              //change tenant
              initialState?.changeTenant?.(p.tenant?.id ?? '');
            }}
          >
            <Space>
              {p.isHost ? (
                <FormattedMessage id="saas.switch.backToHost" defaultMessage="Back to Host" />
              ) : (
                p.tenant?.displayName
              )}
            </Space>
          </a>
        ),
      };
    }),
    {
      key: '@',
      label: (
        <div
          onClick={(e) => {
            e.preventDefault();
            handleCreateModalVisible(true);
          }}
        >
          <Space>
            <PlusOutlined />
            {intl.formatMessage({
              id: 'saas.tenant.create',
              defaultMessage: 'Create New',
            })}
          </Space>
        </div>
      ),
    },
  ];
  const actionClassName = useEmotionCss(({ token }) => {
    return {
      display: 'flex',
      float: 'right',
      // height: '48px',
      marginLeft: 'auto',
      overflow: 'hidden',
      cursor: 'pointer',
      padding: '0 8px',
      borderRadius: token.borderRadius,
      '&:hover': {
        backgroundColor: token.colorBgTextHover,
      },
    };
  });
  const currentName = (
    <h1>
      {initialState?.currentTenant?.isHost
        ? initialState?.currentTenant?.tenant?.displayName ??
          intl.formatMessage({
            id: 'saas.switch.host',
            defaultMessage: 'Host',
          })
        : initialState?.currentTenant?.tenant?.displayName}
    </h1>
  );

  return (
    <>
      {initialState?.currentTenant?.tenant?.logo?.url ? (
        <img src={initialState?.currentTenant?.tenant?.logo?.url} />
      ) : (
        props.logo
      )}
      <Dropdown menu={{ items: menuItems }}>
        <span className={actionClassName}>
          <Space>
            {currentName}
            <DownOutlined />
          </Space>
        </span>
      </Dropdown>
      <CreateTenantModal
        open={createModalVisible}
        onCancel={() => {
          handleCreateModalVisible(false);
        }}
        onFinish={(tenant) => {
          handleCreateModalVisible(false);
          initialState?.changeTenant?.(tenant?.id ?? '');
        }}
      ></CreateTenantModal>
    </>
  );
};

export default TenantDropdown;
