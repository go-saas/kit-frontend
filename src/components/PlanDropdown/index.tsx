import type { V1GetStripeConfigReply, V1Plan } from '@gosaas/api';
import { PlanServiceApi, StripePaymentGatewayServiceApi, TenantServiceApi } from '@gosaas/api';
import { Button, Card, Space, Spin, Switch } from 'antd';
import { Modal } from 'antd';
import { useEffect, useState } from 'react';

import classNames from 'classnames';

import { useEmotionCss } from '@ant-design/use-emotion-css';
import { useIntl, useModel } from '@umijs/max';
import React from 'react';
export type GlobalHeaderRightProps = {
  fetchingNotices?: boolean;
  onNoticeVisibleChange?: (visible: boolean) => void;
  onNoticeClear?: (tabName?: string) => void;
};

const PlanDropdown: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const paymentSrv = new StripePaymentGatewayServiceApi();
  const planSrv = new PlanServiceApi();
  const [stripeCfg, setStripeCfg] = useState<V1GetStripeConfigReply>();
  const [plans, setPlans] = useState<V1Plan[]>([]);
  const intl = useIntl();

  useEffect(() => {
    paymentSrv.stripePaymentGatewayServiceGetStripeConfig().then((resp) => {
      setStripeCfg(resp.data);
    });
  }, []);
  useEffect(() => {
    planSrv.planServiceGetAvailablePlans().then((resp) => {
      setPlans(resp.data.items ?? []);
    });
  }, []);

  const { initialState } = useModel('@@initialState');

  if (initialState?.currentTenant?.isHost) {
    return <></>;
  }

  if (!stripeCfg) {
    return <Spin></Spin>;
  }

  return (
    <span>
      <Button
        type="primary"
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        {initialState?.currentTenant?.tenant?.plan
          ? initialState.currentTenant.tenant.plan.diplayName
          : intl.formatMessage({ id: 'saas.tenant.upgradePlan', defaultMessage: 'Upgrade Plan' })}
      </Button>
      <Modal
        width={800}
        open={isModalOpen}
        footer={null}
        onCancel={() => {
          setIsModalOpen(false);
        }}
      >
        <stripe-pricing-table
          pricing-table-id={stripeCfg.priceTables?.plan}
          publishable-key={stripeCfg.publishKey}
          client-reference-id={initialState?.currentUser?.id}
        ></stripe-pricing-table>
      </Modal>
    </span>
  );
};

export default PlanDropdown;
