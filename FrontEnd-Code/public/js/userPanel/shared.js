import { logout } from "../../../utils/auth.js";
import { getMe, isLogin } from "../../../utils/utils.js";

window.addEventListener("load", async () => {
  let sidebarPhoneNumber = document.querySelector("#sidebar-phone-number");
  let logoutBtn = document.querySelector("#logout-btn");

  const isLoginUsr = isLogin();
  if (isLoginUsr) {
    getMe().then((user) => {
      sidebarPhoneNumber.innerHTML = user.data.user.phone;
    });
  } else {
    location.href = "../posts.html";
  }

// !!logout
  logoutBtn?.addEventListener('click' ,logout)
});
