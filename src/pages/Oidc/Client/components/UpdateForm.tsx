import type { ProFormInstance } from '@ant-design/pro-components';
import {
  ProFormText,
  DrawerForm,
  ProFormSelect,
  ProFormSwitch,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import React, { useEffect, useRef } from 'react';
import type { ClientOAuth2Client } from '@kit/api';
import { ClientServiceApi } from '@kit/api';

const service = new ClientServiceApi();

export type FormValueType = ClientOAuth2Client;

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
    //fetch  detail
    if (props.values?.clientId && props.updateModalVisible) {
      service.clientServiceGetOAuth2Client({ id: props.values!.clientId! }).then((resp) => {
        formRef?.current?.setFieldsValue(resp.data);
      });
    }
  }, [props]);

  return (
    <DrawerForm
      formRef={formRef}
      initialValues={props.values}
      visible={props.updateModalVisible}
      onFinish={async (formData) => {
        console.log(formData);
        const ret = {
          clientId: props.values?.clientId,
          ...formData,
        };
        console.log(ret);
        await props.onSubmit(ret);
      }}
      drawerProps={{
        onClose: () => {
          props.onCancel();
        },
        destroyOnClose: true,
      }}
    >
      <ProFormText
        name="clientName"
        label={intl.formatMessage({
          id: 'oidc.client.name',
          defaultMessage: 'Client Name',
        })}
        rules={[
          {
            required: true,
          },
        ]}
      />
      <ProFormSelect
        name="allowedCorsOrigins"
        mode="tags"
        label={intl.formatMessage({
          id: 'oidc.client.allowedCorsOrigins',
          defaultMessage: 'Client AllowedCorsOrigins',
        })}
      />
      <ProFormSelect
        name="audience"
        mode="tags"
        label={intl.formatMessage({
          id: 'oidc.client.audience',
          defaultMessage: 'Client Audience',
        })}
      />
      <ProFormSwitch
        name="backchannelLogoutSessionRequired"
        label={intl.formatMessage({
          id: 'oidc.client.backchannelLogoutSessionRequired',
          defaultMessage: 'Client BackchannelLogoutSessionRequired',
        })}
      />
      <ProFormSwitch
        name="backchannelLogoutUri"
        label={intl.formatMessage({
          id: 'oidc.client.backchannelLogoutUri',
          defaultMessage: 'Client BackchannelLogoutUri',
        })}
      />
      <ProFormText
        name="clientSecret"
        label={intl.formatMessage({
          id: 'oidc.client.clientSecret',
          defaultMessage: 'Client ClientSecret',
        })}
      />
      <ProFormText
        name="clientUri"
        label={intl.formatMessage({
          id: 'oidc.client.clientUri',
          defaultMessage: 'Client ClientUri',
        })}
      />
      <ProFormTextArea
        name="contacts"
        convertValue={(value: any) => {
          if (value && Array.isArray(value) && value.length > 0) {
            return value[0];
          } else {
            return undefined;
          }
        }}
        transform={(value) => {
          if (value && Array.isArray(value)) {
            return { contacts: value };
          }
          return { contacts: value ? [value] : undefined };
        }}
        label={intl.formatMessage({
          id: 'oidc.client.contacts',
          defaultMessage: 'Client Contacts',
        })}
      />
      <ProFormSwitch
        name="frontchannelLogoutSessionRequired"
        label={intl.formatMessage({
          id: 'oidc.client.FrontchannelLogoutSessionRequired',
          defaultMessage: 'Client FrontchannelLogoutSessionRequired',
        })}
      />
      <ProFormSwitch
        name="frontchannelLogoutUri"
        label={intl.formatMessage({
          id: 'oidc.client.frontchannelLogoutUri',
          defaultMessage: 'Client FrontchannelLogoutUri',
        })}
      />
      <ProFormSelect
        name="grantTypes"
        mode="tags"
        label={intl.formatMessage({
          id: 'oidc.client.grantTypes',
          defaultMessage: 'Client GrantTypes',
        })}
      />
      <ProFormText
        name="owner"
        label={intl.formatMessage({
          id: 'oidc.client.owner',
          defaultMessage: 'Client Owner',
        })}
      />
      <ProFormText
        name="policyUri"
        label={intl.formatMessage({
          id: 'oidc.client.policyUri',
          defaultMessage: 'Client PolicyUri',
        })}
      />
      <ProFormSelect
        name="postLogoutRedirectUris"
        mode="tags"
        label={intl.formatMessage({
          id: 'oidc.client.postLogoutRedirectUris',
          defaultMessage: 'Client PostLogoutRedirectUris',
        })}
      />
      <ProFormSelect
        name="redirectUris"
        mode="tags"
        label={intl.formatMessage({
          id: 'oidc.client.redirectUris',
          defaultMessage: 'Client RedirectUris',
        })}
      />
      <ProFormText
        name="registrationAccessToken"
        label={intl.formatMessage({
          id: 'oidc.client.registrationAccessToken',
          defaultMessage: 'Client RegistrationAccessToken',
        })}
      />
      <ProFormText
        name="registrationClientUri"
        label={intl.formatMessage({
          id: 'oidc.client.registrationClientUri',
          defaultMessage: 'Client RegistrationClientUri',
        })}
      />
      <ProFormText
        name="requestObjectSigningAlg"
        label={intl.formatMessage({
          id: 'oidc.client.requestObjectSigningAlg',
          defaultMessage: 'Client RequestObjectSigningAlg',
        })}
      />
      <ProFormSelect
        name="requestUris"
        mode="tags"
        label={intl.formatMessage({
          id: 'oidc.client.requestUris',
          defaultMessage: 'Client RequestUris',
        })}
      />
      <ProFormSelect
        name="responseTypes"
        mode="tags"
        label={intl.formatMessage({
          id: 'oidc.client.responseTypes',
          defaultMessage: 'Client ResponseTypes',
        })}
      />
      <ProFormText
        name="scope"
        label={intl.formatMessage({
          id: 'oidc.client.scope',
          defaultMessage: 'Client Scope',
        })}
      />
      <ProFormText
        name="subjectType"
        label={intl.formatMessage({
          id: 'oidc.client.subjectType',
          defaultMessage: 'Client SubjectType',
        })}
      />
      <ProFormText
        name="tokenEndpointAuthMethod"
        label={intl.formatMessage({
          id: 'oidc.client.tokenEndpointAuthMethod',
          defaultMessage: 'Client TokenEndpointAuthMethod',
        })}
      />
      <ProFormText
        name="tokenEndpointAuthSigningAlg"
        label={intl.formatMessage({
          id: 'oidc.client.tokenEndpointAuthSigningAlg',
          defaultMessage: 'Client TokenEndpointAuthSigningAlg',
        })}
      />
      <ProFormText
        name="tosUri"
        label={intl.formatMessage({
          id: 'oidc.client.tosUri',
          defaultMessage: 'Client TosUri',
        })}
      />
      <ProFormText
        name="userinfoSignedResponseAlg"
        label={intl.formatMessage({
          id: 'oidc.client.userinfoSignedResponseAlg',
          defaultMessage: 'Client UserinfoSignedResponseAlg',
        })}
      />
    </DrawerForm>
  );
};

export default UpdateForm;
