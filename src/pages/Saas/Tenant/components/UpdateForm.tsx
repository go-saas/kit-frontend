import type { ProFormInstance } from '@ant-design/pro-components';
import {
  ProFormText,
  DrawerForm,
  ProForm,
  ProFormSwitch,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import React, { useEffect, useRef } from 'react';
import type { V1CreateTenantRequest, V1UpdateTenant } from '@kit/api';
import { TenantServiceApi } from '@kit/api';
import { uploadApi } from '@/utils/upload';

const service = new TenantServiceApi();

export type FormValueType = V1CreateTenantRequest & V1UpdateTenant;

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: FormValueType;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const intl = useIntl();
  const formRef = useRef<ProFormInstance>();
  useEffect(() => {
    //fetch role detail
    if (props.values?.id && props.updateModalVisible) {
      service.tenantServiceGetTenant({ idOrName: props.values?.id }).then((resp) => {
        formRef?.current?.setFieldsValue(resp.data);
      });
    }
  }, [props]);
  //transform logo into file list

  return (
    <DrawerForm
      formRef={formRef}
      initialValues={props.values}
      visible={props.updateModalVisible}
      onFinish={async (formData) => {
        const { logo, ...data } = formData;
        const newLogo = logo?.id;
        await props.onSubmit({ id: props.values?.id, logo: newLogo, ...data });
      }}
      drawerProps={{
        onClose: () => {
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
        transform={(value: any) => {
          if (!value) {
            return value;
          }
          let res: any;
          if (Array.isArray(value)) {
            if (value.length > 0) {
              res = value[0]?.response;
            }
          } else {
            res = value.response;
          }
          return { logo: res };
        }}
        convertValue={(value: any) => {
          if (!value) {
            return value;
          }
          if (Array.isArray(value)) {
            return value;
          }
          return [value];
        }}
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
            message: (
              <FormattedMessage
                id="sys.tenant.nameRequired"
                defaultMessage="Tenant Name is required"
              />
            ),
          },
        ]}
      />
      <ProFormText
        name="displayName"
        label={intl.formatMessage({
          id: 'saas.tenant.displayName',
          defaultMessage: 'Tenant DisplayName',
        })}
        rules={[
          {
            required: true,
            message: (
              <FormattedMessage
                id="sys.tenant.displayNameRequired"
                defaultMessage="Tenant DisplayName is required"
              />
            ),
          },
        ]}
      />
      <ProFormText
        name="region"
        label={intl.formatMessage({
          id: 'saas.tenant.region',
          defaultMessage: 'Tenant Region',
        })}
      />
      <ProFormSwitch
        name="separateDb"
        label={intl.formatMessage({
          id: 'saas.tenant.separateDb',
          defaultMessage: 'Tenant Separate Storage',
        })}
      />
      <ProForm.Item noStyle shouldUpdate>
        {(form) => {
          if (!form.getFieldValue('separateDb')) {
            return <div />;
          }
          return (
            <>
              <ProFormText
                name="adminUsername"
                label={intl.formatMessage({
                  id: 'saas.tenant.adminUsername',
                  defaultMessage: 'Tenant Admin Username',
                })}
                rules={[
                  {
                    required: true,
                  },
                ]}
              />
              <ProFormText.Password
                name="adminPassword"
                label={intl.formatMessage({
                  id: 'saas.tenant.adminPassword',
                  defaultMessage: 'Tenant Admin Password',
                })}
                rules={[
                  {
                    required: true,
                  },
                ]}
              />
            </>
          );
        }}
      </ProForm.Item>
    </DrawerForm>
  );
};

export default UpdateForm;
