export interface PostCardData {
  id: string;
  title: string;
  description: string;
  date: string;
  slug: string;
  categoryPath: string;
  categoryLabel: string;
  readingTime?: string;
}

export type PostCardProps = Omit<PostCardData, 'id'> & {
  /** 목록 내 순서. 전달 시 zero-padded 인덱스(001…)가 표시된다 */
  index?: number;
};
