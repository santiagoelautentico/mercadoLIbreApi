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
