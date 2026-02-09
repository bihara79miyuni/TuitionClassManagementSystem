let classModal;

document.addEventListener("DOMContentLoaded", () => {
  seed();
  requireAuth();
  initToast();
  initNavbar("dashboard");

  classModal = new bootstrap.Modal($("classModal"));

  $("btnOpenClassModal").addEventListener("click", () => {
    $("classModalTitle").textContent = "Add New Class";
    $("classId").value = "";
    $("classForm").reset();
    classModal.show();
  });

  $("classSearch").addEventListener("input", drawClassesTable);
  $("teacherFilter").addEventListener("change", drawClassesTable);

  $("classForm").addEventListener("submit", (e) => {
    e.preventDefault();
    saveClass();
  });

  renderDashboard();
});

function renderDashboard() {
  const classes = readLS(LS_KEYS.classes, []);
  const studentsByClass = readLS(LS_KEYS.studentsByClass, {});
  const payments = readLS(LS_KEYS.payments, []);

  $("statClasses").textContent = classes.length;

  let studentCount = 0;
  for (const cid of Object.keys(studentsByClass)) studentCount += (studentsByClass[cid] || []).length;
  $("statStudents").textContent = studentCount;

  $("statUnpaid").textContent = payments.filter(p => p.status === "Unpaid").length;

  const teacherFilter = $("teacherFilter");
  const teachers = [...new Set(classes.map(c => c.teacher))].sort();
  teacherFilter.innerHTML = `<option value="">All teachers</option>` + teachers.map(t => `<option>${escapeHtml(t)}</option>`).join("");

  drawClassesTable();
}

function drawClassesTable() {
  const classes = readLS(LS_KEYS.classes, []);
  const q = ($("classSearch").value || "").toLowerCase().trim();
  const teacher = $("teacherFilter").value || "";

  const filtered = classes.filter(c => {
    const okQ = !q || (c.name.toLowerCase().includes(q) || c.teacher.toLowerCase().includes(q));
    const okT = !teacher || c.teacher === teacher;
    return okQ && okT;
  });

  const tbody = $("classesTbody");
  tbody.innerHTML = "";

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center text-secondary py-4">No classes found</td></tr>`;
    return;
  }

  for (const c of filtered) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="fw-semibold">${escapeHtml(c.name)}</td>
      <td>${escapeHtml(c.teacher)}</td>
      <td>${escapeHtml(c.time)}</td>
      <td>${formatMoney(c.fee)}</td>
      <td class="text-end">
        <button class="btn btn-outline-secondary btn-sm action-btn me-1" data-act="edit" data-id="${c.id}">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn btn-outline-danger btn-sm action-btn" data-act="del" data-id="${c.id}">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  }

  tbody.querySelectorAll("button[data-act]").forEach(btn => {
    btn.addEventListener("click", () => {
      const act = btn.dataset.act;
      const id = btn.dataset.id;
      if (act === "edit") openEditClass(id);
      if (act === "del") deleteClass(id);
    });
  });
}

function openEditClass(id) {
  const classes = readLS(LS_KEYS.classes, []);
  const c = classes.find(x => x.id === id);
  if (!c) return;

  $("classModalTitle").textContent = "Edit Class";
  $("classId").value = c.id;
  $("className").value = c.name;
  $("classTeacher").value = c.teacher;
  $("classTime").value = c.time;
  $("classFee").value = c.fee;
  classModal.show();
}

function saveClass() {
  const id = $("classId").value;
  const name = $("className").value.trim();
  const teacher = $("classTeacher").value.trim();
  const time = $("classTime").value.trim();
  const fee = Number($("classFee").value || 0);

  if (!name || !teacher || !time) return showToast("Fill all fields");
  if (fee < 0) return showToast("Invalid fee");

  const classes = readLS(LS_KEYS.classes, []);
  if (id) {
    const c = classes.find(x => x.id === id);
    if (!c) return;
    c.name = name; c.teacher = teacher; c.time = time; c.fee = fee;
    showToast("Class updated");
  } else {
    const newId = uid();
    classes.push({ id: newId, name, teacher, time, fee });

    const map = readLS(LS_KEYS.studentsByClass, {});
    map[newId] = [];
    writeLS(LS_KEYS.studentsByClass, map);

    showToast("Class added");
  }

  writeLS(LS_KEYS.classes, classes);
  classModal.hide();
  renderDashboard();
}

function deleteClass(id) {
  if (!confirm("Delete this class?")) return;

  let classes = readLS(LS_KEYS.classes, []);
  classes = classes.filter(c => c.id !== id);
  writeLS(LS_KEYS.classes, classes);

  const map = readLS(LS_KEYS.studentsByClass, {});
  delete map[id];
  writeLS(LS_KEYS.studentsByClass, map);

  let payments = readLS(LS_KEYS.payments, []);
  payments = payments.filter(p => p.classId !== id);
  writeLS(LS_KEYS.payments, payments);

  showToast("Class deleted");
  renderDashboard();
}
