export declare type SortOrder = 'descend' | 'ascend' | null;

export default function transform<TData, TFilter>(
  func: (req: TListRequest<TFilter>) => Promise<TPagedResult<TData>>,
): (
  params: TAntdReq | null,
  sort: Record<string, SortOrder>,
  filter: Record<string, React.ReactText[] | null>,
) => Promise<TAntdList<TData>> {
  //TODO build query item
  return async (
    params: TAntdReq | null,
    sort: Record<string, SortOrder>,
    filter: Record<string, React.ReactText[] | null>,
  ): Promise<TAntdList<TData>> => {
    const sorting: string[] = [];
    for (const k in sort) {
      if (sort[k] == 'descend') {
        sorting.push('-' + k);
      } else {
        sorting.push(k);
      }
    }
    const resp = await func({
      pageOffset:
        params?.current == null ? undefined : ((params.current ?? 0) - 1) * (params?.pageSize ?? 0),
      pageSize: params?.pageSize,
      search: params?.search,
      sort: sorting,
    });
    return {
      data: resp.items ?? [],
      success: true,
      total: resp.totalSize!,
    };
  };
}
interface TAntdReq {
  pageSize?: number;
  current?: number;
  [key: string]: any;
}

interface TAntdList<TData> {
  data: TData[];
  success: boolean;
  total: number;
}

export interface TPagedResult<TData> {
  items?: TData[];
  totalSize?: number;
  filterSize?: number;
}

export interface TListRequest<TFilter> {
  pageOffset?: number;

  pageSize?: number;

  search?: string;

  sort?: string[];

  fields?: string;

  filter?: TFilter;
}
