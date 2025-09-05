import {
  baseUrl,
  getArticleByCategory,
  getArticleByID,
} from "../../../utils/shared.js";
import { getParamFromUrl } from "../../../utils/utils.js";

window.addEventListener("load",async() => {
  let loading = document.querySelector("#loading-container");
  let breadcumbSpan = document.querySelector("#breadcumb span");
  let articleTitle = document.querySelector("#article-title");
  let articleBody = document.querySelector("#article-body");
  let sameArticles = document.querySelector("#same-articles");

  let articleID = getParamFromUrl("id");
  let categoryArticleID = null;

 await getArticleByID(articleID).then((article) => {
    loading.style.display = "none";
    console.log(article);
    document.title = article.title;
    breadcumbSpan.innerHTML = article.title;
    articleTitle.innerHTML = article.title;
    articleBody.innerHTML = article.body;
    categoryArticleID = article.categories[0];
    
  });
  
  getArticleByCategory(categoryArticleID).then(data=>{
   const find= data.filter(dataID=>dataID._id!==articleID)
     
    find.forEach(sameArticle => {
      sameArticles.insertAdjacentHTML('beforeend',`
          <a href="./article.html?id=${sameArticle._id}">${sameArticle.title}</a>
        `)
    });
  })
  
  
});
