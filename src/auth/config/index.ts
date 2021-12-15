import { CookieOptions } from 'express';

export const CookieConfig = (): CookieOptions => ({
  path: '/',
  maxAge: 2592000000, // 30 days
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true,
  sameSite: 'strict',
  signed: true
});
