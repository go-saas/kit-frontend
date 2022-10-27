import type { ProFormInstance } from '@ant-design/pro-components';
import {
  ProFormText,
  DrawerForm,
  ProForm,
  ProFormSwitch,
  ProFormUploadButton,
  ProFormDependency,
} from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import React, { useEffect, useRef } from 'react';
import type { V1CreateTenantRequest, V1UpdateTenant } from '@kit/api';
import { TenantServiceApi, AuthApi } from '@kit/api';
import { uploadApi } from '@/utils/upload';
import Userselect from '@/components/Userselect';
import { FriendlyError } from '@kit/core';
import { ErrorShowType } from '@/utils/errors';
import { message } from 'antd';

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
        const { logo, user, password, ...data } = formData;
        const newLogo = logo?.id;
        const ret = {
          id: props.values?.id,
          logo: newLogo,
          adminUserId: user?.user?.id,
          adminEmail: user?.email,
          adminUsername: user?.username,
          adminPassword: password,
          ...data,
        };
        console.log(ret);
        await props.onSubmit(ret);
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
              res = value[0]?.response ?? value[0];
            }
          } else {
            res = value.response ?? value;
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
      {!props.values.id && (
        <ProFormSwitch
          name="separateDb"
          label={intl.formatMessage({
            id: 'saas.tenant.separateDb',
            defaultMessage: 'Tenant Separate Storage',
          })}
        />
      )}
      {!props.values.id && (
        <>
          <ProForm.Item
            name="user"
            label={intl.formatMessage({
              id: 'saas.tenant.admin',
              defaultMessage: 'Tenant Administrator',
            })}
          >
            <Userselect />
          </ProForm.Item>
          <ProFormDependency name={['user']}>
            {({ user }) => {
              if (!user?.user) {
                //create user
                return (
                  <>
                    <ProFormText.Password
                      name="password"
                      label={intl.formatMessage({
                        id: 'sys.user.password',
                        defaultMessage: 'Password',
                      })}
                      rules={[
                        {
                          required: true,
                          validator: async (rule, value) => {
                            if (!value) {
                              return;
                            } else {
                              //validate the password
                              try {
                                await new AuthApi().authValidatePassword(
                                  {
                                    body: { password: value },
                                  },
                                  { showType: ErrorShowType.SILENT },
                                );
                                return;
                              } catch (err: any) {
                                if (err instanceof FriendlyError) {
                                  return Promise.reject(err);
                                }
                                message.error(err);
                              }
                            }
                            return;
                          },
                        },
                      ]}
                    />
                    <ProFormText.Password
                      name="confirmPassword"
                      label={intl.formatMessage({
                        id: 'sys.user.confirmPassword',
                        defaultMessage: 'Confirm Password',
                      })}
                      rules={[
                        {
                          required: true,
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error(
                                intl.formatMessage({
                                  id: 'sys.user.confirmPasswordMissmatch',
                                  defaultMessage:
                                    'The two passwords that you entered do not match!',
                                }),
                              ),
                            );
                          },
                        }),
                      ]}
                    />
                  </>
                );
              }
              return <></>;
            }}
          </ProFormDependency>
        </>
      )}
    </DrawerForm>
  );
};

export default UpdateForm;
