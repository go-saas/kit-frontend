import type { ProColumns } from '@ant-design/pro-components';
import { ProFormText, DrawerForm } from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import React from 'react';
import type { V1Role } from '@kit/api';

export type FormValueType = Partial<V1Role>;

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: FormValueType;
  columns: ProColumns<V1Role>[];
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const intl = useIntl();

  return (
    <DrawerForm
      initialValues={props.values}
      visible={props.updateModalVisible}
      onFinish={async (formData) => {
        await props.onSubmit(formData);
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
          id: 'sys.role.name',
          defaultMessage: 'Role Name',
        })}
        rules={[
          {
            required: true,
            message: (
              <FormattedMessage
                id="sys.menu.role.required"
                defaultMessage="Role Name is required"
              />
            ),
          },
        ]}
      />
    </DrawerForm>
  );
};

export default UpdateForm;
