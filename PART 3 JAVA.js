"use strict";

const $ = (id) => document.getElementById(id);

/* ---------- SAMPLE DATA (fictional, in memory only) ---------- */

let patients = [
  { id: "DEMO-001", name: "Juan Dela Cruz", grade: "Grade 11 - Sampaguita", lastVisit: "2026-10-06" },
  { id: "DEMO-002", name: "Maria Santos",   grade: "Grade 10 - Rosal",      lastVisit: "2026-10-05" },
  { id: "DEMO-003", name: "Alex Reyes",     grade: "Grade 12 - Gumamela",   lastVisit: "2026-10-04" },
  { id: "DEMO-004", name: "Ana Garcia",     grade: "Grade 9 - Dahlia",      lastVisit: "2026-10-03" }
];

let staff = [
  { name: "Nurse Lourdes Ramos", role: "School Nurse",  schedule: "Mon–Fri, 8:00 AM – 4:00 PM" },
  { name: "Dr. Paolo Mendoza",   role: "School Doctor", schedule: "Tue & Thu, 9:00 AM – 1:00 PM" },
  { name: "Dr. Grace Villanueva", role: "Dentist",      schedule: "Wed, 9:00 AM – 3:00 PM" }
];

let appointments = [
  { patientId: "DEMO-001", date: "2026-10-22", purpose: "General Consultation", status: "Scheduled" },
  { patientId: "DEMO-002", date: "2026-10-26", purpose: "Dental Check-up",      status: "Scheduled" }
];

/* ---------- HELPERS ---------- */

// Safe helper for creating table cells (uses textContent, never innerHTML).
function addCell(row, value) {
  const cell = document.createElement("td");
  cell.textContent = String(value ?? "");
  row.appendChild(cell);
  return cell;
}

function makeBadge(text) {
  const badge = document.createElement("span");
  badge.className = "badge";
  badge.textContent = text;
  return badge;
}

// Local date as YYYY-MM-DD (toISOString() uses UTC, which is off by a day
// early in the morning in the Philippines).
function todayLocal() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return d.getFullYear() + "-" + month + "-" + day;
}

/* ---------- LOGIN / LOGOUT ---------- */

$("loginForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const username = $("username").value.trim();
  const password = $("password").value;

  if (username === "admin" && password === "clinic123") {
    $("loginError").textContent = "";
    $("loginPage").classList.add("hidden");
    $("appShell").classList.remove("hidden");

    renderAll();
    showPage("dashboard");
  } else {
    $("loginError").textContent =
      "Incorrect username or password. Try the demo login.";
  }
});

$("logoutBtn").addEventListener("click", function () {
  $("appShell").classList.add("hidden");
  $("loginPage").classList.remove("hidden");
  $("loginForm").reset();
});

/* ---------- NAVIGATION ---------- */

const pageTitles = {
  dashboard: "Dashboard",
  patients: "Patient Information",
  staff: "Staff",
  appointments: "Appointments"
};

const pageNames = Object.keys(pageTitles);

function showPage(pageName) {
  if (!pageNames.includes(pageName)) return;

  pageNames.forEach((name) => {
    $(name + "Page").classList.toggle("hidden", name !== pageName);
  });

  document.querySelectorAll(".nav-item").forEach((button) => {
    button.classList.toggle("active", button.dataset.page === pageName);
  });

  $("pageTitle").textContent = pageTitles[pageName];
}

document.querySelectorAll(".nav-item").forEach((button) => {
  button.addEventListener("click", () => showPage(button.dataset.page));
});

document.querySelectorAll("[data-go]").forEach((button) => {
  button.addEventListener("click", () => showPage(button.dataset.go));
});

/* ---------- DASHBOARD ---------- */

function renderDashboard() {
  $("statPatients").textContent = patients.length;
  $("statStaff").textContent = staff.length;
  $("statAppointments").textContent = appointments.length;

  const tbody = $("recentPatients");
  tbody.replaceChildren();

  patients.slice(0, 5).forEach((patient) => {
    const row = document.createElement("tr");
    addCell(row, patient.name);
    addCell(row, patient.id);
    addCell(row, patient.grade);
    addCell(row, patient.lastVisit);
    tbody.appendChild(row);
  });
}

/* ---------- PATIENTS ---------- */

function renderPatients(searchTerm = "") {
  const tbody = $("patientsTable");
  tbody.replaceChildren();

  const term = searchTerm.trim().toLowerCase();

  const results = patients.filter((patient) =>
    patient.name.toLowerCase().includes(term) ||
    patient.id.toLowerCase().includes(term)
  );

  results.forEach((patient) => {
    const row = document.createElement("tr");
    addCell(row, patient.name);
    addCell(row, patient.id);
    addCell(row, patient.grade);
    addCell(row, patient.lastVisit);

    const actionCell = addCell(row, "");
    const viewButton = document.createElement("button");
    viewButton.type = "button";
    viewButton.className = "outline";
    viewButton.textContent = "View";
    viewButton.addEventListener("click", function () {
      alert(
        "SAMPLE PATIENT PROFILE\n\n" +
        "Name: " + patient.name + "\n" +
        "Student ID: " + patient.id + "\n" +
        "Grade / Section: " + patient.grade + "\n" +
        "Last Visit: " + patient.lastVisit +
        "\n\nThis prototype displays basic profile information only."
      );
    });

    actionCell.appendChild(viewButton);
    tbody.appendChild(row);
  });

  $("emptyPatients").classList.toggle("hidden", results.length > 0);
}

