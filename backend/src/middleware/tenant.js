import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function resolveTenant(req, res, next) {
  const tenantId = req.headers['x-tenant-id'] || req.query.tenant_id;
  if (!tenantId) {
    return res.status(400).json({ error: 'Tenant ID required' });
  }

  const empresa = await prisma.empresa.findUnique({
    where: { id: tenantId },
  });

  if (!empresa || empresa.status !== 'active') {
    return res.status(403).json({ error: 'Tenant not found or inactive' });
  }

  req.tenant = empresa;
  next();
}

export function requireTenant(req, res, next) {
  if (!req.tenant) {
    return res.status(403).json({ error: 'Tenant context required' });
  }
  next();
}