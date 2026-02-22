import { eq } from 'drizzle-orm';
import { db } from './index';
import { user } from './schema';

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
