import type { ProFormInstance } from '@ant-design/pro-components';
import { ProFormRadio, ProFormUploadButton } from '@ant-design/pro-components';
import { ProFormDependency, ProFormSelect } from '@ant-design/pro-components';
import { ProFormText, DrawerForm, ProForm, ProFormDatePicker } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import React, { useEffect, useRef, useState } from 'react';
import type { V1UpdateUser, V1CreateUserRequest, V1User, V1Role } from '@gosaas/api';
import { UserServiceApi, AuthApi, RoleServiceApi } from '@gosaas/api';
import { ErrorShowType } from '@/utils/errors';
import { FriendlyError } from '@gosaas/core';
import { message } from 'antd';
import Userselect from '@/components/Userselect';
import { genderValueEnum } from '../gender';
import { uploadApi } from '@/utils/upload';
import { uploadConvertValue, uploadTransformSingle } from '@gosaas/core';
import RoleTag from '@/components/Roletag/Roletag';
import { getName } from '@/components/Roletag/RoleName';
export type FormValueType = V1CreateUserRequest &
  V1UpdateUser & {
    user?: V1User;
  };

const service = new UserServiceApi();
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
      service.userServiceGetUser({ id: props.values?.id }).then((resp) => {
        formRef?.current?.setFieldsValue(resp.data);
      });
    }
  }, [props]);
  const [allRoles, setAllRoles] = useState<V1Role[]>([]);
  useEffect(() => {
    if (props.values?.id) {
      //set form user
      formRef?.current?.setFieldsValue({
        ...props.values,
        user: { ...props.values, user: props.values },
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
        const { avatar, user, ...data } = formData;
        const newAvatar = avatar?.id;
        await props.onSubmit({
          id: props.values?.id ?? user?.user?.id,
          username: user?.username,
          email: user?.email,
          phone: user?.phone,
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
      <ProForm.Item name="user">
        <Userselect disableClear={!!props.values?.id} />
      </ProForm.Item>
      <ProFormDependency name={['user']}>
        {({ user }) => {
          if (!user?.user) {
            //create user
            return (
              <>
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
                        setbirthday(
                          new Date(Date.UTC(a.year(), a.month(), a.date())).toISOString(),
                        );
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
              </>
            );
          }
          return <></>;
        }}
      </ProFormDependency>
      <ProFormSelect
        name="rolesId"
        label={intl.formatMessage({
          id: 'sys.user.role',
          defaultMessage: 'User Role',
        })}
        fieldProps={{
          tagRender: (p) => {
            const { value } = p;
            const role = allRoles.find((r) => r.id === value);
            if (role) {
              return <RoleTag role={role} />;
            } else {
              return value;
            }
          },
        }}
        mode="tags"
        request={async () => {
          const rolesResp = await new RoleServiceApi().roleServiceListRoles2({
            body: { pageSize: -1, pageOffset: 0 },
          });
          const ret = rolesResp.data?.items ?? [];
          setAllRoles(ret);
          return ret.map((p: any) => {
            return { label: getName(intl, p), value: p.id };
          });
        }}
      />
    </DrawerForm>
  );
};

export default UpdateForm;
