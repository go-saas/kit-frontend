import type { ProFormInstance } from '@ant-design/pro-components';
import { ProFormText, DrawerForm, ProFormSwitch } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import React, { useEffect, useRef } from 'react';
import type { V1CreatePlanRequest, V1UpdatePlan } from '@gosaas/api';
import { PlanServiceApi } from '@gosaas/api';

const service = new PlanServiceApi();

export type FormValueType = V1CreatePlanRequest & V1UpdatePlan;

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
    if (props.values?.key && props.updateModalVisible) {
      service.planServiceGetPlan({ key: props.values?.key }).then((resp) => {
        formRef?.current?.setFieldsValue(resp.data);
      });
    }
  }, [props]);
  //transform logo into file list

  return (
    <DrawerForm
      formRef={formRef}
      initialValues={props.values}
      open={props.updateModalVisible}
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
        name="key"
        label={intl.formatMessage({
          id: 'saas.plan.key',
          defaultMessage: 'Plan Key',
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
          id: 'saas.plan.displayName',
          defaultMessage: 'Plan DisplayName',
        })}
        rules={[
          {
            required: true,
          },
        ]}
      />
      {props.values.key && (
        <ProFormSwitch
          name="active"
          label={intl.formatMessage({
            id: 'saas.plan.active',
            defaultMessage: 'Active',
          })}
        />
      )}
    </DrawerForm>
  );
};

export default UpdateForm;
