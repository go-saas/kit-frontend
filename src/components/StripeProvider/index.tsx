import React, { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { StripePaymentGatewayServiceApi, V1GetStripeConfigReply } from '@gosaas/api';

type Props = {
  children: React.ReactNode;
};

const StripeProvider: React.FC<Props> = ({ children, routes }: any) => {
  const newChildren = React.cloneElement(children, {
    ...children?.props,
    routes,
  });

  const paymentSrv = new StripePaymentGatewayServiceApi();

  const [stripeCfg, setStripeCfg] = useState<V1GetStripeConfigReply>();
  useEffect(() => {
    paymentSrv.stripePaymentGatewayServiceGetStripeConfig().then((resp) => {
      setStripeCfg(resp.data);
    });
  }, []);
  const [stripePromise, setStripePromis] = useState<Stripe | null>();
  useEffect(() => {
    //load config
    if (stripeCfg) {
      loadStripe(stripeCfg.publishKey!).then((s) => {
        setStripePromis(s);
      });
    }
  }, [stripeCfg]);

  if (!stripePromise) {
    return newChildren;
  }

  return <Elements stripe={stripePromise}>{newChildren}</Elements>;
};

export default StripeProvider;
