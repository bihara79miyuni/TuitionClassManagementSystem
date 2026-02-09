// ========= Shared Common =========
const LS_KEYS = {
  user: "tms_user",
  users: "tms_users",
  classes: "tms_classes",
  studentsByClass: "tms_studentsByClass",
  attendance: "tms_attendance",
  payments: "tms_payments",
};

const $ = (id) => document.getElementById(id);

function readLS(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function writeLS(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}
function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatMoney(n) {
  const num = Number(n || 0);
  return "Rs " + num.toLocaleString("en-LK");
}

function currentUser() {
  return readLS(LS_KEYS.user, null);
}
function setUser(user) {
  writeLS(LS_KEYS.user, user);
}
function logout() {
  localStorage.removeItem(LS_KEYS.user);
  window.location.href = "login.html";
}

// Toast (optional)
let toast;
function initToast() {
  const el = $("appToast");
  if (!el) return;
  toast = new bootstrap.Toast(el, { delay: 2200 });
}
function showToast(msg) {
  const t = $("toastText");
  if (t) t.textContent = msg;
  if (toast) toast.show();
  else alert(msg);
}

// Seed demo DB once
function seed() {
  const users = readLS(LS_KEYS.users, null);
  if (!users) {
    writeLS(LS_KEYS.users, [
      { username: "admin", password: "admin123", role: "admin", fullName: "Admin User", email: "admin@demo.com" },
      { username: "teacher", password: "teacher123", role: "teacher", fullName: "Teacher User", email: "teacher@demo.com" },
    ]);
  }

  const classes = readLS(LS_KEYS.classes, null);
  if (!classes) {
    writeLS(LS_KEYS.classes, [
      { id: uid(), name: "Grade 10 ICT", teacher: "Mr. A", time: "4.00-6.00", fee: 2500 },
      { id: uid(), name: "Grade 11 ICT", teacher: "Mr. B", time: "6.00-8.00", fee: 3000 },
    ]);
  }

  const studentsByClass = readLS(LS_KEYS.studentsByClass, null);
  if (!studentsByClass) {
    const cls = readLS(LS_KEYS.classes, []);
    const map = {};
    for (const c of cls) map[c.id] = ["John", "Toby"];
    writeLS(LS_KEYS.studentsByClass, map);
  }

  const payments = readLS(LS_KEYS.payments, null);
  if (!payments) {
    const cls = readLS(LS_KEYS.classes, []);
    writeLS(LS_KEYS.payments, [
      { id: uid(), student: "John", classId: cls[0]?.id, month: "February", amount: 2500, status: "Unpaid", type: "Cash", paidAt: null },
      { id: uid(), student: "Toby", classId: cls[0]?.id, month: "February", amount: 2500, status: "Unpaid", type: "Cash", paidAt: null },
      { id: uid(), student: "Hasi", classId: cls[1]?.id, month: "February", amount: 3000, status: "Unpaid", type: "Card", paidAt: null },
    ]);
  }
}

function requireAuth() {
  const u = currentUser();
  if (!u) window.location.href = "login.html";
}

function initNavbar(activePage) {
  // show user + logout
  const who = $("whoami");
  const btn = $("btnLogout");
  const u = currentUser();
  if (who && u) who.textContent = `${u.role.toUpperCase()}: ${u.username}`;
  if (btn) btn.addEventListener("click", logout);

  // active nav
  const map = {
    dashboard: "nav-dashboard",
    attendance: "nav-attendance",
    payment: "nav-payment",
    report: "nav-report",
  };
  const id = map[activePage];
  if (id && $(id)) $(id).classList.add("active");
}

function fillClassSelect(selectEl, includeAll = false) {
  const classes = readLS(LS_KEYS.classes, []);
  const opts = [];
  opts.push(includeAll ? `<option value="">All classes</option>` : `<option value="">Select Class...</option>`);
  for (const c of classes) opts.push(`<option value="${c.id}">${escapeHtml(c.name)}</option>`);
  selectEl.innerHTML = opts.join("");
  if (!includeAll && classes.length > 0) selectEl.value = classes[0].id;
}

function getClassNameById(id) {
  const classes = readLS(LS_KEYS.classes, []);
  return classes.find(c => c.id === id)?.name || "N/A";
}
