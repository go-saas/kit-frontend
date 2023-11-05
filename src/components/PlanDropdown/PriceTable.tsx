import {
  StripePaymentIntent,
  SubscriptionServiceApi,
  type V1Plan,
  type V1Price,
} from '@gosaas/api';
import styles from './index.less';
import React, { useState, useEffect } from 'react';
import { Button, message, InputNumber, Radio } from 'antd';
import { ProCard } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { useStripe, PaymentElement, Elements, ElementsConsumer } from '@stripe/react-stripe-js';

export type PriceTableProps = {
  data: Map<string, Array<{ plan: V1Plan; price: V1Price }>>;
  currentPeriod: string;
  onPeriodChange: (v: string) => undefined;
  onConfirm: (v: { plan: V1Plan; price: V1Price }) => undefined;
};

const PriceTable: React.FC<PriceTableProps> = (props) => {
  const subscriptionSrv = new SubscriptionServiceApi();
  const [messageApi] = message.useMessage();
  const groupedData = props.data;
  const currentPeriod = props.currentPeriod;

  const [loading, setLoading] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [currentPrice, setCurrentPrice] = useState<{ plan: V1Plan; price: V1Price }>();
  const intl = useIntl();

  let btnMsg = intl.formatMessage({
    id: 'product.price.subscribeNow',
    defaultMessage: 'Subscribe Now',
  });
  if (props.currentPeriod === 'one-time') {
    btnMsg = intl.formatMessage({ id: 'product.price.buyNow', defaultMessage: 'Buy Now' });
  }
  const stripe = useStripe();

  const [paymentIntent, setPaymentIntent] = useState<StripePaymentIntent>();
  // const [paymentElement, setPaymentElement] = useState<StripePaymentElement>();
  useEffect(() => {
    if (!paymentIntent) {
      return;
    }
    if (paymentIntent && paymentIntent.status === 'succeeded') {
      props.onConfirm(currentPrice!);
      return;
    }
  }, [paymentIntent, stripe]);

  if (paymentIntent) {
    return (
      <Elements stripe={stripe} options={{ clientSecret: paymentIntent.clientSecret! }}>
        <ElementsConsumer>
          {({ stripe, elements }) => {
            const handleSubmit = async (event) => {
              // We don't want to let default form submission happen here,
              // which would refresh the page.
              event.preventDefault();
              if (!stripe || !elements) {
                // Stripe.js hasn't yet loaded.
                // Make sure to disable form submission until Stripe.js has loaded.
                return;
              }
              elements.submit();

              let { error } = await stripe.confirmPayment({
                elements: elements,
                clientSecret: paymentIntent!.clientSecret!,
                //TODO return_url
                confirmParams: { return_url: window.location.href },
              });
              if (error) {
                messageApi.open({
                  type: 'error',
                  content: error.message,
                });
                return;
              }
            };
            return (
              <>
                <PaymentElement id="payment-element" />
                <Button onClick={handleSubmit}>Submit</Button>
              </>
            );
          }}
        </ElementsConsumer>
      </Elements>
    );
  }
  return (
    <>
      <div className={styles['price-table']}>
        <Radio.Group
          value={currentPeriod}
          onChange={({ target: { value } }) => {
            if (!loading) {
              props.onPeriodChange(value);
            }
          }}
          size="large"
          optionType="button"
          buttonStyle="solid"
        >
          {Array.from(groupedData.keys()).map((p) => (
            <Radio.Button value={p} key={p}>
              {intl.formatMessage({
                id: 'product.price.recurringInterval.' + p,
                defaultMessage: p,
              })}
            </Radio.Button>
          ))}
        </Radio.Group>

        <ProCard gutter={8}>
          {(groupedData.get(currentPeriod || '') ?? []).map((p) => (
            <ProCard key={p.price.id} layout="center" title={p.plan.displayName} bordered>
              {p.price.discounted?.text ?? p.price.default?.text}
              {props.currentPeriod === 'one-time' && (
                <>
                  {intl.formatMessage({ id: 'product.quantity', defaultMessage: 'Quantity' })}
                  <InputNumber
                    min={1}
                    value={quantity}
                    onChange={(v) => {
                      setQuantity(v ?? 1);
                    }}
                  />
                </>
              )}
              <Button
                type="primary"
                loading={loading && currentPrice === p}
                disabled={loading && currentPrice !== p}
                onClick={async () => {
                  // create subscription
                  setLoading(true);
                  setCurrentPrice(p);
                  try {
                    const resp = await subscriptionSrv.subscriptionServiceCreateMySubscription({
                      body: {
                        provider: 'stripe',
                        items: [{ priceId: p.price.id, quantity: quantity }],
                      },
                    });
                    setPaymentIntent(resp.data.providerInfo?.stripe?.latestInvoice?.paymentIntent);
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                {btnMsg}
              </Button>
            </ProCard>
          ))}
        </ProCard>
      </div>
    </>
  );
};

export default PriceTable;
