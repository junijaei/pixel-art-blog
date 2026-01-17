import { Client } from '@notionhq/client';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export const NOTION_DATASOURCE_CATEGORY_ID = process.env.NOTION_DATASOURCE_CATEGORY_ID || '';
export const NOTION_DATASOURCE_POST_ID = process.env.NOTION_DATASOURCE_POST_ID || '';

export default notion;
