import { baseUrl } from "../../../utils/shared.js";
import { calculateRealtime, getToken, showSwal } from "../../../utils/utils.js";

window.addEventListener("load", async () => {
  const empty = document.querySelector(".empty");
  const postsContainer = document.querySelector("#posts-container");

  const res = await fetch(`${baseUrl}/v1/user/notes`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const response = await res.json();

  let posts = response.data.posts;

  function notesGenerator(posts) {
    postsContainer.innerHTML = "";
    posts.forEach((note) => {
      
      postsContainer.insertAdjacentHTML(
        "beforeend",
        `
          <div class="post">
                      <div>
                          ${
                            note.pics.length
                              ? `<img src="${baseUrl}/${note.pics[0].path}" />`
                              : `<img src="../../public/images/main/noPicture.PNG" />`
                          }
                          
                          <div>
                          <a class="title" href="../post.html?id=${note._id}">${
          note.title
        }</a>
                          <p>${calculateRealtime(note.createdAt)} در ${
          note.city.name
        }</p>
                          <p>${note.note.content}</p>
                          </div>
                      </div>
                      <i class="bi bi-trash" onclick=removeNote('${
                        note.note._id
                      }')></i>
                  </div>   
          
          `
      );
    });
  }

  if (posts.length) {
    notesGenerator(posts);
  } else {
    empty.style.display = "flex";
  }

  window.removeNote = (noteID) => {
    showSwal("از حذف یادداشت مطمئنی؟", "warning", ["خیر", "بله"],async (result) => {
      if (result) {
       await fetch(`${baseUrl}/v1/note/${noteID}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }).then((res) => {
          if (res.status == 200) {
            
            posts = posts.filter((post) => post.note._id !== noteID);
            console.log(posts);
            
            if (posts.length) {
              notesGenerator(posts);
            } else {
              postsContainer.innerHTML = "";
              empty.style.display = "flex";
            }
          }
        });
      }
    });
  };
});
