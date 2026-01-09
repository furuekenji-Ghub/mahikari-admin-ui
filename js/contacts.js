import { api } from "./api.js";

const $ = (id) => document.getElementById(id);

const status = $("status");
const rows = $("rows");

$("btnSearch").onclick = search;
$("btnClear").onclick = clearForm;

function clearForm() {
  $("q").value = "";
  $("email").value = "";
  $("member_id").value = "";
  rows.innerHTML = "";
  status.textContent = "";
}

async function search() {
  rows.innerHTML = "";
  status.textContent = "Searching...";

  const payload = {
    q: $("q").value.trim() || undefined,
    email: $("email").value.trim() || undefined,
    member_id: $("member_id").value.trim() || undefined,
    limit: 50,
  };

  try {
    const data = await api("/contacts/search", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    status.textContent = `Found ${data.total} result(s)`;

    data.results.forEach((c) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${c.id}</td>
        <td>${c.properties.email || ""}</td>
        <td>${c.properties.member_id || ""}</td>
        <td>${c.properties.active_status || ""}</td>
        <td>${c.properties.branch || ""}</td>
        <td>
          <a href="./edit.html?id=${encodeURIComponent(c.id)}">
            Edit
          </a>
        </td>
      `;

      rows.appendChild(tr);
    });
  } catch (err) {
    status.textContent = "Error";
    alert(err.message);
    console.error(err);
  }
}