import { and, eq } from 'drizzle-orm';
import { db } from './index';
import { site, user } from './schema';

export async function getUserByEmail(email: string) {
  try {
    const [u] = await db.select().from(user).where(eq(user.email, email));
    return u ?? null;
  } catch (error: unknown) {
    console.error(`Database query failed in getUserByEmail for email: ${email}`, error);
    throw new Error('Failed to fetch user by email');
  }
}

export async function createUser(data: Omit<typeof user.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const [u] = await db.insert(user).values(data).returning();
    return u ?? null;
  } catch (error: unknown) {
    console.error('Database query failed in createUser', error);
    throw new Error('Failed to create user');
  }
}

export async function deleteUserById(userId: string) {
  try {
    const [deletedUser] = await db.delete(user).where(eq(user.id, userId)).returning();
    return deletedUser ?? null;
  } catch (error: unknown) {
    console.error(`Database query failed in deleteUserById for userId: ${userId}`, error);
    throw new Error('Failed to delete user');
  }
}

// ── Site queries ──

export async function createSite(data: Omit<typeof site.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const [s] = await db.insert(site).values(data).returning();
    return s ?? null;
  } catch (error: unknown) {
    console.error('Database query failed in createSite', error);
    throw error;
  }
}

export async function getSitesByUserId(userId: string, limit = 100) {
  try {
    return await db.select().from(site).where(eq(site.userId, userId)).limit(limit);
  } catch (error: unknown) {
    console.error(`Database query failed in getSitesByUserId for userId: ${userId}`, error);
    throw new Error('Failed to fetch sites');
  }
}

export async function deleteSite(siteId: string, userId: string) {
  try {
    const [s] = await db
      .delete(site)
      .where(and(eq(site.id, siteId), eq(site.userId, userId)))
      .returning();
    return s ?? null;
  } catch (error: unknown) {
    console.error('Database query failed in deleteSite', error);
    throw new Error('Failed to delete site');
  }
}

export async function getSiteBySiteId(siteId: string) {
  try {
    const [s] = await db.select().from(site).where(eq(site.id, siteId));
    return s ?? null;
  } catch (error: unknown) {
    console.error(`Database query failed in getSiteBySiteId for siteId: ${siteId}`, error);
    throw new Error('Failed to fetch site');
  }
}
