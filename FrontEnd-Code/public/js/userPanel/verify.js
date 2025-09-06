import { baseUrl } from "../../../utils/shared.js";
import { getMe, getToken } from "../../../utils/utils.js";

window.addEventListener("load", () => {
  const verifyInput = document.querySelector("#verify-input");
  const verifyBtn = document.querySelector("#verify-btn");
  const phoneNumber = document.querySelector("#phone-number");
  const verifyError = document.querySelector("#verify-error");
  const verifyContainer = document.querySelector("#verify-container");

  getMe().then((user) => {
    phoneNumber.innerHTML = user.data.user.phone;
    if (user.data.user.verified) {
      verifyContainer.innerHTML = "";
      verifyContainer.insertAdjacentHTML(
        "beforeend",
        `
  
     <div class="verified">
                <p>تأیید هویت شده</p>
                <span>تأیید هویت شما در ${new Date().toLocaleDateString(
                  "fa-IR"
                )} از طریق کد ملی انجام شد.</span>
                <img
                width="100"
                height="100"
                src="https://img.icons8.com/ios/100/approval--v1.png"
                alt="approval--v1"
                />
            </div>   
  `
      );
    }
  });

  verifyBtn.addEventListener("click", async () => {
    const verifyInputValue = verifyInput.value;
    const nationalCodeRegex = RegExp(/^[0-9]{10}$/g);
    const nationalCodeTestResult = nationalCodeRegex.test(verifyInputValue);

    if (nationalCodeTestResult) {
      await fetch(`${baseUrl}/v1/user/identity`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ nationalCode: verifyInputValue }),
      }).then((res) => {
        console.log(res);

        if (res.status == 200) {
          verifyError.style.display = "none";

          verifyContainer.innerHTML = "";
          verifyContainer.insertAdjacentHTML(
            "beforeend",
            `
  
     <div class="verified">
                <p>تأیید هویت شده</p>
                <span>تأیید هویت شما در ${new Date().toLocaleDateString(
                  "fa-IR"
                )}از طریق کد ملی انجام شد.</span>
                <img
                width="100"
                height="100"
                src="https://img.icons8.com/ios/100/approval--v1.png"
                alt="approval--v1"
                />
            </div>   
  `
          );
        } else {
          verifyError.style.display = "flex";
        }
      });
    } else {
      verifyError.style.display = "flex";
    }
  });
});
