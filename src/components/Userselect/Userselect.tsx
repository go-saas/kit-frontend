import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Radio, Card, Avatar, AutoComplete, Form } from 'antd';
import type { UserServiceApiUserServiceSearchUserRequest } from '@gosaas/api';
import { UserServiceApi } from '@gosaas/api';
import { useIntl } from '@umijs/max';
import { DeleteOutlined, UserOutlined } from '@ant-design/icons';
import type { ProFormInstance } from '@ant-design/pro-components';
import { ProForm } from '@ant-design/pro-components';
import { ErrorShowType } from '@/utils/errors';
const service = new UserServiceApi();
const { Meta } = Card;
const { Option } = AutoComplete;
export type SelectUser = {
  id?: string | null;
  username?: string | null;
  name?: string | null;
  avatar?: {
    url?: string | null;
  };
};

export type UserselectValue = {
  user?: SelectUser;
  username?: string | null;
  email?: string | null;
  region?: string | null;
  phone?: string | null;
};

export type UserselectProps = {
  disableClear?: boolean;
  onChange?: (value: UserselectValue) => void;
  value?: UserselectValue;
};

enum SelectType {
  USERNAME,
  EMAIL,
  PHONE,
}
const Userselect: React.FC<UserselectProps> = (props: UserselectProps) => {
  const intl = useIntl();
  const [selectType, setSelectType] = useState(SelectType.USERNAME);
  const [currentUser, setCurrentUser] = useState<SelectUser>();
  const [userList, setUserList] = useState<SelectUser[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    if (props.value?.user) {
      //has user
      setCurrentUser(props.value?.user);
    } else {
      formRef?.current?.setFieldsValue(props.value);
      setCurrentUser(undefined);
    }
  }, [props]);

  const avatarFunc = (user: SelectUser) => {
    return user?.avatar?.url ? (
      <Avatar src={user.avatar.url} />
    ) : (
      <Avatar icon={<UserOutlined />} />
    );
  };

  const search = async (body: UserServiceApiUserServiceSearchUserRequest) => {
    try {
      const resp = await service.userServicePublicSearchUser(body, {
        showType: ErrorShowType.SILENT,
      });
      const u = resp.data?.user ? [resp.data?.user] : [];
      setUserList(u);
      setOpen(u.length > 0);
    } catch (e) {}
  };

  // const email = Form.useWatch('email', form);
  // console.log(email);
  // useEffect(() => {
  //   console.log(form.getFieldError('email'));
  //   console.log(form.isFieldValidating('email'));
  //   if (!formRef.current?.getFieldError('email')) {
  //     search({ email: email });
  //   }
  // }, [email]);

  if (currentUser) {
    const avatar = avatarFunc(currentUser);
    const actions = props.disableClear
      ? undefined
      : [
          <DeleteOutlined
            key="delete"
            onClick={() => {
              setCurrentUser(undefined);
              formRef?.current?.resetFields();
              props?.onChange?.({});
            }}
          />,
        ];
    return (
      <Card actions={actions}>
        <Meta avatar={avatar} title={currentUser?.username} description={currentUser?.name} />
      </Card>
    );
  }

  const optionItemRender = (value: SelectUser) => {
    const ret = (
      <span key={value.id}>
        <div>
          {avatarFunc(value)}
          {value.username}
        </div>
      </span>
    );
    return ret;
  };

  const onSelect = (value: any) => {
    const u = userList.find((p) => p.id === value);
    if (!u) {
      return;
    }
    setCurrentUser(u);
    setOpen(false);
    props?.onChange?.({ user: u });
    formRef?.current?.resetFields();
  };

  const onBlur = () => {
    if (userList.length === 0) {
      return;
    }
    const u = userList[0];
    setCurrentUser(u);
    setOpen(false);
    props?.onChange?.({ user: u });
    formRef?.current?.resetFields();
  };

  return (
    <>
      <ProForm.Item>
        <Radio.Group
          onChange={(e) => {
            setSelectType(e.target.value);
          }}
          defaultValue={selectType}
        >
          <Radio.Button value={SelectType.USERNAME}>
            {intl.formatMessage({
              id: 'sys.user.username',
              defaultMessage: 'Username',
            })}
          </Radio.Button>
          <Radio.Button value={SelectType.EMAIL}>
            {intl.formatMessage({
              id: 'sys.user.email',
              defaultMessage: 'Email',
            })}
          </Radio.Button>
          <Radio.Button value={SelectType.PHONE}>
            {intl.formatMessage({
              id: 'sys.user.phone',
              defaultMessage: 'Phone',
            })}
          </Radio.Button>
        </Radio.Group>
      </ProForm.Item>
      {selectType === SelectType.USERNAME && (
        <ProForm.Item
          name="username"
          label={intl.formatMessage({
            id: 'sys.user.username',
            defaultMessage: 'Username',
          })}
          rules={[{ required: true }]}
        >
          <AutoComplete<string>
            showSearch
            open={open}
            onSelect={onSelect}
            onChange={(p) => {
              if (!currentUser) {
                props?.onChange?.({
                  username: p,
                });
              }
            }}
            onBlur={onBlur}
            onSearch={async (p) => {
              await search({ username: p });
            }}
          >
            {userList.map((p) => (
              <Option key={p.id} value={p.id}>
                {optionItemRender(p)}
              </Option>
            ))}
          </AutoComplete>
        </ProForm.Item>
      )}

      {selectType === SelectType.EMAIL && (
        <ProForm.Item
          name="email"
          label={intl.formatMessage({
            id: 'sys.user.email',
            defaultMessage: 'Email',
          })}
          rules={[{ required: true, type: 'email' }]}
        >
          <AutoComplete<string>
            showSearch
            open={open}
            onSelect={onSelect}
            onChange={(p) => {
              if (!currentUser) {
                props?.onChange?.({
                  email: p,
                });
              }
            }}
            onBlur={onBlur}
            onSearch={async (p) => {
              await search({ email: p });
            }}
          >
            {userList.map((p) => (
              <Option key={p.id} value={p.id}>
                {optionItemRender(p)}
              </Option>
            ))}
          </AutoComplete>
        </ProForm.Item>
      )}

      {selectType === SelectType.PHONE && (
        <ProForm.Item
          name="phone"
          label={intl.formatMessage({
            id: 'sys.user.phone',
            defaultMessage: 'Phone',
          })}
          rules={[{ required: true }]}
        >
          <AutoComplete<string>
            showSearch
            open={open}
            onSelect={onSelect}
            onChange={(p) => {
              if (!currentUser) {
                props?.onChange?.({
                  email: p,
                });
              }
            }}
            onBlur={onBlur}
            onSearch={async (p) => {
              await search({ phone: p });
            }}
          >
            {userList.map((p) => (
              <Option key={p.id} value={p.id}>
                {optionItemRender(p)}
              </Option>
            ))}
          </AutoComplete>
        </ProForm.Item>
      )}
    </>
  );
};

export default Userselect;
