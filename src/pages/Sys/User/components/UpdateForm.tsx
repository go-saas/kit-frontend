import type { ProFormInstance } from '@ant-design/pro-components';
import { ProFormText, DrawerForm } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import React, { useEffect, useRef } from 'react';
import type { V1UpdateUser, V1CreateUserRequest } from '@kit/api';
import { UserServiceApi, AuthApi } from '@kit/api';
import { ErrorShowType } from '@/utils/errors';
import { FriendlyError } from '@kit/core';
import { message } from 'antd';
export type FormValueType = V1CreateUserRequest & V1UpdateUser;

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

  return (
    <DrawerForm
      formRef={formRef}
      initialValues={props.values}
      visible={props.updateModalVisible}
      onFinish={async (formData) => {
        await props.onSubmit({ id: props.values?.id, ...formData });
      }}
      drawerProps={{
        onClose: () => {
          props.onCancel();
        },
        destroyOnClose: true,
      }}
    >
      <ProFormText
        name="name"
        label={intl.formatMessage({
          id: 'sys.user.name',
          defaultMessage: 'User Name',
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
    </DrawerForm>
  );
};

export default UpdateForm;
