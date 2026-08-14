document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const messageEl = document.getElementById("login-message");
  messageEl.textContent = "";

  const form = e.target;
  const payload = {
    email: form.email.value,
    password: form.password.value,
  };

  try {
    const data = await apiFetch("/api/users/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    setAuth(data.accessToken, data.tokenType, data.user);
    location.href = "./index.html";
  } catch (err) {
    messageEl.textContent = err.message;
  }
});
