/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // 기본값 60초는 속도 제한 큐를 통과하는 페이지에 너무 짧다.
  // 글 하나가 블록당 댓글을 조회하는 동안 초당 3회에 묶여 쉽게 넘긴다.
  staticPageGenerationTimeout: 600,
  experimental: {
    // Notion 속도 제한 큐(features/post/api/throttle.ts)는 프로세스 단위다.
    // 워커를 여러 개 띄우면 전체 처리량이 워커 수만큼 곱해져 429가 난다.
    // 워커를 늘리려면 NOTION_RATE_LIMIT_PER_SECOND를 워커 수로 나눠 넣어야 한다.
    cpus: 1,
    staticGenerationMinPagesPerWorker: 10_000,
  },
  async headers() {
    return [
      {
        // 폰트 파일에 1년 불변 캐시 적용 (해시된 파일명으로 캐시 무효화)
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
