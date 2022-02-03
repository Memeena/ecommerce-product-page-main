"use strict";

const thumbnailImages = document.querySelectorAll(
  ".product__images__thumbnails"
);
const mainproductImage = document.querySelector(".product__images__main");

const lightBox = document.querySelector(".light__box");
const overlay = document.querySelector(".overlay");
const openLightBox = document.querySelector(".light__box-show");
const closeLightBox = document.querySelector(".light__box-close");
const slides = document.querySelectorAll(".main-image");
const btnLeft = document.querySelector(".prev-button");
const btnRight = document.querySelector(".next-button");
const thumbnailContainer = document.querySelector(".thumbnail-container");
const plusButton = document.querySelector(".plus-button");
const minusButton = document.querySelector(".minus-button");
let itemCount = document.querySelector(".product__count");
const addtoCartButton = document.querySelector(".button__addtocart");
const cartQuantity = document.querySelector(".header__cart--notification");
const cartButton = document.querySelector(".header__cart");
const cartBasket = document.querySelector(".header__cart-basket");
const basketPerAmount = document.querySelector(".desc-amt");
const basketQuantity = document.querySelector(".desc-quantity");
const basketTotalAmount = document.querySelector(".desc-total");
const deleteButton = document.querySelector(".delete-button");
const basketDetails = document.querySelector(".header__cart-basket--details");
const checkoutButton = document.querySelector(".checkout__button");
const cartcloseButton = document.querySelector(".cart-close");
const mobilemenuIcon = document.querySelector(".mobile-menu");
const mobileMenu = document.querySelector(".header__mobile--background");
const menuClose = document.querySelector(".menu-close");

const init = function () {
  //Traversing through the thumbnail images on the main page
  thumbnailImages[0].style.border = "3px solid hsl(26, 100%, 55%)";
  cartQuantity.textContent = 0;
};

init();

thumbnailImages.forEach((thumbnail, i) => {
  thumbnail.addEventListener("click", function () {
    //Change the main Product image as of thumbnail clicked
    mainproductImage.src = `images/image-product-${i + 1}.jpg`;

    //Remove already existing active thumbnail
    thumbnailImages.forEach((thumbnail) => {
      thumbnail.classList.remove("thumbnail--active");
      thumbnail.style.border = "";
      thumbnail.style.transform = "scale(1)";
    });

    //Activating the specific thumbnail
    document
      .querySelector(`.product__images__thumbnails[data-image = "${i + 1}"]`)
      .classList.add("thumbnail--active");
    thumbnail.style.border = "3px solid hsl(26, 100%, 55%)";
    thumbnail.style.transform = "scale(1.2)";
  });
});

//Opening LightBox Modal
const openModal = function (e) {
  e.preventDefault();

  lightBox.classList.remove("hidden");
  overlay.classList.remove("hidden");
  slider();
};

//Closing LightBox Modal
const closeModal = function () {
  lightBox.classList.add("hidden");
  overlay.classList.add("hidden");
  thumbnailContainer.innerHTML = "";
};

openLightBox.addEventListener("click", openModal);

closeLightBox.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

//On Pressing Escape key, when the modal is open
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !lightBox.classList.contains("hidden")) {
    closeModal();
  }
});

