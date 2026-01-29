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

export type PostCardProps = Omit<PostCardData, 'id'>;
