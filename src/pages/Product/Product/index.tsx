import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumnType } from '@ant-design/pro-components';
import {
  PageContainer,
  ProDescriptions,
  ProTable,
  TableDropdown,
} from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import { Button, Drawer, message, Image } from 'antd';
import React, { useRef, useState } from 'react';
import UpdateForm from './components/UpdateForm';
import { requestTransform } from '@gosaas/core';
import type {
  V1CreateProductRequest,
  ProductServiceUpdateProductRequest,
  V1Product,
  V1ProductFilter,
} from '@gosaas/api';
import { ProductServiceApi } from '@gosaas/api';

import { useIntl } from '@umijs/max';

const service = new ProductServiceApi();

const TableList: React.FC = () => {
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<V1Product | undefined | null>(undefined);

  const intl = useIntl();
  const handleAdd = async (fields: V1CreateProductRequest) => {
    const hide = message.loading(
      intl.formatMessage({ id: 'common.creating', defaultMessage: 'Creating...' }),
    );
    try {
      await service.productServiceCreateProduct({ body: fields });
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

  const handleUpdate = async (fields: ProductServiceUpdateProductRequest) => {
    const hide = message.loading(
      intl.formatMessage({ id: 'common.updating', defaultMessage: 'Updating...' }),
    );
    try {
      await service.productServiceUpdateProduct2({ body: fields, productId: currentRow!.id! });
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

  const handleRemove = async (selectedRow: V1Product) => {
    const hide = message.loading(
      intl.formatMessage({ id: 'common.deleting', defaultMessage: 'Deleting...' }),
    );
    try {
      await service.productServiceDeleteProduct({ id: selectedRow.id! });
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

  const columns: ProColumnType<V1Product>[] = [
    {
      title: <FormattedMessage id="saas.product.title" defaultMessage="Title" />,
      dataIndex: 'title',
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
      title: <FormattedMessage id="saas.product.mainPic" defaultMessage="Picture" />,
      dataIndex: 'mainPic',
      valueType: 'image',
      render: (dom, entity) => {
        return entity?.mainPic?.url ? (
          <Image src={entity.mainPic.url} width={54} height={54} />
        ) : (
          <div />
        );
      },
    },
    {
      title: <FormattedMessage id="saas.product.shortDesc" defaultMessage="Product Short Desc" />,
      dataIndex: 'shortDesc',
      valueType: 'text',
    },
    {
      title: <FormattedMessage id="saas.product.mainCategory" defaultMessage="Main Category" />,
      dataIndex: ['mainCategory', 'name'],
      valueType: 'text',
    },
    {
      title: <FormattedMessage id="saas.product.multiSku" defaultMessage="Multi Sku" />,
      dataIndex: 'multiSku',
      valueType: 'switch',
    },
    {
      title: <FormattedMessage id="saas.product.needShipping" defaultMessage="Shipping" />,
      dataIndex: 'needShipping',
      valueType: 'switch',
    },
    {
      title: <FormattedMessage id="saas.product.saleableFrom" defaultMessage="Saleable From" />,
      dataIndex: 'saleableFrom',
      valueType: 'dateTime',
    },
    {
      title: <FormattedMessage id="saas.product.saleableTo" defaultMessage="Saleable To" />,
      dataIndex: 'saleableTo',
      valueType: 'dateTime',
    },
    {
      title: <FormattedMessage id="saas.product.active" defaultMessage="Active" />,
      dataIndex: 'active',
      valueType: 'switch',
    },
    {
      title: <FormattedMessage id="saas.product.managed" defaultMessage="Managed" />,
      dataIndex: ['manageInfo', 'managed'],
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
        record.manageInfo?.managed ?? false ? (
          <FormattedMessage id="common.edit" defaultMessage="Edit" />
        ) : (
          <a
            key="editable"
            onClick={() => {
              setCurrentRow(record);
              setShowDetail(false);
              handleUpdateModalVisible(true);
            }}
          >
            <FormattedMessage id="common.edit" defaultMessage="Edit" />
          </a>
        ),
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
          menus={
            record.manageInfo?.managed ?? false
              ? []
              : [
                  {
                    key: 'delete',
                    name: <FormattedMessage id="common.delete" defaultMessage="Delete" />,
                  },
                ]
          }
        />,
      ],
    },
  ];

  const getData = requestTransform<V1Product, V1ProductFilter>(async (req) => {
    const resp = await service.productServiceListProduct2({ body: req });
    return resp.data;
  });

  return (
    <PageContainer>
      <ProTable<V1Product>
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
          <ProDescriptions<V1Product>
            column={1}
            title={currentRow?.title}
            request={async () => {
              const resp = await service.productServiceGetProduct({ id: currentRow.id! });
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
          const { id } = value;
          let success = false;
          if (id) {
            success = await handleUpdate({ product: value });
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
