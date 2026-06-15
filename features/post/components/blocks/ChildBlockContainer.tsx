import type { ReactNode } from 'react';

interface ChildBlockContainerProps {
  children: ReactNode;
}

export function ChildBlockContainer({ children }: ChildBlockContainerProps) {
  return <div className="mt-2 ml-6 space-y-1">{children}</div>;
}
