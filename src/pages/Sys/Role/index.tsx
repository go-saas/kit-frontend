import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  PageContainer,
  ProDescriptions,
  ProTable,
  ProCard,
  TableDropdown,
} from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import { Button, Drawer, message, Switch } from 'antd';
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
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useIntl } from 'umi';
import Roletag from '@/components/Roletag';

const TableList: React.FC = () => {
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<V1Role | undefined | null>(undefined);
  const intl = useIntl();

  const handleAdd = async (fields: V1CreateRoleRequest) => {
    const hide = message.loading(
      intl.formatMessage({ id: 'common.creating', defaultMessage: 'Creating...' }),
    );
    try {
      await new RoleServiceApi().roleServiceCreateRole({ body: fields });
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

  const handleUpdate = async (fields: V1UpdateRoleRequest) => {
    const hide = message.loading(
      intl.formatMessage({ id: 'common.updating', defaultMessage: 'Updating...' }),
    );
    try {
      await new RoleServiceApi().roleServiceUpdateRole2({ body: fields, roleId: fields.role!.id! });
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

  const handleRemove = async (selectedRow: V1Role) => {
    if (selectedRow.isPreserved) {
      return;
    }
    const hide = message.loading(
      intl.formatMessage({ id: 'common.deleting', defaultMessage: 'Deleting...' }),
    );
    try {
      await new RoleServiceApi().roleServiceDeleteRole({ id: selectedRow.id! });
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

  const columns: ProColumns<V1Role>[] = [
    {
      title: <FormattedMessage id="sys.role.name" defaultMessage="Role Name" />,
      dataIndex: 'name',
      valueType: 'text',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            <Roletag role={entity} />
          </a>
        );
      },
    },
    {
      title: <FormattedMessage id="sys.role.isPreserved" defaultMessage="Role Preserved" />,
      dataIndex: 'isPreserved',
      valueType: 'switch',
      render: (dom, entity) => {
        return entity.isPreserved ? <CheckOutlined /> : <CloseOutlined />;
      },
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating" />,
      key: 'option',
      valueType: 'option',
      render: (_, record) => [
        record.isPreserved ? (
          <FormattedMessage id="pages.searchTable.edit" defaultMessage="Edit" />
        ) : (
          <a
            key="editable"
            onClick={() => {
              setCurrentRow(record);
              setShowDetail(false);
              handleUpdateModalVisible(true);
            }}
          >
            <FormattedMessage id="pages.searchTable.edit" defaultMessage="Edit" />
          </a>
        ),
        <TableDropdown
          key="actionGroup"
          onSelect={async (key) => {
            if (key == 'delete') {
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

  const permission: ProColumns<V1Role>[] = [
    {
      title: <FormattedMessage id="sys.role.permission" defaultMessage="Role Permission" />,
      dataIndex: 'defGroups',
      render: (dom, entity) => {
        const g = (entity.defGroups ?? []).map((p) => {
          const defs = (p.def ?? []).map((q) => {
            return (
              <ProDescriptions
                column={3}
                key={q.name}
                title={
                  <div style={{ fontSize: '14px', fontWeight: 'normal' }}>{q.displayName}</div>
                }
              >
                <ProDescriptions.Item
                  label={
                    <FormattedMessage id="sys.permission.namespace" defaultMessage="Namespace" />
                  }
                >
                  {q.namespace}
                </ProDescriptions.Item>
                <ProDescriptions.Item
                  label={<FormattedMessage id="sys.permission.action" defaultMessage="Action" />}
                >
                  {q.action}
                </ProDescriptions.Item>
                <ProDescriptions.Item>
                  <Switch defaultChecked={q.granted} disabled />
                </ProDescriptions.Item>
              </ProDescriptions>
            );
          });
          return (
            <ProCard
              size="small"
              title={<div style={{ fontSize: '16px', fontWeight: 'bold' }}>{p.displayName}</div>}
              key={p.name}
              bordered
              headerBordered
            >
              {defs}
            </ProCard>
          );
        });
        return <div>{g}</div>;
      },
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
        pagination={{
          defaultPageSize: 10,
        }}
        type="table"
        request={getData}
        columns={columns}
      />
      <Drawer
        width={800}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
        destroyOnClose
      >
        {currentRow?.id && (
          <ProDescriptions<V1Role>
            column={1}
            title={currentRow?.name}
            request={async () => {
              const resp = await new RoleServiceApi().roleServiceGetRole({ id: currentRow.id! });
              return {
                data: resp.data,
              };
            }}
            params={{
              id: currentRow?.id,
            }}
            columns={[...columns, ...permission] as ProDescriptionsItemProps<V1Role>[]}
          />
        )}
      </Drawer>
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
        values={(currentRow as any) || { name: '' }}
      />
    </PageContainer>
  );
};

export default TableList;
