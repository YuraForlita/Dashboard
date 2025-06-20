const SHEETDB_URL = "https://sheetdb.io/api/v1/d6wvpyfvjl765";
    const user = localStorage.getItem("user");
    if (!user) window.location.href = "index.html";
    document.getElementById("usernameDisplay").textContent = user;

    async function fetchLinks() {
      const res = await fetch(`${SHEETDB_URL}/search?username=${user}`);
      const data = await res.json();
      const container = document.getElementById("linksContainer");
      container.innerHTML = "";

      data.forEach((item, index) => {
        const card = document.createElement("div");
        card.className = "bg-white p-4 rounded shadow relative";
        card.innerHTML = `
          <h3 class="text-lg font-bold">${item.title}</h3>
          <a href="${item.link}" target="_blank" class="text-blue-500 text-sm break-words">${item.link}</a>
          <p class="text-sm text-gray-600 mt-1">${item.description || ''}</p>
          <div class="text-xs text-gray-400 mt-1">${item.tags || ''}</div>
          <button onclick="deleteLink(${item.id || index})" class="absolute top-2 right-2 text-red-500 text-xs">✖</button>
        `;
        container.appendChild(card);
      });
    }

    function showAddForm() {
      document.getElementById("linkForm").classList.toggle("hidden");
    }

    async function addLink() {
      const title = document.getElementById("linkTitle").value.trim();
      const link = document.getElementById("linkURL").value.trim();
      const description = document.getElementById("linkDesc").value.trim();
      const tags = document.getElementById("linkTags").value.trim();

      if (!title || !link) return alert("Назва і посилання обов’язкові");

      const body = {
        data: {
          username: user,
          title,
          link,
          description,
          tags
        }
      };

      await fetch(SHEETDB_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      document.getElementById("linkForm").classList.add("hidden");
      document.getElementById("linkTitle").value = "";
      document.getElementById("linkURL").value = "";
      document.getElementById("linkDesc").value = "";
      document.getElementById("linkTags").value = "";
      fetchLinks();
    }

    async function deleteLink(index) {
      if (!confirm("Видалити це посилання?")) return;
      const res = await fetch(`${SHEETDB_URL}/search?username=${user}`);
      const data = await res.json();
      const item = data[index];

      if (item && item.id) {
        await fetch(`${SHEETDB_URL}/id/${item.id}`, { method: "DELETE" });
        fetchLinks();
      } else {
        alert("Не вдалося видалити");
      }
    }

    function logout() {
      localStorage.removeItem("user");
      window.location.href = "index.html";
    }

    fetchLinks();