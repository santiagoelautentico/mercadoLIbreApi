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
                <img alt="" src="${this.dataItem.thumbnail}" />
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
