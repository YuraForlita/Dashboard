const SHEETDB_URL = "https://sheetdb.io/api/v1/ydc2u8amcru5m"; // замінити на свій

    async function sha256(text) {
      const msgBuffer = new TextEncoder().encode(text);
      const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    }

    async function login() {
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value;
      if (!username || !password) return alert("Заповніть усі поля");

      const hash = await sha256(password);
      const res = await fetch(`${SHEETDB_URL}/search?username=${username}`);
      const users = await res.json();

      if (users.length === 0) return alert("Користувача не знайдено");
      if (users[0].passwordHash === hash) {
        localStorage.setItem("user", username);
        window.location.href = "dashboard.html";
      } else {
        alert("Невірний пароль");
      }
    }

    async function register() {
      const username = document.getElementById("newUsername").value.trim();
      const password = document.getElementById("newPassword").value;
      if (!username || !password) return alert("Заповніть усі поля");

      const hash = await sha256(password);
      const createdAt = new Date().toISOString().split("T")[0];

      const body = {
        data: {
          username,
          passwordHash: hash,
          created_at: createdAt,
        },
      };

      await fetch(SHEETDB_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      alert("Користувача створено! Тепер можна увійти.");
      toggleRegister();
      loadUsers();
    }

    function toggleRegister() {
      document.getElementById("auth-form").classList.toggle("hidden");
      document.getElementById("register-form").classList.toggle("hidden");
    }

    async function loadUsers() {
      const res = await fetch(SHEETDB_URL);
      const data = await res.json();
      const select = document.getElementById("username");

      select.innerHTML = '<option value="">Оберіть користувача</option>';
      data.forEach((user) => {
        const opt = document.createElement("option");
        opt.value = user.username;
        opt.textContent = user.username;
        select.appendChild(opt);
      });
    }

    loadUsers();