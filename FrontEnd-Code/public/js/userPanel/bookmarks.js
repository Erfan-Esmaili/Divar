import { baseUrl } from "../../../utils/shared.js";
import {
  calculateRealtime,
  getParamFromUrl,
  getToken,
  pagination,
  showSwal,
} from "../../../utils/utils.js";

window.addEventListener("load", async () => {
  const postsContainer = document.querySelector("#posts-container");
  const empty = document.querySelector(".empty");
  const paginationItems = document.querySelector(".pagination-items");

  let page = +getParamFromUrl("page");
  !page ? (page = 1) : null;

  const res = await fetch(`${baseUrl}/v1/user/bookmarks?page=${page}&limit=2`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const response = await res.json();
  let bookmarks = response.data.posts;
  let totalPosts = response.data.pagination.totalPosts;

  const postGenerator = (bookmarks) => {
    postsContainer.innerHTML = "";
    bookmarks.map((bookmark) => {
      postsContainer.insertAdjacentHTML(
        "beforeend",
        `

        <div class="post">
                   <div>
                       <div>
                       <a href="../post.html?id=${
                         bookmark._id
                       }" class="title">${bookmark.title}</a>
                       <div>
                           <p>${bookmark.price.toLocaleString()} تومان</p>
                           <p>${calculateRealtime(bookmark.createdAt)} در ${
          bookmark.city.name
        }</p>
                       </div>
                       </div>
                       ${
                         bookmark.pics.length
                           ? `
                            <img src="${baseUrl}/${bookmark.pics[0].path}" />
                       `
                           : `<img src="../../public/images/main/noPicture.PNG" />`
                       }
                   </div>
                   <div>
                       <button  onclick="shareBookmark('${bookmark.title}','${
          bookmark._id
        }')">
                       اشتراک گذاری
                       <i class="bi bi-share"></i>
                       </button>
                       <button  onclick="removeBookmark('${bookmark._id}')">
                       حذف نشان
                       <i class="bi bi-trash"></i>
                       </button>
                   </div>
               </div>           
      `
      );
    });

    pagination(
      "../userPanel/bookmarks.html",
      paginationItems,
      page,
      totalPosts,
      2
    );
  };

  if (bookmarks.length) {
    postGenerator(bookmarks);
  } else {
    empty.style.display = "flex";
  }

  window.removeBookmark = (bookmarkID) => {
    showSwal(
      "میخواهید این پست از نشان برداشته شود؟",
      "warning",
      ["خیر", "بله"],
      async (result) => {
        if (result) {
          fetch(`${baseUrl}/v1/bookmark/${bookmarkID}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }).then((res) => {
            if (res.status == 200) {
              bookmarks = bookmarks.filter(
                (bookmark) => bookmark._id != bookmarkID
              );

              if (bookmarks.length) {
                postGenerator(bookmarks);
              } else {
                postsContainer.innerHTML = "";
                empty.style.display = "flex";
              }
            }
          });
        }
      }
    );
  };

  window.shareBookmark = async (title, id) => {
    await navigator.share({
      title: "اشتراک گذاری",
      text: `${title}`,
      url: `${location.href}?categoryID=${id}`,
    });
  };
});
