customElements.define(
  "page-list-items",
  class extends HTMLElement {
    connectedCallback() {
        console.log("connected page list items");
        
        this.innerHTML = document.getElementById("page-list-items.html").innerHTML;

        this.chargeListItems();
      }
      
      chargeListItems() {
          
      }
  }
);
