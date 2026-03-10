const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

const STATE = {
  admins: [],
  students: [],
  alumni: [],
  placements: [],
  placementAssistance: [],
  permissions: [],
  posts: [],
  currentUser: null
};

function loadState() {
  const s = localStorage.getItem("campus_hub_v2_state");
  if (s) {
    const data = JSON.parse(s);
    Object.assign(STATE, data);
  } else {
    seedData();
    persistState();
  }
}

function persistState() {
  localStorage.setItem("campus_hub_v2_state", JSON.stringify(STATE));
}

function uid(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

function seedData() {
  const admin1 = {
    id: uid("admin"),
    name: "John Doe",
    collegeName: "Tech University",
    location: "San Francisco",
    email: "admin@tech.edu",
    phone: "1234567890",
    password: "password123"
  };

  const student1 = {
    id: uid("stu"),
    name: "Alice Student",
    email: "alice@student.com",
    phone: "0987654321",
    collegeName: "Tech University",
    yearOfStudy: "3",
    rollNo: "STU001",
    collegeId: "TECH-ID-101",
    password: "password123",
    adminId: admin1.id
  };

  const alum1 = {
    id: uid("alum"),
    name: "Bob Alum",
    email: "bob@alum.com",
    phone: "1122334455",
    collegeName: "Tech University",
    graduationYear: "2022",
    linkedin: "linkedin.com/in/bob",
    password: "password123",
    adminId: admin1.id,
    approved: true
  };

  STATE.admins = [admin1];
  STATE.students = [student1];
  STATE.alumni = [alum1];
  STATE.placementAssistance = [
    { id: uid("pa"), adminId: admin1.id, type: "questions", title: "Common JS Questions", content: "Closure, Hoisting, Promises...", date: "2026-03-10" },
    { id: uid("pa"), adminId: admin1.id, type: "companies", title: "Top Tech Visit", content: "Google, Amazon, Meta visited this month.", date: "2026-03-11" },
    { id: uid("pa"), adminId: admin1.id, type: "drives", title: "Spring Hiring Drive", content: "Register by March 20th.", date: "2026-03-12" }
  ];
  STATE.posts = [
    { id: uid("post"), adminId: admin1.id, content: "Tech University achieves 95% placement this year!", date: "2026-03-10" },
    { id: uid("post"), adminId: admin1.id, content: "New Hackathon announced: 'Code for Future'. Register now!", date: "2026-03-11" }
  ];
}

function setUser(user) {
  STATE.currentUser = user;
  persistState();
  updateNav();
}

function updateNav() {
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  if (!loginBtn || !logoutBtn) return;
  if (STATE.currentUser) {
    loginBtn.hidden = true;
    logoutBtn.hidden = false;
  } else {
    loginBtn.hidden = false;
    logoutBtn.hidden = true;
  }
}

function byId(id) {
  return document.getElementById(id);
}

function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

function render() {
  const main = byId("app");
  if (!main) return;
  const route = location.hash || "#/home";

  if (route.startsWith("#/home")) main.replaceChildren(Views.home());
  else if (route.startsWith("#/login")) main.replaceChildren(Views.login());
  else if (route.startsWith("#/signup")) main.replaceChildren(Views.signup());
  else if (route.startsWith("#/dashboard")) main.replaceChildren(Views.dashboard());
  else main.replaceChildren(Views.home());
}

const Views = {
  home() {
    const u = STATE.currentUser;
    const container = el(`
      <div>
        <section class="hero">
          <div class="hero-content">
            <h1 class="creative-title">
              <span class="logo-icon">🚀</span>
              FUTURE<span class="highlight">PATH</span>
              <small>Campus Placement Hub</small>
            </h1>
            <p class="hero-overview">
              The ultimate bridge between ambition and opportunity. 
              FuturePath empowers colleges to streamline placements, students to accelerate careers, 
              and alumni to guide the next generation.
            </p>
            <div class="overview-features grid">
              <div class="card mini-card">
                <div class="card-icon">🏫</div>
                <div class="card-title">For Admins</div>
                <div class="muted">Manage your entire college's placement lifecycle.</div>
              </div>
              <div class="card mini-card">
                <div class="card-icon">🎓</div>
                <div class="card-title">For Students</div>
                <div class="muted">Access exclusive drives, prep material, and guidance.</div>
              </div>
              <div class="card mini-card">
                <div class="card-icon">🤝</div>
                <div class="card-title">For Alumni</div>
                <div class="muted">Connect back with your roots and mentor talent.</div>
              </div>
            </div>
            <div class="inline" style="margin-top:30px">
              ${u ? '<a class="btn btn-primary" href="#/dashboard">Go to Dashboard</a>' : '<a class="btn btn-primary" href="#/login">Get Started Now</a>'}
              <a class="btn btn-ghost" href="#/signup">Join as Admin</a>
            </div>
          </div>
          <div class="hero-visual">
            <div class="img-overlay">
              <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1000" alt="Collaboration"/>
            </div>
          </div>
        </section>

        <section class="site-overview" style="margin-top:100px">
          <h2 class="section-title centered">How It Works</h2>
          <div class="overview-steps grid">
            <div class="step">
              <div class="step-num">01</div>
              <h3>Admin Onboarding</h3>
              <p>College admins register first, setting up the foundation for their institution's placement portal.</p>
            </div>
            <div class="step">
              <div class="step-num">02</div>
              <h3>Student & Alumni Enrollment</h3>
              <p>Once an admin is active, students and alumni can join using their college credentials and admin approval.</p>
            </div>
            <div class="step">
              <div class="step-num">03</div>
              <h3>Empowerment & Success</h3>
              <p>Collaborate on placements, share interview insights, and track success in real-time.</p>
            </div>
          </div>
        </section>
      </div>
    `);
    return container;
  },

  login() {
    const container = el(`
      <section class="auth-section">
        <div class="auth-card card">
          <div class="tabs" role="tablist">
            <button class="tab" id="tab-student" role="tab" aria-selected="true">Student</button>
            <button class="tab" id="tab-admin" role="tab" aria-selected="false">Admin</button>
            <button class="tab" id="tab-alumni" role="tab" aria-selected="false">Alumni</button>
          </div>
          <div id="login-form-container"></div>
          <div class="auth-footer">
            <span class="muted">Don't have an account?</span> 
            <a href="#/signup" class="highlight">Sign Up</a>
          </div>
        </div>
      </section>
    `);

    const tabs = container.querySelectorAll(".tab");
    const formWrap = container.querySelector("#login-form-container");

    const renderForm = (role) => {
      formWrap.innerHTML = `
        <form class="form" id="loginForm">
          <h3>${role.charAt(0).toUpperCase() + role.slice(1)} Login</h3>
          <div class="field">
            <label>Email Address</label>
            <input required type="email" name="email" class="input" placeholder="name@example.com"/>
          </div>
          <div class="field">
            <label>Password</label>
            <input required type="password" name="password" class="input" placeholder="••••••••"/>
          </div>
          <button class="btn btn-primary" type="submit">Sign In</button>
        </form>
      `;

      const form = formWrap.querySelector("#loginForm");
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const d = new FormData(form);
        const email = d.get("email").toLowerCase();
        const pass = d.get("password");

        let user = null;
        if (role === "admin") {
          user = STATE.admins.find(a => a.email.toLowerCase() === email && a.password === pass);
          if (user) user.type = "admin";
        } else if (role === "student") {
          user = STATE.students.find(s => s.email.toLowerCase() === email && s.password === pass);
          if (user) user.type = "student";
        } else if (role === "alumni") {
          user = STATE.alumni.find(a => a.email.toLowerCase() === email && a.password === pass);
          if (user) {
            if (!user.approved) { alert("Your alumni account is pending admin approval."); return; }
            user.type = "alumni";
          }
        }

        if (user) {
          setUser(user);
          location.hash = "#/dashboard";
        } else {
          alert("Invalid email or password.");
        }
      });
    };

    tabs.forEach(t => {
      t.addEventListener("click", () => {
        tabs.forEach(x => x.setAttribute("aria-selected", "false"));
        t.setAttribute("aria-selected", "true");
        renderForm(t.id.replace("tab-", ""));
      });
    });

    renderForm("student");
    return container;
  },

  signup() {
    const container = el(`
      <section class="auth-section">
        <div class="auth-card card wide-card">
          <div class="tabs" role="tablist">
            <button class="tab" id="tab-student" role="tab" aria-selected="false">Student</button>
            <button class="tab" id="tab-admin" role="tab" aria-selected="true">Admin</button>
            <button class="tab" id="tab-alumni" role="tab" aria-selected="false">Alumni</button>
          </div>
          <div id="signup-form-container"></div>
          <div class="auth-footer">
            <span class="muted">Already have an account?</span> 
            <a href="#/login" class="highlight">Log In</a>
          </div>
        </div>
      </section>
    `);

    const tabs = container.querySelectorAll(".tab");
    const formWrap = container.querySelector("#signup-form-container");

    const renderForm = (role) => {
      if (role === "admin") {
        formWrap.innerHTML = `
          <form class="form grid-form" id="adminSignup">
            <h3>Admin Registration</h3>
            <div class="field"><label>Admin Name</label><input required name="name" class="input"/></div>
            <div class="field"><label>College Name</label><input required name="collegeName" class="input"/></div>
            <div class="field"><label>College Location</label><input required name="location" class="input"/></div>
            <div class="field"><label>Email Address</label><input required type="email" name="email" class="input"/></div>
            <div class="field"><label>Phone Number</label><input required type="tel" name="phone" class="input"/></div>
            <div class="field"><label>Create Password</label><input required type="password" name="password" class="input"/></div>
            <button class="btn btn-primary" style="grid-column: span 2" type="submit">Create Admin Account</button>
          </form>
        `;
        const form = formWrap.querySelector("#adminSignup");
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          const d = new FormData(form);
          const admin = {
            id: uid("admin"),
            name: d.get("name"),
            collegeName: d.get("collegeName"),
            location: d.get("location"),
            email: d.get("email"),
            phone: d.get("phone"),
            password: d.get("password")
          };
          STATE.admins.push(admin);
          persistState();
          admin.type = "admin";
          setUser(admin);
          location.hash = "#/dashboard";
        });
      } else {
        const admins = STATE.admins;
        if (admins.length === 0) {
          formWrap.innerHTML = `<div class="alert warn">No colleges have registered yet. An Admin must register first before Students or Alumni can join.</div>`;
          return;
        }

        if (role === "student") {
          formWrap.innerHTML = `
            <form class="form grid-form" id="studentSignup">
              <h3>Student Registration</h3>
              <div class="field"><label>Full Name</label><input required name="name" class="input"/></div>
              <div class="field"><label>Email Address</label><input required type="email" name="email" class="input"/></div>
              <div class="field"><label>Phone Number</label><input required type="tel" name="phone" class="input"/></div>
              <div class="field"><label>Select College</label>
                <select name="adminId" class="select" required>
                  ${admins.map(a => `<option value="${a.id}">${a.collegeName}</option>`).join("")}
                </select>
              </div>
              <div class="field"><label>Year of Study</label><input required name="year" class="input" type="number" min="1" max="4"/></div>
              <div class="field"><label>Student Roll No</label><input required name="rollNo" class="input"/></div>
              <div class="field"><label>College ID (assigned by admin)</label><input required name="collegeId" class="input"/></div>
              <div class="field"><label>Create Password</label><input required type="password" name="password" class="input"/></div>
              <button class="btn btn-primary" style="grid-column: span 2" type="submit">Sign Up</button>
            </form>
          `;
          const form = formWrap.querySelector("#studentSignup");
          form.addEventListener("submit", (e) => {
            e.preventDefault();
            const d = new FormData(form);
            const admin = STATE.admins.find(a => a.id === d.get("adminId"));
            const stu = {
              id: uid("stu"),
              name: d.get("name"),
              email: d.get("email"),
              phone: d.get("phone"),
              collegeName: admin.collegeName,
              yearOfStudy: d.get("year"),
              rollNo: d.get("rollNo"),
              collegeId: d.get("collegeId"),
              password: d.get("password"),
              adminId: admin.id
            };
            STATE.students.push(stu);
            persistState();
            stu.type = "student";
            setUser(stu);
            location.hash = "#/dashboard";
          });
        } else if (role === "alumni") {
          formWrap.innerHTML = `
            <form class="form grid-form" id="alumSignup">
              <h3>Alumni Registration</h3>
              <div class="field"><label>Full Name</label><input required name="name" class="input"/></div>
              <div class="field"><label>Email Address</label><input required type="email" name="email" class="input"/></div>
              <div class="field"><label>Phone Number</label><input required type="tel" name="phone" class="input"/></div>
              <div class="field"><label>Select College</label>
                <select name="adminId" class="select" required>
                  ${admins.map(a => `<option value="${a.id}">${a.collegeName}</option>`).join("")}
                </select>
              </div>
              <div class="field"><label>Graduation Year</label><input required name="year" class="input" type="number"/></div>
              <div class="field"><label>LinkedIn Profile</label><input required name="linkedin" class="input"/></div>
              <div class="field"><label>Create Password</label><input required type="password" name="password" class="input"/></div>
              <button class="btn btn-primary" style="grid-column: span 2" type="submit">Submit for Approval</button>
            </form>
          `;
          const form = formWrap.querySelector("#alumSignup");
          form.addEventListener("submit", (e) => {
            e.preventDefault();
            const d = new FormData(form);
            const admin = STATE.admins.find(a => a.id === d.get("adminId"));
            const alum = {
              id: uid("alum"),
              name: d.get("name"),
              email: d.get("email"),
              phone: d.get("phone"),
              collegeName: admin.collegeName,
              graduationYear: d.get("year"),
              linkedin: d.get("linkedin"),
              password: d.get("password"),
              adminId: admin.id,
              approved: false
            };
            STATE.alumni.push(alum);
            persistState();
            alert("Your details have been sent to the college admin. You can login once approved.");
            location.hash = "#/login";
          });
        }
      }
    };

    tabs.forEach(t => {
      t.addEventListener("click", () => {
        tabs.forEach(x => x.setAttribute("aria-selected", "false"));
        t.setAttribute("aria-selected", "true");
        renderForm(t.id.replace("tab-", ""));
      });
    });

    renderForm("admin");
    return container;
  },

  dashboard() {
    const u = STATE.currentUser;
    if (!u) return el(`<section><div class="alert danger">Please <a href="#/login">login</a> to access this page.</div></section>`);

    if (u.type === "admin") return AdminViews.dashboard(u);
    if (u.type === "student") return StudentViews.dashboard(u);
    if (u.type === "alumni") return AlumniViews.dashboard(u);
    return el(`<section>Error identifying role.</section>`);
  }
};

