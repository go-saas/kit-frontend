/* eslint-disable @typescript-eslint/no-unused-vars */
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
// import UpdateForm from './components/UpdateForm';
import { requestTransform } from '@gosaas/core';
import type { V1Order, V1OrderFilter } from '@gosaas/api';
import { OrderServiceApi } from '@gosaas/api';

import { useIntl } from '@umijs/max';

const service = new OrderServiceApi();

const TableList: React.FC = () => {
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<V1Order | undefined | null>(undefined);

  const intl = useIntl();
  // const handleAdd = async (fields: V1CreateOrderRequest) => {
  //   const hide = message.loading(
  //     intl.formatMessage({ id: 'common.creating', defaultMessage: 'Creating...' }),
  //   );
  //   try {
  //     await service.ticketingOrderServiceCreateOrder({ body: fields });
  //     hide();
  //     message.success(
  //       intl.formatMessage({ id: 'common.created', defaultMessage: 'Created Successfully' }),
  //     );
  //     return true;
  //   } catch (error) {
  //     hide();
  //     return false;
  //   }
  // };

  // const handleUpdate = async (fields: V1UpdateOrderRequest) => {
  //   const hide = message.loading(
  //     intl.formatMessage({ id: 'common.updating', defaultMessage: 'Updating...' }),
  //   );
  //   try {
  //     await service.ticketingOrderServiceUpdateOrder2({
  //       body: fields,
  //       bannerId: fields.banner!.id!,
  //     });
  //     hide();
  //     message.success(
  //       intl.formatMessage({ id: 'common.updated', defaultMessage: 'Update Successfully' }),
  //     );
  //     return true;
  //   } catch (error) {
  //     hide();
  //     return false;
  //   }
  // };

  // const handleRemove = async (selectedRow: V1Order) => {
  //   const hide = message.loading(
  //     intl.formatMessage({ id: 'common.deleting', defaultMessage: 'Deleting...' }),
  //   );
  //   try {
  //     await service.ticketingOrderServiceDeleteOrder({ id: selectedRow.id! });
  //     message.success(
  //       intl.formatMessage({ id: 'common.deleted', defaultMessage: 'Delete Successfully' }),
  //     );
  //     hide();
  //     return true;
  //   } catch (error) {
  //     hide();
  //     return false;
  //   }
  // };

  const columns: ProColumnType<V1Order>[] = [
    {
      title: <FormattedMessage id="ticketing.order.id" defaultMessage="Id" />,
      dataIndex: 'id',
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
      title: <FormattedMessage id="ticketing.order.status" defaultMessage="Status" />,
      dataIndex: 'status',
      valueType: 'text',
    },
    {
      title: <FormattedMessage id="ticketing.order.customerId" defaultMessage="customerId" />,
      dataIndex: 'customerId',
      valueType: 'text',
    },
    {
      title: <FormattedMessage id="ticketing.order.totalPrice" defaultMessage="Total Price" />,
      dataIndex: ['totalPrice', 'text'],
      valueType: 'text',
    },
    {
      title: (
        <FormattedMessage
          id="ticketing.order.totalPriceInclTax"
          defaultMessage="Total Price with Tax"
        />
      ),
      dataIndex: ['totalPriceInclTax', 'text'],
      valueType: 'text',
    },
    {
      title: <FormattedMessage id="ticketing.order.originalPrice" defaultMessage="originalPrice" />,
      dataIndex: ['originalPrice', 'text'],
      valueType: 'text',
    },
    {
      title: (
        <FormattedMessage
          id="ticketing.order.originalPriceInclTax"
          defaultMessage="originalPrice with Tax"
        />
      ),
      dataIndex: ['originalPriceInclTax', 'text'],
      valueType: 'text',
    },
    {
      title: (
        <FormattedMessage id="ticketing.order.paidPrice" defaultMessage="paidPrice with Tax" />
      ),
      dataIndex: ['paidPrice', 'text'],
      valueType: 'text',
    },
    {
      title: <FormattedMessage id="ticketing.order.paidTime" defaultMessage="paidTime" />,
      dataIndex: ['paidTime'],
      valueType: 'dateTime',
    },
    {
      title: <FormattedMessage id="ticketing.order.payWay" defaultMessage="payWay" />,
      dataIndex: 'payWay',
      valueType: 'text',
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
        <TableDropdown
          key="actionGroup"
          onSelect={async (key) => {
            // if (key === 'delete') {
            //   const ok = await handleRemove(record);
            //   if (ok && actionRef.current) {
            //     actionRef.current.reload();
            //   }
            // }
          }}
          menus={
            [
              // {
              //   key: 'delete',
              //   name: <FormattedMessage id="common.delete" defaultMessage="Delete" />,
              // },
            ]
          }
        />,
      ],
    },
  ];

  const getData = requestTransform<V1Order, V1OrderFilter>(async (req) => {
    const resp = await service.orderServiceListOrder2({ body: req });
    return resp.data;
  });

  return (
    <PageContainer>
      <ProTable<V1Order>
        actionRef={actionRef}
        rowKey="id"
        search={false}
        pagination={false}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setCurrentRow(undefined);
              handleUpdateModalVisible(true);
            }}
          >
            {/* <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" /> */}
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
          <ProDescriptions<V1Order> column={1} dataSource={currentRow} columns={columns} />
        )}
      </Drawer>
      {/* <UpdateForm
        onSubmit={async (value) => {
          let success = false;
          if (currentRow) {
            success = await handleUpdate({
              banner: value as V1UpdateOrder,
            });
          } else {
            success = await handleAdd(value as V1CreateOrderRequest);
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
      /> */}
    </PageContainer>
  );
};

export default TableList;