//Slider function in the lightBox
const slider = function () {
  let curSlide = 0;
  let maxSlide = slides.length;

  //Creating thumbnails
  const createThumbnail = function () {
    slides.forEach((s, i) => {
      thumbnailContainer.insertAdjacentHTML(
        "beforeend",
        `<img
    src="images/image-product-${i + 1}-thumbnail.jpg"
    alt="thumbnail${i + 1}"
    class="thumbnails"
    data-slide="${i}"
  />`
      );
    });
  };

  //Activating thumbnail

  const activateThumbnail = function (slide) {
    //Before activating we need to first remove any active thumbnail
    document.querySelectorAll(".thumbnails").forEach((thumbnail) => {
      thumbnail.classList.remove("thumbnail--active");
      thumbnail.style.border = "";
      thumbnail.style.transform = "scale(1)";
    });

    //Activating the specific thumbnail

    document
      .querySelector(`.thumbnails[data-slide = "${slide}"]`)
      .classList.add("thumbnail--active");
    document.querySelector(
      `.thumbnails[data-slide = "${slide}"]`
    ).style.border = "3px solid hsl(26, 100%, 55%)";
    document.querySelector(
      `.thumbnails[data-slide = "${slide}"]`
    ).style.transform = "scale(1.2)";
  };

  const goToSlide = function (slide) {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slide)}%)`;
    });
  };

  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateThumbnail(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateThumbnail(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createThumbnail();
    activateThumbnail(0);
  };
  init();

  //Event handlers
  thumbnailContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("thumbnail")) {
      // const slide = e.target.dataset.slide;
      //we can also destructure like this
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateThumbnail(slide);
    }
  });

  btnRight.addEventListener("click", nextSlide);

  btnLeft.addEventListener("click", prevSlide);

  //Adding an event listener for 'Left' and 'Right Arrow' key pressed
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") prevSlide();
    e.key === "ArrowRight" && nextSlide();
  });
};

///Adding items to the cart

plusButton.addEventListener("click", function (e) {
  e.preventDefault();
  const count = Number(itemCount.value) || 0;
  itemCount.value = count + 1;
});

minusButton.addEventListener("click", function (e) {
  e.preventDefault();
  const count = Number(itemCount.value) <= 0 ? 1 : Number(itemCount.value);
  itemCount.value = count - 1;
});

addtoCartButton.addEventListener("click", function (e) {
  e.preventDefault();
  //If the itemCount.value > 0, then
  //1.Removing the hidden status of the cart button in the header
  if (+itemCount.value > 0) {
    cartQuantity.classList.remove("hidden");
    cartQuantity.textContent = itemCount.value;
  }
});

//On click of cart button
cartButton.addEventListener("click", function (e) {
  console.log("Cart button is clicked");
  e.preventDefault();
  cartBasket.classList.remove("hidden");
  const qty = +cartQuantity.textContent;
  const amtPerItem = 125.0;
  const totalAmt = (qty * amtPerItem).toFixed(2);

  if (qty === 0) {
    emptyCart();
    return;
  }

  const markup = `
          <img
            src="images/image-product-1-thumbnail.jpg"
            alt="cart image"
            class="cart-image"
          />
          <div class="description">
            <p class="desc-para">Fall limited Edition Sneakers</p>
            <div class="description-amount">
              <p class="desc-amt">$${amtPerItem} x</p>
              <p class="desc-quantity">${qty}</p>
              <p class="desc-total">$${totalAmt}</p>
            </div>
          </div>

          <span>
            <svg class="delete-button">
              <use href="images/sprite.svg#icon-delete"></use>
            </svg>
          </span>`;
  basketDetails.classList.remove("empty-cart");
  basketDetails.textContent = "";
  basketDetails.insertAdjacentHTML("beforeend", markup);
  checkoutButton.classList.remove("hidden");

  //On click of delete button
  basketDetails.lastChild.addEventListener("click", function (e) {
    // e.preventDefault();
    emptyCart();
  });
});

const emptyCart = function () {
  basketDetails.textContent = "Your cart is empty.";
  checkoutButton.classList.add("hidden");
  basketDetails.classList.add("empty-cart");
  cartQuantity.classList.add("hidden");
  itemCount.value = 0;
  cartQuantity.textContent = 0;
};

//On click of cart close button
cartcloseButton.addEventListener("click", function (e) {
  e.preventDefault();
  cartBasket.classList.add("hidden");
});

const openMenu = function (e) {
  e.preventDefault();

  mobileMenu.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

//Closing LightBox Modal
const closeMenu = function () {
  mobileMenu.classList.add("hidden");
  overlay.classList.add("hidden");
};

mobilemenuIcon.addEventListener("click", openMenu);

menuClose.addEventListener("click", closeMenu);
overlay.addEventListener("click", closeMenu);

//On Pressing Escape key, when the modal is open
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !mobileMenu.classList.contains("hidden")) {
    closeMenu();
  }
});
