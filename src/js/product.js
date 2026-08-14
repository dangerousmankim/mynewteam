/**
 * 백엔드 서버 기본 주소
 */
const BASE_URL = "http://teacherdev09.kro.kr:10002/endpoint";

/**
 * 1. 상품 목록 조회 및 검색 (GET /api/products)
 */
async function fetchProducts(keyword = "", category = "") {
  const container = document.getElementById("product-container");
  const statusMsg = document.getElementById("status-message");

  if (!container) return;

  // 이전 내용 비우고 로딩 띄우기
  container.innerHTML = "";
  if (statusMsg) {
    statusMsg.style.display = "block";
    statusMsg.innerText = "⏳ 상품 목록을 불러오는 중입니다...";
  }

  try {
    // 쿼리스트링 생성 (검색어, 카테고리 필터링)
    let url = `${BASE_URL}/api/products?`;
    if (keyword) url += `keyword=${encodeURIComponent(keyword)}&`;
    if (category) url += `category=${encodeURIComponent(category)}&`;

    const response = await fetch(url);
    const result = await response.json();

    if (statusMsg) statusMsg.style.display = "none";

    // 데이터 꺼내기 (배열 형태 확인)
    const products = result.contents || result.content || result;
    if (!products || products.length === 0) {
      if (statusMsg) {
        statusMsg.style.display = "block";
        statusMsg.innerText = "🔍 검색된 상품이 없습니다.";
      }
      return;
    }

    // 카드 형태로 화면에 출력
    products.forEach((product) => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <span class="category-tag">${product.category || '기타'}</span>
        <h3 class="product-title">${product.name}</h3>
        <p class="price">${Number(product.price).toLocaleString()}원</p>
        <p class="stock">남은 재고: ${product.stockQuantity}개</p>
      `;

      // 카드 클릭 시 상세 페이지로 이동 (id 전달)
      card.onclick = () => {
        location.href = `product-detail.html?id=${product.id}`;
      };

      container.appendChild(card);
    });

  } catch (error) {
    if (statusMsg) {
      statusMsg.style.display = "block";
      statusMsg.innerText = "⚠️ 상품 목록을 불러오지 못했습니다.";
    }
    console.error("fetchProducts 에러:", error);
  }
}

/**
 * 2. 상품 상세 정보 조회 (GET /api/products/{id})
 */
async function loadProductDetail() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  const loadingEl = document.getElementById("detail-loading");
  const cardEl = document.getElementById("detail-card");

  if (!productId) {
    if (loadingEl) loadingEl.innerText = "잘못된 접근입니다. (상품 ID가 없습니다)";
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/api/products/${productId}`);
    if (!response.ok) throw new Error("상품 정보 조회 실패");

    const product = await response.json();

    // 상세 내용 화면에 채우기
    document.getElementById("detail-name").innerText = product.name;
    document.getElementById("detail-category").innerText = product.category || '기타';
    document.getElementById("detail-price").innerText = Number(product.price).toLocaleString();
    document.getElementById("detail-stock").innerText = product.stockQuantity;
    document.getElementById("detail-desc").innerText = product.description || "상세 설명이 없습니다.";

    if (loadingEl) loadingEl.style.display = "none";
    if (cardEl) cardEl.style.display = "block";

  } catch (error) {
    if (loadingEl) loadingEl.innerText = "⚠️ 상품 정보를 불러오지 못했습니다.";
    console.error("loadProductDetail 에러:", error);
  }
}