import React, { useState } from 'react';
import { Spin } from 'antd';

import { useEmotionCss } from '@ant-design/use-emotion-css';
export type IFrameProps = {
  frameSrc: string;
};

const Iframe: React.FC<IFrameProps> = (props) => {
  const containerStyle = useEmotionCss(() => {
    return {
      height: '100%',
      ':global(.ant-spin-container)': {
        height: '100%',
      },
    };
  });
  const iframeStyle = useEmotionCss(({ token }) => {
    return {
      width: '100%',
      height: '100%',
      overflow: 'auto',
      border: 0,
      background: token.Layout?.colorBgBody,
    };
  });

  const [loading, setLoading] = useState<boolean>(true);
  let url = props.frameSrc || '';
  if (!url.startsWith('http') && !url.startsWith('https')) {
    url = window.location.protocol + '//' + window.location.host + url;
  }
  return (
    <Spin size="large" spinning={loading} wrapperClassName={containerStyle}>
      <iframe src={url} onLoad={() => setLoading(false)} className={iframeStyle} />
    </Spin>
  );
};

export default Iframe;
