document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const loginMessage = document.getElementById("loginMessage");
  const schemaView = document.getElementById("schemaView");
  let currentRole = null;

  loginForm?.addEventListener("submit", async function (e) {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if (!username || !password) return;

    try {
      const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!data.success) {
        loginMessage.style.color = "var(--danger)";
        loginMessage.textContent = data.message;
        return;
      }

      currentRole = data.role;
      loginMessage.style.color = "var(--success)";
      loginMessage.textContent = `Welcome ${data.username}`;
      loginForm.style.display = "none";

      await loadProjects(data.username);
    } catch (err) {
      loginMessage.style.color = "var(--danger)";
      loginMessage.textContent = "Server error";
    }
  });

  async function loadProjects(username) {
    if (!schemaView) return;
    schemaView.innerHTML = "<p class='hint'>Loading data...</p>";

    try {
      const url = `/api/projects?role=${encodeURIComponent(currentRole)}&username=${encodeURIComponent(username)}`;
      const res = await fetch(url);
      const data = await res.json();

      if (!data || data.length === 0) {
        schemaView.innerHTML = "<p>No data found.</p>";
        return;
      }

      displayTable(schemaView, data, "Projects");
    } catch (err) {
      console.error(err);
      schemaView.innerHTML = "<p class='error'>Failed to load data.</p>";
    }
  }

  function displayTable(container, data, title) {
    container.innerHTML = "";
    const wrapper = document.createElement("div");
    wrapper.className = "schema-card";
    wrapper.innerHTML = `<h3>${title}</h3>`;

    const table = document.createElement("table");
    table.className = "data-table";

    const headers = Object.keys(data[0]);
    const thead = document.createElement("thead");
    const trHead = document.createElement("tr");
    headers.forEach(h => {
      const th = document.createElement("th");
      th.textContent = h;
      trHead.appendChild(th);
    });
    thead.appendChild(trHead);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    data.forEach(row => {
      const tr = document.createElement("tr");
      headers.forEach(h => {
        const td = document.createElement("td");
        td.textContent = row[h];
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    wrapper.appendChild(table);
    container.appendChild(wrapper);
  }
});
