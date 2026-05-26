import { prisma } from './prisma';
import crypto from 'crypto';

export async function generateAuthToken(userId: string) {
  // Generate a 6-digit numeric token or a alphanumeric one. 
  // Given it's for WhatsApp, a shorter alphanumeric or numeric token is easier to type.
  const token = crypto.randomBytes(3).toString('hex').toUpperCase(); // 6 chars
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours expiry

  const authToken = await prisma.authToken.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });

  return authToken;
}

export async function verifyToken(token: string) {
  const authToken = await prisma.authToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!authToken) return null;
  if (authToken.usedAt) return null; // Already used
  if (new Date() > authToken.expiresAt) return null; // Expired

  return authToken;
}

export async function markTokenAsUsed(tokenId: string) {
  return await prisma.authToken.update({
    where: { id: tokenId },
    data: { usedAt: new Date() },
  });
}
