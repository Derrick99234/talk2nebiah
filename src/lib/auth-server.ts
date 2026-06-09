import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

export async function authenticateAdmin(email: string, password: string) {
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) return null;
  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) return null;
  return { adminId: admin.id, email: admin.email };
}
