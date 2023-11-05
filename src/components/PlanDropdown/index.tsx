import type { V1Plan, V1Price } from '@gosaas/api';
import { PlanServiceApi } from '@gosaas/api';
import { Button } from 'antd';
import { Modal } from 'antd';
import { useEffect, useState } from 'react';

import { useEmotionCss } from '@ant-design/use-emotion-css';
import { useIntl, useModel } from '@umijs/max';
import React from 'react';

import PriceTable from './PriceTable';
export type GlobalHeaderRightProps = {
  fetchingNotices?: boolean;
  onNoticeVisibleChange?: (visible: boolean) => void;
  onNoticeClear?: (tabName?: string) => void;
};

const PlanDropdown: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const planSrv = new PlanServiceApi();

  const [plans, setPlans] = useState<V1Plan[] | undefined>(undefined);
  const intl = useIntl();

  useEffect(() => {
    planSrv.planServiceGetAvailablePlans().then((resp) => {
      setPlans(resp.data.items ?? []);
    });
  }, []);

  const actionClassName = useEmotionCss(({}) => {
    return {
      display: 'flex',
      float: 'right',
      height: '48px',
      marginLeft: 'auto',
      overflow: 'hidden',
      alignItems: 'center',
      padding: '0 8px',
    };
  });

  const { initialState } = useModel('@@initialState');

  const [groupedData, setGroupedData] = useState<
    Map<string, Array<{ plan: V1Plan; price: V1Price }>>
  >(new Map());
  const [currentPeriod, setCurrentPeriod] = useState<string>();

  useEffect(() => {
    const allprices = (plans ?? []).flatMap(
      (plan) =>
        plan.prices?.map((price) => {
          return { plan, price };
        }) ?? [],
    );

    //group by period
    const periodTypes = ['day', 'week', 'month', 'year'];
    const newGroupeddata: Map<string, Array<{ plan: V1Plan; price: V1Price }>> = new Map();
    periodTypes.forEach((periodType) => {
      const thisPeriodTypePrices = allprices
        .filter((items) => items?.price?.recurring?.interval === periodType)
        .sort((a, b) => {
          return Number(
            BigInt(a?.price.default?.amount ?? 0) - BigInt(b?.price.default?.amount ?? 0),
          );
        });
      if (thisPeriodTypePrices.length > 0) {
        newGroupeddata.set(periodType, thisPeriodTypePrices);
      }
    });
    const oneTime = allprices
      .filter((items) => !items?.price?.recurring)
      .sort((a, b) => {
        return Number(
          BigInt(a?.price.default?.amount ?? 0) - BigInt(b?.price.default?.amount ?? 0),
        );
      });
    if (oneTime.length > 0) {
      newGroupeddata.set('one-time', oneTime);
    }

    setGroupedData(newGroupeddata);
    setCurrentPeriod(newGroupeddata.keys().next().value);
  }, [plans]);

  if (initialState?.currentTenant?.isHost) {
    return <></>;
  }

  if ((plans ?? []).length === 0) {
    //no plan
    return <></>;
  }

  return (
    <span className={actionClassName}>
      <Button
        type="primary"
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        {initialState?.currentTenant?.tenant?.plan
          ? initialState.currentTenant.tenant.plan.displayName
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
        <PriceTable
          data={groupedData}
          currentPeriod={currentPeriod!}
          onPeriodChange={(v) => {
            setCurrentPeriod(v);
          }}
          onConfirm={() => {
            setIsModalOpen(false);
          }}
        ></PriceTable>
      </Modal>
    </span>
  );
};

export default PlanDropdown;
