import type { ProColumnType } from '@ant-design/pro-components';
import {
  ProFormText,
  ProFormDigit,
  DrawerForm,
  ProFormSwitch,
  ProForm,
  EditableProTable,
  ProFormTreeSelect,
  ProFormRadio,
  ProFormDependency,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import React, { useState, useEffect } from 'react';
import type { V1Menu } from '@gosaas/api';
import type { PermissionRequirement } from '@gosaas/core';
import { Form } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import type { MenuWithChildren } from '../data';
import { getTreeData } from '../data';

export type FormValueType = Partial<V1Menu>;

const columns: ProColumnType<RequirementWithId>[] = [
  {
    title: <FormattedMessage id="sys.permission.namepsace" defaultMessage="Namespace" />,
    dataIndex: 'namespace',
  },
  {
    title: <FormattedMessage id="sys.permission.resource" defaultMessage="Resource" />,
    dataIndex: 'resource',
  },
  {
    title: <FormattedMessage id="sys.permission.action" defaultMessage="action" />,
    dataIndex: 'action',
  },
  {
    title: <FormattedMessage id="common.operate" defaultMessage="Operate" />,
    valueType: 'option',
  },
];

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: FormValueType;
};

export async function getTreeSelectData() {
  const tree = await getTreeData();
  const transform = (menus: MenuWithChildren[]) => {
    return menus.map((p): any => {
      return {
        title: <FormattedMessage id={p.title || p.name} defaultMessage={p.title || p.name} />,
        value: p.id ?? '',
        children: p.children ? transform(p.children) : undefined,
      };
    });
  };
  return transform(tree);
}

export type RequirementWithId = {
  id: string;
} & PermissionRequirement;

