const express = require('express');
require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const { PrismaClient } = require('@prisma/client');
const { resolveTenant, requireTenant } = require('./middleware/tenant.js');
const { authMiddleware } = require('./middleware/auth.js');
const { validateWebhookSecret } = require('./middleware/webhook.js');
const companiesRouter = require('./routes/companies.js');
const leadsRouter = require('./routes/leads.js');
const conversationsRouter = require('./routes/conversations.js');
const webhookRouter = require('./routes/webhook.js');
const dashboardRouter = require('./routes/dashboard.js');
const authRouter = require('./routes/auth.js');
const appointmentsRouter = require('./routes/appointments.js');
const iaRouter = require('./routes/ia.js');



const app = express();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Public auth routes (no tenant resolution needed - JWT has empresaId)
app.use('/api/v1/auth', authRouter);

// Protected routes with auth + tenant
app.use('/api/v1/companies', authMiddleware, requireTenant, companiesRouter);
app.use('/api/v1/leads', authMiddleware, requireTenant, leadsRouter);
app.use('/api/v1/conversations', authMiddleware, requireTenant, conversationsRouter);
app.use('/api/v1/dashboard', authMiddleware, requireTenant, dashboardRouter);
app.use('/api/v1/appointments', authMiddleware, requireTenant, appointmentsRouter);
app.use('/api/v1/ia', authMiddleware, requireTenant, iaRouter);

// Webhook - no auth, only secret
app.use('/api/v1/webhooks', validateWebhookSecret, webhookRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Backend running on ' + PORT));