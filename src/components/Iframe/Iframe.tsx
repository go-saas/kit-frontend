import React, { useState } from 'react';
import { Spin } from 'antd';
import { useSearchParams } from 'umi';
import styles from './index.less';
export type IFrameProps = {
  frameSrc: string;
};
const Iframe: React.FC<IFrameProps> = (props) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [searchParams] = useSearchParams();
  let url = (props.frameSrc || searchParams.get('url')) ?? '';
  if (!url.startsWith('http') && !url.startsWith('https')) {
    url = window.location.protocol + '//' + window.location.host + url;
  }
  return (
    <>
      <Spin size="large" spinning={loading} className={styles.container}>
        <iframe src={url} onLoad={() => setLoading(false)} className={styles.iframe} />
      </Spin>
    </>
  );
};

export default Iframe;
