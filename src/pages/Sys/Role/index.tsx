import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  PageContainer,
  ProDescriptions,
  ProTable,
  TableDropdown,
} from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import { Button, Drawer, message } from 'antd';
import React, { useRef, useState } from 'react';
import UpdateForm from './components/UpdateForm';
import requestTransform from '@/utils/requestTransform';
import type {
  V1CreateRoleRequest,
  V1UpdateRole,
  V1UpdateRoleRequest,
  V1Role,
  V1RoleFilter,
} from '@kit/api';
import { RoleServiceApi } from '@kit/api';

const handleAdd = async (fields: V1CreateRoleRequest) => {
  const hide = message.loading('正在添加');
  try {
    await new RoleServiceApi().roleServiceCreateRole({ body: fields });
    hide();
    message.success('Added successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Adding failed, please try again!');
    return false;
  }
};

const handleUpdate = async (fields: V1UpdateRoleRequest) => {
  const hide = message.loading('Configuring');
  try {
    await new RoleServiceApi().roleServiceUpdateRole2({ body: fields, roleId: fields.role!.id! });
    hide();

    message.success('Configuration is successful');
    return true;
  } catch (error) {
    hide();
    message.error('Configuration failed, please try again!');
    return false;
  }
};

const handleRemove = async (selectedRow: V1Role) => {
  const hide = message.loading('正在删除');
  try {
    await new RoleServiceApi().roleServiceDeleteRole({ id: selectedRow.id! });
    hide();
    message.success('Deleted successfully and will refresh soon');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again');
    return false;
  }
};

const TableList: React.FC = () => {
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<V1Role | undefined | null>(undefined);

  const columns: ProColumns<V1Role>[] = [
    {
      title: <FormattedMessage id="sys.role.name" defaultMessage="Role Name" />,
      dataIndex: 'name',
      valueType: 'text',
    },
    {
      title: <FormattedMessage id="sys.role.isPreserved" defaultMessage="Role Preserved" />,
      dataIndex: 'isPreserved',
      valueType: 'switch',
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
            handleUpdateModalVisible(true);
          }}
        >
          <FormattedMessage id="pages.searchTable.edit" defaultMessage="Edit" />
        </a>,
        <TableDropdown
          key="actionGroup"
          onSelect={() => handleRemove(record)}
          menus={[{ key: 'delete', name: '删除' }]}
        />,
      ],
    },
  ];

  const getData = requestTransform<V1Role, V1RoleFilter>(async (req) => {
    const resp = await new RoleServiceApi().roleServiceListRoles2({ body: req });
    return resp.data;
  });

  return (
    <PageContainer>
      <ProTable<V1Role>
        actionRef={actionRef}
        rowKey="id"
        search={false}
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
      )
      <UpdateForm
        onSubmit={async (value) => {
          const { id } = value;
          let success = false;
          if (id) {
            success = await handleUpdate({ role: value as V1UpdateRole });
          } else {
            success = await handleAdd(value as V1CreateRoleRequest);
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
        values={currentRow || {}}
        columns={columns}
      />
      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<V1Role>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<V1Role>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
