// 백엔드 API 주소
const SERVER_URL = 'http://teacherdev09.kro.kr:10002/endpoint';

// URL에서 상품 아이디 가져오기 (기본값: 101)
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('productId') || 101;

// 공통 API 함수 객체
const review = {
  // 리뷰 목록 조회
  async getList(id) {
    const res = await fetch(`${SERVER_URL}/api/products/${id}/reviews`);
    if (!res.ok) throw new Error('조회 실패');
    const json = await res.json();
    return json.data || [];
  },

  // 리뷰 등록
  async create(id, bodyData) {
    const token = localStorage.getItem('accessToken');
    const res = await fetch(`${SERVER_URL}/api/products/${id}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: JSON.stringify(bodyData)
    });
    if (!res.ok) throw new Error('등록 실패');
    return await res.json();
  }
};

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
  // 리뷰 작성 버튼 클릭 이벤트
  const writeBtn = document.getElementById('btnWriteReview');
  if (writeBtn) {
    writeBtn.addEventListener('click', () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert('로그인이 필요한 서비스입니다.');
        location.href = 'login.html';
        return;
      }
      location.href = `review-form.html?productId=${productId}`;
    });
  }

  // 데이터 불러오기
  loadReviews();
});

// 리뷰 데이터 로드 및 렌더링
async function loadReviews() {
  const container = document.getElementById('reviewList');

  try {
    const data = await review.getList(productId);
    drawReviews(data);
    calcSummary(data);
  } catch (e) {
    console.log('서버 미연결: 임시 목업 데이터를 표시합니다.');

    // 연동 전 테스트용 목업
    const dummy = [
      {
        id: 1,
        userName: "김지현",
        rating: 5,
        content: "정말 만족스러운 제품입니다! 디자인이 깔끔하고 미니멀해서 어디에 두어도 잘 어울립니다. 무엇보다 마감이 훌륭해서 고급스러운 느낌이 나네요. 배송도 빠르고 포장도 꼼꼼하게 와서 기분이 좋았습니다. 다음에도 여기서 구매할 의향 100% 입니다.",
        createdAt: "2026-08-10T14:30:00"
      },
      {
        id: 2,
        userName: "박민수",
        rating: 4,
        content: "사용하기 편리해요. 직관적인 인터페이스 덕분에 설명서를 보지 않아도 쉽게 사용할 수 있었습니다. 다만 색상이 화면에서 본 것보다 약간 밝은 편이라 아쉽네요. 그래도 전반적인 성능은 아주 만족스럽습니다.",
        createdAt: "2026-08-08T11:20:00"
      },
      {
        id: 3,
        userName: "이수진",
        rating: 5,
        content: "가성비 최고의 제품입니다. 지인들에게도 추천하고 싶네요. 포장 상태도 매우 좋았습니다.",
        createdAt: "2026-08-01T09:15:00"
      }
    ];

    drawReviews(dummy);
    calcSummary(dummy);
  }
}

// 화면에 리뷰 카드 출력
function drawReviews(list) {
  const container = document.getElementById('reviewList');
  if (!container) return;

  container.innerHTML = '';

  if (!list || list.length === 0) {
    container.innerHTML = '<p class="empty-msg">등록된 리뷰가 없습니다.</p>';
    return;
  }

  list.forEach(item => {
    // 이름 가운데 글자 마스킹 (김지현 -> 김*현)
    let maskedName = item.userName || '익명';
    if (maskedName.length === 2) {
      maskedName = maskedName[0] + '*';
    } else if (maskedName.length > 2) {
      maskedName = maskedName[0] + '*' + maskedName[maskedName.length - 1];
    }

    // 날짜 포맷 (YYYY.MM.DD)
    const dateStr = item.createdAt ? item.createdAt.slice(0, 10).replace(/-/g, '.') : '';
    
    // 별점 채우기
    const starCount = item.rating || 5;
    const stars = '★'.repeat(starCount) + '☆'.repeat(5 - starCount);

    const article = document.createElement('article');
    article.className = 'review-item';
    article.innerHTML = `
      <div class="item-top">
        <div class="user-avatar">${maskedName[0]}</div>
        <div class="user-meta">
          <span class="user-name">${maskedName}</span>
          <span class="post-date">${dateStr}</span>
        </div>
        <div class="item-stars">${stars}</div>
      </div>
      <p class="review-content">${item.content || ''}</p>
    `;

    container.appendChild(article);
  });
}

// 상단 별점 요약 및 게이지 바 계산
function calcSummary(list) {
  if (!list || list.length === 0) return;

  const total = list.length;
  const countEl = document.getElementById('totalReviewCount');
  const avgEl = document.getElementById('avgScore');

  if (countEl) countEl.textContent = `총 ${total}개의 리뷰`;

  let sum = 0;
  const scoreCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  list.forEach(item => {
    const score = item.rating || 5;
    scoreCounts[score] = (scoreCounts[score] || 0) + 1;
    sum += score;
  });

  if (avgEl) avgEl.textContent = (sum / total).toFixed(1);

  // 1~5점 프로그레스 바 너비 조절
  const rows = document.querySelectorAll('.chart-side .bar-row');
  rows.forEach(row => {
    const labelText = row.querySelector('.bar-label')?.textContent;
    if (!labelText) return;

    const scoreNum = parseInt(labelText.replace('점', ''));
    const count = scoreCounts[scoreNum] || 0;
    const percent = Math.round((count / total) * 100);

    const barFill = row.querySelector('.bar-fill');
    const barPercent = row.querySelector('.bar-percent');

    if (barFill) barFill.style.width = `${percent}%`;
    if (barPercent) barPercent.textContent = `${percent}%`;
  });
}