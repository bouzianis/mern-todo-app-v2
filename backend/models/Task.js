const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
  dueDate: { type: Date, default: null },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Task", taskSchema);
