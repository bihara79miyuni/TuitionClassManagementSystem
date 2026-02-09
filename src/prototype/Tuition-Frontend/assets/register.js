document.addEventListener("DOMContentLoaded", () => {
  seed();
  initToast();

  $("registerForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const fullName = $("regFullName").value.trim();
    const studentId = $("regStudentId").value.trim();
    const email = $("regEmail").value.trim();
    const phone = $("regPhone").value.trim();
    const username = $("regUsername").value.trim();
    const role = $("regRole").value;
    const p1 = $("regPassword").value;
    const p2 = $("regPassword2").value;

    if (p1 !== p2) return showToast("Passwords do not match");
    if (p1.length < 4) return showToast("Password too short");

    const users = readLS(LS_KEYS.users, []);
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      return showToast("Username already exists");
    }

    users.push({ username, password: p1, role, fullName, studentId, email, phone });
    writeLS(LS_KEYS.users, users);

    showToast("Registration success");
    window.location.href = "login.html";
  });
});
