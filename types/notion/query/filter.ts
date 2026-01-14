// Property Filter Base Types
export type PropertyType =
  | 'title'
  | 'rich_text'
  | 'number'
  | 'checkbox'
  | 'select'
  | 'multi_select'
  | 'date'
  | 'people'
  | 'files'
  | 'url'
  | 'email'
  | 'phone_number'
  | 'formula'
  | 'relation'
  | 'rollup'
  | 'created_time'
  | 'created_by'
  | 'last_edited_time'
  | 'last_edited_by'
  | 'status';

// Text Filter Conditions
export interface TextFilterCondition {
  equals?: string;
  does_not_equal?: string;
  contains?: string;
  does_not_contain?: string;
  starts_with?: string;
  ends_with?: string;
  is_empty?: true;
  is_not_empty?: true;
}

// Number Filter Conditions
export interface NumberFilterCondition {
  equals?: number;
  does_not_equal?: number;
  greater_than?: number;
  less_than?: number;
  greater_than_or_equal_to?: number;
  less_than_or_equal_to?: number;
  is_empty?: true;
  is_not_empty?: true;
}

// Checkbox Filter Conditions
export interface CheckboxFilterCondition {
  equals?: boolean;
  does_not_equal?: boolean;
}

// Select Filter Conditions
export interface SelectFilterCondition {
  equals?: string;
  does_not_equal?: string;
  is_empty?: true;
  is_not_empty?: true;
}

// Multi-select Filter Conditions
export interface MultiSelectFilterCondition {
  contains?: string;
  does_not_contain?: string;
  is_empty?: true;
  is_not_empty?: true;
}

// Date Filter Conditions
export interface DateFilterCondition {
  equals?: string;
  before?: string;
  after?: string;
  on_or_before?: string;
  on_or_after?: string;
  is_empty?: true;
  is_not_empty?: true;
  past_week?: Record<string, never>;
  past_month?: Record<string, never>;
  past_year?: Record<string, never>;
  next_week?: Record<string, never>;
  next_month?: Record<string, never>;
  next_year?: Record<string, never>;
}

// People Filter Conditions
export interface PeopleFilterCondition {
  contains?: string;
  does_not_contain?: string;
  is_empty?: true;
  is_not_empty?: true;
}

// Files Filter Conditions
export interface FilesFilterCondition {
  is_empty?: true;
  is_not_empty?: true;
}

// Relation Filter Conditions
export interface RelationFilterCondition {
  contains?: string;
  does_not_contain?: string;
  is_empty?: true;
  is_not_empty?: true;
}

// Status Filter Conditions
export interface StatusFilterCondition {
  equals?: string;
  does_not_equal?: string;
  is_empty?: true;
  is_not_empty?: true;
}

// Formula Filter Conditions (depends on formula result type)
export type FormulaFilterCondition =
  | { string: TextFilterCondition }
  | { checkbox: CheckboxFilterCondition }
  | { number: NumberFilterCondition }
  | { date: DateFilterCondition };

// Property Filters
export type PropertyFilter =
  | { property: string; title: TextFilterCondition }
  | { property: string; rich_text: TextFilterCondition }
  | { property: string; number: NumberFilterCondition }
  | { property: string; checkbox: CheckboxFilterCondition }
  | { property: string; select: SelectFilterCondition }
  | { property: string; multi_select: MultiSelectFilterCondition }
  | { property: string; date: DateFilterCondition }
  | { property: string; people: PeopleFilterCondition }
  | { property: string; files: FilesFilterCondition }
  | { property: string; url: TextFilterCondition }
  | { property: string; email: TextFilterCondition }
  | { property: string; phone_number: TextFilterCondition }
  | { property: string; relation: RelationFilterCondition }
  | { property: string; formula: FormulaFilterCondition }
  | { property: string; status: StatusFilterCondition }
  | { timestamp: 'created_time'; created_time: DateFilterCondition }
  | { timestamp: 'last_edited_time'; last_edited_time: DateFilterCondition };

// Compound Filters
export interface CompoundFilter {
  or?: Filter[];
  and?: Filter[];
}

export type Filter = PropertyFilter | CompoundFilter;
