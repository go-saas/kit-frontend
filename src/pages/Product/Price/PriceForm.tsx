import {
  V1Price,
  V1PriceCurrencyOption,
  V1PriceCurrencyOptionParams,
  V1PriceCurrencyOptionTier,
  V1PriceCurrencyOptionTierParams,
  V1PriceParams,
  V1PriceRecurring,
  V1PriceTier,
  V1PriceTierParams,
} from '@gosaas/api';
import React, { useEffect } from 'react';
import { Card, Button, Form, Space, Radio } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import { useIntl } from '@umijs/max';
import {
  ProForm,
  ProFormDependency,
  ProFormDigit,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  useDeepCompareEffect,
} from '@ant-design/pro-components';
import { currencyCodes } from '../Product/price';
import CurrencyForm from './CurrencyForm';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';

export type PriceModel = Omit<V1Price, 'recurring' | 'tiers' | 'currencyOptions'> &
  Omit<V1PriceParams, 'tiers' | 'currencyOptions'> & {
    modelType: string;
    recurring?: V1PriceRecurring & {
      meterUsage?: boolean;
    };
    tiers?: Array<V1PriceTier & V1PriceTierParams>;
    currencyOptions?: Array<
      Omit<V1PriceCurrencyOption, 'tiers'> &
        Omit<V1PriceCurrencyOptionParams, 'tiers'> & {
          tiers?: Array<V1PriceCurrencyOptionTier & V1PriceCurrencyOptionTierParams>;
        }
    >;
  };

enum PriceModelType {
  Standard = 'standard',
  Package = 'package',
  //TODO tiered
  // Graduated = 'graduated',
  // Volume = 'volume',
}

export type PriceFormProps = {
  fieldKey: any;
};

