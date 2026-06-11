const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');

// Récupérer les tâches de l'utilisateur connecté
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).populate('category');
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Ajouter une tâche
router.post('/', auth, async (req, res) => {
  try {
    const task = new Task({
      title: req.body.title,
      category: req.body.category || null,
      dueDate: req.body.dueDate || null,
      user: req.user.id,
    });
    await task.save();
    const populated = await task.populate('category');
    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Modifier une tâche
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée ou non autorisée' });
    }
    if (req.body.title !== undefined) task.title = req.body.title;
    if (req.body.completed !== undefined) task.completed = req.body.completed;
    if (req.body.category !== undefined) task.category = req.body.category || null;
    if (req.body.dueDate !== undefined) task.dueDate = req.body.dueDate || null;
    await task.save();
    const populated = await task.populate('category');
    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur lors de la modification' });
  }
});

// Supprimer une tâche
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée ou non autorisée' });
    }
    await Task.deleteOne({ _id: req.params.id });
    res.json({ message: 'Tâche supprimée' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression' });
  }
});

module.exports = router;