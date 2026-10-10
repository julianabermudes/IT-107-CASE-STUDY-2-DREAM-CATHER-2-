
"use strict";

const $ = (id) => document.getElementById(id);

let patients = [
  {
    id: "DEMO-001",
    name: "Juan Dela Cruz",
    grade: "Grade 11 - Sampaguita",
    lastVisit: "2026-10-06"
  },
  {
    id: "DEMO-002",
    name: "Maria Santos",
    grade: "Grade 10 - Rosal",
    lastVisit: "2026-10-05"
  },
  {
    id: "DEMO-003",
    name: "Alex Reyes",
    grade: "Grade 12 - Gumamela",
    lastVisit: "2026-10-04"
  },
  {
    id: "DEMO-004",
    name: "Ana Garcia",
    grade: "Grade 9 - Dahlia",
    lastVisit: "2026-10-03"
  }
];

let consultations = [
  {
    patientId: "DEMO-001",
    date: "2026-10-06",
    type: "General Consultation"
  },
  {
    patientId: "DEMO-002",
    date: "2026-10-05",
    type: "First Aid"
  },
  {
    patientId: "DEMO-003",
    date: "2026-10-04",
    type: "Follow-up"
  }
];

let appointments = [
  {
    patientId: "DEMO-001",
    date: "2026-10-12",
    purpose: "General Consultation",
    status: "Scheduled"
  },
  {
    patientId: "DEMO-002",
    date: "2026-10-14",
    purpose: "Dental Check-up",
    status: "Scheduled"
  }
];

const serviceCategories = [
  "First Aid",
  "General Consultation",
  "Dental Check-up",
  "Hospital Referral"
];

// Safe helper for creating table cells.
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

// LOGIN
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

// LOGOUT
$("logoutBtn").addEventListener("click", function () {
  $("appShell").classList.add("hidden");
  $("loginPage").classList.remove("hidden");
  $("loginForm").reset();
});

// NAVIGATION
const pageNames = [
  "dashboard",
  "patients",
  "consultations",
  "services",
  "appointments"
];

const pageTitles = {
  dashboard: "Dashboard",
  patients: "Patient Information",
  consultations: "Consultations",
  services: "Medical Services",
  appointments: "Appointments"
};

function showPage(pageName) {
  if (!pageNames.includes(pageName)) return;

  pageNames.forEach((name) => {
    $(name + "Page").classList.toggle(
      "hidden",
      name !== pageName
    );
  });

  document.querySelectorAll(".nav-item").forEach((button) => {
    button.classList.toggle(
      "active",
      button.dataset.page === pageName
    );
  });

  $("pageTitle").textContent = pageTitles[pageName];
}

document.querySelectorAll(".nav-item").forEach((button) => {
  button.addEventListener("click", function () {
    showPage(button.dataset.page);
  });
});

document.querySelectorAll("[data-go]").forEach((button) => {
  button.addEventListener("click", function () {
    showPage(button.dataset.go);
  });
});

// DASHBOARD
function renderDashboard() {
  $("statPatients").textContent = patients.length;
  $("statConsultations").textContent = consultations.length;
  $("statServices").textContent = serviceCategories.length;
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

// PATIENT INFORMATION AND SEARCH
function renderPatients(searchTerm = "") {
  const tbody = $("patientsTable");
  tbody.replaceChildren();

  const term = searchTerm.trim().toLowerCase();

  const results = patients.filter((patient) => {
    return (
      patient.name.toLowerCase().includes(term) ||
      patient.id.toLowerCase().includes(term)
    );
  });

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

  $("emptyPatients").classList.toggle(
    "hidden",
    results.length > 0
  );
}

$("patientSearch").addEventListener("input", function () {
  renderPatients(this.value);
});

// ADD PATIENT
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

  const duplicate = patients.some((patient) => {
    return patient.id.toLowerCase() === id.toLowerCase();
  });

  if (duplicate) {
    alert("This Student ID already exists in the sample list.");
    return;
  }

  patients.push({
    id: id,
    name: name,
    grade: grade,
    lastVisit: "No visit recorded"
  });

  $("patientDialog").close();
  renderAll();
  showPage("patients");
});

