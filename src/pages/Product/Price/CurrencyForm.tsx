import React from 'react';

import { Form, Button, Space, Select } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import {
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormSwitch,
} from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { currencyCodes } from '../Product/price';

export type CurrencyFormProps = {
  fieldKey: any;
  modelType: string | undefined;
  restCurrency: string[];
};
//@ATT:this was created to make nested dynamic elements! This is hard!
const CurrencyForm: React.FC<CurrencyFormProps> = (props) => {
  const intl = useIntl();
  return (
    <>
      <Form.List name={[props.fieldKey, 'currencyOptions']}>
        {(fields, { add, remove }) => {
          return (
            <div>
              {fields.map((field) => (
                <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="start">
                  <ProFormSelect
                    name={[field.name, 'currencyCode']}
                    disabled={true}
                    label={intl.formatMessage({
                      id: 'product.price.currencyCode',
                      defaultMessage: 'Currency',
                    })}
                    valueEnum={new Map(currencyCodes.map((p) => [p, { text: p }]))}
                  />
                  <ProFormDigit
                    name={[field.name, 'default', 'amountDecimal']}
                    label={intl.formatMessage({
                      id: 'product.price.defaultPrice',
                      defaultMessage: 'Default Price',
                    })}
                  />
                  <ProFormDigit
                    name={[field.name, 'discounted', 'amountDecimal']}
                    label={intl.formatMessage({
                      id: 'product.price.discountedPrice',
                      defaultMessage: 'Discounted Price',
                    })}
                  />
                  <ProFormText
                    name={[field.name, 'discountText']}
                    label={intl.formatMessage({
                      id: 'product.price.discountText',
                      defaultMessage: 'Discount Text',
                    })}
                  ></ProFormText>
                  <ProFormSwitch
                    name={[field.name, 'denyMoreDiscounts']}
                    label={intl.formatMessage({
                      id: 'product.price.denyMoreDiscounts',
                      defaultMessage: 'Deny More Discounts',
                    })}
                  ></ProFormSwitch>

                  <MinusCircleOutlined
                    onClick={() => {
                      remove(field.name);
                    }}
                  />
                </Space>
              ))}

              <Form.Item
                label={intl.formatMessage({
                  id: 'product.price.chooseCurrency',
                  defaultMessage: 'Choose To Add Currency Option',
                })}
              >
                <Select
                  options={props.restCurrency.map((p) => {
                    return { label: p, value: p };
                  })}
                  onChange={(p) => {
                    add({ currencyCode: p });
                  }}
                ></Select>
              </Form.Item>

              {/* <Button
                type="dashed"
                onClick={() => {
                  add();
                }}
              >
                <PlusOutlined />{' '}
                {intl.formatMessage({
                  id: 'saas.product.addCurrency Option',
                  defaultMessage: 'Add Currency Option',
                })}
              </Button> */}
            </div>
          );
        }}
      </Form.List>
    </>
  );
};
export default CurrencyForm;
