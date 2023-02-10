import React from 'react';
import type { MenuDataItem } from '@ant-design/pro-layout';
import * as allIcons from '@ant-design/icons';
import type { V1Menu, V1PermissionRequirement } from '@gosaas/api';
import Iframe from '@/components/Iframe';
import MicroApp from '@/components/MicroApp';
const isDev = process.env.NODE_ENV === 'development';

export declare type RouteData = {
  type: 'iframe' | 'microApp';
  iframe?: string;
  microAppName?: string;
  microAppEntry?: string;
  microAppBasename?: string;
};

export declare type Route = {
  route?: RouteData;
} & Omit<MenuDataItem, 'children'> & {
    requirement?: V1PermissionRequirement[] | undefined;
    children?: Route[];
  } & {
    element?: React.ReactNode;
  };

export function transformMenu(allMenu: V1Menu[]) {
  const findChildren = (id: string): Route[] => {
    const items: Route[] = allMenu
      .filter((p) => p.parent === id)
      .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0))
      .map((p) => {
        const item: Route = {
          icon: p.icon,
          locale: p.title,
          name: p.title,
          path: p.path,
          //component: p.component,
          requirment: p.requirement,
          key: p.id,
          hideInMenu: p.hideInMenu,
        };
        if (p.iframe) {
          item.route = {
            type: 'iframe',
            iframe: p.iframe!,
          };
          item.element = <Iframe key={p.id!} frameSrc={p.iframe!} />;
        }
        if (p.microAppName) {
          const entry = isDev ? p.microAppDev : p.microApp;
          item.route = {
            microAppName: p.microAppName,
            microAppEntry: entry,
            microAppBasename: p.microAppBaseRoute,
            type: 'microApp',
          };
          item.element = (
            <MicroApp key={p.id!} name={p.microAppName} url={p.microAppBaseRoute!} entry={entry} />
          );
        }

        //fix icon
        const icon = p.icon;
        if (typeof icon === 'string') {
          item.icon = React.createElement(allIcons[icon] || allIcons.AppstoreOutlined);
        }
        return item;
      });

    for (const i of items) {
      i.children = findChildren(i.key);
      if (i.children.length === 0) {
        i.children = undefined;
      }
    }
    return items;
  };
  const ret = findChildren('');
  console.log(ret);
  return ret;
}
