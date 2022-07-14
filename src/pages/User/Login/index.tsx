import Footer from '@/components/Footer';
import { LockOutlined, MobileOutlined, UserOutlined } from '@ant-design/icons';
import {
  LoginForm,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { FormattedMessage, history, SelectLang, useIntl, useModel } from '@umijs/max';
import { Alert, message, Tabs, Input } from 'antd';
import type { InputRef } from 'antd';
import React, { useState, useRef } from 'react';
import styles from './index.less';
import { AuthWebApi } from '@kit/api';
import { getRequestInstance } from '@@/plugin-request/request';
import { useMount } from 'ahooks';
const { Search } = Input;
const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};

interface LoginResult {
  status?: 'error';
  type: 'account' | 'mobile';
}

type LoginParams = {
  username: string;
  password: string;
  autoLogin?: boolean;
  type?: string;
};

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<LoginResult>({ type: 'account' });
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');

  const [tenantSwitching, setTenantSwitching] = useState<boolean>(false);

  const intl = useIntl();

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState((s) => ({
        ...s,
        currentUser: userInfo,
      }));
    }
  };

  const onSwitch = async (value: string) => {
    if (value == initialState?.currentTenant?.tenant?.name ?? '') {
      return;
    }
    try {
      initialState?.changeTenant?.(value);
    } catch (e) {
    } finally {
      setTenantSwitching(false);
    }
  };

  const handleSubmit = async (values: LoginParams) => {
    try {
      // 登录
      const data = await new AuthWebApi(undefined, undefined, getRequestInstance()).authWebWebLogin(
        {
          body: { username: values.username, password: values.password },
        },
      );
      const defaultLoginSuccessMessage = intl.formatMessage({
        id: 'pages.login.success',
        defaultMessage: '登录成功！',
      });
      message.success(defaultLoginSuccessMessage);
      await fetchUserInfo();
      const redirect =
        data.data.redirect || new URL(window.location.href).searchParams.get('redirect') || '/';
      console.log(redirect);
      history.push(redirect);
      return;
      // 如果失败去设置用户错误信息
    } catch (error) {
      setUserLoginState({ status: 'error', type: 'account' });
    }
  };
  const { status, type: loginType } = userLoginState;
  const titile = initialState?.currentTenant?.tenant?.displayName ?? 'GO SAAS KIT';
  const logo = initialState?.currentTenant?.tenant?.logo?.url ?? '/logo.svg';

  const inputRef = useRef<InputRef>(null);
  useMount(() => inputRef.current!.focus());
  return (
    <div className={styles.container}>
      <div className={styles.lang} data-lang>
        {SelectLang && <SelectLang />}
      </div>
      <div className={styles.content}>
        <LoginForm
          logo={<img alt="logo" src={logo} />}
          title={titile}
          subTitle={intl.formatMessage({
            id: 'pages.layouts.userLayout.title',
            defaultMessage: '',
          })}
          initialValues={{
            autoLogin: true,
          }}
          actions={[]}
          onFinish={async (values) => {
            await handleSubmit(values as LoginParams);
          }}
        >
          <Search
            placeholder={intl.formatMessage({
              id: 'saas.switch.placeholder',
            })}
            enterButton={intl.formatMessage({
              id: 'saas.switch',
            })}
            defaultValue={initialState?.currentTenant?.tenant?.name || ''}
            size="large"
            onSearch={onSwitch}
            loading={tenantSwitching}
          />
          <Tabs activeKey={type} onChange={setType}>
            <Tabs.TabPane
              key="account"
              tab={intl.formatMessage({
                id: 'pages.login.accountLogin.tab',
                defaultMessage: '账户密码登录',
              })}
            />
            {/* <Tabs.TabPane
              key="mobile"
              tab={intl.formatMessage({
                id: 'pages.login.phoneLogin.tab',
                defaultMessage: '手机号登录',
              })}
            /> */}
          </Tabs>

          {status === 'error' && loginType === 'account' && (
            <LoginMessage
              content={intl.formatMessage({
                id: 'pages.login.accountLogin.errorMessage',
                defaultMessage: '凭证或密码错误',
              })}
            />
          )}
          {type === 'account' && (
            <>
              <ProFormText
                name="username"
                fieldProps={{
                  ref: inputRef,
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.username.placeholder',
                  defaultMessage: '用户名或邮箱',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.username.required"
                        defaultMessage="请输入用户名或者邮箱!"
                      />
                    ),
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.password.placeholder',
                  defaultMessage: '密码',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.password.required"
                        defaultMessage="请输入密码！"
                      />
                    ),
                  },
                ]}
              />
            </>
          )}

          {status === 'error' && loginType === 'mobile' && <LoginMessage content="验证码错误" />}
          {type === 'mobile' && (
            <>
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <MobileOutlined className={styles.prefixIcon} />,
                }}
                name="mobile"
                placeholder={intl.formatMessage({
                  id: 'pages.login.phoneNumber.placeholder',
                  defaultMessage: '手机号',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.phoneNumber.required"
                        defaultMessage="请输入手机号！"
                      />
                    ),
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: (
                      <FormattedMessage
                        id="pages.login.phoneNumber.invalid"
                        defaultMessage="手机号格式错误！"
                      />
                    ),
                  },
                ]}
              />
              <ProFormCaptcha
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                captchaProps={{
                  size: 'large',
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.captcha.placeholder',
                  defaultMessage: '请输入验证码',
                })}
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return `${count} ${intl.formatMessage({
                      id: 'pages.getCaptchaSecondText',
                      defaultMessage: '获取验证码',
                    })}`;
                  }
                  return intl.formatMessage({
                    id: 'pages.login.phoneLogin.getVerificationCode',
                    defaultMessage: '获取验证码',
                  });
                }}
                name="captcha"
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.captcha.required"
                        defaultMessage="请输入验证码！"
                      />
                    ),
                  },
                ]}
                onGetCaptcha={async () => {
                  message.success('获取验证码成功！验证码为：1234');
                }}
              />
            </>
          )}
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录" />
            </ProFormCheckbox>
            <a
              style={{
                float: 'right',
              }}
            >
              <FormattedMessage id="pages.login.forgotPassword" defaultMessage="忘记密码" />
            </a>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
