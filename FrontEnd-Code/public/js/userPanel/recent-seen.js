import { baseUrl } from "../../../utils/shared.js";
import {
  calculateRealtime,
  getCityFromLocalStorage,
  saveCityInLocalStorage,
  showSwal,
} from "../../../utils/utils.js";

window.addEventListener("load", async () => {
  let postsContainer = document.querySelector("#posts-container");
  let empty = document.querySelector(".empty");
  let seenArray = getCityFromLocalStorage("resent-seen");

  console.log(seenArray);

  let allSeenPosts = await Promise.all(
    seenArray.map(async (postID) => {
      const res = await fetch(`${baseUrl}/v1/post/${postID}`);
      const response = await res.json();
      console.log(response);

      if (response.data.post) {
        return response.data.post;
      } else {
        empty.style.display = "flex";
      localStorage.removeItem('resent-seen')
        
      }
    })
  );
  const postGenerator = (allSeenPosts) => {
    postsContainer.innerHTML = "";
    console.log(allSeenPosts);

    if (allSeenPosts.length) {
      allSeenPosts.forEach((post) => {
        postsContainer.insertAdjacentHTML(
          "beforeend",
          `
      
                    <div class="post">
                        <div>
                        ${
                          post.pics.length
                            ? `<img src="${baseUrl}/${post.pics[0].path}" />`
                            : `<img src="../../public/images/main/noPicture.PNG" />`
                        }
                        
                        <div>
                            <a class="title" href="/pages/post.html?id=${
                              post._id
                            }">${post.title}</a>
                            <p>${calculateRealtime(post.createdAt)} در ${
            post.city.name
          }، ${post.neighborhood.id !== 0 ? post.neighborhood.name : ""}</p>
                        </div>
                        </div>
                        <i onclick="sahrePost('${post._id}', '${
            post.title
          }')" class="bi bi-share"></i>
                        <i onclick="removeRecentSeen('${
                          post._id
                        }')" class="bi bi-trash"></i>
                    </div>      
        
      
      
      `
        );
      });
    } else {
      empty.style.display = "flex";
      localStorage.removeItem('resent-seen')
    }
  };

  postGenerator(allSeenPosts);




  window.removeRecentSeen = (postID) => {
    showSwal("از حذف این پست مطمئنی؟", "warning", ["خیر", "بله"], (result) => {
      if (result) {
        allSeenPosts = allSeenPosts.filter((post) => post._id != postID);
        seenArray = seenArray.filter((ID) => ID != postID);
        console.log(allSeenPosts);
        saveCityInLocalStorage("resent-seen", seenArray);
        postGenerator(allSeenPosts);
      }
    });
  };
});
