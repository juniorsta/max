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
import authRouter from './routes/auth.js';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Public auth routes
app.use('/api/v1/auth', authRouter);

// Tenant resolution for all API routes
app.use('/api/v1', resolveTenant);
app.use('/api/v1', requireTenant);

// Protected routes
app.use('/api/v1/companies', authMiddleware, companiesRouter);
app.use('/api/v1/leads', authMiddleware, leadsRouter);

// Webhook - no auth, only secret
app.post('/api/v1/webhooks/whatsapp', validateWebhookSecret, async (req, res) => {
  try {
    const { instance, data } = req.body;
    // TODO: process webhook
    console.log('Webhook received:', instance, data);
    res.json({ received: true });
  } catch (e) {
    console.error('Webhook error:', e);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on ${PORT}`));