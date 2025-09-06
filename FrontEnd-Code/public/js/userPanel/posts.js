import { baseUrl } from "../../../utils/shared.js";
import {
  calculateRealtime,
  getParamFromUrl,
  getToken,
  pagination,
} from "../../../utils/utils.js";

window.addEventListener("load", async () => {
  const empty = document.querySelector(".empty");
  const postsContainer = document.querySelector("#posts-container");
  const paginationItems = document.querySelector(".pagination-items");

  let page = +getParamFromUrl("page");
  !page ? (page = 1) : null;

  const res = await fetch(`${baseUrl}/v1/user/posts?page=${page}&limit=1`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const response = await res.json();
  let posts = response.data.posts;
  let totalPosts = response.data.pagination.totalPosts;

  if (posts.length) {
    posts.map((post) => {
      console.log(post);

      postsContainer.insertAdjacentHTML(
        "beforeend",
        `

              <a class="post">
                <div class="post-info">
                ${
                  post.length
                    ? `
                  <img src="${baseUrl}/${post.pics[0].path}" />
                `
                    : `<img src="../../public/images/main/noPicture.PNG" />`
                }
                <div>
                    <p class="title">${post.title}</p>
                    <p class="price">${post.price.toLocaleString()} تومان</p>
                    <p class="location">${calculateRealtime(
                      post.createdAt
                    )} در ${post.city.name}</p>
                </div>
                </div>
                <div class="post-status">
                <div>
                    <p>وضعیت آگهی:</p>
                  ${
                    post.status == "pending"
                      ? '<p class="pending">در صف انتشار</p>'
                      : post.status == "rejected"
                      ? '<p class="reject">رد شده</p>'
                      : post.status == "published"
                      ? '<p class="publish">منتشر شده</p>'
                      : ""
                  }
                    
                </div>
                <button class="controll-btn">مدیریت اگهی</button>
                </div>
            </a> 

          
          
          
          
          
          
          `
      );
    });
  } else {
    empty.style.display = "flex";
  }

  pagination(
    "FrontEnd-Code/pages/userPanel/posts.html",
    paginationItems,
    page,
    totalPosts,
    1
  );
});
