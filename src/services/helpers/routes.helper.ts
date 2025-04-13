import { ROUTES, TRouteBreadcrumb, TRouteMeta } from '~/definitions';

export const getRoutePathTitle = (pathname: string): string => {
  const routeData = ROUTES[pathname as keyof typeof ROUTES] || null;

  return routeData?.title || '';
};

export const getRouteMeta = (pathname: string): TRouteMeta | null => {
  const routeData = ROUTES[pathname as keyof typeof ROUTES] || null;

  if (!routeData) return null;

  const navs: string[] = routeData.breadcrumb ? routeData.breadcrumb?.split(',') : [];
  const breadcrumb: TRouteBreadcrumb[] = [];

  if (navs?.length) {
    navs.forEach((nav) => {
      const title = getRoutePathTitle(nav);
      breadcrumb.push({
        title,
        href: nav,
      });
    });
  }

  return { ...routeData, breadcrumb };
};
