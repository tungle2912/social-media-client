/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import React, { PropsWithChildren, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback: ReactNode;
}

class ErrorBoundary extends React.Component<PropsWithChildren<Props>> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  render() {
    if ((this.state as any).hasError) {
      // You can render any custom fallback UI
      return (this.props as any).fallback;
    }

    // eslint-disable-next-line react/prop-types
    return (this.props as any).children;
  }
}

export default ErrorBoundary;
