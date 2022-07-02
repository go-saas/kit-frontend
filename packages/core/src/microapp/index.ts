import { OptionsType } from '@micro-app/types';
import microApp from '@micro-zoe/micro-app';
import { mitt } from '../utils/mitt';

export const globalDataKeyPrefix = 'micro-app.data.global.';

//base application start
export function microappInit(options?: OptionsType) {
  microApp.start(options);
  hookGlobalData();
}

export function sendData2child(child: string, data: Record<PropertyKey, unknown>) {
  microApp.setData(child, data);
}

//dispatch golabl data
export function dispatchGlobalData(data: Record<PropertyKey, unknown>, type = 'default') {
  const app = window.__MICRO_APP_BASE_APPLICATION__
    ? microApp
    : window.__MICRO_APP_ENVIRONMENT__
    ? window.microApp
    : null;

  if (app) {
    app.setGlobalData({ data: data, type: type || '' });
  }
}

export const microappEmiiter = mitt();

export function hookGlobalData(fn?: (type: string, data: any) => void) {
  const app = window.__MICRO_APP_BASE_APPLICATION__
    ? microApp
    : window.__MICRO_APP_ENVIRONMENT__
    ? window.microApp
    : null;

  if (app) {
    app.addGlobalDataListener((raw: { type: string; data: any }) => {
      const { type, data } = raw;
      if (type) {
        if (fn) {
          fn(type, data);
        } else {
          microappEmiiter.emit(`${globalDataKeyPrefix}${type}`, data);
        }
      }
    }, true);
  }
}

export function handleMicroData(child: string) {
  if (window.__MICRO_APP_ENVIRONMENT__) {
    microappEmiiter.emit(child, window.microApp.getData());
    window.microApp.addDataListener((data: Record<string, unknown>) => {
      microappEmiiter.emit(child, data);
    });
  }
}

export function handleChildData(e: any) {
  console.log(e);
}
