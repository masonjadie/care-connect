const express = require('express');
const { getPool } = require('../../db');
const router = express.Router();

// Middleware to check if user is admin (simple demonstration version)
const isAdmin = (req, res, next) => {
  // In a real app, verify JWT and check role
  next();
};

// Get all meals
router.get('/', async (req, res) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query('SELECT * FROM meals');
    
    // Parse tags JSON string back to array if necessary (depending on DB driver/setup)
    const meals = rows.map(meal => ({
      ...meal,
      tags: typeof meal.tags === 'string' ? JSON.parse(meal.tags) : meal.tags
    }));
    
    res.json(meals);
  } catch (error) {
    console.error('Error fetching meals:', error);
    res.status(500).json({ error: 'Failed to fetch meals' });
  }
});

// Create a new meal
router.post('/', isAdmin, async (req, res) => {
  try {
    const { name, description, category, calories, protein, price, tags, image } = req.body;
    const pool = await getPool();
    
    const [result] = await pool.query(
      'INSERT INTO meals (name, description, category, calories, protein, price, tags, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, description, category, calories, protein, price, JSON.stringify(tags), image]
    );
    
    res.status(201).json({ id: result.insertId, message: 'Meal created successfully' });
  } catch (error) {
    console.error('Error creating meal:', error);
    res.status(500).json({ error: 'Failed to create meal' });
  }
});

// Update an existing meal
router.put('/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, calories, protein, price, tags, image } = req.body;
    const pool = await getPool();
    
    await pool.query(
      'UPDATE meals SET name = ?, description = ?, category = ?, calories = ?, protein = ?, price = ?, tags = ?, image = ? WHERE id = ?',
      [name, description, category, calories, protein, price, JSON.stringify(tags), image, id]
    );
    
    res.json({ message: 'Meal updated successfully' });
  } catch (error) {
    console.error('Error updating meal:', error);
    res.status(500).json({ error: 'Failed to update meal' });
  }
});

// Delete a meal
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getPool();
    
    await pool.query('DELETE FROM meals WHERE id = ?', [id]);
    
    res.json({ message: 'Meal deleted successfully' });
  } catch (error) {
    console.error('Error deleting meal:', error);
    res.status(500).json({ error: 'Failed to delete meal' });
  }
});

module.exports = router;
