const express = require('express');
const multer = require('multer');
const streamifier = require('streamifier');
const csv = require('csv-parser');
const { Customer } = require('../models');
const router = express.Router();

// GET /api/customers
router.get('/', async (req, res) => {
  try {
    const list = await Customer.findAll({ order: [['id', 'DESC']] });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching customers.' });
  }
});

// POST /api/customers
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, company, tags } = req.body;
    const cust = await Customer.create({ name, email, phone, company, tags });
    res.status(201).json(cust);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Error creating customer.', error: err.message });
  }
});

// PUT /api/customers/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, company, tags } = req.body;
    const [updated] = await Customer.update(
      { name, email, phone, company, tags },
      { where: { id } }
    );
    if (!updated) return res.status(404).json({ message: 'Customer not found.' });
    const cust = await Customer.findByPk(id);
    res.json(cust);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Error updating customer.', error: err.message });
  }
});

// DELETE /api/customers/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Customer.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: 'Customer not found.' });
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting customer.' });
  }
});

// POST /api/customers/upload
// Stream‑parse, validate, batch insert up to 1M records
router.post('/upload', multer().single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });

  const BATCH_SIZE = 1000;
  let total = 0, processed = 0, skipped = 0, failed = 0;
  const bufferStream = streamifier.createReadStream(req.file.buffer);
  const rows = [];

  bufferStream
    .pipe(csv())
    .on('data', (row) => {
      total++;
      // Basic validation
      if (!row.name || !row.email || !row.phone) {
        skipped++;
        return;
      }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(row.email)) {
        skipped++;
        return;
      }
      // accumulate
      rows.push({
        name: row.name.trim(),
        email: row.email.trim(),
        phone: row.phone.trim(),
        company: row.company?.trim() || null,
        tags: row.tags ? row.tags.split(';').map(t => t.trim()) : []
      });
      if (rows.length >= BATCH_SIZE) {
        bufferStream.pause();
        Customer.bulkCreate(rows, { ignoreDuplicates: true })
          .then(() => {
            processed += rows.length;
            rows.length = 0;
            bufferStream.resume();
          })
          .catch(err => {
            console.error('Batch insert error', err);
            failed += rows.length;
            rows.length = 0;
            bufferStream.resume();
          });
      }
    })
    .on('end', async () => {
      if (rows.length) {
        try {
          await Customer.bulkCreate(rows, { ignoreDuplicates: true });
          processed += rows.length;
        } catch {
          failed += rows.length;
        }
      }
      return res.json({ total, processed, skipped, failed });
    })
    .on('error', (err) => {
      console.error('CSV streaming error:', err);
      res.status(500).json({ message: 'Error processing CSV.' });
    });
});

module.exports = router;