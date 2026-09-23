import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';
import { resolveTenant, requireTenant } from './middleware/tenant.js';
import { authMiddleware } from './middleware/auth.js';
import { validateWebhookSecret } from './middleware/webhook.js';
import companiesRouter from './routes/companies.js';
import leadsRouter from './routes/leads.js';
import conversationsRouter from './routes/conversations.js';
import webhookRouter from './routes/webhook.js';
import dashboardRouter from './routes/dashboard.js';
import authRouter from './routes/auth.js';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Public auth routes (no tenant resolution needed - JWT has empresaId)
app.use('/api/v1/auth', authRouter);

// Tenant resolution for protected API routes
app.use('/api/v1', (req, res, next) => {
  // Skip tenant resolution for auth routes
  if (req.path.startsWith('/auth/')) return next();
  resolveTenant(req, res, next);
});
app.use('/api/v1', requireTenant);

// Protected routes
app.use('/api/v1/companies', authMiddleware, companiesRouter);
app.use('/api/v1/leads', authMiddleware, leadsRouter);
app.use('/api/v1/conversations', authMiddleware, conversationsRouter);
app.use('/api/v1/dashboard', authMiddleware, dashboardRouter);

// Webhook - no auth, only secret
app.use('/api/v1/webhooks', validateWebhookSecret, webhookRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on ${PORT}`));