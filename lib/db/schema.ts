import { InferSelectModel } from 'drizzle-orm';
import { boolean, index, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core';
import { v7 as uuidv7 } from 'uuid';

export const roleEnum = pgEnum('role', ['user', 'admin']);

export const verificationStatusEnum = pgEnum('verification_status', [
  'pending',
  'verified',
  'failed',
]);

export const verificationMethodEnum = pgEnum('verification_method', [
  'dns_txt',
  'meta_tag',
  'file',
]);

export const user = pgTable(
  'user',
  {
    id: uuid('id')
      .primaryKey()
      .$defaultFn(() => uuidv7()),
    name: text('name').notNull(),
    email: text('email').notNull(),
    emailVerified: boolean('email_verified').default(false),
    avatar: text('avatar'),
    role: roleEnum('role').notNull().default('user'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  t => [uniqueIndex('user_email_idx').on(t.email), index('user_created_at_idx').on(t.createdAt)]
);

export const site = pgTable(
  'site',
  {
    id: uuid('id')
      .primaryKey()
      .$defaultFn(() => uuidv7()),
    userId: uuid('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    domain: text('domain').notNull(),
    verificationStatus: verificationStatusEnum('verification_status').notNull().default('pending'),
    verificationMethod: verificationMethodEnum('verification_method'),
    verificationToken: varchar('verification_token', { length: 96 }).notNull(),
    verifiedAt: timestamp('verified_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  t => [
    uniqueIndex('site_domain_idx').on(t.domain),
    index('site_user_id_idx').on(t.userId),
    index('site_created_at_idx').on(t.createdAt),
  ]
);

export const visitor = pgTable(
  'visitor',
  {
    id: uuid('id')
      .primaryKey()
      .$defaultFn(() => uuidv7()),
    siteId: uuid('site_id')
      .notNull()
      .references(() => site.id, { onDelete: 'cascade' }),
    ip: text('ip').notNull(),
    browser: varchar('browser', { length: 120 }).notNull(),
    os: varchar('os', { length: 80 }).notNull(),
    device: varchar('device', { length: 40 }).notNull(),
    referrer: text('referrer'),
    country: varchar('country', { length: 2 }),
    city: varchar('city', { length: 120 }),
    path: text('path').notNull(),
    isBot: boolean('is_bot').default(false),
    botReason: text('bot_reason'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  t => [
    index('visitor_site_created_at_idx').on(t.siteId, t.createdAt),
    index('visitor_site_ip_created_at_idx').on(t.siteId, t.ip, t.createdAt),
    index('visitor_created_at_idx').on(t.createdAt),
    index('visitor_site_path_idx').on(t.siteId, t.path),
    index('visitor_site_referrer_idx').on(t.siteId, t.referrer),
    index('visitor_site_browser_idx').on(t.siteId, t.browser),
    index('visitor_site_is_bot_idx').on(t.siteId, t.isBot, t.createdAt)
  ]
);

export type User = InferSelectModel<typeof user>;
export type Site = InferSelectModel<typeof site>;
export type Visitor = InferSelectModel<typeof visitor>;
