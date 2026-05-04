import { sqliteTable, text, integer, unique, any, primaryKey, sqliteExpr, sqliteFunction } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const triggers = sqliteTable('triggers', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: sqliteFunction('created_at', () => sqliteExpr(sql`CURRENT_TIMESTAMP`)),
  updatedAt: sqliteFunction('updated_at', () => sqliteExpr(sql`CURRENT_TIMESTAMP`)),
});

export const triggerConditions = sqliteTable('trigger_conditions', {
  id: integer('id').primaryKey(),
  triggerId: integer('trigger_id').notNull().references(() => triggers.id),
  conditionType: text('condition_type').notNull().default('scroll_depth'),
  parameters: any('parameters').notNull(),
  createdAt: sqliteFunction('created_at', () => sqliteExpr(sql`CURRENT_TIMESTAMP`)),
}, (t) => ({
  unique: unique(t.triggerId, t.conditionType),
}));

export const segmentation = sqliteTable('segmentation', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: sqliteFunction('created_at', () => sqliteExpr(sql`CURRENT_TIMESTAMP`)),
  updatedAt: sqliteFunction('updated_at', () => sqliteExpr(sql`CURRENT_TIMESTAMP`)),
});

export const segmentConditions = sqliteTable('segment_conditions', {
  id: integer('id').primaryKey(),
  segmentId: integer('segment_id').notNot().references(() => segmentation.id),
  conditionType: text('condition_type').notNull().default('utm_tags'),
  parameters: any('parameters').notNull(),
  createdAt: sqliteFunction('created_at', () => sqliteExpr(sql`CURRENT_TIMESTAMP`)),
}, (t) => ({
  unique: unique(t.segmentId, t.conditionType),
}));

export const triggerSegmentation = sqliteTable('trigger_segmentation', {
  triggerId: integer('trigger_id').notNull().references(() => triggers.id),
  segmentId: integer('segment_id').notNull().references(() => segmentation.id),
  createdAt: sqliteFunction('created_at', () => sqliteExpr(sql`CURRENT_TIMESTAMP`)),
}, (t) => ({
  pk: primaryKey(t.triggerId, t.segmentId),
}));