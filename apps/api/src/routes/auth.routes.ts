import { FastifyInstance } from 'fastify';
import { AuthService } from '../services/auth.service';

export default async function (fastify: FastifyInstance) {
  const authService = new AuthService();

  fastify.post('/signup', async (request, reply) => {
    try {
      const result = await authService.signup(request.body);
      return reply.send(result);
    } catch (e: any) {
      request.log.error(e);
      return reply.status(400).send({ error: e.message, code: 'SIGNUP_FAILED' });
    }
  });

  fastify.post('/login', async (request, reply) => {
    try {
      const { token, refreshToken, user } = await authService.login(request.body);
      reply.setCookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/api/auth'
      });
      return reply.send({ access_token: token, user });
    } catch (e: any) {
      request.log.error(e);
      return reply.status(401).send({ error: e.message, code: 'LOGIN_FAILED' });
    }
  });

  fastify.post('/refresh', async (request, reply) => {
    try {
      const oldRefreshToken = request.cookies.refresh_token;
      if (!oldRefreshToken) throw new Error('No refresh token provided');
      
      const { token, refreshToken } = await authService.refreshToken(oldRefreshToken);
      reply.setCookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/api/auth'
      });
      return reply.send({ access_token: token });
    } catch (e: any) {
      request.log.error(e);
      return reply.status(401).send({ error: 'Session expired', code: 'UNAUTHORIZED' });
    }
  });

  fastify.post('/logout', async (request, reply) => {
    const refreshToken = request.cookies.refresh_token;
    if (refreshToken) {
      await authService.logout(refreshToken);
    }
    reply.clearCookie('refresh_token', { path: '/api/auth' });
    return reply.send({ success: true });
  });

  fastify.post('/forgot-password', async (request, reply) => {
    const { email } = request.body as any;
    if (!email) return reply.status(400).send({ error: 'Email required' });
    const result = await authService.forgotPassword(email);
    return reply.send(result);
  });

  fastify.post('/reset-password', async (request, reply) => {
    const { token, newPassword } = request.body as any;
    try {
      const result = await authService.resetPassword(token, newPassword);
      return reply.send(result);
    } catch (e: any) {
      return reply.status(400).send({ error: e.message });
    }
  });

  fastify.post('/verify-email', async (request, reply) => {
    const { token } = request.body as any;
    try {
      const result = await authService.verifyEmail(token);
      return reply.send(result);
    } catch (e: any) {
      return reply.status(400).send({ error: e.message });
    }
  });
}
