import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumnType } from '@ant-design/pro-components';
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
import { requestTransform } from '@gosaas/core';
import type {
  V1CreatePlanRequest,
  PlanServiceUpdatePlanRequest,
  V1Plan,
  V1PlanFilter,
} from '@gosaas/api';
import { PlanServiceApi } from '@gosaas/api';

import { useIntl } from '@umijs/max';

const service = new PlanServiceApi();

const TableList: React.FC = () => {
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<V1Plan | undefined | null>(undefined);

  const intl = useIntl();
  const handleAdd = async (fields: V1CreatePlanRequest) => {
    const hide = message.loading(
      intl.formatMessage({ id: 'common.creating', defaultMessage: 'Creating...' }),
    );
    try {
      await service.planServiceCreatePlan({ body: fields });
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

  const handleUpdate = async (fields: PlanServiceUpdatePlanRequest) => {
    const hide = message.loading(
      intl.formatMessage({ id: 'common.updating', defaultMessage: 'Updating...' }),
    );
    try {
      await service.planServiceUpdatePlan2({ body: fields, planKey: currentRow!.key! });
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

  const handleRemove = async (selectedRow: V1Plan) => {
    const hide = message.loading(
      intl.formatMessage({ id: 'common.deleting', defaultMessage: 'Deleting...' }),
    );
    try {
      await service.planServiceDeletePlan({ key: selectedRow.key! });
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

  const columns: ProColumnType<V1Plan>[] = [
    {
      title: <FormattedMessage id="saas.plan.key" defaultMessage="Plan Key" />,
      dataIndex: 'key',
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
      title: <FormattedMessage id="saas.plan.displayName" defaultMessage="Plan Display Name" />,
      dataIndex: 'displayName',
      valueType: 'text',
    },
    {
      title: <FormattedMessage id="saas.plan.active" defaultMessage="Active" />,
      dataIndex: 'active',
      valueType: 'switch',
    },
    {
      title: <FormattedMessage id="common.createdAt" defaultMessage="CreatedAt" />,
      dataIndex: 'createdAt',
      valueType: 'dateTime',
    },
    {
      title: <FormattedMessage id="common.updatedAt" defaultMessage="UpdatedAt" />,
      dataIndex: 'updatedAt',
      valueType: 'dateTime',
    },
    {
      title: <FormattedMessage id="common.operate" defaultMessage="Operate" />,
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
          <FormattedMessage id="common.edit" defaultMessage="Edit" />
        </a>,
        <a
          key="editprice"
          onClick={() => {
            setCurrentRow(record);
            setShowDetail(false);
            handleUpdateModalVisible(true);
          }}
        >
          <FormattedMessage id="saas.plan.editprice" defaultMessage="Edit Price" />
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

  const getData = requestTransform<V1Plan, V1PlanFilter>(async (req) => {
    const resp = await service.planServiceListPlan2({ body: req });
    return resp.data;
  });

  return (
    <PageContainer>
      <ProTable<V1Plan>
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
        {currentRow?.key && (
          <ProDescriptions<V1Plan>
            column={1}
            title={currentRow?.key}
            request={async () => {
              const resp = await service.planServiceGetPlan({ key: currentRow.key! });
              return {
                data: resp.data,
              };
            }}
            params={{
              id: currentRow?.key,
            }}
            columns={columns}
          />
        )}
      </Drawer>
      <UpdateForm
        onSubmit={async (value) => {
          const { key } = value;
          let success = false;
          if (key) {
            success = await handleUpdate({ plan: value });
          } else {
            success = await handleAdd(value);
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
        values={(currentRow as any) || {}}
      />
    </PageContainer>
  );
};

export default TableList;
