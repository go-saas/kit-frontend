import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  PageContainer,
  ProDescriptions,
  ProTable,
  TableDropdown,
} from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import { Button, Drawer, message, Image, Divider, Skeleton } from 'antd';

import React, { useEffect, useRef, useState } from 'react';
import UpdateForm from './components/UpdateForm';
import type { ClientOAuth2Client } from '@kit/api';
import { ClientServiceApi } from '@kit/api';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useIntl } from 'umi';

const service = new ClientServiceApi();

const TableList: React.FC = () => {
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<ClientOAuth2Client | undefined | null>(undefined);

  const intl = useIntl();
  const handleAdd = async (fields: ClientOAuth2Client) => {
    const hide = message.loading(
      intl.formatMessage({ id: 'common.creating', defaultMessage: 'Creating...' }),
    );
    try {
      await service.clientServiceCreateOAuth2Client({ body: fields });
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

  const handleUpdate = async (fields: ClientOAuth2Client) => {
    const hide = message.loading(
      intl.formatMessage({ id: 'common.updating', defaultMessage: 'Updating...' }),
    );
    try {
      await service.clientServiceUpdateOAuth2Client({
        body: { client: fields },
        id: fields.clientId!,
      });
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

  const handleRemove = async (selectedRow: ClientOAuth2Client) => {
    const hide = message.loading(
      intl.formatMessage({ id: 'common.deleting', defaultMessage: 'Deleting...' }),
    );
    try {
      await service.clientServiceDeleteOAuth2Client({ id: selectedRow.clientId! });
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

  const [afterPageToken, setAfterPageToken] = useState<string>();
  const [allData, setAllData] = useState<ClientOAuth2Client[]>();
  const [totalSize, setTotalSize] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const fetchData = async () => {
    const limit = 10;
    const resp = await service.clientServiceListOAuth2Clients({
      limit: limit.toString(),
      afterPageToken: afterPageToken,
    });
    setTotalSize(resp.data?.totalSize | 0);
    setAllData([...(allData ?? []), ...(resp.data?.items ?? [])]);
    setHasMore((resp.data?.items ?? []).length === limit);
    setAfterPageToken(resp.data?.nextAfterPageToken);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const reload = async () => {
    setTotalSize(0);
    setHasMore(true);
    setAfterPageToken(undefined);
    setAllData([]);
    await fetchData();
  };

  const columns = (
    extra: ProColumns<ClientOAuth2Client>[] = [],
  ): ProColumns<ClientOAuth2Client>[] => {
    return [
      {
        title: <FormattedMessage id="oidc.client.logo" defaultMessage="Client Logo" />,
        dataIndex: 'logo',
        valueType: 'image',
        render: (dom, entity) => {
          return entity?.logoUri ? <Image src={entity?.logoUri} width={54} height={54} /> : <div />;
        },
      },
      {
        title: <FormattedMessage id="oidc.client.id" defaultMessage="Client Id" />,
        dataIndex: 'clientId',
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
        title: <FormattedMessage id="oidc.client.name" defaultMessage="Client Name" />,
        dataIndex: 'clientName',
        valueType: 'text',
      },
      {
        title: <FormattedMessage id="oidc.client.uri" defaultMessage="Client Uri" />,
        dataIndex: 'clientUri',
        valueType: 'text',
      },
      {
        title: <FormattedMessage id="oidc.client.owner" defaultMessage="Client Owner" />,
        dataIndex: 'owner',
        valueType: 'text',
      },
      {
        title: <FormattedMessage id="oidc.client.scope" defaultMessage="Client Scope" />,
        dataIndex: 'scope',
        valueType: 'text',
      },
      ...extra,
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
  };

  const detailColumns: ProColumns<ClientOAuth2Client>[] = [
    {
      title: (
        <FormattedMessage
          id="oidc.client.allowedCorsOrigins"
          defaultMessage="Client AllowedCorsOrigins"
        />
      ),
      dataIndex: 'allowedCorsOrigins',
      render: (dom, entity) => {
        return <>{(entity.allowedCorsOrigins ?? []).join(',')}</>;
      },
    },
    {
      title: <FormattedMessage id="oidc.client.audience" defaultMessage="Client Audience" />,
      dataIndex: 'audience',
      render: (dom, entity) => {
        return <>{(entity.audience ?? []).join(',')}</>;
      },
    },
    {
      title: (
        <FormattedMessage
          id="oidc.client.backchannelLogoutSessionRequired"
          defaultMessage="Client BackchannelLogoutSessionRequired"
        />
      ),
      dataIndex: 'backchannelLogoutSessionRequired',
      valueType: 'switch',
    },
    {
      title: (
        <FormattedMessage
          id="oidc.client.backchannelLogoutUri"
          defaultMessage="Client BackchannelLogoutUri"
        />
      ),
      dataIndex: 'backchannelLogoutUri',
      valueType: 'text',
    },
    {
      title: (
        <FormattedMessage
          id="oidc.client.frontchannelLogoutSessionRequired"
          defaultMessage="Client FrontchannelLogoutSessionRequired"
        />
      ),
      dataIndex: 'frontchannelLogoutSessionRequired',
      valueType: 'switch',
    },
    {
      title: (
        <FormattedMessage
          id="oidc.client.frontchannelLogoutUri"
          defaultMessage="Client FrontchannelLogoutUri"
        />
      ),
      dataIndex: 'frontchannelLogoutUri',
      valueType: 'text',
    },
    {
      title: <FormattedMessage id="oidc.client.grantTypes" defaultMessage="Client GrantTypes" />,
      dataIndex: 'grantTypes',
      render: (dom, entity) => {
        return <>{(entity.grantTypes ?? []).join(',')}</>;
      },
    },
    {
      title: <FormattedMessage id="oidc.client.contacts" defaultMessage="Client Contacts" />,
      dataIndex: 'contacts',
      render: (dom, entity) => {
        return <>{(entity.contacts ?? []).join(',')}</>;
      },
    },
    {
      title: <FormattedMessage id="oidc.client.policyUri" defaultMessage="Client PolicyUri" />,
      dataIndex: 'policyUri',
    },
    {
      title: (
        <FormattedMessage
          id="oidc.client.postLogoutRedirectUris"
          defaultMessage="Client PostLogoutRedirectUris"
        />
      ),
      dataIndex: 'postLogoutRedirectUris',
      render: (dom, entity) => {
        return <>{(entity.postLogoutRedirectUris ?? []).join(',')}</>;
      },
    },
    {
      title: (
        <FormattedMessage id="oidc.client.redirectUris" defaultMessage="Client RedirectUris" />
      ),
      dataIndex: 'redirectUris',
      render: (dom, entity) => {
        return <>{(entity.redirectUris ?? []).join(',')}</>;
      },
    },
  ];

  return (
    <PageContainer>
      <div
        id="oidcClientScrollableDiv"
        style={{
          height: 900,
          overflow: 'auto',
        }}
      >
        <InfiniteScroll
          dataLength={totalSize}
          next={fetchData}
          hasMore={hasMore}
          loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
          endMessage={
            <Divider plain>
              <FormattedMessage id="common.pagination.total.all" defaultMessage="It's all" /> 🤐
            </Divider>
          }
          scrollableTarget="oidcClientScrollableDiv"
        >
          <ProTable<ClientOAuth2Client>
            actionRef={actionRef}
            rowKey="id"
            search={false}
            pagination={false}
            options={{ reload: reload }}
            toolBarRender={() => [
              `${intl.formatMessage({
                id: 'common.pagination.total.total',
                defaultMessage: '总共',
              })} ${totalSize} ${intl.formatMessage({
                id: 'common.pagination.total.item',
                defaultMessage: '条',
              })}`,
              <Button
                type="primary"
                key="primary"
                onClick={() => {
                  setCurrentRow(undefined);
                  handleUpdateModalVisible(true);
                }}
              >
                <PlusOutlined />{' '}
                <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
              </Button>,
            ]}
            type="list"
            dataSource={allData}
            columns={columns()}
          />
        </InfiniteScroll>

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
          {currentRow?.clientId && (
            <ProDescriptions<ClientOAuth2Client>
              column={2}
              title={currentRow?.clientName}
              request={async () => {
                const resp = await service.clientServiceGetOAuth2Client({
                  id: currentRow.clientId!,
                });
                return {
                  data: resp.data,
                };
              }}
              params={{
                id: currentRow?.clientId,
              }}
              columns={columns(detailColumns)}
            />
          )}
        </Drawer>
        <UpdateForm
          onSubmit={async (value) => {
            const { clientId } = value;
            let success = false;
            if (clientId) {
              success = await handleUpdate(value as ClientOAuth2Client);
            } else {
              success = await handleAdd(value as ClientOAuth2Client);
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
      </div>
    </PageContainer>
  );
};

export default TableList;
