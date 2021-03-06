import Footer from '@/components/Footer';
import { LockOutlined, MobileOutlined, UserOutlined } from '@ant-design/icons';
import {
  LoginForm,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { FormattedMessage, SelectLang, useIntl, useModel } from '@umijs/max';
import { Alert, message, Tabs, Input } from 'antd';
import type { InputRef } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import styles from './index.less';
import { AuthWebApi } from '@kit/api';
import { useMount } from 'ahooks';
import { useSearchParams } from 'umi';
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
  const [searchParams] = useSearchParams();

  const [redirect, setRedirect] = useState<string>();
  const [currentLoginChallenge, setCurrentLoginChallenge] = useState<string>();

  useEffect(() => {
    const r = searchParams.get('redirect') || '/';
    setRedirect(r);
    const loginChallenge = searchParams.get('login_challenge') || undefined;
    new AuthWebApi().authWebGetWebLogin({ redirect: r, loginChallenge }).then((resp) => {
      const data = resp.data ?? {};
      //TODO oauth providers
      if (data.redirect) {
        setRedirect(data.redirect);
      }
      setCurrentLoginChallenge(data.challenge);
    });
  }, [searchParams]);
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
      // ??????
      const data = await new AuthWebApi().authWebWebLogin({
        body: {
          username: values.username,
          password: values.password,
          remember: values.autoLogin,
          challenge: currentLoginChallenge,
        },
      });
      console.log(data.data);
      const defaultLoginSuccessMessage = intl.formatMessage({
        id: 'pages.login.success',
        defaultMessage: '???????????????',
      });
      message.success(defaultLoginSuccessMessage);
      await fetchUserInfo();
      const finalRedirect = data.data?.redirect || redirect || '/';
      console.log(finalRedirect);
      //history.push(redirect);
      window.location.replace(finalRedirect);
      return;
      // ???????????????????????????????????????
    } catch (error) {
      setUserLoginState({ status: 'error', type: 'account' });
    }
  };
  const { status, type: loginType } = userLoginState;
  const titile = initialState?.currentTenant?.tenant?.displayName || 'GO SAAS KIT';
  const logo = initialState?.currentTenant?.tenant?.logo?.url || '/logo.svg';

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
                defaultMessage: '??????????????????',
              })}
            />
            {/* <Tabs.TabPane
              key="mobile"
              tab={intl.formatMessage({
                id: 'pages.login.phoneLogin.tab',
                defaultMessage: '???????????????',
              })}
            /> */}
          </Tabs>

          {status === 'error' && loginType === 'account' && (
            <LoginMessage
              content={intl.formatMessage({
                id: 'pages.login.accountLogin.errorMessage',
                defaultMessage: '?????????????????????',
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
                  defaultMessage: '??????????????????',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.username.required"
                        defaultMessage="??????????????????????????????!"
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
                  defaultMessage: '??????',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.password.required"
                        defaultMessage="??????????????????"
                      />
                    ),
                  },
                ]}
              />
            </>
          )}

          {status === 'error' && loginType === 'mobile' && <LoginMessage content="???????????????" />}
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
                  defaultMessage: '?????????',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.phoneNumber.required"
                        defaultMessage="?????????????????????"
                      />
                    ),
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: (
                      <FormattedMessage
                        id="pages.login.phoneNumber.invalid"
                        defaultMessage="????????????????????????"
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
                  defaultMessage: '??????????????????',
                })}
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return `${count} ${intl.formatMessage({
                      id: 'pages.getCaptchaSecondText',
                      defaultMessage: '???????????????',
                    })}`;
                  }
                  return intl.formatMessage({
                    id: 'pages.login.phoneLogin.getVerificationCode',
                    defaultMessage: '???????????????',
                  });
                }}
                name="captcha"
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.captcha.required"
                        defaultMessage="?????????????????????"
                      />
                    ),
                  },
                ]}
                onGetCaptcha={async () => {
                  message.success('???????????????????????????????????????1234');
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
              <FormattedMessage id="pages.login.rememberMe" defaultMessage="????????????" />
            </ProFormCheckbox>
            <a
              style={{
                float: 'right',
              }}
            >
              <FormattedMessage id="pages.login.forgotPassword" defaultMessage="????????????" />
            </a>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
