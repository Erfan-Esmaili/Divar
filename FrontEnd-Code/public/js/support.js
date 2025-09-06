import { baseUrl, getSupportArticles } from "../../utils/shared.js";

window.addEventListener("load", () => {
  let loading = document.querySelector("#loading-container");

  let popularArticlesContainer = document.querySelector("#popular-articles");
  let categoriesContainerElem = document.querySelector("#categories-container");

  getSupportArticles().then((supportArticlesCategory) => {
    loading.style.display = "none";
    let popularArticles = supportArticlesCategory.find(
      (categories) => categories.shortName == "popular_articles"
    );
    console.log(popularArticles.articles);
    popularArticles.articles.forEach((article) => {
      popularArticlesContainer.insertAdjacentHTML(
        "beforeend",
        `
        <a href="./support/article.html?id=${article._id}" class="article">
    <p>${article.title}</p>
    <span>${article.body.slice(0, 175)}...</span>
    <div class="d-flex align-align-items-baseline"><i class="bi bi-arrow-left"></i>
        <p>ادامه مقاله</p>
    </div>

      </a>         
  `
      );
    });
    supportArticlesCategory.forEach((categories) => {
      console.log(categories.name);
      categoriesContainerElem.innerHTML = "";
      categoriesContainerElem.insertAdjacentHTML(
        "beforeend",
        `
      <a href="./support/articles.html?id=${categories._id}">
    <img src="${baseUrl}/${categories.pic.path}" width="64" height="64" alt="">
    <div>
        <p>${categories.name}</p>
        <span>روی گزینهٔ «دیوار من» کلیک کنید. گزینه‌ٔ «ورود به حساب» را انتخاب کرده و شمارهٔ تماس خود را وارد کنید.</span>

    </div>
    <i class="bi bi-chevron-left"></i>
</a>
       
    `
      );
    });
    // !Handle Search Box
    const searchInput = document.querySelector("#search-input");
    const removeIcon = document.querySelector("#remove-icon");
    const searchResult = document.querySelector("#search-result");

    let allArticles = [];
    supportArticlesCategory.forEach((articles) => {
      articles.articles.forEach((article) => allArticles.push(article));
    });

    searchInput.addEventListener("keyup", (event) => {
      searchResult.innerHTML=''
      if (event.target.value.trim()) {
        searchResult.classList.add("active");
        removeIcon.classList.add("active");
        let result = allArticles.filter((result) =>
          result.title.includes(event.target.value)
        );

        if(event.keyCode==13){
          location.href=`./support/search.html?key=${event.target.value.trim()}`
          
        }
        
        if (result.length) {
    searchResult.innerHTML = `
          <a href="./support/search.html?key=${event.target.value.trim()}">
            <i class="bi bi-search"></i>
            ${event.target.value}
          </a>
    `;


          result.forEach((searchResultArticle) => {
            console.log(searchResultArticle);
            searchResult.insertAdjacentHTML(
              "beforeend",
              `
                <a href="./support/article.html?id=${searchResultArticle._id}">
        <i class="bi bi-card-text"></i>
        ${searchResultArticle.title}
      </a>
              `
            );
          });
        } else {
          searchResult.innerHTML = `
          <a href="./support/search.html?key=${event.target.value.trim()}">
            <i class="bi bi-search"></i>
            ${event.target.value.trim()}
          </a>
    `;
        }
      } else {
        searchInput.value = "";
        searchResult.classList.remove("active");
        removeIcon.classList.remove("active");
      }

      removeIcon.addEventListener("click", () => {
        searchInput.value = "";
        searchResult.classList.remove("active");
        removeIcon.classList.remove("active");
      });
    });
  });
});