// PATIENT DROPDOWN MENUS
function fillPatientSelect(selectId) {
  const select = $(selectId);
  select.replaceChildren();

  patients.forEach((patient) => {
    const option = document.createElement("option");

    option.value = patient.id;
    option.textContent =
      patient.name + " (" + patient.id + ")";

    select.appendChild(option);
  });

  select.disabled = patients.length === 0;
}

// CONSULTATIONS
function renderConsultations() {
  const list = $("consultationList");
  list.replaceChildren();

  if (consultations.length === 0) {
    const message = document.createElement("p");
    message.className = "muted";
    message.textContent = "No consultations have been added.";
    list.appendChild(message);
    return;
  }

  consultations.forEach((consultation) => {
    const patient = patients.find(
      (item) => item.id === consultation.patientId
    );

    const card = document.createElement("article");
    card.className = "record-card";

    const heading = document.createElement("h3");
    heading.textContent = patient
      ? patient.name
      : "Sample patient";

    const date = document.createElement("p");
    date.textContent = "Visit date: " + consultation.date;

    const category = document.createElement("p");
    category.textContent =
      "Consultation category: " + consultation.type;

    card.append(heading, date, category);
    list.appendChild(card);
  });
}

$("addConsultationBtn").addEventListener("click", function () {
  if (patients.length === 0) {
    alert("Add a sample patient first.");
    return;
  }

  fillPatientSelect("consultPatient");
  $("consultDate").value = new Date().toISOString().slice(0, 10);
  $("consultationDialog").showModal();
});

$("consultationForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const patientId = $("consultPatient").value;
  const date = $("consultDate").value;
  const type = $("consultType").value;
  const today = new Date().toISOString().slice(0, 10);

  if (!patientId || !date || !type) {
    alert("Please complete all required fields.");
    return;
  }

  if (date > today) {
    alert("The visit date cannot be in the future.");
    return;
  }

  consultations.unshift({
    patientId: patientId,
    date: date,
    type: type
  });

  const patient = patients.find(
    (item) => item.id === patientId
  );

  if (patient) {
    patient.lastVisit = date;
  }

  $("consultationDialog").close();
  renderAll();
});

// APPOINTMENTS
function renderAppointments() {
  const tbody = $("appointmentsTable");
  tbody.replaceChildren();

  appointments.forEach((appointment) => {
    const patient = patients.find(
      (item) => item.id === appointment.patientId
    );

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
  $("appointmentDialog").showModal();
});

$("appointmentForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const patientId = $("appointmentPatient").value;
  const date = $("appointmentDate").value;
  const purpose = $("appointmentPurpose").value;
  const today = new Date().toISOString().slice(0, 10);

  if (!patientId || !date || !purpose) {
    alert("Please complete all required fields.");
    return;
  }

  if (date < today) {
    alert("Choose today or a future appointment date.");
    return;
  }

  const duplicate = appointments.some((appointment) => {
    return (
      appointment.patientId === patientId &&
      appointment.date === date &&
      appointment.purpose === purpose
    );
  });

  if (duplicate) {
    alert("This appointment already exists.");
    return;
  }

  appointments.push({
    patientId: patientId,
    date: date,
    purpose: purpose,
    status: "Scheduled"
  });

  $("appointmentDialog").close();
  renderAll();
});

// CLOSE FORM BUTTONS
document.querySelectorAll("[data-close]").forEach((button) => {
  button.addEventListener("click", function () {
    const dialog = $(button.dataset.close);

    if (dialog) {
      dialog.close();
    }
  });
});

// UPDATE ALL DISPLAYS
function renderAll() {
  renderDashboard();
  renderPatients($("patientSearch").value);
  renderConsultations();
  renderAppointments();

  fillPatientSelect("consultPatient");
  fillPatientSelect("appointmentPatient");
}

// INITIAL DATE
// No data is saved to a permanent database in this demo.