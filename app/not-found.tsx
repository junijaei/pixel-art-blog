import ErrorLayout from '@/shared/layouts/error-layout';
import type { Metadata } from 'next';

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: Metadata = {
  title: '404 - 페이지를 찾을 수 없습니다',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <ErrorLayout
      code="404"
      title="페이지를 찾을 수 없습니다"
      description="요청하신 페이지가 존재하지 않거나, 이동되었을 수 있습니다."
    />
  );
}
