/**
 * 백엔드 서버 기본 주소
 */
const BASE_URL = "http://teacherdev09.kro.kr:10002/endpoint";

document.addEventListener("DOMContentLoaded", () => {
  // 메인 페이지(index.html)일 때 상품 목록 로드 및 이벤트 바인딩
  if (document.getElementById("product-container")) {
    fetchProducts();

    const searchBtn = document.getElementById("search-btn");
    const searchInput = document.getElementById("search-keyword");
    const categorySelect = document.getElementById("category-select");

    if (searchBtn) {
      searchBtn.addEventListener("click", () => {
        const keyword = searchInput ? searchInput.value.trim() : "";
        const category = categorySelect ? categorySelect.value : "";
        fetchProducts(keyword, category);
      });
    }

    if (searchInput) {
      searchInput.addEventListener("keyup", (e) => {
        if (e.key === "Enter" && searchBtn) searchBtn.click();
      });
    }

    if (categorySelect) {
      categorySelect.addEventListener("change", () => {
        const keyword = searchInput ? searchInput.value.trim() : "";
        const category = categorySelect.value;
        fetchProducts(keyword, category);
      });
    }
  }

  // 상세 페이지(product-detail.html)일 때 상세 정보 로드
  if (document.getElementById("detail-card")) {
    loadProductDetail();
  }
});

/**
 * 1. 상품 목록 조회 및 검색 (GET /api/products)
 */
async function fetchProducts(keyword = "", category = "") {
  const container = document.getElementById("product-container");
  const statusMsg = document.getElementById("status-message");

  if (!container) return;

  container.innerHTML = "";
  if (statusMsg) {
    statusMsg.style.display = "block";
    statusMsg.innerText = "⏳ 상품 목록을 불러오는 중입니다...";
  }

  try {
    let url = `${BASE_URL}/api/products?page=0&size=50&`;
    if (keyword) url += `keyword=${encodeURIComponent(keyword)}&`;
    if (category) url += `category=${encodeURIComponent(category)}&`;

    const response = await fetch(url);
    const result = await response.json();

    if (statusMsg) statusMsg.style.display = "none";

    // data 상자 안쪽까지 안전하게 꺼내기
    const dataObj = result.data || result;
    const products =
      dataObj.contents ||
      dataObj.content ||
      (Array.isArray(dataObj) ? dataObj : []);

    if (!products || products.length === 0) {
      if (statusMsg) {
        statusMsg.style.display = "block";
        statusMsg.innerText = "🔍 검색된 상품이 없습니다.";
      }
      return;
    }

    products.forEach((product) => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <span class="category-tag">${product.category || "기타"}</span>
        <h3 class="product-title">${product.name}</h3>
        <p class="price">${Number(product.price || 0).toLocaleString()}원</p>
        <p class="stock">남은 재고: ${product.stockQuantity ?? 0}개</p>
      `;

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
    if (loadingEl)
      loadingEl.innerText = "잘못된 접근입니다. (상품 ID가 없습니다)";
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/api/products/${productId}`);
    if (!response.ok) throw new Error("상품 정보 조회 실패");

    const result = await response.json();
    const product = result.data || result;

    document.getElementById("detail-name").innerText = product.name || "-";
    document.getElementById("detail-category").innerText =
      product.category || "기타";
    document.getElementById("detail-price").innerText = Number(
      product.price || 0,
    ).toLocaleString();
    document.getElementById("detail-stock").innerText =
      product.stockQuantity ?? 0;
    document.getElementById("detail-desc").innerText =
      product.description || "상세 설명이 없습니다.";

    if (loadingEl) loadingEl.style.display = "none";
    if (cardEl) cardEl.style.display = "block";
  } catch (error) {
    if (loadingEl) loadingEl.innerText = "⚠️ 상품 정보를 불러오지 못했습니다.";
    console.error("loadProductDetail 에러:", error);
  }
}