const PriceForm: React.FC<PriceFormProps> = () => {
  const intl = useIntl();
  const form = useFormInstance();
  const prices = Form.useWatch<PriceModel[]>('prices', form);

  const modelType = Form.useWatch<string | undefined>('modelType', form);

  //normalize pricess
  useDeepCompareEffect(() => {
    const newPrices = (prices ?? []).map((p) => {
      p.defaultAmountDecimal = p.default?.amountDecimal;
      p.discountedAmountDecimal = p.discounted?.amountDecimal;
      p.tiers?.forEach((p) => (p.flatAmountDecimal = p.flat?.amountDecimal));
      p.tiers?.forEach((p) => (p.unitAmountDecimal = p.unit?.amountDecimal));
      p.currencyOptions?.forEach((p) => {
        p.defaultAmountDecimal = p.default?.amountDecimal;
        p.discountedAmountDecimal = p.discounted?.amountDecimal;
        p.tiers?.forEach((p) => (p.flatAmountDecimal = p.flat?.amountDecimal));
        p.tiers?.forEach((p) => (p.unitAmountDecimal = p.unit?.amountDecimal));
      });

      if (!p.modelType) {
        //set model type
        if (p.transformQuantity) {
          p.modelType = 'package';
        } else if (p.tiersMode === 'package') {
          p.modelType = 'graduated';
        } else {
          p.modelType = PriceModelType.Standard;
        }
      }
      if (!p.type) {
        //set  type
        if (p.recurring) {
          p.type = 'recurring';
        } else {
          p.type = 'one_time';
        }
      }

      if (p.recurring) {
        if (p.recurring.meterUsage === null) {
          if (p.recurring.usageType === 'metered') {
            p.recurring.meterUsage = true;
          } else {
            p.recurring.meterUsage = false;
          }
        }
      }

      //reverse set
      if (p.modelType) {
        if (p.modelType === PriceModelType.Standard) {
          p.tiersMode = '';
          p.transformQuantity = undefined;
        } else if (p.modelType === PriceModelType.Package) {
          p.tiersMode = '';
        } else {
          p.transformQuantity = undefined;
        }
      }
      if (p.type === 'one_time') {
        p.recurring = undefined;
      }
      if (p.recurring) {
        if (p.recurring.meterUsage === true) {
          p.recurring.usageType = 'metered';
        } else {
          p.recurring.usageType = 'licensed';
        }
      }
      if (p.recurring?.meterUsage) {
        if (!p.recurring.aggregateUsage) {
          p.recurring.aggregateUsage = 'sum';
        }
      }
      return { ...p };
    });
    console.log('=========old prices');
    console.log(prices);
    console.log('=========new prices');
    console.log(newPrices);

    form.setFieldValue('prices', newPrices);
  }, [prices]);

  return (
    <Form.List name="prices">
      {(fields, { add, remove }) => {
        return (
          <div>
            {fields.map((field) => (
              <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="start">
                <Card
                  actions={[
                    <div
                      key="delete"
                      onClick={(event) => {
                        event.stopPropagation();
                        remove(field.name);
                      }}
                    >
                      <DeleteOutlined></DeleteOutlined>
                      {intl.formatMessage({
                        id: 'saas.product.deletePrice',
                        defaultMessage: 'Delete Price',
                      })}
                    </div>,
                  ]}
                >
                  <ProFormSelect
                    name={[field.name, 'modelType']}
                    label={intl.formatMessage({
                      id: 'product.price.modelType',
                      defaultMessage: 'Model Type',
                    })}
                    valueEnum={
                      new Map(
                        Object.values(PriceModelType).map((p) => [
                          p,
                          {
                            text: intl.formatMessage({
                              id: 'product.price.modelType.' + p,
                              defaultMessage: p,
                            }),
                          },
                        ]),
                      )
                    }
                  />

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
                  {/* tiers */}

                  {/* currencies */}
                  <ProForm.Item>
                    <CurrencyForm
                      fieldKey={field.name}
                      modelType={modelType}
                      restCurrency={currencyCodes.filter((p) => {
                        const existing = [
                          prices[field.name].currencyCode,
                          ...(prices[field.name].currencyOptions?.map((p1) => p1.currencyCode) ??
                            []),
                        ];
                        return existing.indexOf(p) === -1;
                      })}
                    />
                  </ProForm.Item>
                  <ProForm.Item
                    name={[field.name, 'type']}
                    label={intl.formatMessage({
                      id: 'product.price.type',
                      defaultMessage: 'Type',
                    })}
                  >
                    <Radio.Group>
                      <Radio.Button value={'recurring'}>
                        {intl.formatMessage({
                          id: 'product.price.recurring',
                          defaultMessage: 'Recurring',
                        })}
                      </Radio.Button>
                      <Radio.Button value={'one_time'}>
                        {intl.formatMessage({
                          id: 'product.price.oneTime',
                          defaultMessage: 'One Time',
                        })}
                      </Radio.Button>
                    </Radio.Group>
                    <ProFormDependency name={['prices', field.name, 'type']}>
                      {({ type }) => {
                        console.log('??????????console.log(type)');
                        console.log(type);
                        if (type === 'one_time') {
                          return <></>;
                        }
                        return (
                          <ProForm.Item
                            label={intl.formatMessage({
                              id: 'product.price.recurring',
                              defaultMessage: 'Recurring',
                            })}
                          >
                            <ProFormDigit
                              name={[field.name, 'recurring', 'intervalCount']}
                              label={intl.formatMessage({
                                id: 'product.price.recurringIntervalCount',
                                defaultMessage: 'Interval Count',
                              })}
                              rules={[{ required: true }]}
                            />
                            <ProFormSelect
                              name={[field.name, 'recurring', 'interval']}
                              label={intl.formatMessage({
                                id: 'product.price.recurringInterval',
                                defaultMessage: 'Interval',
                              })}
                              valueEnum={
                                new Map(
                                  ['day', 'week', 'month', 'year'].map((p) => [p, { text: p }]),
                                )
                              }
                              initialValue={'month'}
                            />
                            <ProFormSwitch
                              name={[field.name, 'recurring', 'meterUsage']}
                              label={intl.formatMessage({
                                id: 'product.price.meterUsage',
                                defaultMessage: 'Metered Usage',
                              })}
                            ></ProFormSwitch>
                            {prices[field.name].recurring?.meterUsage && (
                              <ProFormSelect
                                name={[field.name, 'recurring', 'aggregateUsage']}
                                label={intl.formatMessage({
                                  id: 'product.price.recurringAggregateUsage',
                                  defaultMessage: 'Aggregate Usage',
                                })}
                                valueEnum={
                                  new Map(
                                    ['last_during_period', 'last_ever', 'max', 'sum'].map((p) => [
                                      p,
                                      { text: p },
                                    ]),
                                  )
                                }
                                initialValue={'month'}
                              />
                            )}
                          </ProForm.Item>
                        );
                      }}
                    </ProFormDependency>
                  </ProForm.Item>
                </Card>
              </Space>
            ))}
            <Button
              type="dashed"
              onClick={() => {
                add({ id: uuidv4(), ownerType: 'product', billingScheme: 'per_unit' });
              }}
              block
            >
              <PlusOutlined />
              {intl.formatMessage({
                id: 'saas.product.addPrice',
                defaultMessage: 'Add Price',
              })}
            </Button>
          </div>
        );
      }}
    </Form.List>
  );
};
export default PriceForm;
