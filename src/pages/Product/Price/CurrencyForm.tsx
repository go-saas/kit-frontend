import React from 'react';

import {
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormSwitch,
  ProFormList,
  ProForm,
} from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { currencyCodes } from '../Product/price';
import { Card, Space } from 'antd';

export type CurrencyFormProps = {
  modelType: string | undefined;
};
//@ATT:this was created to make nested dynamic elements! This is hard!
const CurrencyForm: React.FC<CurrencyFormProps> = (props) => {
  const intl = useIntl();
  return (
    <ProFormList
      name={['currencyOptions']}
      creatorButtonProps={{
        creatorButtonText: intl.formatMessage({
          id: 'product.price.addCurrencyOption',
          defaultMessage: 'Add Currency Option',
        }),
      }}
    >
      <Space style={{ display: 'flex', marginBottom: 8 }} align="start">
        <Card style={{ width: 400 }}>
          <ProFormSelect
            name={['currencyCode']}
            label={intl.formatMessage({
              id: 'product.price.currencyCode',
              defaultMessage: 'Currency',
            })}
            valueEnum={new Map(currencyCodes.map((p) => [p, { text: p }]))}
            rules={[{ required: true }]}
          />

          <ProFormDigit
            name={['default', 'amountDecimal']}
            label={intl.formatMessage({
              id: 'product.price.defaultPrice',
              defaultMessage: 'Default Price',
            })}
          />
          <ProFormDigit
            name={['discounted', 'amountDecimal']}
            label={intl.formatMessage({
              id: 'product.price.discountedPrice',
              defaultMessage: 'Discounted Price',
            })}
          />
          <ProFormText
            name={['discountText']}
            label={intl.formatMessage({
              id: 'product.price.discountText',
              defaultMessage: 'Discount Text',
            })}
          ></ProFormText>
          <ProFormSwitch
            name={['denyMoreDiscounts']}
            label={intl.formatMessage({
              id: 'product.price.denyMoreDiscounts',
              defaultMessage: 'Deny More Discounts',
            })}
          ></ProFormSwitch>

          {/* <Form.Item
        label={intl.formatMessage({
          id: 'product.price.chooseCurrency',
          defaultMessage: 'Choose To Add Currency Option',
        })}
      >
        <Select
          options={currencyCodes.map((p) => {
            return { label: p, value: p };
          })}
          onChange={(p) => {
            add({ currencyCode: p });
          }}
        ></Select>
      </Form.Item> */}
        </Card>
      </Space>
    </ProFormList>
  );
};
export default CurrencyForm;
