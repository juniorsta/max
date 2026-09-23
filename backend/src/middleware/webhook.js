function validateWebhookSecret(req, res, next) {
  const secret = req.headers['x-webhook-secret'];
  if (!secret || secret !== process.env.WEBHOOK_SECRET) {
    return res.status(401).json({ error: 'Invalid webhook secret' });
  }
  next();
}
module.exports = { validateWebhookSecret };