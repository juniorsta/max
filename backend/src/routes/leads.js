import express from 'express';
const router = express.Router();

router.get('/', (req, res) => res.json([]));
router.post('/', (req, res) => res.json({ created: true }));
router.patch('/:id', (req, res) => res.json({ updated: true }));

export default router;
