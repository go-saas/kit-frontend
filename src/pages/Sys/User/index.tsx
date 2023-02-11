import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  PageContainer,
  ProDescriptions,
  ProTable,
  TableDropdown,
} from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import { Button, Drawer, message, Image, Avatar } from 'antd';
import React, { useRef, useState } from 'react';
import UpdateForm from './components/UpdateForm';
import { requestTransform } from '@gosaas/core';
import type {
  V1CreateUserRequest,
  V1UpdateUser,
  V1UpdateUserRequest,
  V1User,
  V1UserFilter,
} from '@gosaas/api';
import { UserServiceApi } from '@gosaas/api';
import { UserOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import RoleTag from '@/components/Roletag';
import { genderValueEnum } from './gender';

const service = new UserServiceApi();
const TableList: React.FC = () => {
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<V1User | undefined | null>(undefined);
  const intl = useIntl();

  const handleAdd = async (fields: V1CreateUserRequest) => {
    const hide = message.loading(
      intl.formatMessage({ id: 'common.creating', defaultMessage: 'Creating...' }),
    );
    try {
      await service.userServiceCreateUser({ body: fields });
      hide();
      message.success(
        intl.formatMessage({ id: 'common.created', defaultMessage: 'Created Successfully' }),
      );
      return true;
    } catch (error) {
      hide();
      return false;
    }
  };

  const handleUpdate = async (fields: V1UpdateUserRequest) => {
    const hide = message.loading(
      intl.formatMessage({ id: 'common.updating', defaultMessage: 'Updating...' }),
    );
    try {
      await service.userServiceUpdateUser2({ body: fields, userId: fields.user!.id! });
      hide();
      message.success(
        intl.formatMessage({ id: 'common.updated', defaultMessage: 'Update Successfully' }),
      );
      return true;
    } catch (error) {
      hide();
      return false;
    }
  };

  const handleRemove = async (selectedRow: V1User) => {
    const hide = message.loading(
      intl.formatMessage({ id: 'common.deleting', defaultMessage: 'Deleting...' }),
    );
    try {
      await service.userServiceDeleteUser({ id: selectedRow.id! });
      message.success(
        intl.formatMessage({ id: 'common.deleted', defaultMessage: 'Delete Successfully' }),
      );
      hide();
      return true;
    } catch (error) {
      hide();
      return false;
    }
  };

  const columns: ProColumns<V1User>[] = [
    {
      title: <FormattedMessage id="sys.user.avatar" defaultMessage="User Avatar" />,
      dataIndex: 'avatar',
      valueType: 'image',
      render: (dom, entity) => {
        return entity?.avatar?.url ? (
          <Avatar size={50} src={<Image src={entity.avatar.url} style={{ width: 48 }} />} />
        ) : (
          <Avatar size={50} icon={<UserOutlined />} />
        );
      },
    },
    {
      title: <FormattedMessage id="sys.user.role" defaultMessage="Role" />,
      render: (dom, entity) => {
        return (
          <div>
            {(entity.roles ?? []).map((p) => (
              <RoleTag role={p} key={p.id} />
            ))}
          </div>
        );
      },
    },
    {
      title: <FormattedMessage id="sys.user.username" defaultMessage="Username" />,
      dataIndex: 'username',
      valueType: 'text',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: <FormattedMessage id="sys.user.name" defaultMessage="User Name" />,
      dataIndex: 'name',
      valueType: 'text',
    },
    {
      title: <FormattedMessage id="sys.user.email" defaultMessage="Email" />,
      dataIndex: 'email',
      valueType: 'text',
    },
    {
      title: <FormattedMessage id="sys.user.phone" defaultMessage="Phone" />,
      dataIndex: 'phone',
      valueType: 'text',
    },
    {
      title: <FormattedMessage id="sys.user.gender" defaultMessage="Gender" />,
      dataIndex: 'gender',
      valueType: 'radioButton',
      valueEnum: genderValueEnum,
    },
    {
      title: <FormattedMessage id="sys.user.birthday" defaultMessage="Birthday" />,
      dataIndex: 'birthday',
      valueType: 'date',
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating" />,
      key: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="editable"
          onClick={() => {
            setCurrentRow(record);
            setShowDetail(false);
            handleUpdateModalVisible(true);
          }}
        >
          <FormattedMessage id="pages.searchTable.edit" defaultMessage="Edit" />
        </a>,
        <TableDropdown
          key="actionGroup"
          onSelect={async (key) => {
            if (key === 'delete') {
              const ok = await handleRemove(record);
              if (ok && actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          menus={[
            {
              key: 'delete',
              name: <FormattedMessage id="common.delete" defaultMessage="Delete" />,
            },
          ]}
        />,
      ],
    },
  ];

  const getData = requestTransform<V1User, V1UserFilter>(async (req) => {
    const resp = await service.userServiceListUsers2({ body: req });
    return resp.data;
  });

  return (
    <PageContainer>
      <ProTable<V1User>
        actionRef={actionRef}
        rowKey="id"
        search={false}
        pagination={{
          defaultPageSize: 10,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setCurrentRow(undefined);
              handleUpdateModalVisible(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        type="table"
        request={getData}
        columns={columns}
      />
      <Drawer
        width={800}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
        destroyOnClose
      >
        {currentRow?.id && (
          <ProDescriptions<V1User>
            column={2}
            title={currentRow?.name}
            request={async () => {
              const resp = await service.userServiceGetUser({ id: currentRow.id! });
              return {
                data: resp.data,
              };
            }}
            params={{
              id: currentRow?.id,
            }}
            columns={columns}
          />
        )}
      </Drawer>
      <UpdateForm
        onSubmit={async (value) => {
          let success = false;
          if (currentRow) {
            success = await handleUpdate({ user: value as V1UpdateUser });
          } else {
            success = await handleAdd(value as V1CreateUserRequest);
          }
          if (success) {
            handleUpdateModalVisible(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalVisible(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        updateModalVisible={updateModalVisible}
        values={
          { ...(currentRow || {}), rolesId: currentRow?.roles?.map((p) => p.id!) ?? [] } as any
        }
      />
    </PageContainer>
  );
};

export default TableList;
