# 공통 디자인 시스템 적용 가이드 (src/css/style.css)

`src/css/style.css` 하나에 팀 디자인 시안(Luminous Soft-UI System)의 색상/폰트/여백 변수와 기본 컴포넌트 클래스가 들어있습니다. 모든 페이지는 이 파일 하나만 불러오면 됩니다.

## 1. 페이지에 연결하기

`<head>`에 아래 한 줄만 추가하면 끝입니다.

```html
<head>
  <meta charset="UTF-8" />
  <title>페이지 제목</title>
  <link rel="stylesheet" href="./css/style.css" />
</head>
```

> 경로는 페이지 위치 기준 상대경로입니다. `src/` 바로 아래 있는 페이지는 `./css/style.css`, 하위 폴더에 페이지를 두면 `../css/style.css`처럼 맞춰주세요.

## 2. 색상 변수

시안의 팔레트 4개를 기본으로, 각 색상마다 밝기 단계(900~100)를 자동 생성해뒀습니다. 직접 hex를 쓰지 말고 아래 변수를 사용하세요.

```css
color: var(--color-primary);       /* #7FB7AD 세이지 그린 */
color: var(--color-secondary);     /* #9DB2BF 블루 그레이 */
color: var(--color-tertiary);      /* #E3F2FD 라이트 블루 */
color: var(--color-neutral);       /* #526D82 슬레이트 */
```

- `--color-{palette}-900` : 가장 어두움 (버튼 배경 등)
- `--color-{palette}-700`
- `--color-{palette}-500` : 기본값 (베이스 컬러와 동일)
- `--color-{palette}-300`
- `--color-{palette}-100` : 가장 밝음 (배경/배지 등)

화면 요소에는 아래 **시맨틱 변수**를 우선 사용하세요. 나중에 팔레트가 바뀌어도 이 변수들만 바꾸면 전체 화면이 같이 바뀝니다.

| 변수 | 용도 |
|---|---|
| `--color-bg` | 페이지 배경 |
| `--color-surface` | 카드/패널 배경 (연한 블루 톤) |
| `--color-surface-alt` | 흰색 배경 (인풋, 버튼 등) |
| `--color-border` | 테두리 |
| `--color-text-primary` | 본문 텍스트 (진한 남색) |
| `--color-text-secondary` | 보조 텍스트 (회색) |
| `--color-text-muted` | placeholder 등 옅은 텍스트 |
| `--color-text-inverse` | 어두운 배경 위 흰 텍스트 |
| `--color-danger` / `--color-danger-bg` | 삭제 등 위험 액션 |

```css
.my-card {
  background: var(--color-surface);
  color: var(--color-text-primary);
}
```

## 3. 폰트

- 제목(h1~h3)에는 `--font-headline` (Plus Jakarta Sans)이 자동 적용됩니다.
- 본문/버튼/인풋에는 `--font-body` (Be Vietnam Pro)가 자동 적용됩니다.
- 새로 만드는 요소에 직접 지정하고 싶다면:

```css
font-family: var(--font-headline); /* 제목용 */
font-family: var(--font-body);     /* 본문용 */
```

## 4. 여백 / 라운드 / 그림자

```css
padding: var(--space-md);          /* xs, sm, md, lg, xl */
border-radius: var(--radius-md);   /* sm, md, lg, full */
box-shadow: var(--shadow-soft);
```

## 5. 바로 쓰는 공통 컴포넌트 클래스

마크업에 클래스만 붙이면 시안과 동일한 스타일이 적용됩니다.

**카드**
```html
<div class="card">...</div>
```

**버튼 (4종)**
```html
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-inverted">Inverted</button>
<button class="btn btn-outlined">Outlined</button>
```

**인풋 / 서치**
```html
<input class="input" type="text" placeholder="Search" />
```

**배지 / 라벨**
```html
<span class="badge badge-primary">Label</span>
```

**아이콘 버튼 (원형/사각)**
```html
<button class="icon-btn icon-btn-primary">🏠</button>
<button class="icon-btn icon-btn-square">✏️</button>
<button class="icon-btn icon-btn-danger">🗑️</button>
```

**하단 네비게이션 pill**
```html
<nav class="nav-pill">
  <button class="icon-btn icon-btn-primary">🏠</button>
  <button class="icon-btn">🔍</button>
  <button class="icon-btn">👤</button>
</nav>
```

**진행바**
```html
<div class="progress-track">
  <div class="progress-fill" style="width: 60%"></div>
</div>
```

## 6. 새 컴포넌트를 추가할 때

1. hex 값을 직접 쓰지 말고 반드시 `var(--color-...)` 변수를 사용하세요.
2. 시안에 없는 새로운 색이 필요하면 임의로 만들지 말고, 먼저 리뷰(PR)에서 논의해주세요 — 변수는 `style.css` 상단 `:root` 한 곳에서만 관리합니다.
3. 여러 페이지에서 반복해서 쓰는 컴포넌트라면 개별 페이지가 아니라 `style.css`에 클래스로 추가해서 공용화해주세요.
