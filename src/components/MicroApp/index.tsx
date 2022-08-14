import { MicroAppWithMemoHistory, useLocation } from '@umijs/max';

export type MicroAppPros = {
  name: string;
  url: string;
  entry: string;
};

const App: React.FC<MicroAppPros> = (props) => {
  const location = useLocation();
  let e = props.entry;
  if (e.startsWith('//')) {
    //handle entry without protocol
    e = window.location.protocol + e;
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
  console.log(url);

  return <MicroAppWithMemoHistory key={url} name={props.name} url={url} />;
};
export default App;