$("patientSearch").addEventListener("input", function () {
  renderPatients(this.value);
});

$("addPatientBtn").addEventListener("click", function () {
  $("patientForm").reset();
  $("patientDialog").showModal();
});

$("patientForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const name = $("patientName").value.trim();
  const id = $("studentId").value.trim();
  const grade = $("gradeSection").value.trim();

  if (!name || !id || !grade) {
    alert("Please complete all required fields.");
    return;
  }

  const duplicate = patients.some(
    (patient) => patient.id.toLowerCase() === id.toLowerCase()
  );

  if (duplicate) {
    alert("This Student ID already exists in the sample list.");
    return;
  }

  patients.push({ id, name, grade, lastVisit: "No visit recorded" });

  $("patientDialog").close();
  renderAll();
  showPage("patients");
});

/* ---------- STAFF ---------- */

function renderStaff(searchTerm = "") {
  const tbody = $("staffTable");
  tbody.replaceChildren();

  const term = searchTerm.trim().toLowerCase();

  const results = staff.filter((member) =>
    member.name.toLowerCase().includes(term) ||
    member.role.toLowerCase().includes(term)
  );

  results.forEach((member) => {
    const row = document.createElement("tr");
    addCell(row, member.name);

    const roleCell = addCell(row, "");
    roleCell.appendChild(makeBadge(member.role));

    addCell(row, member.schedule);

    const actionCell = addCell(row, "");
    const viewButton = document.createElement("button");
    viewButton.type = "button";
    viewButton.className = "outline";
    viewButton.textContent = "View";
    viewButton.addEventListener("click", function () {
      alert(
        "SAMPLE STAFF PROFILE\n\n" +
        "Name: " + member.name + "\n" +
        "Role: " + member.role + "\n" +
        "Schedule: " + member.schedule
      );
    });

    actionCell.appendChild(viewButton);
    tbody.appendChild(row);
  });

  $("emptyStaff").classList.toggle("hidden", results.length > 0);
}

$("staffSearch").addEventListener("input", function () {
  renderStaff(this.value);
});

$("addStaffBtn").addEventListener("click", function () {
  $("staffForm").reset();
  $("staffDialog").showModal();
});

$("staffForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const name = $("staffName").value.trim();
  const role = $("staffRole").value;
  const schedule = $("staffSchedule").value.trim();

  if (!name || !role || !schedule) {
    alert("Please complete all required fields.");
    return;
  }

  const duplicate = staff.some(
    (member) =>
      member.name.toLowerCase() === name.toLowerCase() &&
      member.role === role
  );

  if (duplicate) {
    alert("This staff member already exists in the sample list.");
    return;
  }

  staff.push({ name, role, schedule });

  $("staffDialog").close();
  renderAll();
  showPage("staff");
});

/* ---------- APPOINTMENTS ---------- */

function fillPatientSelect(selectId) {
  const select = $(selectId);
  select.replaceChildren();

  patients.forEach((patient) => {
    const option = document.createElement("option");
    option.value = patient.id;
    option.textContent = patient.name + " (" + patient.id + ")";
    select.appendChild(option);
  });

  select.disabled = patients.length === 0;
}

function renderAppointments() {
  const tbody = $("appointmentsTable");
  tbody.replaceChildren();

  appointments.forEach((appointment) => {
    const patient = patients.find((item) => item.id === appointment.patientId);
    const row = document.createElement("tr");

    addCell(row, patient ? patient.name : "Sample patient");
    addCell(row, appointment.date);
    addCell(row, appointment.purpose);

    const statusCell = addCell(row, "");
    statusCell.appendChild(makeBadge(appointment.status));

    tbody.appendChild(row);
  });
}

$("addAppointmentBtn").addEventListener("click", function () {
  if (patients.length === 0) {
    alert("Add a sample patient first.");
    return;
  }

  fillPatientSelect("appointmentPatient");
  $("appointmentDate").value = "";
  $("appointmentDate").min = todayLocal();
  $("appointmentDialog").showModal();
});

$("appointmentForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const patientId = $("appointmentPatient").value;
  const date = $("appointmentDate").value;
  const purpose = $("appointmentPurpose").value;

  if (!patientId || !date || !purpose) {
    alert("Please complete all required fields.");
    return;
  }

  if (date < todayLocal()) {
    alert("Choose today or a future appointment date.");
    return;
  }

  const duplicate = appointments.some(
    (appointment) =>
      appointment.patientId === patientId &&
      appointment.date === date &&
      appointment.purpose === purpose
  );

  if (duplicate) {
    alert("This appointment already exists.");
    return;
  }

  appointments.push({ patientId, date, purpose, status: "Scheduled" });

  $("appointmentDialog").close();
  renderAll();
  showPage("appointments");
});

/* ---------- CLOSE DIALOG BUTTONS ---------- */

document.querySelectorAll("[data-close]").forEach((button) => {
  button.addEventListener("click", function () {
    const dialog = $(button.dataset.close);
    if (dialog) dialog.close();
  });
});

/* ---------- UPDATE ALL DISPLAYS ---------- */

function renderAll() {
  renderDashboard();
  renderPatients($("patientSearch").value);
  renderStaff($("staffSearch").value);
  renderAppointments();
}

// No data is saved to a permanent database in this demo.