const AdminViews = {
  dashboard(admin) {
    const container = el(`
      <div class="dashboard-layout">
        <aside class="sidebar">
          <h3>Admin Panel</h3>
          <nav class="side-nav">
            <button class="side-btn active" data-view="overview">Overview</button>
            <button class="side-btn" data-view="students">Students</button>
            <button class="side-btn" data-view="alumni">Alumni Approval</button>
            <button class="side-btn" data-view="post">Post Assistance</button>
            <button class="side-btn" data-view="permissions">Permissions</button>
          </nav>
        </aside>
        <main class="dashboard-main" id="admin-view-content"></main>
      </div>
    `);

    const content = container.querySelector("#admin-view-content");
    const sideBtns = container.querySelectorAll(".side-btn");

    const renderSubView = (view) => {
      sideBtns.forEach(b => b.classList.toggle("active", b.dataset.view === view));

      if (view === "overview") {
        const students = STATE.students.filter(s => s.adminId === admin.id);
        const alumni = STATE.alumni.filter(a => a.adminId === admin.id && a.approved);
        content.innerHTML = `
          <div class="section-header"><h2>${admin.collegeName} - Overview</h2></div>
          <div class="grid">
            <div class="card stat-card"><h3>${students.length}</h3><div class="muted">Registered Students</div></div>
            <div class="card stat-card"><h3>${alumni.length}</h3><div class="muted">Active Alumni</div></div>
            <div class="card stat-card"><h3>${STATE.placementAssistance.filter(p => p.adminId === admin.id).length}</h3><div class="muted">Resources Posted</div></div>
          </div>
          <div class="card" style="margin-top:20px">
            <h3>College Profile</h3>
            <p><strong>Admin:</strong> ${admin.name}</p>
            <p><strong>Location:</strong> ${admin.location}</p>
            <p><strong>Contact:</strong> ${admin.email} | ${admin.phone}</p>
          </div>
        `;
      } else if (view === "students") {
        const list = STATE.students.filter(s => s.adminId === admin.id);
        content.innerHTML = `
          <div class="section-header"><h2>Student Directory</h2></div>
          <div class="card">
            <table class="table">
              <thead><tr><th>Name</th><th>Roll No</th><th>Year</th><th>Email</th></tr></thead>
              <tbody>
                ${list.map(s => `<tr><td>${s.name}</td><td>${s.rollNo}</td><td>${s.yearOfStudy}</td><td>${s.email}</td></tr>`).join("")}
              </tbody>
            </table>
          </div>
        `;
      } else if (view === "alumni") {
        const pending = STATE.alumni.filter(a => a.adminId === admin.id && !a.approved);
        content.innerHTML = `
          <div class="section-header"><h2>Pending Approvals</h2></div>
          <div class="grid">
            ${pending.length === 0 ? '<div class="muted">No pending approvals.</div>' : pending.map(a => `
              <div class="card alumni-approval-card">
                <h3>${a.name}</h3>
                <p>${a.email} | Class of ${a.graduationYear}</p>
                <div class="inline">
                  <button class="btn btn-primary approve-btn" data-id="${a.id}">Accept</button>
                  <button class="btn btn-ghost reject-btn" data-id="${a.id}">Reject</button>
                </div>
              </div>
            `).join("")}
          </div>
        `;
        content.querySelectorAll(".approve-btn").forEach(b => b.addEventListener("click", () => {
          const alum = STATE.alumni.find(x => x.id === b.dataset.id);
          alum.approved = true;
          persistState();
          renderSubView("alumni");
        }));
      } else if (view === "post") {
        content.innerHTML = `
          <div class="section-header"><h2>Post Placement Assistance</h2></div>
          <div class="grid" style="grid-template-columns: 1fr 1fr">
            <div class="card">
              <form class="form" id="postAssistanceForm">
                <div class="field"><label>Category</label>
                  <select name="type" class="select">
                    <option value="placements">Placements Stats</option>
                    <option value="questions">Interview Questions</option>
                    <option value="hackathons">Hackathons</option>
                    <option value="drives">Upcoming Drives</option>
                    <option value="companies">Companies Visited</option>
                    <option value="rules">Interview Rules</option>
                    <option value="guidance">Placement Guidance</option>
                    <option value="rounds">Company Rounds</option>
                  </select>
                </div>
                <div class="field"><label>Title</label><input required name="title" class="input"/></div>
                <div class="field"><label>Content</label><textarea required name="content" class="textarea" rows="4"></textarea></div>
                <button class="btn btn-primary" type="submit">Post to Portal</button>
              </form>
            </div>
            <div class="card">
              <h3>Latest Scrolling Post</h3>
              <form class="form" id="scrollPostForm">
                <div class="field"><label>Short Update</label><input required name="content" class="input" maxlength="100"/></div>
                <button class="btn btn-ghost" type="submit">Update Scroller</button>
              </form>
            </div>
          </div>
        `;
        content.querySelector("#postAssistanceForm").addEventListener("submit", (e) => {
          e.preventDefault();
          const d = new FormData(e.target);
          STATE.placementAssistance.push({
            id: uid("pa"),
            adminId: admin.id,
            type: d.get("type"),
            title: d.get("title"),
            content: d.get("content"),
            date: new Date().toISOString().split('T')[0]
          });
          persistState();
          alert("Posted successfully!");
          e.target.reset();
        });
        content.querySelector("#scrollPostForm").addEventListener("submit", (e) => {
          e.preventDefault();
          const d = new FormData(e.target);
          STATE.posts.push({
            id: uid("post"),
            adminId: admin.id,
            content: d.get("content"),
            date: new Date().toISOString().split('T')[0]
          });
          persistState();
          alert("Scroller updated!");
          e.target.reset();
        });
      } else if (view === "permissions") {
        const requests = STATE.permissions.filter(p => p.adminId === admin.id);
        content.innerHTML = `
          <div class="section-header"><h2>Permission Letters</h2></div>
          <div class="grid">
            ${requests.length === 0 ? '<div class="muted">No permission requests yet.</div>' : requests.map(p => {
          const stu = STATE.students.find(s => s.id === p.studentId);
          return `
                <div class="card perm-card">
                  <div class="inline" style="justify-content:space-between">
                    <h3>${stu ? stu.name : 'Unknown Student'}</h3>
                    <div class="pill ${p.status}">${p.status.toUpperCase()}</div>
                  </div>
                  <p><strong>Roll:</strong> ${stu ? stu.rollNo : '-'} | <strong>Attendance:</strong> ${p.attendance}%</p>
                  <p><strong>Event:</strong> ${p.eventName}</p>
                  <div class="perm-letter">${p.letter}</div>
                  ${p.status === 'pending' ? `
                    <div class="inline" style="margin-top:10px">
                      <button class="btn btn-primary accept-perm" data-id="${p.id}">Accept</button>
                      <button class="btn btn-ghost reject-perm" data-id="${p.id}">Reject</button>
                    </div>
                  ` : ''}
                </div>
              `;
        }).join("")}
          </div>
        `;
        content.querySelectorAll(".accept-perm").forEach(b => b.addEventListener("click", () => {
          const perm = STATE.permissions.find(x => x.id === b.dataset.id);
          perm.status = "accepted";
          persistState();
          renderSubView("permissions");
        }));
        content.querySelectorAll(".reject-perm").forEach(b => b.addEventListener("click", () => {
          const perm = STATE.permissions.find(x => x.id === b.dataset.id);
          perm.status = "rejected";
          persistState();
          renderSubView("permissions");
        }));
      }
    };

    sideBtns.forEach(b => b.addEventListener("click", () => renderSubView(b.dataset.view)));
    renderSubView("overview");
    return container;
  }
};

