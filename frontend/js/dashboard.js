const API_BASE = "http://localhost:5000"; // backend URL

const taskList = document.getElementById("taskList");
const taskForm = document.getElementById("taskForm");

// Fetch and display tasks
async function loadTasks() {
  try {
    const res = await fetch(`${API_BASE}/api/tasks`, {
      method: "GET",
      credentials: "include"  // ✅ ensure session cookie is sent
    });
    
    if (res.status === 401) {
      alert("You are not logged in. Redirecting to login...");
      window.location.href = "login.html";
      return;
    }
    
    if (!res.ok) {
      const data = await res.json();
      alert(data.message || "Failed to load tasks");
      return;
    }
    
    const tasks = await res.json();
    console.log("Loaded tasks:", tasks);

    taskList.innerHTML = "";
    if (tasks.length === 0) {
      taskList.innerHTML = "<li>No tasks yet. Add your first task above!</li>";
      return;
    }
    
    tasks.forEach(task => {
      const li = document.createElement("li");
      li.textContent = `${task.title} (${task.priority})`;

      // priority colors
      if (task.priority === "low") li.style.color = "green";
      if (task.priority === "medium") li.style.color = "orange";
      if (task.priority === "high") li.style.color = "red";

      // delete button
      const delBtn = document.createElement("button");
      delBtn.textContent = "Delete";
      delBtn.onclick = async () => {
        try {
          const deleteRes = await fetch(`${API_BASE}/api/tasks/${task._id}`, {
            method: "DELETE",
            credentials: "include"
          });
          
          if (deleteRes.ok) {
            loadTasks();
          } else {
            const deleteData = await deleteRes.json();
            alert(deleteData.message || "Failed to delete task");
          }
        } catch (err) {
          console.error("Error deleting task:", err);
          alert("Error deleting task");
        }
      };

      li.appendChild(delBtn);
      taskList.appendChild(li);
    });
  } catch (err) {
    console.error("Error loading tasks:", err);
    alert("Error loading tasks. Please refresh the page.");
  }
}

// Add task
taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("taskTitle").value.trim();
  const priority = document.getElementById("priority").value;

  if (!title) {
    alert("Please enter a task title");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",   // ✅ must send cookie
      body: JSON.stringify({ title, priority })
    });

    const data = await res.json();
    
    if (res.ok) {
      taskForm.reset();
      loadTasks();
      alert("Task added successfully!");
    } else {
      alert(data.message || "Failed to add task");
    }
  } catch (err) {
    console.error("Error adding task:", err);
    alert("Error adding task. Please try again.");
  }
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", async () => {
  await fetch(`${API_BASE}/api/auth/logout`, {
    method: "POST",
    credentials: "include"  // ✅ logout clears session
  });
  window.location.href = "login.html";
});

// Load tasks on page load
loadTasks();
