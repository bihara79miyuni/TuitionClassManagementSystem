document.addEventListener("DOMContentLoaded", () => {
  seed();
  requireAuth();
  initToast();
  initNavbar("payment");

  fillClassSelect($("payClassSelect"));

  $("payClassSelect").addEventListener("change", drawPaymentTable);
  $("payStatusFilter").addEventListener("change", drawPaymentTable);
  $("paySearch").addEventListener("input", drawPaymentTable);

  $("btnAddUnpaid").addEventListener("click", addUnpaid);
  $("btnConfirmPay").addEventListener("click", confirmPayment);

  drawPaymentTable();
});

function drawPaymentTable() {
  const payments = readLS(LS_KEYS.payments, []);
  const status = $("payStatusFilter").value;
  const q = ($("paySearch").value || "").toLowerCase().trim();

  const tbody = $("paymentTbody");
  tbody.innerHTML = "";

  const filtered = payments.filter(p => {
    const okS = !status || p.status === status;
    const okQ = !q || p.student.toLowerCase().includes(q) || getClassNameById(p.classId).toLowerCase().includes(q);
    return okS && okQ;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center text-secondary py-4">No payments found</td></tr>`;
    return;
  }

  for (const p of filtered) {
    const badge = p.status === "Paid" ? "text-bg-success" : "text-bg-warning";
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="fw-semibold">${escapeHtml(p.student)}</td>
      <td>${escapeHtml(getClassNameById(p.classId))}</td>
      <td>${escapeHtml(p.month)}</td>
      <td>${formatMoney(p.amount)}</td>
      <td><span class="badge ${badge}">${escapeHtml(p.status)}</span></td>
      <td>${escapeHtml(p.type || "-")}</td>
      <td class="text-end">
        ${
          p.status === "Unpaid"
            ? `<button class="btn btn-dark btn-sm action-btn" data-act="paid" data-id="${p.id}">Pay</button>`
            : `<button class="btn btn-outline-secondary btn-sm action-btn" data-act="undo" data-id="${p.id}">Undo</button>`
        }
        <button class="btn btn-outline-danger btn-sm action-btn ms-1" data-act="del" data-id="${p.id}">
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
      if (act === "paid") markPaid(id);
      if (act === "undo") markUnpaid(id);
      if (act === "del") deletePayment(id);
    });
  });
}

function addUnpaid() {
  const classId = $("payClassSelect").value;
  const month = $("payMonthSelect").value;
  const student = ($("payStudentName").value || "").trim();
  const amount = Number($("payAmount").value || 0);
  const type = $("payType").value;

  if (!classId) return showToast("Select class");
  if (!month) return showToast("Select month");
  if (!student) return showToast("Enter student name");
  if (!amount || amount < 0) return showToast("Enter valid amount");

  const payments = readLS(LS_KEYS.payments, []);
  payments.push({ id: uid(), student, classId, month, amount, status: "Unpaid", type, paidAt: null });
  writeLS(LS_KEYS.payments, payments);

  $("payStudentName").value = "";
  $("payAmount").value = "";
  showToast("Marked Unpaid");
  drawPaymentTable();
}

function confirmPayment() {
  const classId = $("payClassSelect").value;
  const month = $("payMonthSelect").value;
  const student = ($("payStudentName").value || "").trim();
  const amount = Number($("payAmount").value || 0);
  const type = $("payType").value;

  if (!classId) return showToast("Select class");
  if (!month) return showToast("Select month");
  if (!student) return showToast("Enter student name");

  const payments = readLS(LS_KEYS.payments, []);
  let rec = payments.find(p =>
    p.status === "Unpaid" &&
    p.classId === classId &&
    p.month === month &&
    p.student.toLowerCase() === student.toLowerCase()
  );

  if (!rec) {
    if (!amount || amount <= 0) return showToast("Enter amount (no unpaid record found)");
    rec = { id: uid(), student, classId, month, amount, status: "Paid", type, paidAt: new Date().toISOString() };
    payments.push(rec);
  } else {
    rec.status = "Paid";
    rec.type = type;
    rec.paidAt = new Date().toISOString();
    if (amount && amount > 0) rec.amount = amount;
  }

  writeLS(LS_KEYS.payments, payments);
  $("payStudentName").value = "";
  $("payAmount").value = "";
  showToast("Payment confirmed");
  drawPaymentTable();
}

function markPaid(id) {
  const payments = readLS(LS_KEYS.payments, []);
  const p = payments.find(x => x.id === id);
  if (!p) return;
  p.status = "Paid";
  p.paidAt = new Date().toISOString();
  writeLS(LS_KEYS.payments, payments);
  showToast("Marked Paid");
  drawPaymentTable();
}

function markUnpaid(id) {
  const payments = readLS(LS_KEYS.payments, []);
  const p = payments.find(x => x.id === id);
  if (!p) return;
  p.status = "Unpaid";
  p.paidAt = null;
  writeLS(LS_KEYS.payments, payments);
  showToast("Set Unpaid");
  drawPaymentTable();
}

function deletePayment(id) {
  if (!confirm("Delete this record?")) return;
  let payments = readLS(LS_KEYS.payments, []);
  payments = payments.filter(p => p.id !== id);
  writeLS(LS_KEYS.payments, payments);
  showToast("Deleted");
  drawPaymentTable();
}
