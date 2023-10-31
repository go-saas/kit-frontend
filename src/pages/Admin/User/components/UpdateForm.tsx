import type { ProFormInstance } from '@ant-design/pro-components';
import { ProFormRadio, ProFormUploadButton } from '@ant-design/pro-components';
import { ProFormText, DrawerForm, ProFormDatePicker, ProForm } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import React, { useEffect, useRef, useState } from 'react';
import type { V1AdminUpdateUser, V1AdminCreateUserRequest } from '@gosaas/api';
import { UserAdminServiceApi, AuthApi } from '@gosaas/api';
import { ErrorShowType } from '@/utils/errors';
import { FriendlyError } from '@gosaas/core';
import { message } from 'antd';
import { genderValueEnum } from '@/pages/Sys/User/gender';
import { uploadApi } from '@/utils/upload';
import { uploadConvertValue, uploadTransformSingle } from '@gosaas/core';

export type FormValueType = V1AdminCreateUserRequest & V1AdminUpdateUser;

const service = new UserAdminServiceApi();
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
      service.userAdminServiceGetUserAdmin({ id: props.values?.id }).then((resp) => {
        formRef?.current?.setFieldsValue(resp.data);
      });
    }
  }, [props]);

  useEffect(() => {
    if (props.values?.id) {
      //set form user
      formRef?.current?.setFieldsValue({
        ...props.values,
      });
    }
  }, [props]);
  const [birthday, setbirthday] = useState<string>();
  return (
    <DrawerForm
      formRef={formRef}
      initialValues={props.values}
      open={props.updateModalVisible}
      onFinish={async (formData) => {
        const { avatar, ...data } = formData;
        const newAvatar = avatar?.id;
        await props.onSubmit({
          id: props.values?.id,
          avatar: newAvatar,
          ...data,
          birthday: birthday,
        });
      }}
      drawerProps={{
        onClose: () => {
          props.onCancel();
        },
        destroyOnClose: true,
      }}
    >
      <ProFormText
        name="username"
        label={intl.formatMessage({
          id: 'sys.user.username',
          defaultMessage: 'Username',
        })}
      />
      <ProFormText
        name="email"
        label={intl.formatMessage({
          id: 'sys.user.email',
          defaultMessage: 'Email',
        })}
        rules={[{ type: 'email' }]}
      ></ProFormText>
      <ProFormText
        name="phone"
        label={intl.formatMessage({
          id: 'sys.user.phone',
          defaultMessage: 'Phone',
        })}
        rules={[]}
      ></ProFormText>
      <ProFormText
        name="name"
        label={intl.formatMessage({
          id: 'sys.user.name',
          defaultMessage: 'Name',
        })}
      />
      <ProFormText.Password
        name="password"
        label={intl.formatMessage({
          id: 'sys.user.password',
          defaultMessage: 'Password',
        })}
        rules={[
          {
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
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error(
                  intl.formatMessage({
                    id: 'sys.user.confirmPasswordMissmatch',
                    defaultMessage: 'The two passwords that you entered do not match!',
                  }),
                ),
              );
            },
          }),
        ]}
      />
      <ProFormDatePicker
        name="birthday"
        label={intl.formatMessage({
          id: 'sys.user.birthday',
          defaultMessage: 'Birthday',
        })}
        fieldProps={{
          onChange: (a) => {
            if (a) {
              setbirthday(new Date(Date.UTC(a.year(), a.month(), a.date())).toISOString());
            } else {
              setbirthday(undefined);
            }
          },
        }}
      />
      <ProFormRadio.Group
        name="gender"
        label={intl.formatMessage({
          id: 'sys.user.gender',
          defaultMessage: 'Gender',
        })}
        radioType="button"
        initialValue="UNKNOWN"
        valueEnum={genderValueEnum}
      />
      <ProFormUploadButton
        name="avatar"
        max={1}
        label={intl.formatMessage({
          id: 'sys.user.avatar',
          defaultMessage: 'User Avatar',
        })}
        transform={uploadTransformSingle}
        convertValue={uploadConvertValue}
        fieldProps={{
          customRequest: (opt) => {
            const { onProgress, onError, onSuccess, file, filename } = opt;
            uploadApi(
              '/v1/user/avatar',
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
    </DrawerForm>
  );
};

export default UpdateForm;
