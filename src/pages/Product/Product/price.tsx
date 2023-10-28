import { ProColumnType } from '@ant-design/pro-components';
import { V1Price } from '@gosaas/api';
import { FormattedMessage } from '@umijs/max';

export const priceTableColumns: ProColumnType<V1Price>[] = [
  {
    title: <FormattedMessage id="product.price.currencyCode" defaultMessage="Currency" />,
    dataIndex: 'currencyCode',
    valueType: 'text',
  },
  {
    title: <FormattedMessage id="product.price.discountText" defaultMessage="Discount Text" />,
    dataIndex: 'discountText',
    valueType: 'text',
  },
  {
    title: (
      <FormattedMessage id="product.price.denyMoreDiscounts" defaultMessage="Deny More Discounts" />
    ),
    dataIndex: 'denyMoreDiscounts',
    valueType: 'switch',
  },
  {
    title: <FormattedMessage id="product.price.billingScheme" defaultMessage="Billing Scheme" />,
    dataIndex: 'billingScheme',
    valueType: 'select',
    valueEnum: {
      per_unit: { text: 'per_unit', status: 'Default' },
      tiered: { text: 'tiered', status: 'Default' },
    },
  },
];
