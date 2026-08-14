document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const messageEl = document.getElementById("signup-message");
  messageEl.textContent = "";

  const form = e.target;
  const payload = {
    email: form.email.value,
    password: form.password.value,
    name: form.name.value,
    address: form.address.value,
  };

  try {
    await apiFetch("/api/users/signup", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    messageEl.textContent = "회원가입에 성공했습니다. 로그인 페이지로 이동합니다.";
    location.href = "./login.html";
  } catch (err) {
    messageEl.textContent = err.message;
  }
});
