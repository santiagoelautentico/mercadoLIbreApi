startApp();
function startApp() {
  saveElements();
}

function saveElements() {
  $.ionNav = document.querySelector("ion-nav");
}
function navigatePageDetails(itemId) {
  $.ionNav.push("page-item-detail", {
    itemId: itemId,
  });
}
function navigateCart() {
  $.ionNav.push("page-cart");
}
function navigateCheckout() {
  $.ionNav.push("page-checkout");
}

function navigateLogin() {
  $.ionNav.push("page-login");
}
function navigateHome() {
  $.ionNav.push("page-list-items");
}

function navigateSignin() {
  $.ionNav.push("page-signin");
}

function nameInMenu() {
  const user = JSON.parse(localStorage.getItem("token"));
  console.log(user);
  const userHeader = document.querySelector("#user-name");

  userHeader.textContent = `${user[0].info.username}`;
}


