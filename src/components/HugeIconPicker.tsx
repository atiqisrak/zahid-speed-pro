import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import * as HugeIconsAll from '@hugeicons/core-free-icons';

export default function HugeIconPicker({ name, className = '', size = 24 }: { name: string, className?: string, size?: number }) {
  // Try exact match, or camelCase match
  const camelCaseName = name.charAt(0).toLowerCase() + name.slice(1);
  const pascalCaseName = name.charAt(0).toUpperCase() + name.slice(1);
  
  // @ts-ignore
  let iconData = HugeIconsAll[name] || HugeIconsAll[camelCaseName] || HugeIconsAll[pascalCaseName];

  // Fallback to a generic icon if not found
  if (!iconData) {
    // @ts-ignore
    iconData = HugeIconsAll.Globe02Icon;
  }

  if (!iconData) return null;

  return <HugeiconsIcon icon={iconData} size={size} className={className} />;
}
