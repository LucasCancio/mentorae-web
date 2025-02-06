export type TMetaPagination = {
  page: number;
  pageIndex: number;
  totalCount: number;
  perPage: number;
};

export interface IRequestWithPagination {
  page?: number | null;
  limit?: number | null;
}
