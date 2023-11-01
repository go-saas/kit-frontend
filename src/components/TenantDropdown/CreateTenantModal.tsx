import { ModalForm, ProFormText, ProFormUploadButton } from '@ant-design/pro-components';
import {
  PaymentGatewayServiceApi,
  StripePaymentGatewayServiceApi,
  TenantServiceApi,
  V1GetStripeConfigReply,
  V1Tenant,
  V1UserCreateTenantReply,
  V1UserCreateTenantRequest,
} from '@gosaas/api';
import { useIntl, useModel } from '@umijs/max';
import { uploadApi } from '@/utils/upload';
import { uploadConvertValue, uploadTransformSingle } from '@gosaas/core';
import { useState, useEffect } from 'react';
import { Spin } from 'antd';

type FormValueType = V1UserCreateTenantRequest;
export type CreateTenantModalPros = {
  open: boolean;
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onFinish: (tenant: V1Tenant) => void;
};

export default (props: CreateTenantModalPros) => {
  const service = new TenantServiceApi();
  const paymentSrv = new StripePaymentGatewayServiceApi();
  const [stripeCfg, setStripeCfg] = useState<V1GetStripeConfigReply>();
  const intl = useIntl();
  const { initialState } = useModel('@@initialState');
  useEffect(() => {
    paymentSrv.stripePaymentGatewayServiceGetStripeConfig().then((resp) => {
      setStripeCfg(resp.data);
    });
  }, []);

  if (!stripeCfg) {
    return (
      <ModalForm<FormValueType>
        open={props.open}
        title={intl.formatMessage({
          id: 'saas.tenant.create',
          defaultMessage: 'Create New',
        })}
        modalProps={{
          onCancel: () => {
            props.onCancel();
          },
          destroyOnClose: true,
        }}
      >
        <Spin />
      </ModalForm>
    );
  }

  return (
    <ModalForm<FormValueType>
      open={props.open}
      title={intl.formatMessage({
        id: 'saas.tenant.create',
        defaultMessage: 'Create New',
      })}
      onFinish={async (formData) => {
        const resp: { data: V1UserCreateTenantReply } = await service.tenantServiceUserCreateTenant(
          { body: formData },
        );
        props.onFinish(resp.data!.tenant!);
      }}
      modalProps={{
        onCancel: () => {
          props.onCancel();
        },
        destroyOnClose: true,
      }}
    >
      <ProFormUploadButton
        name="logo"
        max={1}
        label={intl.formatMessage({
          id: 'saas.tenant.logo',
          defaultMessage: 'Tenant Logo',
        })}
        transform={uploadTransformSingle}
        convertValue={uploadConvertValue}
        fieldProps={{
          customRequest: (opt) => {
            const { onProgress, onError, onSuccess, file, filename } = opt;
            uploadApi(
              '/v1/saas/tenant/logo',
              {
                file: file as any,
                filename: filename,
              },
              onProgress,
            )
              .then((e) => {
                onSuccess?.(e.data);
              })
              .catch((e: any) => {
                onError?.(e);
              });
          },
        }}
      />

      <ProFormText
        name="name"
        label={intl.formatMessage({
          id: 'saas.tenant.name',
          defaultMessage: 'Tenant Name',
        })}
        rules={[
          {
            required: true,
          },
        ]}
      />
      <ProFormText
        name="displayName"
        label={intl.formatMessage({
          id: 'saas.tenant.displayName',
          defaultMessage: 'Tenant DisplayName',
        })}
      />
      {/* <stripe-pricing-table
        pricing-table-id={stripeCfg.priceTables?.plan}
        publishable-key={stripeCfg.publishKey}
        client-reference-id={initialState?.currentUser?.id}
      ></stripe-pricing-table> */}
    </ModalForm>
  );
};
