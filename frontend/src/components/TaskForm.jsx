import React, { useState } from "react";
import api from "../axiosConfig";

const STATUS_OPTIONS = [
  { value: 'à faire', label: 'À faire' },
  { value: 'en cours', label: 'En cours' },
  { value: 'terminée', label: 'Terminée' },
];

const TaskForm = ({ setTasks, categories = [] }) => {
  const [newTask, setNewTask] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState('à faire');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTask) return;
    try {
      const payload = { title: newTask, status: selectedStatus };
      if (selectedCategory) payload.category = selectedCategory;
      if (dueDate) payload.dueDate = dueDate;
      const res = await api.post("/tasks", payload);
      setTasks((prev) => [...prev, res.data]);
      setNewTask("");
      setSelectedCategory("");
      setDueDate("");
      setSelectedStatus('à faire');
    } catch (err) {
      alert("Erreur lors de l'ajout de la tâche");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form flex gap-2 mb-4 flex-wrap items-end">
      <input
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Nouvelle tâche"
        required
        className="input input-bordered flex-1 min-w-0"
      />
      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
        className="select select-bordered select-sm w-36"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="select select-bordered select-sm w-48"
      >
        <option value="">Sans catégorie</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="input input-bordered input-sm w-44"
        title="Date d'échéance"
      />
      <button type="submit" className="btn btn-primary">
        Ajouter
      </button>
    </form>
  );
};

export default TaskForm;