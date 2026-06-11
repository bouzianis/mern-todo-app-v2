import React, { useState } from 'react';
import api from '../axiosConfig';

const TaskList = ({ tasks, setTasks, categories = [] }) => {
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDueDate, setEditDueDate] = useState('');

  const deleteTask = async (id) => {
    if (!id) return;
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const toggleCompleted = async (task) => {
    try {
      const res = await api.put(`/tasks/${task._id}`, { completed: !task.completed });
      setTasks((prev) => prev.map((t) => (t._id === task._id ? res.data : t)));
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de la modification');
    }
  };

  const isOverdue = (task) => {
    if (!task.dueDate || task.completed) return false;
    return new Date(task.dueDate) < new Date(new Date().toDateString());
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const startEdit = (task) => {
    setEditingId(task._id);
    setEditTitle(task.title);
    setEditCategory(task.category?._id || '');
    setEditDueDate(task.dueDate ? task.dueDate.split('T')[0] : '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditCategory('');
    setEditDueDate('');
  };

  const saveEdit = async (id) => {
    if (!editTitle.trim()) return;
    try {
      const res = await api.put(`/tasks/${id}`, {
        title: editTitle.trim(),
        category: editCategory || null,
        dueDate: editDueDate || null,
      });
      setTasks((prev) => prev.map((t) => (t._id === id ? res.data : t)));
      setEditingId(null);
      setEditTitle('');
      setEditCategory('');
      setEditDueDate('');
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de la modification');
    }
  };

  return (
    <div className="task-list mt-4">
      {tasks.length === 0 ? (
        <p className="text-center text-base-content/70">Aucune tâche pour le moment.</p>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow p-4 flex flex-row justify-between items-center"
            >
              <div className="flex items-center gap-3 flex-1">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleCompleted(task)}
                  className="checkbox checkbox-primary checkbox-sm"
                />
                {editingId === task._id ? (
                  <div className="flex-1 flex flex-col gap-2">
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit(task._id);
                        if (e.key === 'Escape') cancelEdit();
                      }}
                      className="input input-bordered input-sm"
                      autoFocus
                    />
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="select select-bordered select-sm"
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
                      value={editDueDate}
                      onChange={(e) => setEditDueDate(e.target.value)}
                      className="input input-bordered input-sm"
                    />
                  </div>
                ) : (
                  <div className="flex-1">
                    <h3 className={`text-lg font-medium text-base-content ${task.completed ? 'line-through opacity-50' : ''}`}>
                      {task.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <p className="text-sm text-base-content/60">
                        Ajoutée le {new Date(task.createdAt).toLocaleDateString()}
                      </p>
                      {task.category && (
                        <span
                          className="badge badge-sm text-white"
                          style={{ backgroundColor: task.category.color }}
                        >
                          {task.category.name}
                        </span>
                      )}
                      {task.dueDate && (
                        <span className={`badge badge-sm ${isOverdue(task) ? 'badge-error' : 'badge-warning'}`}>
                          {isOverdue(task) ? 'En retard' : 'Échéance'} {formatDate(task.dueDate)}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-2 ml-4">
                {editingId === task._id ? (
                  <>
                    <button
                      onClick={() => saveEdit(task._id)}
                      className="btn btn-success btn-sm"
                    >
                      Sauvegarder
                    </button>
                    <button onClick={cancelEdit} className="btn btn-ghost btn-sm">
                      Annuler
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit(task)}
                      className="btn btn-info btn-sm hover:btn-info/80"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => deleteTask(task._id)}
                      className="btn btn-error btn-sm hover:btn-error/80"
                    >
                      Supprimer
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;