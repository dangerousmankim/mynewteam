# 공통 인증/API 유틸 사용 가이드 (src/js/commom.js)

모든 페이지는 `<script src="./js/commom.js"></script>` (하위 경로면 상대 경로에 맞게 조정)를 자기 페이지의 `<script>`보다 먼저 로드하면 아래 함수들을 바로 사용할 수 있습니다.

```html
<script src="./js/commom.js"></script>
<script src="./js/mypage.js"></script>
```

## 1. apiFetch(path, options) — 공통 API 요청 함수

`fetch`를 감싼 함수로, 아래를 자동으로 처리합니다.

- `API_BASE_URL`(`http://teacherdev09.kro.kr:10002/endpoint`)을 `path` 앞에 붙여줌
- `Content-Type: application/json` 기본 헤더 설정
- 로그인 상태면 `Authorization: {tokenType} {accessToken}` 헤더 자동 추가
- 응답 JSON에서 `success`가 `false`면 `message`를 담은 `Error`를 throw
- 성공 시에는 응답의 `data` 값만 반환 (`{success, message, data}` 래퍼를 벗겨서 줌)

### 인증이 필요 없는 GET 요청

```js
const products = await apiFetch("/api/products?keyword=shoes&page=0&size=20");
```

### 인증이 필요 없는 POST 요청 (회원가입 예시)

```js
try {
  await apiFetch("/api/users/signup", {
    method: "POST",
    body: JSON.stringify({ email, password, name, address }),
  });
} catch (err) {
  // err.message에 서버 message가 들어있음 -> 화면에 출력
  messageEl.textContent = err.message;
}
```

### 로그인이 필요한 요청 (토큰 자동 첨부)

로그인에 성공해서 `setAuth(...)`로 토큰을 저장해두면, 이후 `apiFetch` 호출 시 별도 설정 없이 자동으로 `Authorization` 헤더가 붙습니다.

```js
// 리뷰 등록 예시 (로그인 필요)
try {
  await apiFetch(`/api/products/${productId}/reviews`, {
    method: "POST",
    body: JSON.stringify({ rating, content }),
  });
} catch (err) {
  messageEl.textContent = err.message;
}
```

### 주의사항

- `body`는 직접 `JSON.stringify()`로 문자열로 변환해서 넘겨야 합니다.
- 실패 처리는 각 페이지에서 `try/catch`로 감싸고, `err.message`를 화면에 출력하면 요구사항의 "success, message 확인 후 오류 메시지 출력"을 만족합니다.
- 인증이 필요한 API인데 로그인이 안 되어 있으면 서버가 401 등을 응답하고, `result.success`가 `false`이면 `apiFetch`가 알아서 에러를 던집니다. 로그인 필요 여부를 먼저 안내하고 싶다면 요청 전에 `isLoggedIn()`으로 먼저 체크하세요 (아래 2번 참고).

## 2. 토큰/로그인 상태 컨트롤 함수

| 함수 | 설명 |
|---|---|
| `setAuth(accessToken, tokenType, user)` | 로그인 성공 응답(`data.accessToken`, `data.tokenType`, `data.user`)을 그대로 넘기면 `sessionStorage`에 저장 |
| `clearAuth()` | 저장된 토큰/유저정보 전부 삭제 |
| `getAccessToken()` | 저장된 accessToken 문자열 반환 (없으면 `null`) |
| `getTokenType()` | 저장된 tokenType 반환 (기본값 `"Bearer"`) |
| `getCurrentUser()` | 로그인 시 저장해둔 유저 정보 객체 반환 (없으면 `null`) |
| `isLoggedIn()` | 로그인 여부 boolean |
| `logout()` | `clearAuth()` 후 `index.html`로 이동 |

### 로그인 페이지에서 토큰 저장하기

```js
const data = await apiFetch("/api/users/login", {
  method: "POST",
  body: JSON.stringify({ email, password }),
});

setAuth(data.accessToken, data.tokenType, data.user);
location.href = "./index.html";
```

### 로그인이 필요한 페이지에서 가드 걸기

```js
if (!isLoggedIn()) {
  alert("로그인이 필요합니다.");
  location.href = "./login.html";
}
```

### 현재 로그인한 유저 정보 바로 쓰기

서버에 다시 요청하지 않고 저장된 값만 화면에 보여줘도 되는 경우:

```js
const user = getCurrentUser();
if (user) {
  nameEl.textContent = user.name;
}
```

> 저장 위치: `sessionStorage`를 사용합니다. 브라우저 탭/창을 닫으면 로그인이 풀립니다 (팀 정책상 localStorage보다 보안을 우선한 선택).

## 3. 로그인/로그아웃 버튼 자동 토글 (nav)

각 페이지의 nav에 아래 id를 가진 요소를 두면, `commom.js`가 `DOMContentLoaded` 시점에 로그인 상태에 맞춰 자동으로 보이기/숨기기 처리를 해줍니다. 별도 JS를 작성할 필요 없습니다.

```html
<nav>
  <a href="./index.html">홈</a>
  <a id="nav-signup-link" href="./signup.html">회원가입</a>
  <a id="nav-login-link" href="./login.html">로그인</a>
  <a id="nav-mypage-link" href="./mypage.html">내 정보</a>
  <button id="nav-logout-btn" type="button">로그아웃</button>
</nav>
```

- 로그아웃 상태: 회원가입/로그인 링크만 보임
- 로그인 상태: 내 정보 링크 + 로그아웃 버튼만 보임 (로그아웃 버튼 클릭 시 `logout()` 자동 호출)

다른 팀원이 만드는 페이지(상품, 리뷰, 주문 등)에도 이 nav 마크업을 그대로 붙여넣으면 동일하게 동작합니다.
