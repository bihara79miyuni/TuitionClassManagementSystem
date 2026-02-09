document.addEventListener("DOMContentLoaded", () => {
  seed();
  initToast();

  const u = currentUser();
  if (u) window.location.href = "admin-dashboard.html";

  $("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const username = $("loginUsername").value.trim();
    const password = $("loginPassword").value;

    const users = readLS(LS_KEYS.users, []);
    const user = users.find(x => x.username === username && x.password === password);
    if (!user) return showToast("Invalid username or password");

    setUser({ username: user.username, role: user.role, fullName: user.fullName });
    showToast("Login success");
    window.location.href = "admin-dashboard.html";
  });
});
