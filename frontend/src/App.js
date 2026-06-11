import React, { useState, useEffect } from 'react';
import api from './axiosConfig';
import AuthForm from './components/AuthForm';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import CategoryManager from './components/CategoryManager';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);
  const [showCategories, setShowCategories] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        try {
          const [tasksRes, catsRes, userRes] = await Promise.all([
            api.get('/tasks'),
            api.get('/categories'),
            api.get('/auth/me'),
          ]);
          setTasks(tasksRes.data);
          setCategories(catsRes.data);
          setUser(userRes.data);
        } catch (err) {
          console.error('Erreur lors de la récupération des données:', err);
          setToken('');
          localStorage.removeItem('token');
          setUser(null);
          setTasks([]);
          setCategories([]);
        }
      }
    };
    fetchUserData();
  }, [token]);

  const logout = () => {
    setToken('');
    localStorage.removeItem('token');
    setTasks([]);
    setCategories([]);
    setUser(null);
  };

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col bg-body-bg">
        <Header onLogout={logout} tasks={[]} user={null} />
        <main className="flex-grow pt-16">
          <AuthForm setToken={setToken} setUser={setUser} />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-body-bg">
      <Header onLogout={logout} tasks={tasks} user={user} />
      <main className="flex-grow pt-16 container mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-header-bg">Ma To-Do List</h1>
          <button
            onClick={() => setShowCategories(!showCategories)}
            className="btn btn-outline btn-sm"
          >
            {showCategories ? 'Masquer les catégories' : 'Gérer les catégories'}
          </button>
        </div>
        {showCategories && (
          <CategoryManager categories={categories} setCategories={setCategories} />
        )}
        <TaskForm setTasks={setTasks} categories={categories} />
        <TaskList tasks={tasks} setTasks={setTasks} categories={categories} />
      </main>
      <Footer />
    </div>
  );
}

export default App;