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
import React from 'react';
import { Form, Radio, Card, Space } from 'antd';
import { useIntl } from '@umijs/max';
import {
  ProForm,
  ProFormDependency,
  ProFormDigit,
  ProFormList,
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

export type PriceFormProps = object;

export function convertPrices(v: any): any {
  const prices = (v ?? []).map((p1) => {
    //TODO antd nested ProFormList bug
    const keys = Object.keys(p1);
    if (keys.length === 1 && keys[0] === 'currencyOptions') {
      return p1;
    }

    const p = JSON.parse(JSON.stringify(p1)) as PriceModel;
    p.defaultAmountDecimal = p.default?.amountDecimal?.toString();
    p.discountedAmountDecimal = p.discounted?.amountDecimal?.toString();
    if (p.transformQuantity?.divideBy?.toString()) {
      p.transformQuantity.divideBy = p.transformQuantity?.divideBy?.toString();
    }
    p.tiers?.forEach((p) => (p.flatAmountDecimal = p.flat?.amountDecimal?.toString()));
    p.tiers?.forEach((p) => (p.unitAmountDecimal = p.unit?.amountDecimal?.toString()));
    p.currencyOptions?.forEach((p) => {
      p.defaultAmountDecimal = p.default?.amountDecimal?.toString();
      p.discountedAmountDecimal = p.discounted?.amountDecimal?.toString();
      p.tiers?.forEach((p) => (p.flatAmountDecimal = p.flat?.amountDecimal?.toString()));
      p.tiers?.forEach((p) => (p.unitAmountDecimal = p.unit?.amountDecimal?.toString()));
    });

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
        p.recurring.aggregateUsage = '';
        p.recurring.usageType = 'licensed';
      }
    }

    if (!p.modelType) {
      //set model type
      if ((p.transformQuantity?.divideBy ?? '0') !== '0') {
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
      if (p.recurring.meterUsage === null || p.recurring.meterUsage === undefined) {
        if (p.recurring.usageType === 'metered') {
          p.recurring.meterUsage = true;
        } else {
          p.recurring.meterUsage = false;
        }
      }
    }
    return p;
  });

  return prices;
}
const PriceForm: React.FC<PriceFormProps> = () => {
  const intl = useIntl();
  const form = useFormInstance();
  const prices = Form.useWatch<PriceModel[]>('prices', form);

  //normalize pricess
  useDeepCompareEffect(() => {
    // eslint-disable-next-line eqeqeq
    if (prices == null) {
      return;
    }
    console.log('=========old prices');
    console.log(prices);

    const newPrices = convertPrices(prices);

    console.log('=========new prices');
    console.log(newPrices);

    if (JSON.stringify(prices) !== JSON.stringify(newPrices)) {
      form.setFieldValue('prices', newPrices);
    }
  }, [prices]);

  return (
    <ProForm.Item
      label={intl.formatMessage({
        id: 'product.price.price',
        defaultMessage: 'Prices',
      })}
    >
      <ProFormList
        name="prices"
        alwaysShowItemLabel={true}
        creatorRecord={() => {
          return {
            billingScheme: 'per_unit',
            type: 'one_time',
            modelType: 'standard',
          };
        }}
      >
        <Space style={{ marginBottom: 8 }} align="start">
          <Card style={{ width: 500 }}>
            <ProFormDependency
              name={['modelType', 'type', 'recurring', 'id']}
              ignoreFormListField={false}
            >
              {({ modelType, type, recurring, id }) => {
                const disabled = !!id;
                return (
                  <>
                    <ProFormSelect
                      disabled={disabled}
                      name={['modelType']}
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
                      disabled={disabled}
                      name={['currencyCode']}
                      label={intl.formatMessage({
                        id: 'product.price.currencyCode',
                        defaultMessage: 'Currency',
                      })}
                      valueEnum={new Map(currencyCodes.map((p) => [p, { text: p }]))}
                      rules={[{ required: true }]}
                    />
                    <ProFormDigit
                      disabled={disabled}
                      name={['default', 'amountDecimal']}
                      label={intl.formatMessage({
                        id: 'product.price.defaultPrice',
                        defaultMessage: 'Default Price',
                      })}
                      rules={[{ required: true }]}
                    />
                    <ProFormDigit
                      disabled={disabled}
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
                    {modelType === 'package' ? (
                      <ProFormDigit
                        disabled={disabled}
                        name={['transformQuantity', 'divideBy']}
                        label={intl.formatMessage({
                          id: 'product.price.transformQuantityDivideBy',
                          defaultMessage: 'Divide By',
                        })}
                        rules={[{ required: true }]}
                      />
                    ) : null}

                    {/* tiers */}

                    {/* currencies */}
                    <ProForm.Item>
                      <CurrencyForm modelType={modelType} />
                    </ProForm.Item>

                    <ProForm.Item
                      name={['type']}
                      label={intl.formatMessage({
                        id: 'product.price.type',
                        defaultMessage: 'Type',
                      })}
                    >
                      <Radio.Group>
                        <Radio.Button value={'recurring'} disabled={disabled}>
                          {intl.formatMessage({
                            id: 'product.price.recurring',
                            defaultMessage: 'Recurring',
                          })}
                        </Radio.Button>
                        <Radio.Button value={'one_time'} disabled={disabled}>
                          {intl.formatMessage({
                            id: 'product.price.oneTime',
                            defaultMessage: 'One Time',
                          })}
                        </Radio.Button>
                      </Radio.Group>
                    </ProForm.Item>
                    {type === 'one_time' ? null : (
                      <ProForm.Item
                        label={intl.formatMessage({
                          id: 'product.price.recurring',
                          defaultMessage: 'Recurring',
                        })}
                      >
                        <ProFormDigit
                          disabled={disabled}
                          name={['recurring', 'intervalCount']}
                          label={intl.formatMessage({
                            id: 'product.price.recurringIntervalCount',
                            defaultMessage: 'Interval Count',
                          })}
                          rules={[{ required: true }]}
                        />
                        <ProFormSelect
                          disabled={disabled}
                          name={['recurring', 'interval']}
                          label={intl.formatMessage({
                            id: 'product.price.recurringInterval',
                            defaultMessage: 'Interval',
                          })}
                          valueEnum={
                            new Map(['day', 'week', 'month', 'year'].map((p) => [p, { text: p }]))
                          }
                          initialValue={'month'}
                        />
                        <ProFormSwitch
                          disabled={disabled}
                          name={['recurring', 'meterUsage']}
                          label={intl.formatMessage({
                            id: 'product.price.meterUsage',
                            defaultMessage: 'Metered Usage',
                          })}
                        ></ProFormSwitch>
                        {recurring?.meterUsage && (
                          <ProFormSelect
                            disabled={disabled}
                            name={['recurring', 'aggregateUsage']}
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
                            initialValue={'sum'}
                          />
                        )}
                      </ProForm.Item>
                    )}
                  </>
                );
              }}
            </ProFormDependency>
          </Card>
        </Space>
      </ProFormList>
    </ProForm.Item>
  );
};
export default PriceForm;
