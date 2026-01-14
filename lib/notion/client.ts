import { Client } from '@notionhq/client';

if (!process.env.NOTION_API_KEY) {
  throw new Error('NOTION_API_KEY is required');
}

export const notionClient = new Client({
  auth: process.env.NOTION_API_KEY,
});

export const notionConfig = {
  apiKey: process.env.NOTION_API_KEY,
  defaultPageSize: 100,
  maxPageSize: 100,
} as const;
