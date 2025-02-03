export type TMetaPagination = {
  page: number;
  pageIndex: number;
  perPage: number;
  totalCount: number;
};

export interface IRequestWithPagination {
  page?: number | null;
  perPage?: number | null;
}
