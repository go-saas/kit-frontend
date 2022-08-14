import { MicroAppWithMemoHistory, useLocation, useSearchParams } from '@umijs/max';

export type MicroAppPros = {
  name: string;
  url: string;
  entry: string;
};

const App: React.FC<MicroAppPros> = (props) => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  let e = props.entry;
  if (e.startsWith('http://') || e.startsWith('https://')) {
  } else if (e.startsWith('//')) {
    //handle entry without protocol
    e = window.location.protocol + e;
  } else {
    e = new URL(e, window.location.host).href;
  }

  const entry = new URL(e);
  let url = props.url;
  url = url.slice(entry.pathname.length);
  //make sure url start with '/'
  url = '/' + url;

  if (url && location.pathname.startsWith(url)) {
    const postfix = location.pathname.slice(url.length);
    //append post fix to url
    url = url + postfix;
  }

  url = entry.pathname + url.slice(1);
  const hostPrefix = entry.protocol + '//' + entry.hostname;
  const newUrl = new URL(hostPrefix);
  newUrl.hash = location.hash;
  newUrl.pathname = url;

  for (const [key, value] of searchParams) {
    newUrl.searchParams.set(key, value);
  }
  url = newUrl.href.slice(hostPrefix.length);
  console.log(url);
  return <MicroAppWithMemoHistory key={url} name={props.name} url={url} />;
};
export default App;
