import { baseUrl } from "../../../utils/shared.js";
import { getToken } from "../../../utils/utils.js";

window.addEventListener("load", async () => {
  const articlesCount = document.querySelector("#articles-count");
  const postsCount = document.querySelector("#posts-count");
  const usersCount = document.querySelector("#users-count");

  const res = await fetch(`${baseUrl}/v1/dashboard`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const response = await res.json();
  console.log(response);
  

});
