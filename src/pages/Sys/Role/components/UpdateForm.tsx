import type { ProFormInstance } from '@ant-design/pro-components';
import {
  ProFormText,
  DrawerForm,
  ProDescriptions,
  ProCard,
  ProForm,
  ProFormSwitch,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import React, { useEffect, useRef } from 'react';
import { Form, Spin } from 'antd';
import type {
  Permissionv1PermissionDefGroup,
  Permissionv1PermissionDef,
  V1UpdateRolePermissionAcl,
  V1UpdateRole,
  V1CreateRoleRequest,
} from '@kit/api';
import { RoleServiceApi } from '@kit/api';
export type FormValueType = V1CreateRoleRequest & V1UpdateRole;

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
      new RoleServiceApi().roleServiceGetRole({ id: props.values?.id }).then((resp) => {
        formRef?.current?.setFieldsValue(resp.data);
      });
    }
  }, [props]);

  return (
    <DrawerForm
      formRef={formRef}
      initialValues={props.values}
      open={props.updateModalVisible}
      onFinish={async (formData) => {
        const group = formData.defGroups as Permissionv1PermissionDefGroup[] | undefined;
        const acl: V1UpdateRolePermissionAcl[] = (group ?? [])
          .flatMap((p) => p.def ?? [])
          .filter((p) => p.granted)
          .map((p) => {
            return { namespace: p.namespace!, resource: '*', action: p.action!, effect: 'GRANT' };
          });
        const { ...data } = formData;
        await props.onSubmit({ id: props.values?.id, ...data, acl: acl });
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
              <FormattedMessage id="sys.role.nameRequired" defaultMessage="Role Name is required" />
            ),
          },
        ]}
      />
      {props.values?.id && (
        <ProForm.Item noStyle shouldUpdate>
          {(form) => {
            if (!form.getFieldValue('defGroups')) {
              return <Spin />;
            }
            return (
              <Form.List name="defGroups">
                {(groups) => (
                  <>
                    {groups.map((group) => {
                      const g = form.getFieldValue('defGroups')[
                        group.name
                      ] as Permissionv1PermissionDefGroup;
                      return (
                        <ProForm.Item key={group.key} name={group.name}>
                          <ProCard
                            size="small"
                            title={
                              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                                {g.displayName}
                              </div>
                            }
                            key={g.name}
                            bordered
                            headerBordered
                          >
                            <Form.List name={[group.name, 'def']}>
                              {(defs) => (
                                <>
                                  {defs.map((def) => {
                                    const q = g.def![def.name] as Permissionv1PermissionDef;
                                    return (
                                      <ProDescriptions
                                        column={3}
                                        key={q.name}
                                        title={
                                          <div style={{ fontSize: '14px', fontWeight: 'normal' }}>
                                            {q.displayName}
                                          </div>
                                        }
                                      >
                                        <ProDescriptions.Item
                                          label={
                                            <FormattedMessage
                                              id="sys.permission.namespace"
                                              defaultMessage="Namespace"
                                            />
                                          }
                                        >
                                          {q.namespace}
                                        </ProDescriptions.Item>
                                        <ProDescriptions.Item
                                          label={
                                            <FormattedMessage
                                              id="sys.permission.action"
                                              defaultMessage="Action"
                                            />
                                          }
                                        >
                                          {q.action}
                                        </ProDescriptions.Item>
                                        <ProDescriptions.Item>
                                          <ProFormSwitch name={[def.name, 'granted']} />
                                        </ProDescriptions.Item>
                                      </ProDescriptions>
                                    );
                                  })}
                                </>
                              )}
                            </Form.List>
                          </ProCard>
                        </ProForm.Item>
                      );
                    })}
                  </>
                )}
              </Form.List>
            );
          }}
        </ProForm.Item>
      )}
    </DrawerForm>
  );
};

export default UpdateForm;
