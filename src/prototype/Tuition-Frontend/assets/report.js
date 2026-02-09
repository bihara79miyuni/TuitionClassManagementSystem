document.addEventListener("DOMContentLoaded", () => {
  seed();
  requireAuth();
  initToast();
  initNavbar("report");

  fillClassSelect($("reportClass"), true);

  const now = new Date();
  $("reportTo").value = now.toISOString().slice(0, 10);
  const from = new Date(now.getTime() - 7 * 86400000);
  $("reportFrom").value = from.toISOString().slice(0, 10);

  $("btnGenerateReport").addEventListener("click", generateReport);
  $("btnExportExcel").addEventListener("click", exportExcelCSV);
  $("btnExportPdf").addEventListener("click", exportPdfPrint);

  clearReport();
});

function clearReport() {
  $("reportHeadRow").innerHTML = "";
  $("reportBody").innerHTML = `<tr><td class="text-center text-secondary py-4">No data</td></tr>`;
}

function generateReport() {
  const type = $("reportType").value;
  const classId = $("reportClass").value;
  const from = $("reportFrom").value;
  const to = $("reportTo").value;

  if (!type) return showToast("Select report type");

  if (type === "classwise") {
    const studentsByClass = readLS(LS_KEYS.studentsByClass, {});
    const classes = readLS(LS_KEYS.classes, []);
    const classList = classId ? classes.filter(c => c.id === classId) : classes;

    const rows = [];
    for (const c of classList) {
      const studs = studentsByClass[c.id] || [];
      for (const s of studs) rows.push([c.name, s]);
    }
    drawReportTable(["Class", "Student"], rows);
    showToast("Class-wise report generated");
    return;
  }

  if (type === "payment") {
    const payments = readLS(LS_KEYS.payments, []);
    const rows = payments
      .filter(p => !classId || p.classId === classId)
      .map(p => [p.student, getClassNameById(p.classId), p.month, formatMoney(p.amount), p.status, p.type || "-"]);

    drawReportTable(["Student", "Class", "Month", "Amount", "Status", "Type"], rows);
    showToast("Payment report generated");
    return;
  }

  if (type === "attendance") {
    const attendanceDB = readLS(LS_KEYS.attendance, {});
    const rows = [];

    for (const key of Object.keys(attendanceDB)) {
      const [cid, date] = key.split("__");
      if (classId && cid !== classId) continue;
      if (from && date < from) continue;
      if (to && date > to) continue;

      const rec = attendanceDB[key];
      let present = 0, absent = 0;
      for (const name of Object.keys(rec)) {
        if (rec[name] === "Present") present++;
        else absent++;
      }
      rows.push([date, getClassNameById(cid), present, absent]);
    }

    drawReportTable(["Date", "Class", "Present", "Absent"], rows);
    showToast(rows.length ? "Attendance report generated" : "No attendance records in range");
  }
}

function drawReportTable(headers, rows) {
  $("reportHeadRow").innerHTML = headers.map(h => `<th>${escapeHtml(h)}</th>`).join("");
  const body = $("reportBody");
  body.innerHTML = "";

  if (rows.length === 0) {
    body.innerHTML = `<tr><td colspan="${headers.length}" class="text-center text-secondary py-4">No data</td></tr>`;
    return;
  }

  for (const r of rows) {
    const tr = document.createElement("tr");
    tr.innerHTML = r.map(cell => `<td>${escapeHtml(String(cell))}</td>`).join("");
    body.appendChild(tr);
  }
}

function tableToCSV(table) {
  const rows = [...table.querySelectorAll("tr")];
  return rows.map(row => {
    const cols = [...row.querySelectorAll("th,td")];
    return cols.map(c => `"${String(c.innerText).replaceAll('"', '""')}"`).join(",");
  }).join("\n");
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function exportExcelCSV() {
  const csv = tableToCSV($("reportTable"));
  downloadBlob(new Blob([csv], { type: "text/csv;charset=utf-8" }), "report.csv");
  showToast("CSV downloaded");
}

function exportPdfPrint() {
  const html = `
  <html>
    <head>
      <title>Report</title>
      <style>
        body{font-family: Arial, sans-serif; padding:20px;}
        table{border-collapse:collapse; width:100%;}
        th,td{border:1px solid #ddd; padding:8px;}
        th{background:#f5f5f5;}
      </style>
    </head>
    <body>
      <h2>Report</h2>
      ${$("reportTable").outerHTML}
      <script>window.print();<\/script>
    </body>
  </html>`;
  const w = window.open("", "_blank");
  w.document.open();
  w.document.write(html);
  w.document.close();
}
