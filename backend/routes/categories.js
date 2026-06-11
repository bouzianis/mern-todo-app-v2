const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const auth = require('../middleware/auth');

// Get all categories for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user.id }).sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Create a category
router.post('/', auth, async (req, res) => {
  try {
    const { name, color } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Le nom est requis' });
    }
    const category = new Category({
      name,
      color: color || '#6366f1',
      user: req.user.id,
    });
    await category.save();
    res.json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Update a category
router.put('/:id', auth, async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id, user: req.user.id });
    if (!category) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }
    if (req.body.name !== undefined) category.name = req.body.name;
    if (req.body.color !== undefined) category.color = req.body.color;
    await category.save();
    res.json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur lors de la modification' });
  }
});

// Delete a category
router.delete('/:id', auth, async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id, user: req.user.id });
    if (!category) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }
    await Category.deleteOne({ _id: req.params.id });
    res.json({ message: 'Catégorie supprimée' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression' });
  }
});

module.exports = router;
