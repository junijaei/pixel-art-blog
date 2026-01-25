import { Category, CategoryPage, CategoryTreeNode } from '@/types/notion';

/**
 * 카테고리 페이지를 파싱된 Category 객체로 변환
 */
export function parseCategoryPage(page: CategoryPage): Category {
  const properties = page.properties;

  // label (title 타입)
  const labelProp = properties.label;
  const label = labelProp?.type === 'title' && labelProp.title.length > 0 ? labelProp.title[0].plain_text : '';

  // parent (관계형)
  const parentProp = properties.parent;
  const parentId = parentProp?.type === 'relation' && parentProp.relation.length > 0 ? parentProp.relation[0].id : null;

  // children (관계형)
  const childrenProp = properties.children;
  const hasChildren = childrenProp?.type === 'relation' && childrenProp.relation.length > 0;

  // path (text 타입)
  const pathProp = properties.path;
  const path = pathProp?.type === 'rich_text' && pathProp.rich_text.length > 0 ? pathProp.rich_text[0].plain_text : '';

  // isActive (select 타입)
  const isActiveProp = properties.isActive;
  const isActive = isActiveProp?.type === 'select' && isActiveProp.select?.name === 'active';

  // createdAt
  const createdAtProp = properties.createdAt;
  const createdAt = createdAtProp?.type === 'created_time' ? createdAtProp.created_time : '';

  // updatedAt
  const updatedAtProp = properties.updatedAt;
  const updatedAt = updatedAtProp?.type === 'last_edited_time' ? updatedAtProp.last_edited_time : '';

  return {
    id: page.id,
    label,
    parentId,
    hasChildren,
    path,
    isActive,
    createdAt,
    updatedAt,
  };
}

/**
 * 모든 카테고리를 트리 구조로 변환
 */
export function buildCategoryTree(categories: Category[]): CategoryTreeNode[] {
  const categoryMap = new Map<string, CategoryTreeNode>();
  const rootCategories: CategoryTreeNode[] = [];

  // 1단계: 모든 카테고리를 TreeNode로 변환하여 Map에 저장
  categories.forEach((category) => {
    categoryMap.set(category.id, {
      ...category,
      children: [],
      depth: 0,
    });
  });

  // 2단계: 부모-자식 관계 설정
  categoryMap.forEach((node) => {
    if (node.parentId) {
      const parent = categoryMap.get(node.parentId);
      if (parent) {
        parent.children.push(node);
        node.depth = parent.depth + 1;
      } else {
        // 부모를 찾을 수 없으면 루트로 처리
        rootCategories.push(node);
      }
    } else {
      rootCategories.push(node);
    }
  });

  // 3단계: 각 레벨에서 label로 정렬
  const sortChildren = (nodes: CategoryTreeNode[]) => {
    nodes.sort((a, b) => a.label.localeCompare(b.label));
    nodes.forEach((node) => {
      if (node.children.length > 0) {
        sortChildren(node.children);
      }
    });
  };

  sortChildren(rootCategories);

  return rootCategories;
}
