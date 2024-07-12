customElements.define(
  "page-list-items",
  class extends HTMLElement {
    connectedCallback() {
      console.log("connected page list items");

      this.innerHTML = document.getElementById(
        "page-list-items.html"
      ).innerHTML;

      this.chargeListItems();
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
      itemHtml += /* html */ `
        <ion-card>
          <img src="${item.pictures[0].url}" alt="" />
          <ion-card-header>
            <ion-card-title>${item.title}</ion-card-title>
            <ion-card-subtitle>${item.currency_id} ${item.price}</ion-card-subtitle>
          </ion-card-header>
        </ion-card>
      `;
      this.querySelector("#item-detail").innerHTML = itemHtml;
    }
  }
);
