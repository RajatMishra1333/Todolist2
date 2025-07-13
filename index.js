const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(methodOverride('_method'));

mongoose.connect("mongodb+srv://backendUser:Rajat1333@cluster0.mq1hjpn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

const taskSchema = new mongoose.Schema({
  name: String,
});
const Task = mongoose.model("Task", taskSchema);

app.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.render("list", { tasks });
  } catch (err) {
    console.error("Error loading tasks:", err);
    res.status(500).send("Something went wrong.");
  }
});

app.post("/", async (req, res) => {
  const taskName = req.body.taskName.trim();
  if (taskName) {
    await Task.create({ name: taskName });
  }
  res.redirect("/");
});

app.put("/tasks/:id", async (req, res) => {
  try {
    const updatedText = req.body.updatedText.trim();
    if (updatedText) {
      await Task.findByIdAndUpdate(req.params.id, { name: updatedText });
    }
    res.redirect("/");
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).send("Failed to update task.");
  }
});

app.delete("/tasks/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).send("Failed to delete task.");
  }
});

app.listen(3000, () => {
  console.log("Server running");
});
