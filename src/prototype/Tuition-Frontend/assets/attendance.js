document.addEventListener("DOMContentLoaded", () => {
  seed();
  requireAuth();
  initToast();
  initNavbar("attendance");

  fillClassSelect($("attClassSelect"));

  const today = new Date();
  $("attDate").value = today.toISOString().slice(0, 10);

  $("attClassSelect").addEventListener("change", drawAttendanceTable);
  $("attDate").addEventListener("change", drawAttendanceTable);

  $("btnSaveAttendance").addEventListener("click", saveAttendance);
  $("btnAddStudentToClass").addEventListener("click", addStudentToClass);

  drawAttendanceTable();
});

function drawAttendanceTable() {
  const classId = $("attClassSelect").value;
  const date = $("attDate").value;

  const classes = readLS(LS_KEYS.classes, []);
  const selected = classes.find(c => c.id === classId);
  $("attendanceSubtitle").textContent = selected ? `Attendance - ${selected.name} | Date: ${date}` : "Select class & date";

  const studentsByClass = readLS(LS_KEYS.studentsByClass, {});
  const students = studentsByClass[classId] || [];

  const attendanceDB = readLS(LS_KEYS.attendance, {});
  const key = `${classId}__${date}`;
  const saved = attendanceDB[key] || {};

  const tbody = $("attendanceTbody");
  tbody.innerHTML = "";

  if (!classId) {
    tbody.innerHTML = `<tr><td colspan="3" class="text-center text-secondary py-4">Select a class</td></tr>`;
    return;
  }
  if (students.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3" class="text-center text-secondary py-4">No students in this class</td></tr>`;
    return;
  }

  for (const s of students) {
    const state = saved[s] || "Present";
    const safeName = s.replaceAll('"', "").replaceAll("'", "").replaceAll(" ", "_");
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="fw-semibold">${escapeHtml(s)}</td>
      <td class="text-center">
        <input class="form-check-input" type="radio" name="att_${safeName}" value="Present" ${state === "Present" ? "checked" : ""}>
      </td>
      <td class="text-center">
        <input class="form-check-input" type="radio" name="att_${safeName}" value="Absent" ${state === "Absent" ? "checked" : ""}>
      </td>
    `;
    tbody.appendChild(tr);
  }
}

function saveAttendance() {
  const classId = $("attClassSelect").value;
  const date = $("attDate").value;
  if (!classId || !date) return showToast("Select class and date");

  const studentsByClass = readLS(LS_KEYS.studentsByClass, {});
  const students = studentsByClass[classId] || [];

  const record = {};
  for (const s of students) {
    const safeName = s.replaceAll('"', "").replaceAll("'", "").replaceAll(" ", "_");
    const checked = document.querySelector(`input[name="att_${safeName}"]:checked`);
    record[s] = checked ? checked.value : "Present";
  }

  const attendanceDB = readLS(LS_KEYS.attendance, {});
  attendanceDB[`${classId}__${date}`] = record;
  writeLS(LS_KEYS.attendance, attendanceDB);
  showToast("Attendance saved");
}

function addStudentToClass() {
  const classId = $("attClassSelect").value;
  const name = ($("attNewStudentName").value || "").trim();
  if (!classId) return showToast("Select a class first");
  if (!name) return showToast("Enter student name");

  const map = readLS(LS_KEYS.studentsByClass, {});
  map[classId] = map[classId] || [];
  if (map[classId].some(x => x.toLowerCase() === name.toLowerCase())) return showToast("Student already exists");

  map[classId].push(name);
  writeLS(LS_KEYS.studentsByClass, map);
  $("attNewStudentName").value = "";
  drawAttendanceTable();
  showToast("Student added");
}
