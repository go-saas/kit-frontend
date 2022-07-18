import React from 'react';
import type { MenuDataItem } from '@ant-design/pro-layout';
import * as allIcons from '@ant-design/icons';
import type { V1Menu } from '@kit/api';

export declare type Route = {
  routes?: Route[];
} & MenuDataItem;

export function transformMenu(allMenu: V1Menu[]) {
  const findChildren = (id: string): Route[] => {
    const items: MenuDataItem[] = allMenu
      .filter((p) => p.parent == id)
      .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0))
      .map((p) => {
        const item: any = {
          id: p.id,
          icon: p.icon,
          locale: p.title,
          name: p.title,
          path: p.path,
          //component: p.component,
          requirment: p.requirement,
          key: p.id,
        };
        if ((p.component || '').toUpperCase() == 'IFRAME') {
          item.path = '/iframe' + item.path + '?url=' + encodeURI(p.iframe!);
        }

        //fix icon
        const icon = p.icon;
        if (typeof icon === 'string') {
          item.icon = React.createElement(allIcons[icon] || allIcons.AppstoreOutlined);
        }
        return item;
      });

    for (const i of items) {
      i.children = findChildren(i.id);
      i.routes = i.children;
      if (i.children.length > 0) {
        //redirect到第一个
        i.routes = [{ path: i.path, redirect: i.routes[0].path }, ...i.routes];
      } else {
        i.children = undefined;
      }
    }

    return items;
  };
  const ret = findChildren('');
  console.log(ret);
  return ret;
}