function formatData(
  p: FormValueType,
): { requirement: RequirementWithId[] } & Omit<FormValueType, 'requirement'> {
  const { requirement, ...rest } = p;

  return {
    requirement:
      requirement?.map((p) => {
        return { id: uuidv4(), ...p };
      }) ?? [],
    ...rest,
  };
}

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const intl = useIntl();

  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(
    formatData(props.values).requirement.map((p) => p.id),
  );

  const [form] = Form.useForm();

  const requirement = Form.useWatch<RequirementWithId[]>('requirement', form);

  useEffect(() => {
    setEditableRowKeys(requirement?.map((p) => p.id));
  }, [requirement]);
  return (
    <DrawerForm
      form={form}
      initialValues={formatData(props.values)}
      open={props.updateModalVisible}
      onFinish={async (formData) => {
        console.log(formData);
        await props.onSubmit({ id: props.values?.id, ...formData });
      }}
      drawerProps={{
        onClose: () => {
          props.onCancel();
        },
        destroyOnClose: true,
      }}
    >
      <ProFormTreeSelect
        name="parent"
        allowClear
        label={intl.formatMessage({
          id: 'sys.menu.parent',
          defaultMessage: 'Parent Menu',
        })}
        request={getTreeSelectData}
      />
      <ProFormText
        name="name"
        label={intl.formatMessage({
          id: 'sys.menu.name',
          defaultMessage: 'Menu Name',
        })}
        rules={[
          {
            required: true,
            message: (
              <FormattedMessage id="sys.menu.name.required" defaultMessage="请输入规则名称！" />
            ),
          },
        ]}
      />
      <ProFormText
        name="icon"
        label={intl.formatMessage({
          id: 'sys.menu.icon',
          defaultMessage: 'Menu Icon',
        })}
      />
      <ProFormText
        name="title"
        label={intl.formatMessage({
          id: 'sys.menu.title',
          defaultMessage: 'Menu Title',
        })}
      />
      <ProFormText
        name="path"
        label={intl.formatMessage({
          id: 'sys.menu.path',
          defaultMessage: 'Menu Route',
        })}
      />
      <ProFormSwitch
        name="hideInMenu"
        label={intl.formatMessage({
          id: 'sys.menu.hideInMenu',
          defaultMessage: 'Hide In Menu (Route Only)',
        })}
      />
      <ProFormDigit
        name="priority"
        label={intl.formatMessage({
          id: 'sys.menu.priority',
          defaultMessage: 'Menu Priority',
        })}
      />
      <ProFormRadio.Group
        name="component"
        label={intl.formatMessage({
          id: 'sys.menu.component',
          defaultMessage: 'Component',
        })}
        radioType="button"
        valueEnum={{
          NONE: {
            text: <FormattedMessage id="sys.menu.component.none" defaultMessage="NONE" />,
            status: 'Default',
          },
          IFRAME: {
            text: <FormattedMessage id="sys.menu.component.iframe" defaultMessage="IFRAME" />,
            status: 'Default',
          },
          MICROAPP: {
            text: <FormattedMessage id="sys.menu.component.microapp" defaultMessage="MICROAPP" />,
            status: 'Default',
          },
        }}
      />
      <ProFormDependency name={['component']}>
        {({ component }) => {
          if (component === 'IFRAME') {
            return (
              <ProFormText
                name="iframe"
                label={intl.formatMessage({
                  id: 'sys.menu.iframe',
                  defaultMessage: 'Menu Iframe',
                })}
                rules={[{ required: true }]}
              />
            );
          }
          return <></>;
        }}
      </ProFormDependency>
      <ProFormDependency name={['component']}>
        {({ component }) => {
          if (component === 'MICROAPP') {
            return (
              <>
                <ProFormText
                  name="microAppName"
                  label={intl.formatMessage({
                    id: 'sys.menu.microAppName',
                    defaultMessage: 'MicroAppName',
                  })}
                  rules={[{ required: true }]}
                />
                <ProFormText
                  name="microApp"
                  label={intl.formatMessage({
                    id: 'sys.menu.microApp',
                    defaultMessage: 'MicroApp',
                  })}
                  rules={[{ required: true }]}
                />
                <ProFormText
                  name="microAppDev"
                  label={intl.formatMessage({
                    id: 'sys.menu.microAppDev',
                    defaultMessage: 'MicroAppDev',
                  })}
                  rules={[{ required: true }]}
                />
                <ProFormText
                  name="microAppBaseRoute"
                  label={intl.formatMessage({
                    id: 'sys.menu.microAppBaseRoute',
                    defaultMessage: 'MicroAppBaseRoute',
                  })}
                  rules={[{ required: true }]}
                />
              </>
            );
          }
          return <></>;
        }}
      </ProFormDependency>
      <ProFormSwitch
        name="ignoreAuth"
        label={intl.formatMessage({
          id: 'sys.menu.ignoreAuth',
          defaultMessage: 'Menu Ignore Auth',
        })}
      />
      <Form.Item noStyle shouldUpdate>
        {(form) => {
          if (form.getFieldValue('ignoreAuth')) {
            return <div />;
          }
          return (
            <ProForm.Item
              label={intl.formatMessage({
                id: 'sys.menu.requirement',
                defaultMessage: 'Menu Auth Requirement',
              })}
              name="requirement"
              trigger="onValuesChange"
            >
              <EditableProTable<RequirementWithId>
                rowKey="id"
                toolBarRender={false}
                columns={columns}
                recordCreatorProps={{
                  newRecordType: 'dataSource',
                  position: 'bottom',
                  record: () => ({ id: uuidv4(), namespace: '', resource: '', action: '' }),
                }}
                editable={{
                  type: 'multiple',
                  editableKeys,
                  onChange: (p, rows) => {
                    console.log(p);
                    console.log(rows);
                    setEditableRowKeys(p);
                  },
                  actionRender: (row, _, dom) => {
                    return [dom.delete];
                  },
                }}
              />
            </ProForm.Item>
          );
        }}
      </Form.Item>
    </DrawerForm>
  );
};

export default UpdateForm;
