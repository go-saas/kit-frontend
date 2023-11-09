import Footer from '@/components/Footer';
import { LockOutlined, MobileOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormCaptcha, ProFormText } from '@ant-design/pro-components';
import { FormattedMessage, SelectLang, useIntl, useModel, history } from '@umijs/max';
import { Alert, Button, message, Tabs } from 'antd';
import type { InputRef } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { FriendlyError } from '@gosaas/core';
import { AuthApi } from '@gosaas/api';
import { useMount } from 'ahooks';
import { useSearchParams } from '@umijs/max';
import { useEmotionCss } from '@ant-design/use-emotion-css';

const RegisterMessage: React.FC<{
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

interface RegisterResult {
  status?: 'error';
  errorMsg?: string;
}

type RegisterParams = {
  username?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  passwordlessToken?: string;
  type?: string;
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

const Register: React.FC = () => {
  const service = new AuthApi();

  const [userRegisterState, setUserRegisterState] = useState<RegisterResult>({});
  //account,phone,email
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');

  const intl = useIntl();
  const [searchParams] = useSearchParams();

  const [redirect, setRedirect] = useState<string>();

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

  const titile = initialState?.currentTenant?.tenant?.displayName || '';
  const logo = initialState?.currentTenant?.tenant?.logo?.url || '/logo.png';

  const handleSubmit = async (values: RegisterParams) => {
    try {
      const defaultRegisterSuccessMessage = intl.formatMessage({
        id: 'pages.register.success',
        defaultMessage: 'Register successfully!',
      });

      if (type === 'account') {
        await service.authRegister({
          body: {
            username: values.username!,
            password: values.password!,
            confirmPassword: values.confirmPassword!,
            web: true,
          },
        });
      } else if (type === 'phone') {
        await service.authLoginPasswordless({
          body: {
            phone: values.phone!,
            token: values.passwordlessToken!,
            web: true,
          },
        });
      } else if (type === 'email') {
        await service.authLoginPasswordless({
          body: {
            email: values.email!,
            token: values.passwordlessToken!,
            web: true,
          },
        });
      }

      message.success(defaultRegisterSuccessMessage);
      await fetchUserInfo();
      history.push('/');
    } catch (error) {
      setUserRegisterState((v) => {
        return {
          ...v,
          status: 'error',
          errorMsg: error instanceof FriendlyError ? error.message : ' ',
        };
      });
    }
  };
  const { status, errorMsg } = userRegisterState;

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
          subTitle={' '}
          initialValues={{
            autoLogin: true,
          }}
          actions={[
            <Button
              key="loginbtn"
              type="link"
              style={{
                float: 'right',
              }}
              onClick={() => {
                history.push('/user/login');
              }}
            >
              <FormattedMessage
                id="pages.login.tips"
                defaultMessage="Already have an account? Go to login"
              />
            </Button>,
          ]}
          onFinish={async (values) => {
            await handleSubmit(values as RegisterParams);
          }}
        >
          <Tabs
            activeKey={type}
            onChange={setType}
            items={[
              {
                key: 'account',
                label: intl.formatMessage({
                  id: 'pages.register.account.tab',
                  defaultMessage: 'By username',
                }),
              },
              // {
              //   key: 'email',
              //   label: intl.formatMessage({
              //     id: 'pages.register.email.tab',
              //     defaultMessage: 'By email',
              //   }),
              // },
              // {
              //   key: 'phone',
              //   label: intl.formatMessage({
              //     id: 'pages.register.phone.tab',
              //     defaultMessage: 'By phone',
              //   }),
              // },
            ]}
          ></Tabs>

          {status === 'error' && <RegisterMessage content={errorMsg ?? ''} />}
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
              <ProFormText.Password
                name="confirmPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.confirmPassword.placeholder',
                  defaultMessage: 'Confirm Password',
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
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          intl.formatMessage({
                            id: 'pages.confirmPassword.mismatch',
                            defaultMessage: 'Confirm Password Mismatch',
                          }),
                        ),
                      );
                    },
                  }),
                ]}
              />
            </>
          )}

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
                    id: 'pages.login.phoneRegister.getVerificationCode',
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
          ></div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
