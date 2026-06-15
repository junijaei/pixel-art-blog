export type SortDirection = 'ascending' | 'descending';

export type PropertySort = {
  property: string;
  direction: SortDirection;
};

export type TimestampSort = {
  timestamp: 'created_time' | 'last_edited_time';
  direction: SortDirection;
};

export type Sort = PropertySort | TimestampSort;

export type Sorts = Sort[];
