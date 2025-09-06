import { logout } from "../../../utils/auth.js";
import { getMe, isLogin } from "../../../utils/utils.js";
window.addEventListener("load", () => {
  const loadingContainer = document.querySelector("#loading-container");
  const phoneNumber = document.querySelector("#phone-number");
  const logoutBtn = document.querySelector(".logout");

  const isUserLogin = isLogin();

  if (isUserLogin) {
    getMe().then((user) => {
      console.log(user.data.user.role);
      if (user.data.user.role == "USER") {
        //!code
      }
      phoneNumber.innerHTML = user.data.user.phone;
      loadingContainer.style.display = "none";

      // ?logoutBtn
      logoutBtn.addEventListener("click", logout);
    });
  } else {
    location.href = "FrontEnd-Code/pages/posts.html";
  }
});
