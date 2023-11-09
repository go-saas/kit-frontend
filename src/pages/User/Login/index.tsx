import Footer from '@/components/Footer';
import { LockOutlined, MobileOutlined, UserOutlined } from '@ant-design/icons';
import {
  LoginForm,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { FormattedMessage, SelectLang, useIntl, useModel, history } from '@umijs/max';
import { Alert, message, Tabs, Skeleton, Button } from 'antd';
import type { InputRef } from 'antd';
import React, { useState, useRef, useEffect } from 'react';

import { AuthWebApi } from '@gosaas/api';
import { useMount } from 'ahooks';
import { useSearchParams } from '@umijs/max';
import { useEmotionCss } from '@ant-design/use-emotion-css';

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
}

type LoginParams = {
  username: string;
  password: string;
  autoLogin?: boolean;
};

const Lang = () => {
  const langClassName = useEmotionCss(({ token }) => {
    return {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    };
  });

  return (
    <div className={langClassName} data-lang>
      {SelectLang && <SelectLang />}
    </div>
  );
};

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<LoginResult>({});
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');

  const intl = useIntl();
  const [searchParams] = useSearchParams();

  const [redirect, setRedirect] = useState<string>();
  const [currentLoginChallenge, setCurrentLoginChallenge] = useState<string>();

  const [loading, setLoading] = useState<boolean>();

  const containerClassName = useEmotionCss(() => {
    return {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    };
  });

  useEffect(() => {
    const r = searchParams.get('redirect') || '/';
    setRedirect(r);
    const loginChallenge = searchParams.get('login_challenge') || undefined;
    setLoading(true);
    new AuthWebApi()
      .authWebGetWebLogin({ redirect: r, loginChallenge })
      .then((resp) => {
        const data = resp.data ?? {};
        //TODO oauth providers
        if (data.redirect) {
          //go redirect
          history.push(data.redirect);
        }
        setCurrentLoginChallenge(data.challenge);
      })
      .finally(() => {
        setLoading(false);
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

  const handleSubmit = async (values: LoginParams) => {
    try {
      // 登录
      const data = await new AuthWebApi().authWebWebLogin({
        body: {
          username: values.username,
          password: values.password,
          remember: values.autoLogin,
          challenge: currentLoginChallenge,
        },
      });
      const defaultLoginSuccessMessage = intl.formatMessage({
        id: 'pages.login.success',
        defaultMessage: '登录成功！',
      });
      message.success(defaultLoginSuccessMessage);
      await fetchUserInfo();
      const finalRedirect = data.data?.redirect || redirect || '/';
      //history.push(redirect);
      window.location.replace(finalRedirect);
      return;
    } catch (error) {
      setUserLoginState((v) => {
        return { ...v, status: 'error' };
      });
    }
  };
  const { status } = userLoginState;
  const titile = initialState?.currentTenant?.tenant?.displayName || '';
  const logo = initialState?.currentTenant?.tenant?.logo?.url || '/logo.png';

  const inputRef = useRef<InputRef>(null);
  useMount(() => inputRef.current!.focus());

  return (
    <div className={containerClassName}>
      <Lang />
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
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
          actions={[
            <Button
              key="registerbtn"
              type="link"
              style={{
                float: 'right',
              }}
              onClick={() => {
                history.push('/user/register');
              }}
            >
              <FormattedMessage
                id="pages.register.tips"
                defaultMessage="Do not have an account? Go to register"
              />
            </Button>,
          ]}
          onFinish={async (values) => {
            await handleSubmit(values as LoginParams);
          }}
        >
          <Skeleton loading={loading} active>
            <Tabs
              activeKey={type}
              onChange={setType}
              items={[
                {
                  key: 'account',
                  label: intl.formatMessage({
                    id: 'pages.login.accountLogin.tab',
                    defaultMessage: '账户密码登录',
                  }),
                },
              ]}
            ></Tabs>

            {status === 'error' && type === 'account' && (
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
                    prefix: <UserOutlined />,
                  }}
                  placeholder={intl.formatMessage({
                    id: 'pages.login.username.placeholder',
                    defaultMessage: '用户名',
                  })}
                  rules={[
                    {
                      required: true,
                      message: (
                        <FormattedMessage
                          id="pages.login.username.required"
                          defaultMessage="请输入用户名!"
                        />
                      ),
                    },
                  ]}
                />
                <ProFormText.Password
                  name="password"
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined />,
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

            {status === 'error' && type === 'mobile' && <LoginMessage content="验证码错误" />}
            {type === 'mobile' && (
              <>
                <ProFormText
                  fieldProps={{
                    size: 'large',
                    prefix: <MobileOutlined />,
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
                    prefix: <LockOutlined />,
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
          </Skeleton>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
