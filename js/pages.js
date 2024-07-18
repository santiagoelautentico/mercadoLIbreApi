let productCart = "productCart";
customElements.define(
  "page-list-items",
  class extends HTMLElement {
    connectedCallback() {
      console.log("connected page list items");

      this.innerHTML = document.getElementById(
        "page-list-items.html"
      ).innerHTML;

      this.chargeListItems();
      this.addEventListeners();
    }
    addEventListeners() {
      this.addEventListener("click", (event) => {
        if (event.target && event.target.matches(".categorie")) {
          const clickedElement = event.target;
          const categories = document.querySelectorAll(".categorie");
          categories.forEach((element) => {
            element.classList.remove("active");
          });
          clickedElement.classList.add("active");
          const categorieId = clickedElement.getAttribute("data-id");
          this.chargeListItemsCategories(categorieId);
        }
      });
    }
    chargeListItemsCategories(categorieId) {
      fetch(`${API_URL}sites/MLU/search?official_store_id=628&q=${categorieId}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data.results);
          this.listShopCard(data);
        })
        .catch((error) => {
          console.log(error);
        });
    }

    chargeListItems() {
      fetch(`${API_URL}sites/MLU/search?official_store_id=628`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data.results);
          this.listShopCard(data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    listShopCard(list) {
      let itemHtml = "";

      for (let item of list.results) {
        itemHtml +=
          /* html */
          `
            <item-card
              $id="${item.id}"
              title="${item.title}"
              price="${item.price}"
              thumbnail="${item.thumbnail}"
              currency_id="${item.currency_id}" 
              >
            </item-card>
          `;
      }

      this.querySelector("#list-items").innerHTML = itemHtml;
    }
  }
);
customElements.define(
  "page-item-detail",
  class extends HTMLElement {
    connectedCallback() {
      console.log("connected page item detail", this.itemId);

      this.innerHTML = document.getElementById(
        "page-item-detail.html"
      ).innerHTML;

      this.chargeItemDetail();
      this.chargeItemDetailDescription();
    }

    chargeItemDetail() {
      fetch(`${API_URL}items/${this.itemId}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          this.itemDetail(data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    chargeItemDetailDescription() {
      fetch(`${API_URL}items/${this.itemId}/description`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data, "algo");
          this.itemDetailDescription(data);
        })
        .catch((error) => {
          console.log(error, "algo");
        });
    }
    getLocalStorage(key) {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    }
    setLocalStorage(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    }
    itemDetail(item) {
      const brandAttribute = item.attributes.find(
        (attr) => attr.id === "BRAND"
      );
      const brandName = brandAttribute ? brandAttribute.value_name : "No brand";
      console.log(brandName);
      let itemHtml = "";
      itemHtml += /* html */ `
        <ion-card id="${item.id}">
          <img src="${item.pictures[0].url}" alt="" />
          <ion-card-header class="header-card-detail">
            ${
              item.original_price
                ? `<ion-item class="titleDetail-container">
            <ion-label class="titleDetail" style="font-family: Gizmo-Bold; font-size: 18px;">${item.title}</ion-label>
            <ion-badge slot="end" style="padding: 1rem;">On Sale</ion-badge>
          </ion-item>`
                : `<ion-card-title class="titleDetail">${item.title}</ion-card-title>`
            }
            <ion-item id="subtitle-card-detail">
              <ion-label id="brand-container">
                <div class="${brandName} brand-icon"></div>
                <h4>${brandName}</h4>
              </ion-label>
              ${
                item.shipping.free_shipping
                  ? `<ion-badge slot="end" style="padding: 1rem; background-color: #04a339; color: white; font-size: 16px;">
                  Free Shipping 
                </ion-badge>`
                  : ""
              }
              
            </ion-item>
          </ion-card-header>
          </ion-card>
          <div class="price-container" id="priceContainer">
              ${
                item.original_price
                  ? `<p class="original-price">${item.original_price}</p>`
                  : ""
              }
              <h2 class="price" id="price">${item.currency_id} ${
        item.price
      }</h2>
              <button class="call-to-action" id="addToCart">ADD TO CART</button>
          </div>
      `;
      this.querySelector("#item-detail").innerHTML = itemHtml;
      const addToCart = this.querySelector("#addToCart");
      addToCart.addEventListener("click", () => {
        this.localStorageProduct(item);
      });
    }
    localStorageProduct(item) {
      let productCart = "productCart";
      let productCartSaveArray = this.getLocalStorage(productCart) || [];
      const productExists = productCartSaveArray.some(
        (cartItem) => cartItem.id === item.id
      );
      if (!productExists) {
        productCartSaveArray.push(item);
        this.setLocalStorage(productCart, productCartSaveArray);
        navigateCart();
      } else {
        console.log("El producto ya existe en el carrito");
        // this.renderProductRepeated();
        this.renderProductRepeated();
      }
    }
    renderProductRepeated() {
      let itemHtml = "";
      itemHtml += /* html */ `
        <div><h3>Este producto ya esta en el carrito</h3></div>
      `;
      this.querySelector("#ion-padding").innerHTML = itemHtml;
    }
    itemDetailDescription(description) {
      let truncatedText = description.plain_text.slice(0, 300);
      let itemHtml = "";
      itemHtml += /* html */ `
        <h3 class='title-description' id="title-description">Description</h3>
        <p id="item-detail-description">${truncatedText}</p>
        <p id="">See more</p>
      `;
      this.querySelector("#item-detail-description-container").innerHTML =
        itemHtml;
    }
  }
);
customElements.define(
  "page-cart",
  class extends HTMLElement {
    connectedCallback() {
      console.log("connected page-cart");
      this.innerHTML = document.getElementById("page-card.html").innerHTML;
      this.renderCart();
      this.renderHeaderCart();
      this.renderBtnShop();
    }
    getLocalStorage(key) {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    }
    setLocalStorage(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    }

    renderCart() {
      let itemSave = this.getLocalStorage(productCart) || [];
      let itemHtml = "";
      for (let item of itemSave) {
        itemHtml += /* html */ `
        <div class="cart-item" data-id="${item.id}">
          <img src="${item.thumbnail}" class="cart-item-img"></img>
          <div class="cart-item-info">
            <p class="cart-item-title">${item.title}</p>
            <div class="secondary-info-container">
              <h3 class="cart-item-price">${item.currency_id} ${item.price}</h3>
              <ion-icon button class="trash-icon"  name="trash-outline"></ion-icon>
            </div>
          </div>
        </div>
        `;
        this.querySelector("#cart-items").innerHTML = itemHtml;
      }
    }
    renderHeaderCart() {
      let itemSave = this.getLocalStorage(productCart) || [];
      let itemHtml = "";
      itemHtml += /* html */ `
      <h2>Mi Carrito de compras</h2>
      <span>Total: ${itemSave.length}</span>
      `;
      this.querySelector("#header-card").innerHTML = itemHtml;
    }
    renderBtnShop() {
      let itemHtml = "";
      let itemSave = this.getLocalStorage(productCart) || [];

      // Calcular el monto total de los productos
      let totalProducts = itemSave.reduce((total, item) => {
        return total + item.price * (item.quantity || 1);
      }, 0);

      itemHtml += /* html */ `
          <h3>Total: ${totalProducts.toFixed(2)}</h3>    
          <button class="btn-purchase">Comprar</button>
      `;
      this.querySelector("#btn-shop-container").innerHTML = itemHtml;
    }
  }
);
