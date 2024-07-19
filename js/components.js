function calculateTotal() {
  let productCart = "productCart";
  let productCartSaveArray =
    JSON.parse(localStorage.getItem(productCart)) || [];
  let total = (productCartSaveArray.length -= 1);
  console.log(total);

  document.querySelector(
    "item-header-cart span"
  ).textContent = `Total: ${total.toFixed(0)}`;
}
customElements.define(
  "item-card",
  class extends HTMLElement {
    connectedCallback() {
      console.log("connected item card");

      this.dataItem = {
        $id: this.attributes.$id.value,
        title: this.attributes.title.value.substr(0, 25) + "...",
        price: this.attributes.price.value,
        thumbnail: this.attributes.thumbnail.value,
        currency_id: this.attributes.currency_id.value,
      };

      this.innerHTML =
        /*html*/
        `
            <ion-card id="${this.dataItem.$id}" button>
              <ion-img alt="" src="${this.dataItem.thumbnail}"></ion-img>
                <ion-card-header>
                    <ion-card-title class="ion-text-title">${this.dataItem.title}</ion-card-title>
                    <ion-card-subtitle class="ion-text-subtitle">${this.dataItem.currency_id} ${this.dataItem.price}</ion-card-subtitle>
                </ion-card-header>
            </ion-card>
         `;

      this.querySelector("ion-card").addEventListener("click", () => {
        navigatePageDetails(this.dataItem.$id);
      });
    }
  }
);
customElements.define(
  "item-header-cart",
  class extends HTMLElement {
    connectedCallback() {
      console.log("connected item header cart");
      this.dataItem = {
        itemSave: this.attributes.itemSave.value,
      };
      this.innerHTML =
        /* html */
        `
      <h2>Mi Carrito de compras</h2>
      <span>Total: ${this.dataItem.itemSave}</span>
      `;
    }
  }
);
customElements.define(
  "item-cart",
  class extends HTMLElement {
    connectedCallback() {
      console.log("connected item cart");
      this.dataItem = {
        $id: this.attributes.$id.value,
        title: this.attributes.title.value.substr(0, 25) + "...",
        price: this.attributes.price.value,
        picture: this.attributes.picture.value,
        currency_id: this.attributes.currency_id.value,
      };
      this.innerHTML =
        /* html */
        `
        <div class="cart-item" data-id="${this.dataItem.$id}" button>
          <img src="${this.dataItem.picture}" class="cart-item-img"></img>
          <div class="cart-item-info">
            <p class="cart-item-title">${this.dataItem.title}</p>
            <div class="secondary-info-container">
              <h3 class="cart-item-price">${this.dataItem.currency_id} ${this.dataItem.price}</h3>
              <ion-icon button class="trash-icon"  name="trash-outline"></ion-icon>
            </div>
          </div>
        </div>
      `;
      this.querySelector(".cart-item").addEventListener("click", () => {
        navigatePageDetails(this.dataItem.$id);
      });

      this.querySelector(".trash-icon").addEventListener("click", (event) => {
        event.stopPropagation();
        removeItemCart(this.dataItem.$id);
        this.remove();
        updateTotalItems();
      });

      function removeItemCart(itemId) {
        let productCart = "productCart";
        let productCartSaveArray =
          JSON.parse(localStorage.getItem(productCart)) || [];
        productCartSaveArray = productCartSaveArray.filter(
          (item) => item.id !== itemId
        );
        localStorage.setItem(productCart, JSON.stringify(productCartSaveArray));
        console.log(`Item con ID ${itemId} eliminado del carrito`);
      }
      function updateTotalItems() {
        const totalPriceText = document.querySelector(".total-precio");
        let productCart = "productCart";
        let productCartSaveArray =
          JSON.parse(localStorage.getItem(productCart)) || [];
        let totalItems = productCartSaveArray.length;
        if (totalItems >= 1) {
          document.querySelector(
            "item-header-cart span"
          ).textContent = `Total: ${totalItems}`;
          for (let i = 0; i < totalItems; i++) {
            console.log(productCartSaveArray[i].price);
            let totalOfTheProducts = productCartSaveArray.reduce(
              (total, item) => {
                return total + item.price * (item.quantity || 1);
              },
              0
            );
            console.log(totalOfTheProducts, "total");
            totalPriceText.textContent = `Total U$D ${totalOfTheProducts.toFixed(
              2
            )}`;
          }
        } else {
          totalPriceText.textContent = `Total: U$D 0.00`;
          document.querySelector("item-header-cart span").textContent = `Total: 0`;
        }
      }
    }
  }
);
customElements.define(
  "filtro-item", class extends HTMLElement {
    connectedCallback() {
      console.log("connected filtro item");
      this.dataItem = {
        $id: this.attributes.id.value,
        name: this.attributes.name.value,
      }

      this.innerHTML =
        /* html */
        `<div id="${this.dataItem.$id}" class="filter-item">${this.dataItem.name}</div>`
    }
  }
)