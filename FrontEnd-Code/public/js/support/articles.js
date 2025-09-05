import { baseUrl, getArticles } from "../../../utils/shared.js";
import { getParamFromUrl } from "../../../utils/utils.js";

window.addEventListener("load", () => {
  let articleID = getParamFromUrl("id");
  let loading = document.querySelector("#loading-container");
  let breadcrumbSpan = document.querySelector("#breadcrumb span");
  let articlesContent = document.querySelector("#articles");
  let categoryInfo = document.querySelector("#category-info");

  getArticles().then((categories) => {
    loading.style.display = "none";
    const category = categories.find((category) => category._id === articleID);
    console.log(category);
    breadcrumbSpan.innerHTML = category.name;
    document.title = category.name;
    categoryInfo.insertAdjacentHTML(
      "beforeend",
      `
    <img class="category-info-icon" src="${baseUrl}/${category.pic.path}">
      <p class="category-info-title">${category.name}</p>
  `
    );

    category.articles.map((article) => {
      console.log(article);
      
      articlesContent.insertAdjacentHTML(
        "beforeend",
        `
        <a href="./article.html?id=${article._id}" class="article flex-column align-items-start">
    <p>${article.title}</p>
    <div class="d-flex align-items-center">
    <span>${article.body.slice(0,150)}...</span>
    <i class="bi bi-arrow-left"></i>
    
    </div>

      </a>
    
    
    
    `
      );
    });
  });
});