const StudentViews = {
  dashboard(student) {
    const container = el(`
      <div class="dashboard-layout">
        <aside class="sidebar">
          <h3>Student Hub</h3>
          <nav class="side-nav">
            <button class="side-btn active" data-view="assistance">Placement Assistance</button>
            <button class="side-btn" data-view="permissions">Permissions</button>
            <button class="side-btn" data-view="alumni">Alumni Support</button>
          </nav>
        </aside>
        <main class="dashboard-main">
          <div class="scrolling-updates">
            <div class="scroller" id="latest-posts-scroller"></div>
          </div>
          <div id="student-view-content"></div>
        </main>
      </div>
    `);

    const content = container.querySelector("#student-view-content");
    const scroller = container.querySelector("#latest-posts-scroller");
    const sideBtns = container.querySelectorAll(".side-btn");

    // Scroller logic
    const adminPosts = STATE.posts.filter(p => p.adminId === student.adminId).slice(-5);
    scroller.innerHTML = adminPosts.length ? adminPosts.map(p => `<span class="scroll-item">🔥 ${p.content}</span>`).join("") : "<span>No recent updates from admin.</span>";

    const renderSubView = (view) => {
      sideBtns.forEach(b => b.classList.toggle("active", b.dataset.view === view));

      if (view === "assistance") {
        const pa = STATE.placementAssistance.filter(p => p.adminId === student.adminId);
        content.innerHTML = `
          <div class="section-header"><h2>Placement Assistance</h2></div>
          <div class="grid">
            ${pa.length === 0 ? '<div class="muted">No assistance posts yet.</div>' : pa.map(p => `
              <div class="card pa-card">
                <div class="pill">${p.type.toUpperCase()}</div>
                <h3>${p.title}</h3>
                <div class="pa-content">${p.content}</div>
                <div class="muted" style="font-size:11px; margin-top:10px">Posted on: ${p.date}</div>
              </div>
            `).join("")}
          </div>
        `;
      } else if (view === "permissions") {
        const myPerms = STATE.permissions.filter(p => p.studentId === student.id);
        content.innerHTML = `
          <div class="section-header"><h2>Request Permission</h2></div>
          <div class="grid" style="grid-template-columns: 1fr 1.5fr">
            <div class="card">
              <form class="form" id="permRequestForm">
                <div class="field"><label>Event/Drive Name</label><input required name="eventName" class="input"/></div>
                <div class="field"><label>Attendance Percentage (%)</label><input required type="number" name="attendance" class="input"/></div>
                <div class="field"><label>Permission Letter</label><textarea required name="letter" class="textarea" rows="5" placeholder="Dear Admin, I wish to participate in..."></textarea></div>
                <button class="btn btn-primary" type="submit">Submit to Admin</button>
              </form>
            </div>
            <div class="card">
              <h3>My Requests</h3>
              <div class="grid" style="grid-template-columns: 1fr">
                ${myPerms.length === 0 ? '<div class="muted">No requests sent.</div>' : myPerms.map(p => `
                  <div class="card mini-card">
                    <div class="inline" style="justify-content:space-between">
                      <strong>${p.eventName}</strong>
                      <div class="pill ${p.status}">${p.status.toUpperCase()}</div>
                    </div>
                  </div>
                `).join("")}
              </div>
            </div>
          </div>
        `;
        content.querySelector("#permRequestForm").addEventListener("submit", (e) => {
          e.preventDefault();
          const d = new FormData(e.target);
          STATE.permissions.push({
            id: uid("perm"),
            studentId: student.id,
            adminId: student.adminId,
            eventName: d.get("eventName"),
            letter: d.get("letter"),
            attendance: d.get("attendance"),
            status: "pending"
          });
          persistState();
          alert("Permission request sent!");
          renderSubView("permissions");
        });
      } else if (view === "alumni") {
        const alums = STATE.alumni.filter(a => a.adminId === student.adminId && a.approved);
        content.innerHTML = `
          <div class="section-header"><h2>Alumni Support</h2></div>
          <div class="grid">
            ${alums.length === 0 ? '<div class="muted">No alumni connected for your college yet.</div>' : alums.map(a => `
              <div class="card alum-connect-card">
                <h3>${a.name}</h3>
                <div class="muted">Class of ${a.graduationYear}</div>
                <div class="inline" style="margin-top:10px">
                  <a href="mailto:${a.email}" class="btn btn-ghost">Email</a>
                  <a href="${a.linkedin}" target="_blank" class="btn btn-primary">LinkedIn</a>
                </div>
              </div>
            `).join("")}
          </div>
        `;
      }
    };

    sideBtns.forEach(b => b.addEventListener("click", () => renderSubView(b.dataset.view)));
    renderSubView("assistance");
    return container;
  }
};

const AlumniViews = {
  dashboard(alum) {
    const container = el(`
      <section>
        <div class="section-header">
          <h2>Alumni Dashboard</h2>
          <div class="pill accepted">APPROVED</div>
        </div>
        <div class="grid">
          <div class="card">
            <h3>My Status</h3>
            <p><strong>College:</strong> ${alum.collegeName}</p>
            <p><strong>Email:</strong> ${alum.email}</p>
            <p><strong>Graduation:</strong> ${alum.graduationYear}</p>
          </div>
          <div class="card">
            <h3>Connection Hub</h3>
            <p class="muted">You are now visible to students of ${alum.collegeName}. They may reach out to you via email or LinkedIn for career guidance.</p>
          </div>
        </div>
      </section>
    `);
    return container;
  }
};

function wireGlobalActions() {
  const loginBtn = byId("loginBtn");
  const logoutBtn = byId("logoutBtn");
  if (loginBtn) loginBtn.addEventListener("click", () => location.hash = "#/login");
  if (logoutBtn) logoutBtn.addEventListener("click", () => {
    setUser(null);
    location.hash = "#/home";
  });
}

function main() {
  loadState();
  wireGlobalActions();
  updateNav();
  addEventListener("hashchange", render);
  render();
}

main();
