const express = require('express');
const router = express.Router();
const { Customer } = require('../models');

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
    if (!updated) {
      return res.status(404).json({ message: 'Customer not found.' });
    }
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
    if (!deleted) {
      return res.status(404).json({ message: 'Customer not found.' });
    }
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting customer.' });
  }
});

module.exports = router;