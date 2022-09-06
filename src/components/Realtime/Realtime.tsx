import React, { useEffect, useState } from 'react';
import { Centrifuge } from 'centrifuge';
import { CentrifugeContext } from './context';
import { notification } from 'antd';
// import { useModel } from '@@/plugin-model';

type Props = {
  children: React.ReactNode;
};

const Realtime: React.FC<Props> = ({ children, routes }: any) => {
  const newChildren = React.cloneElement(children, {
    ...children?.props,
    routes,
  });

  // const { initialState } = useModel('@@initialState');

  const [client, setClient] = useState<Centrifuge>();
  useEffect(() => {
    const { host, protocol } = window.location;
    const centrifuge = new Centrifuge(
      protocol === 'https' ? 'wss' : 'ws' + '://' + host + BASE_URL + '/v1/realtime/connect/ws',
    );
    centrifuge.on('publication', function (ctx) {
      if (ctx.channel.startsWith('notification#')) {
        notification.open({
          message: ctx.data.title,
          description: ctx.data.desc,
        });
      }
      console.log(ctx.channel + ': ' + JSON.stringify(ctx.data));
    });
    setClient(centrifuge);
    // Trigger actual connection establishement.
    centrifuge.connect();
    return () => {
      centrifuge.disconnect();
    };
  }, []);

  return <CentrifugeContext.Provider value={client}> {newChildren}</CentrifugeContext.Provider>;
};

export default Realtime;
