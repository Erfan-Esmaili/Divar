import { baseUrl, getPostDetails } from "../../utils/shared.js";
import {
  calculateRealtime,
  showModalMostSearch,
  showSwal,
  isLogin,
  getToken,
  getParamFromUrl,
  saveCityInLocalStorage,
  getCityFromLocalStorage,
} from "../../utils/utils.js";

window.addEventListener("load", () => {
  let loadingContainer = document.querySelector("#loading-container");
  let postTitle = document.querySelector("#post-title");
  let postDescription = document.querySelector("#post-description");
  let postLocation = document.querySelector("#post-location");
  let breadcrumb = document.querySelector("#breadcrumb");
  let shareIcon = document.querySelector("#share-icon");
  let postInfoesList = document.querySelector("#post-infoes-list");
  let phoneInfoBtn = document.querySelector("#phone-info-btn");
  let postFeedbackIcon = document.querySelectorAll(".post_feedback_icon");
  let noteTextarea = document.querySelector("#note-textarea");
  let noteTrashIcon = document.querySelector("#note-trash-icon");
  let bookmarkIconBtn = document.querySelector("#bookmark-icon-btn");
  let bookmarkIcon = bookmarkIconBtn.querySelector(".bi");
  let postPreviewPictureContent =
    document.querySelector("#post-preview");
  let mainSliderWrapper = document.querySelector("#main-slider-wrapper");
  let secondSliderWrapper = document.querySelector("#secend-slider-wrapper"); 
  let mapContent = document.querySelector("#map"); 

  getPostDetails().then(async (post) => {
    console.log(post);
    
    loadingContainer.style.display = "none";
    const isUserLogin = await isLogin();
    let noteID = null;
    let bookmarked = false;
    postTitle.innerHTML = post.title;
    postDescription.innerHTML = post.description;
    postLocation.innerHTML = `${calculateRealtime(post.createdAt)} در ${
      post.city.name
    },${post.neighborhood ? post.neighborhood.name : ""}`;

    breadcrumb.insertAdjacentHTML(
      "beforeend",
      `
        
        
        <li class="main__breadcrumb-item">
          <a href="posts.html?categoryID=${post.breadcrumbs.category._id}" id="category-breadcrumb">${post.breadcrumbs.category.title}</a>
          <i class="main__breadcrumb-icon bi bi-chevron-left"></i>
        </li>
        <li class="main__breadcrumb-item">
          <a href="posts.html?categoryID=${post.breadcrumbs.subCategory._id}" id="category-breadcrumb">${post.breadcrumbs.subCategory.title}</a>
          <i class="main__breadcrumb-icon bi bi-chevron-left"></i>
        </li>
        <li class="main__breadcrumb-item">
          <a href="posts.html?categoryID=${post.breadcrumbs.subSubCategory._id}" id="category-breadcrumb">${post.breadcrumbs.subSubCategory.title}</a>
          <i class="main__breadcrumb-icon bi bi-chevron-left"></i>
        </li>
        <li class="main__breadcrumb-item">${post.title}</li> 
        
        
        `
    );

    postInfoesList.insertAdjacentHTML(
      "beforeend",
      `
              <li class="post__info-item">
                <span class="post__info-key">قیمت</span>
                <span class="post__info-value">${post.price.toLocaleString()}</span>
              </li>
                 
          `
    );

    post.dynamicFields.forEach((fields) => {
      postInfoesList.insertAdjacentHTML(
        "beforeend",
        `
              <li class="post__info-item">
                <span class="post__info-key">${fields.name}</span>
                <span class="post__info-value">${
                  typeof fields.data === "boolean"
                    ? fields.data
                      ? "دارد"
                      : "ندارد"
                    : fields.data
                }</span>
              </li>
                 
          `
      );
    });

    phoneInfoBtn.addEventListener("click", () => {
      showSwal(`شماره تماس :${post.creator.phone}`, "info", "تایید", () => {});
    });

    postFeedbackIcon.forEach((icon) => {
      icon.addEventListener("click", (event) => {
        postFeedbackIcon.forEach((icon) => icon.classList.remove("active"));
        icon.classList.add("active");
      });
    });

    if (isUserLogin) {
      if (post.note) {
        noteTextarea.innerHTML = post.note.content;
        noteTrashIcon.style.display = "block";
        noteID = post.note._id;
      }

      noteTextarea.addEventListener("keyup", () => {
        if (noteTextarea.value.trim()) {
          noteTrashIcon.style.display = "block";
        } else {
          noteTrashIcon.style.display = "none";
        }
      });

      noteTrashIcon.addEventListener("click", async () => {
        noteTextarea.value = "";
        noteTrashIcon.style.display = "none";
        await fetch(`${baseUrl}/v1/note/${noteID}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({
            content: (noteTextarea.value = ""),
          }),
        });
      });

      noteTextarea.addEventListener("blur", async (event) => {
        if (noteID) {
          await fetch(`${baseUrl}/v1/note/${noteID}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify({
              content: event.target.value,
            }),
          }).then((res) => console.log(res));
        } else {
          await fetch(`${baseUrl}/v1/note`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify({
              postId: post._id,
              content: event.target.value,
            }),
          });
        }
      });
    } else {
      noteTextarea.addEventListener("focus", (event) => {
        event.preventDefault();
        showModalMostSearch("login-modal", "login-modal--active");
      });
    }

    // ?bookmarkIconBtn
    if (post.bookmarked) {
      bookmarkIcon.style.color = "red";
      bookmarked = true;
    } else {
      bookmarkIcon.style.color = "gray";
      bookmarked = false;
    }
    bookmarkIconBtn.addEventListener("click", async () => {
      if (isUserLogin) {
        if (bookmarked) {
          await fetch(`${baseUrl}/v1/bookmark/${post._id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }).then((res) => {
            if (res.status == 200) {
              bookmarkIcon.style.color = "gray";
              bookmarked = false;
            }
          });
        } else {
          await fetch(`${baseUrl}/v1/bookmark/${post._id}`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }).then((res) => {
            if (res.status == 201) {
              bookmarkIcon.style.color = "red";
              bookmarked = true;
            }
          });
        }
      } else {
        showModalMostSearch("login-modal", "login-modal--active");
      }
    });

    // !Pictures

    if (post.pics.length) {
      post.pics.map((pic) => {
        mainSliderWrapper.insertAdjacentHTML(
          "beforeend",
          `          
          <div class="swiper-slide">
            <img src="${baseUrl}/${pic.path}"/>
          </div>
                              `
        );
      });
      post.pics.map((pic) => {
        secondSliderWrapper.insertAdjacentHTML(
          "beforeend",
          `          
          <div class="swiper-slide">
            <img src="${baseUrl}/${pic.path}"/>
          </div>
                              `
        );
      });
    } else {
      postPreviewPictureContent.style.display = "none";
    }

    const mainSliderConfig = new Swiper(".mySwiper", {
      spaceBetween: 10,
      rewind: true,
      watchSlidesProgress: true,
    });
    const secondSliderConfig = new Swiper(".mySwiper2", {
      spaceBetween: 10,
      rewind: true,
      loop: true,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      watchSlidesProgress: true,

      thumbs: {
        swiper: mainSliderConfig,
      },
    });

    // ??seen Recently
    const recentSeen = getCityFromLocalStorage("resent-seen");
    const isPostSeen = recentSeen?.some((seenID) => seenID == post._id);
    console.log(isPostSeen);

    if (!recentSeen) {
      saveCityInLocalStorage("resent-seen", [post._id]);
      console.log('asd');
      
    } else {
      if (recentSeen) {
        if(!isPostSeen){
          saveCityInLocalStorage("resent-seen", [...recentSeen, post._id]);
          console.log("asd");
        }
      }


    }

    // **MAP

  let map=  L.map('map').setView([post.map.x,post.map.y],13)

 L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 20,
  }).addTo(map);
  
  let markerIcon=  L.icon({
      iconUrl:  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjciIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCAyNyA0OCI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9InBpbi1hIiB4MT0iNTAlIiB4Mj0iNTAlIiB5MT0iMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0E2MjYyNiIgc3RvcC1vcGFjaXR5PSIuMzIiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjQTYyNjI2Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPHBhdGggaWQ9InBpbi1jIiBkPSJNMTguNzk0MzMzMywxNC40NjA0IEMxOC43OTQzMzMzLDE3LjQwNTQ1OTkgMTYuNDA3NDQ5NiwxOS43OTM3MzMzIDEzLjQ2MDEwNDcsMTkuNzkzNzMzMyBDMTAuNTE0NTUwNCwxOS43OTM3MzMzIDguMTI3NjY2NjcsMTcuNDA1NDU5OSA4LjEyNzY2NjY3LDE0LjQ2MDQgQzguMTI3NjY2NjcsMTEuNTE1MzQwMSAxMC41MTQ1NTA0LDkuMTI3MDY2NjcgMTMuNDYwMTA0Nyw5LjEyNzA2NjY3IEMxNi40MDc0NDk2LDkuMTI3MDY2NjcgMTguNzk0MzMzMywxMS41MTUzNDAxIDE4Ljc5NDMzMzMsMTQuNDYwNCIvPgogICAgPGZpbHRlciBpZD0icGluLWIiIHdpZHRoPSIyMzEuMiUiIGhlaWdodD0iMjMxLjIlIiB4PSItNjUuNiUiIHk9Ii00Ni45JSIgZmlsdGVyVW5pdHM9Im9iamVjdEJvdW5kaW5nQm94Ij4KICAgICAgPGZlT2Zmc2V0IGR5PSIyIiBpbj0iU291cmNlQWxwaGEiIHJlc3VsdD0ic2hhZG93T2Zmc2V0T3V0ZXIxIi8+CiAgICAgIDxmZUdhdXNzaWFuQmx1ciBpbj0ic2hhZG93T2Zmc2V0T3V0ZXIxIiByZXN1bHQ9InNoYWRvd0JsdXJPdXRlcjEiIHN0ZERldmlhdGlvbj0iMiIvPgogICAgICA8ZmVDb2xvck1hdHJpeCBpbj0ic2hhZG93Qmx1ck91dGVyMSIgdmFsdWVzPSIwIDAgMCAwIDAgICAwIDAgMCAwIDAgICAwIDAgMCAwIDAgIDAgMCAwIDAuMjQgMCIvPgogICAgPC9maWx0ZXI+CiAgPC9kZWZzPgogIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICA8cGF0aCBmaWxsPSJ1cmwoI3Bpbi1hKSIgZD0iTTEzLjA3MzcsMS4wMDUxIEM1LjgwMzIsMS4yMTUxIC0wLjEzOTgsNy40Njg2IDAuMDAyNywxNC43MzkxIEMwLjEwOTIsMjAuMTkwMSAzLjQ1NTcsMjQuODQ2MSA4LjE5NTcsMjYuODYzNiBDMTAuNDUzMiwyNy44MjUxIDExLjk3MTIsMjkuOTc0NiAxMS45NzEyLDMyLjQyODYgTDExLjk3MTIsMzkuNDExNTUxNCBDMTEuOTcxMiw0MC4yMzk1NTE0IDEyLjY0MTcsNDAuOTExNTUxNCAxMy40NzEyLDQwLjkxMTU1MTQgQzE0LjI5OTIsNDAuOTExNTUxNCAxNC45NzEyLDQwLjIzOTU1MTQgMTQuOTcxMiwzOS40MTE1NTE0IEwxNC45NzEyLDMyLjQyNTYgQzE0Ljk3MTIsMzAuMDEyMSAxNi40MTcyLDI3LjgzNDEgMTguNjQ0NywyNi45MDU2IEMyMy41MTY3LDI0Ljg3NzYgMjYuOTQxMiwyMC4wNzYxIDI2Ljk0MTIsMTQuNDcwNiBDMjYuOTQxMiw2Ljg5ODYgMjAuNjkzNywwLjc4NjEgMTMuMDczNywxLjAwNTEgWiIvPgogICAgPHBhdGggZmlsbD0iI0E2MjYyNiIgZmlsbC1ydWxlPSJub256ZXJvIiBkPSJNMTMuNDcwNiw0Ny44MTIgQzEyLjU1NTYsNDcuODEyIDExLjgxNDYsNDcuMDcxIDExLjgxNDYsNDYuMTU2IEMxMS44MTQ2LDQ1LjI0MSAxMi41NTU2LDQ0LjUgMTMuNDcwNiw0NC41IEMxNC4zODU2LDQ0LjUgMTUuMTI2Niw0NS4yNDEgMTUuMTI2Niw0Ni4xNTYgQzE1LjEyNjYsNDcuMDcxIDE0LjM4NTYsNDcuODEyIDEzLjQ3MDYsNDcuODEyIFoiLz4KICAgIDx1c2UgZmlsbD0iIzAwMCIgZmlsdGVyPSJ1cmwoI3Bpbi1iKSIgeGxpbms6aHJlZj0iI3Bpbi1jIi8+CiAgICA8dXNlIGZpbGw9IiNGRkYiIHhsaW5rOmhyZWY9IiNwaW4tYyIvPgogIDwvZz4KPC9zdmc+Cg==",
      iconSize: [35, 35],
    })
    L.marker([post.map.x,post.map.y],{icon:markerIcon}).addTo(map)


  });

  shareIcon.addEventListener("click", async () => {
    await navigator.share({
      title: "MDN",
      text: "Learn web development on MDN!",
      url: location.href,
    });
  });
});
