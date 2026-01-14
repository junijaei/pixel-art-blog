import { Client } from '@notionhq/client';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID || '';

export default notion;
