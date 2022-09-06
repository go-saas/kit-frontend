import type { V1Notification } from '@kit/api';
import { NotificationServiceApi } from '@kit/api';
import { Card, Space, Switch } from 'antd';
import { Avatar, Divider, List, Skeleton, Badge } from 'antd';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import styles from './index.less';
import { BellOutlined, DeleteOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import HeaderDropdown from '../HeaderDropdown';
export type GlobalHeaderRightProps = {
  fetchingNotices?: boolean;
  onNoticeVisibleChange?: (visible: boolean) => void;
  onNoticeClear?: (tabName?: string) => void;
};

const NoticeIconView: React.FC = () => {
  const service = new NotificationServiceApi();
  const [loading, setLoading] = useState(false);

  const [notices, setNotices] = useState<V1Notification[]>([]);
  const [pageToken, setPageToken] = useState('');
  const [unreadSize, setUnreadSize] = useState(0);
  const [totalSize, setTotalSize] = useState(0);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const loadMoreData = async (token?: string) => {
    if (loading) {
      return;
    }
    try {
      setLoading(true);
      const t = token ?? pageToken;
      const resp = await service.notificationServiceListNotification2({
        body: {
          afterPageToken: t,
          pageSize: 8,
          filter: !unreadOnly
            ? undefined
            : {
                hasRead: {
                  $eq: false,
                },
              },
        },
      });
      const { unreadSize: unread, nextAfterPageToken, items, filterSize: total } = resp.data;
      setUnreadSize(unread);
      if (!t) {
        //should clear data
        setNotices([...items]);
      } else {
        setNotices([...notices, ...items]);
      }

      setPageToken(nextAfterPageToken);

      setTotalSize(total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    //clear data
    setNotices([]);
    loadMoreData('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unreadOnly]);

  const changeReadState = async (id: string) => {
    await service.notificationServiceReadNotification({ id: id, body: {} });
    //refech
    let shouldReduce = false;

    setNotices(
      //set read
      notices.map((item) => {
        const notice = { ...item };
        if (notice.id === id && notice.hasRead == false) {
          notice.hasRead = true;
          shouldReduce = true;
        }
        return notice;
      }),
    );
    if (shouldReduce) {
      setUnreadSize(unreadSize - 1);
    }
  };

  const clearReadState = async () => {
    await service.notificationServiceReadNotification({ id: '-', body: {} });
    //reload state
    await loadMoreData('');
  };
  const noticeButtonClass = classNames(styles.noticeButton);
  const NoticeBellIcon = <BellOutlined className={styles.icon} />;
  const visible = false;
  const trigger = (
    <span className={classNames(noticeButtonClass, { opened: visible })}>
      <Badge count={unreadSize} style={{ boxShadow: 'none' }} className={styles.badge}>
        {NoticeBellIcon}
      </Badge>
    </span>
  );

  const notificationBox = (
    <Card
      extra={
        <Space>
          <span>仅显示未读</span>
          <Switch checked={unreadOnly} onChange={(v) => setUnreadOnly(v)} />
        </Space>
      }
      actions={[<DeleteOutlined key="delete" onClick={clearReadState} />]}
    >
      <InfiniteScroll
        dataLength={notices.length}
        next={loadMoreData}
        hasMore={notices.length < totalSize}
        loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
        endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
        height={400}
      >
        <List
          dataSource={notices}
          renderItem={(item) => {
            const itemCls = classNames(styles.item, {
              [styles.read]: item.hasRead,
            });
            return (
              <List.Item
                key={item.id}
                onClick={() => changeReadState(item.id!)}
                className={itemCls}
              >
                <List.Item.Meta
                  avatar={<Avatar src={item.image} />}
                  title={item.title}
                  description={item.desc}
                />
              </List.Item>
            );
          }}
        />
      </InfiniteScroll>
    </Card>
  );

  return (
    <HeaderDropdown
      placement="bottomRight"
      overlay={notificationBox}
      overlayClassName={styles.popover}
      trigger={['click']}
    >
      {trigger}
    </HeaderDropdown>
  );
};

export default NoticeIconView;
