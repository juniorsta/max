const express = require('express');
require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Import routes after middleware
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/companies', require('./routes/companies'));
app.use('/api/v1/leads', require('./routes/leads'));
app.use('/api/v1/dashboard', require('./routes/dashboard'));
app.use('/api/v1/appointments', require('./routes/appointments'));
app.use('/api/v1/conversations', require('./routes/conversations'));
app.use('/api/v1/ia', require('./routes/ia'));
app.use('/api/v1/webhooks', require('./routes/webhook'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log('Backend running on port ' + PORT);
  console.log('Health check at http://localhost:' + PORT + '/health');
});
