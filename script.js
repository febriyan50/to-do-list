const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const categorySelect = document.getElementById("category");
const filterSelect = document.getElementById("filter");
const completedCounter = document.getElementById("completed-counter");
const uncompletedCounter = document.getElementById("uncompleted-counter");
const clearAllButton = document.getElementById("clear-all");
const colorPicker = document.getElementById("color-picker");

// Dark Mode Toggle
const darkModeButton = document.getElementById("dark-mode-toggle");
darkModeButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    });

// Simpan & Muat Tugas dari Local Storage
function saveTask() {
    const tasks = [];
    document.querySelectorAll("#list-container li").forEach((li) => {
        tasks.push({
            task: li.querySelector(".task-text").textContent,
            completed: li.classList.contains("completed"),
            category: li.dataset.category,
            color: li.style.backgroundColor,
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {            
    listContainer.innerHTML = ""; // Kosongkan daftar sebelum memuat ulang
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => addTask(task.task, task.completed, task.color, task.category, false));
    updateCounter();
}

// Tambah Tugas Baru
function addTask(taskText = null, completed = false, taskColor = null, taskCategory = null, save = true) {
    if (!taskText) {
        taskText = inputBox.value.trim();
        taskColor = colorPicker.value;
        taskCategory = categorySelect.value;

        if (!taskText) {
            alert("Tugas tidak boleh kosong!");
            return;
        }
    }

    const li = document.createElement("li");
    li.style.backgroundColor = taskColor;
    li.classList.add("task-item");
    li.dataset.category = taskCategory; // simpan kategori dalam atribut data

    li.innerHTML = `
    <label style="flex: 1; display: flex; align-items: center;">
        <input type="checkbox" class="task-checkbox" ${completed ? "checked" : ""}>
        <span class="task-text">${taskText} <small>(${taskCategory})</small></span>
    </label>
    <div class="button-group">
        <button class="edit-btn">✏️</button>
        <button class="delete-btn">❌</button>
    </div>
    `;

    if (completed) {
    li.classList.add("completed");
    }

    listContainer.appendChild(li);
    inputBox.value = "";

    if (save) saveTask();
    updateCounter(); // update jumlah tugas yang sudah/belum selesai

    // event listener untuk checkbox
    const checkbox = li.querySelector(".task-checkbox");
    checkbox.addEventListener("change",function () {
    li.classList.toggle("completed", checkbox.checked);
    saveTask();
    updateCounter();
    filterTasks(); // perbarui tampilan setelah mengubah status
    });

    // Edit Tugas
    li.querySelector(".edit-btn").addEventListener("click", function () {
    const newText = prompt("Edit Tugas", li.querySelector(".task-text").textContent);
    if (newText) {
        li.querySelector(".task-text").innerHTML = `${newText} <small>(${taskCategory})</small>`;
        saveTask();
    }
    });

    // Hapus Tugas
    li.querySelector(".delete-btn").addEventListener("click", function () {
        if (confirm("Hapus Tugas Ini?")) {
            li.remove();
            saveTask();
            updateCounter();
        }
    });

    filterTasks(); // pastikan filter tetap berlaku setelah menambahkan tugas
}

// Perbaiki fungsi filter tugas
function filterTasks() {
    const filterValue = filterSelect.value;
    document.querySelectorAll(".task-item").forEach(li => {
        const category = li.dataset.category;
        const isCompleted = li.classList.contains("completed");

        if (filterValue === "all" || category === filterValue) {
            li.style.display = "flex";
        } else {
            li.style.display = "none";
        }
    });
}

// Perbarui Jumlah Tugas yang Sudah/Belum Selesai
function updateCounter() {
    const totalTasks = document.querySelectorAll(".task-item").length;
    const completedTasks = document.querySelectorAll(".task-item.completed").length;
    const uncompletedTasks = totalTasks - completedTasks;

    completedCounter.innerText = completedTasks;
    uncompletedCounter.innerText = uncompletedTasks;
}

// event listener untuk filter
filterSelect.addEventListener("change", filterTasks);

// event listener untuk hapus semua
clearAllButton.addEventListener("click", () => {
    if (confirm("Hapus Semua Tugas ?")) {
        listContainer.innerHTML = "";
        localStorage.removeItem("tasks");
        updateCounter();
    }
});

// panggil fungsi untuk memuat tugas saat halaman di muat
loadTasks();
