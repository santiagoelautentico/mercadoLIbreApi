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
    c;
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

    itemDetail(item) {
      let itemHtml = "";
      const hasOriginalPrice = item.original_price;
      itemHtml += /* html */ `
        <ion-card>
          <img src="${item.pictures[0].url}" alt="" />
          <ion-card-header>
            <ion-card-title>${item.title}</ion-card-title>
            ${item.original_price ? `<ion-card-subtitle>${item.original_price}</ion-card-subtitle>` : ""}
            <ion-card-subtitle>${item.price}</ion-card-subtitle>
          </ion-card-header>
        </ion-card>
      `;
      this.querySelector("#item-detail").innerHTML = itemHtml;
    }
  }
);
