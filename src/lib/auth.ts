import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { User, SessionUser } from '@/types/User';

const secretKey = process.env.JWT_SECRET_KEY!;
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key);
}

export async function decrypt(token: string): Promise<any> {
  const { payload } = await jwtVerify(token, key, {
    algorithms: ['HS256'],
  });
  return payload;
}

export async function login(user: User): Promise<void> {
  const sessionUser: SessionUser = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  const session = await encrypt({ user: sessionUser, expires });

  if (session) {
    (await cookies()).set('session', session, { 
      expires, 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
  }
}

export async function logout(): Promise<void> {
  (await cookies()).delete('session');
}

export async function getSession(): Promise<SessionUser | null> {
  const session = (await cookies()).get('session')?.value;
  if (!session) return null;

  try {
    const parsed = await decrypt(session);
    if (!parsed || parsed.expires < Date.now()) {
      return null;
    }
    return parsed.user;
  } catch (error) {
    console.error('Error decrypting session:', error);
    return null;
  }
}