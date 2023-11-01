import { ModalForm, ProFormText, ProFormUploadButton } from '@ant-design/pro-components';
import {
  TenantServiceApi,
  V1Tenant,
  V1UserCreateTenantReply,
  V1UserCreateTenantRequest,
} from '@gosaas/api';
import { useIntl } from '@umijs/max';
import { uploadApi } from '@/utils/upload';
import { uploadConvertValue, uploadTransformSingle } from '@gosaas/core';

type FormValueType = V1UserCreateTenantRequest;
export type CreateTenantModalPros = {
  open: boolean;
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onFinish: (tenant: V1Tenant) => void;
};

export default (props: CreateTenantModalPros) => {
  const service = new TenantServiceApi();
  const intl = useIntl();

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
    </ModalForm>
  );
};
