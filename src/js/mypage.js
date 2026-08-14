async function loadMyInfo() {
  const messageEl = document.getElementById("mypage-message");
  const infoEl = document.getElementById("mypage-info");

  if (!isLoggedIn()) {
    messageEl.textContent = "로그인이 필요합니다.";
    location.href = "./login.html";
    return;
  }

  try {
    const user = await apiFetch("/api/users/me");

    document.getElementById("info-name").textContent = user.name;
    document.getElementById("info-email").textContent = user.email;
    document.getElementById("info-address").textContent = user.address || "-";
    document.getElementById("info-createdAt").textContent = user.createdAt || "-";

    infoEl.hidden = false;
  } catch (err) {
    messageEl.textContent = err.message;
  }
}

document.addEventListener("DOMContentLoaded", loadMyInfo);
