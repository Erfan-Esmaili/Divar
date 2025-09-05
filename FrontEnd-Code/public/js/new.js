import { baseUrl } from "../../utils/shared.js";
import { isLogin } from "../../utils/utils.js";

window.addEventListener("load", async () => {
  let loading = document.querySelector("#loading-container");
  let showCategories = document.querySelector("#show-categoies");
  let allCategoriesContent = document.querySelector("#categories");
  let categoriesContainer = document.querySelector("#categories-container");
  let categoriesLoading = document.querySelector("#categories-loading");
  let descriptionCheckbox = document.querySelector("#description-checkbox");
  let searchInput = document.querySelector("#search-input");
  let resultContainer = document.querySelector("#result-container");
  let removeIcon = document.querySelector("#remove-icon");

  let descriptionCheckboxValue = false;
  let isUserLogin = isLogin();

  loading.style.display = "none";

  if (!isUserLogin) {
    location.href = "./posts.html";
  }

  const res = await fetch(`${baseUrl}/v1/category`);
  const response = await res.json();
  const allCategories = response.data.categories;
  descriptionCheckbox.addEventListener("change", (event) => {
    descriptionCheckboxValue = event.target.checked;
  });
  showCategories.addEventListener("click", async () => {
    showCategories.classList.remove("active");
    categoriesContainer.classList.add("active");

    categoriesLoading.style.display = "none";

    renderCategories(allCategories);

    descriptionCheckbox.addEventListener("change", () => {
      descriptionCheckboxValue = descriptionCheckbox.checked;
      renderCategories(allCategories);
    });
  });

  const renderCategories = (allCategories, title, id) => {
    allCategoriesContent.innerHTML = "";
    if (title) {
      allCategoriesContent.insertAdjacentHTML(
        "beforeend",
        `
              <div class="back" onclick="${
                id ? `categoryClickHandler('${id}')` : `backToAllCategory()`
              }">
                <i class="bi bi-arrow-right"></i>
                <p>بازگشت به ${title}</p>
              </div>
        `
      );
    }
    allCategories.map((category) => {
      allCategoriesContent.insertAdjacentHTML(
        "beforeend",
        `
          
          <div class="box flex-column align-items-start" onclick="categoryClickHandler('${
            category._id
          }')">
          <div class="d-flex w-100 justify-content-between">
          <div class="d-flex align-items-start">
          <i class="bi bi-house-door ms-2"></i>
          <p>${category.title}</p>
          </div>
          <i class="bi bi-chevron-left"></i>
          </div>
          <div>
          
          <span>${descriptionCheckboxValue ? category.description : ""}</span>
          </div>
        </div>
          
          
          `
      );
    });
  };

  window.categoryClickHandler = (categoryID) => {
    const category = allCategories.find(
      (category) => category._id == categoryID
    );

    if (category) {
      renderCategories(category.subCategories, "همه دسته ها");
    } else {
      const allSubCategory = allCategories.flatMap(
        (category) => category.subCategories
      );
      const findSubCategory = allSubCategory.find(
        (subCategoryID) => subCategoryID._id == categoryID
      );
      console.log(findSubCategory);

      if (findSubCategory) {
        const findParentCategory = allCategories.find(
          (parentCategory) => parentCategory._id === findSubCategory.parent
        );
        renderCategories(
          findSubCategory.subCategories,
          findParentCategory.title,
          findParentCategory._id
        );
        console.log(findParentCategory._id);

        // console.log(findSubCategory);
      } else {
        location.href = `./new/registerPost.html?categoryID=${categoryID}`;
      }
    }
  };
  window.backToAllCategory = () => {
    renderCategories(allCategories, "همه دسته ها");
  };

  // !Search handler

  searchInput.addEventListener("keyup", async (event) => {
    if (event.target.value.trim()) {
      removeIcon.style.display = "block";
      resultContainer.classList.add("active");

      const res = await fetch(`${baseUrl}/v1/category/sub`);
      const searchResponse = await res.json();
      const subcategoriesTitle = searchResponse.data.categories;

      const result = subcategoriesTitle.filter((subCategories) =>
        subCategories.title.includes(event.target.value.trim())
      );
      console.log(result);
      resultContainer.innerHTML = "";
      if (result) {
        result.forEach((element) => {
          resultContainer.insertAdjacentHTML(
            "beforeend",
            `
      <a href="./new/registerPost.html?categoryID=${element._id}" class="search-result">
  <p>${element.title}</p>
  <i class="bi bi-chevron-left"></i>
</a>
      `
          );
        });
      } else {
        resultContainer.insertAdjacentHTML(
          "beforeend",
          `
              <div class="empty">
               <img src="https://support-faq.divarcdn.com/web/2024/03/static/media/magnifier.7f88b2e3f8ae30f4333986d0b0fbcf1d.svg">
               <p>یافت نشد</p>
              </div>
              
              `
        );
      }
    } else {
      removeIcon.style.display = "none";
      searchInput.value = "";
      resultContainer.classList.remove("active");
    }
  });

  removeIcon.addEventListener("click", () => {
    removeIcon.style.display = "none";
    searchInput.value = "";
    resultContainer.classList.remove("active");
  });
});
