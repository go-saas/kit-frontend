import type { ProFormInstance } from '@ant-design/pro-components';
import { ProFormText, DrawerForm } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import React, { useEffect, useRef } from 'react';
import type { V1UpdateUser, V1CreateUserRequest } from '@kit/api';
import { UserServiceApi } from '@kit/api';
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
    </DrawerForm>
  );
};

export default UpdateForm;
