'use client';

import { BreadcrumbItemType, BreadcrumbSeparatorType } from 'antd/es/breadcrumb/Breadcrumb';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import { TRouteBreadcrumb } from '~/definitions';
import { getRouteMeta } from '~/services/helpers';
import { Breadcrumb } from '~/theme';

function itemRender(currentRoute: Partial<BreadcrumbItemType & BreadcrumbSeparatorType>) {
  return !(currentRoute as TRouteBreadcrumb)?.href ? (
    <span key={currentRoute.href || ''}>{(currentRoute as TRouteBreadcrumb).title}</span>
  ) : (
    <Link key={currentRoute.href || ''} href={(currentRoute as TRouteBreadcrumb).href}>
      {(currentRoute as TRouteBreadcrumb).title}
    </Link>
  );
}

export default function BasicBreadcrumb() {
  const pathname = usePathname();
  const routeMeta = getRouteMeta(pathname);

  if (!routeMeta?.breadcrumb?.length) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
  }

  return (
    <Breadcrumb
      items={[
        ...(routeMeta?.breadcrumb || []),
        {
          title: routeMeta?.title || '',
        },
      ]}
      itemRender={itemRender}
    />
  );
}
