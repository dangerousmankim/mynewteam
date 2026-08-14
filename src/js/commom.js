// 공통 설정 및 유틸 함수
// 모든 페이지의 js에서 <script src="./js/commom.js"></script> (또는 상대경로)로 로드해서 사용

const API_BASE_URL = "http://teacherdev09.kro.kr:10002/endpoint";

const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  TOKEN_TYPE: "tokenType",
  USER: "currentUser",
};

// 인증 정보 저장/조회 

function setAuth(accessToken, tokenType, user) {
  sessionStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  sessionStorage.setItem(STORAGE_KEYS.TOKEN_TYPE, tokenType || "Bearer");
  sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user || {}));
}

function clearAuth() {
  sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  sessionStorage.removeItem(STORAGE_KEYS.TOKEN_TYPE);
  sessionStorage.removeItem(STORAGE_KEYS.USER);
}

function getAccessToken() {
  return sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
}

function getTokenType() {
  return sessionStorage.getItem(STORAGE_KEYS.TOKEN_TYPE) || "Bearer";
}

function getCurrentUser() {
  const raw = sessionStorage.getItem(STORAGE_KEYS.USER);
  return raw ? JSON.parse(raw) : null;
}

function isLoggedIn() {
  return !!getAccessToken();
}

function logout() {
  clearAuth();
  location.href = "./index.html";
}

// 공통 API 요청 함수
// path: "/api/users/login" 같은 API 경로
// 성공 시 응답의 data를 반환, 실패 시 message를 담은 Error를 throw

async function apiFetch(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const token = getAccessToken();
  if (token) {
    headers["Authorization"] = `${getTokenType()} ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "요청 처리 중 오류가 발생했습니다.");
  }

  return result.data;
}

// 공통 네비게이션(로그인/로그아웃 버튼 토글)
// 각 페이지 nav에 id="nav-login-link", id="nav-signup-link", id="nav-logout-btn" 요소를 두면
// 로그인 상태에 따라 자동으로 보이거나 숨겨짐

function renderAuthNav() {
  const loginLink = document.getElementById("nav-login-link");
  const signupLink = document.getElementById("nav-signup-link");
  const logoutBtn = document.getElementById("nav-logout-btn");
  const mypageLink = document.getElementById("nav-mypage-link");

  const loggedIn = isLoggedIn();

  if (loginLink) loginLink.style.display = loggedIn ? "none" : "";
  if (signupLink) signupLink.style.display = loggedIn ? "none" : "";
  if (logoutBtn) logoutBtn.style.display = loggedIn ? "" : "none";
  if (mypageLink) mypageLink.style.display = loggedIn ? "" : "none";

  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }
}

document.addEventListener("DOMContentLoaded", renderAuthNav);
