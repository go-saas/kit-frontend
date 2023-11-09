import { AuthWebApi } from '@gosaas/api';
import { stringify } from 'querystring';

const donnotneedauthpath = ['/user/login', '/user/register'];
/**
 * 退出登录，并且将当前的 url 保存
 */
export const loginOut = async () => {
  await new AuthWebApi().authWebWebLogout({ body: {} });
  const { search, pathname } = window.location;

  if (donnotneedauthpath.includes(pathname)) {
    return;
  }

  const urlParams = new URL(window.location.href).searchParams;
  /** 此方法会跳转到 redirect 参数所在的位置 */
  const redirect = urlParams.get('redirect');
  // Note: There may be security issues, please note

  //TODO validating search
  let newSearch = '';
  if (pathname !== '/user/login') {
    newSearch = stringify({
      redirect: pathname + search,
    });
  }

  if (!redirect) {
    // history.replace({
    //   pathname: '/user/login',
    //   search: newSearch,
    // });
    const currentPath = window.location + '';

    const url = new URL(currentPath);
    url.pathname = '/user/login';
    url.search = newSearch;
    window.location.replace(url.href);
  }
};
