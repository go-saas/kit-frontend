import React from 'react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'umi';
import { history, useModel, FormattedMessage } from '@umijs/max';
import type { V1GetConsentResponse } from '@gosaas/api';
import styles from './index.less';
import { AuthWebApi } from '@gosaas/api';
import { LoginForm } from '@ant-design/pro-components';
import { Button, Space, Avatar } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';

const ConsentPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  const [consentResp, setConsentResp] = useState<V1GetConsentResponse>();
  const { initialState } = useModel('@@initialState');

  const [consentChallenge, setConsentChallenge] = useState<string>();
  const [scopes, setScopes] = useState<string[]>();

  useEffect(() => {
    if (consentResp?.redirect) {
      //skip consent
      window.location.replace(consentResp?.redirect);
    }

    setConsentChallenge(consentResp?.challenge);
    setScopes(consentResp?.requestedScope);
  }, [consentResp]);

  useEffect(() => {
    const qConsentChallenge = searchParams.get('consent_challenge');
    if (qConsentChallenge) {
      new AuthWebApi().authWebGetConsent({ consentChallenge: qConsentChallenge }).then((resp) => {
        setConsentResp(resp.data);
      });
    } else {
      //redirect to home page
      history.push('/');
    }
  }, [searchParams]);

  const act = async (reject: boolean) => {
    const resp = await new AuthWebApi().authWebGrantConsent({
      body: {
        challenge: consentChallenge,
        grantScope: scopes,
        reject: reject,
      },
    });
    if (resp.data?.redirect) {
      window.location.replace(resp.data?.redirect);
    } else {
      history.push('/');
    }
  };
  const denyAction = async () => act(true);

  const allowAction = async () => act(false);

  return (
    <PageContainer>
      <div className={styles.content}>
        <LoginForm
          logo={
            <Space>
              {initialState?.currentUser?.avatar ? (
                <Avatar src={initialState?.currentUser?.avatar} />
              ) : (
                <Avatar />
              )}
              <SwapOutlined />
              {consentResp?.client?.logoUri ? (
                <Avatar src={consentResp?.client?.logoUri} />
              ) : (
                <Avatar />
              )}
            </Space>
          }
          submitter={{
            render: () => {
              return [
                <Button
                  htmlType="button"
                  onClick={denyAction}
                  key="deny"
                  disabled={!consentChallenge}
                >
                  <FormattedMessage id="common.deny" defaultMessage="Deny" />
                </Button>,
                <Button
                  htmlType="button"
                  type="primary"
                  onClick={allowAction}
                  key="allow"
                  disabled={!consentChallenge}
                >
                  <FormattedMessage id="common.allow" defaultMessage="Allow" />
                </Button>,
              ];
            },
          }}
        />
      </div>
    </PageContainer>
  );
};

export default ConsentPage;
