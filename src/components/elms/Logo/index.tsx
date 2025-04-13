import Image from 'next/image';
import React from 'react';

export default function Logo({ size = 80 }: { size: number }) {
  return <Image src="/logo.png" width={size} height={size} alt="Logo" />;
}
