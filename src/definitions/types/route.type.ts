export type TRouteBreadcrumb = {
  title: string;
  href: string;
};
export type TRouteMeta = {
  title: string;
  description: string;
  breadcrumb: TRouteBreadcrumb[] | [];
};
