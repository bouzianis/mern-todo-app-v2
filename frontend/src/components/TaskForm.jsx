import React, { useState } from "react";
import api from "../axiosConfig";

const TaskForm = ({ setTasks, categories = [] }) => {
  const [newTask, setNewTask] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTask) return;
    try {
      const payload = { title: newTask };
      if (selectedCategory) payload.category = selectedCategory;
      const res = await api.post("/tasks", payload);
      setTasks((prev) => [...prev, res.data]);
      setNewTask("");
      setSelectedCategory("");
    } catch (err) {
      alert("Erreur lors de l'ajout de la tâche");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form flex gap-2 mb-4 flex-wrap">
      <input
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Nouvelle tâche"
        required
        className="input input-bordered flex-1 min-w-0"
      />
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
      <button type="submit" className="btn btn-primary">
        Ajouter
      </button>
    </form>
  );
};

export default TaskForm;