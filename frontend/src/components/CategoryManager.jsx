import React, { useState } from "react";
import api from "../axiosConfig";

const COLORS = [
  "#6366f1", "#ec4899", "#f59e0b", "#10b981",
  "#3b82f6", "#ef4444", "#8b5cf6", "#06b6d4",
];

const CategoryManager = ({ categories, setCategories }) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState(COLORS[0]);

  const addCategory = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      const res = await api.post("/categories", { name: name.trim(), color });
      setCategories((prev) => [...prev, res.data]);
      setName("");
      setColor(COLORS[0]);
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors de l'ajout");
    }
  };

  const deleteCategory = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors de la suppression");
    }
  };

  const startEdit = (cat) => {
    setEditingId(cat._id);
    setEditName(cat.name);
    setEditColor(cat.color);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (id) => {
    if (!editName.trim()) return;
    try {
      const res = await api.put(`/categories/${id}`, {
        name: editName.trim(),
        color: editColor,
      });
      setCategories((prev) =>
        prev.map((c) => (c._id === id ? res.data : c))
      );
      setEditingId(null);
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors de la modification");
    }
  };

  return (
    <div className="card bg-base-100 shadow-lg p-4 mb-4">
      <h2 className="text-lg font-semibold text-base-content mb-3">
        Gerer les categories
      </h2>

      <form onSubmit={addCategory} className="flex gap-2 mb-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nouvelle categorie"
          required
          className="input input-bordered input-sm flex-1"
        />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-10 h-10 rounded cursor-pointer border-0 p-0"
          title="Choisir une couleur"
        />
        <button type="submit" className="btn btn-primary btn-sm">
          Ajouter
        </button>
      </form>

      {categories.length === 0 ? (
        <p className="text-sm text-base-content/50 text-center">
          Aucune categorie.
        </p>
      ) : (
        <div className="space-y-2">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="flex items-center justify-between p-2 rounded bg-base-200"
            >
              {editingId === cat._id ? (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="color"
                    value={editColor}
                    onChange={(e) => setEditColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                  />
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit(cat._id);
                      if (e.key === "Escape") cancelEdit();
                    }}
                    className="input input-bordered input-sm flex-1"
                    autoFocus
                  />
                  <button
                    onClick={() => saveEdit(cat._id)}
                    className="btn btn-success btn-xs"
                  >
                    OK
                  </button>
                  <button onClick={cancelEdit} className="btn btn-ghost btn-xs">
                    Annuler
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 rounded-full inline-block"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-sm font-medium text-base-content">
                      {cat.name}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => startEdit(cat)}
                      className="btn btn-info btn-xs"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => deleteCategory(cat._id)}
                      className="btn btn-error btn-xs"
                    >
                      Supprimer
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
