import React, { useState } from 'react';
import { Spin } from 'antd';
import styles from './index.less';
export type IFrameProps = {
  frameSrc: string;
};
const Iframe: React.FC<IFrameProps> = (props) => {
  const [loading, setLoading] = useState<boolean>(true);
  let url = props.frameSrc || '';
  if (!url.startsWith('http') && !url.startsWith('https')) {
    url = window.location.protocol + '//' + window.location.host + url;
  }
  return (
    <Spin size="large" spinning={loading} wrapperClassName={styles.container}>
      <iframe src={url} onLoad={() => setLoading(false)} className={styles.iframe} />
    </Spin>
  );
};

export default Iframe;
