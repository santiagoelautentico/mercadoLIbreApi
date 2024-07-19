let productCart = "productCart";
let token = "token";
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}
customElements.define(
  "page-list-items",
  class extends HTMLElement {
    connectedCallback() {
      console.log("connected page list items");

      this.innerHTML = document.getElementById(
        "page-list-items.html"
      ).innerHTML;
      nameInMenu();
      this.chargeListItemsCategories();
      this.chargeListItems();
      this.addEventListeners();
      this.search();
      const cartIcon = document.getElementById("icon-cart");
      if (cartIcon) {
        cartIcon.addEventListener("click", () => {
          console.log("click");
          navigateCart();
        });
      }
    }

    search() {
      const searchInput = document.getElementById("search");
      searchInput.addEventListener(
        "keyup",
        debounce((event) => {
          const searchValue = event.target.value;
          console.log(searchValue);
          if (searchValue) {
            this.searchListItems(searchValue);
          } else {
            this.chargeListItems();
          }
        }, 1000)
      );
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
    filterCategories() {
      const menuFilters = document.querySelector("#first-accordion");
      fetch(`${API_URL}sites/MLU/search?official_store_id=628`)
        .then((response) => response.json())
        .then((data) => {
          const availableFilters = data.available_filters;
          const categoryFilter = availableFilters.find(
            (filter) => filter.id === "category"
          );
          if (categoryFilter) {
            const categories = categoryFilter.values;
            categories.forEach((category) => {
              console.log(
                `ID: ${category.id}, Name: ${category.name}, Results: ${category.results}`
              );

              menuFilters.innerHTML += `
                <ion-item>
                  <ion-label class="filterItem" id="${category.id}">${category.name}</ion-label>
                </ion-item>
              `;
              const filterItem = document.querySelectorAll(".filterItem");
              filterItem.forEach((element) => {
                element.addEventListener("click", (event) => {
                  console.log(event.target.id);
                  this.chargeListItemsCategories(event.target.id);
                });
              });
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    filterDiscount() {
      const menuFilters = document.querySelector("#second-accordion");
      fetch(`${API_URL}sites/MLU/search?official_store_id=628`)
        .then((response) => response.json())
        .then((data) => {
          const availableFilters = data.available_filters;
          const categoryFilter = availableFilters.find(
            (filter) => filter.id === "discount"
          );

          if (categoryFilter) {
            const categories = categoryFilter.values;
            categories.forEach((category) => {
              console.log(
                `ID: ${category.id}, Name: ${category.name}, Results: ${category.results}`
              );

              menuFilters.innerHTML += `
                <ion-item>
                  <ion-label class="filterItem" id="${category.id}">${category.name}</ion-label>
                </ion-item>
              `;
              const filterItem = document.querySelectorAll(".filterItem");
              filterItem.forEach((element) => {
                element.addEventListener("click", (event) => {
                  console.log(event.target.id);
                  this.chargeListItemsCategories(event.target.id);
                });
              });
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    chargeListItemsCategories(categorieId) {
      fetch(`${API_URL}/sites/MLU/search?category=${categorieId}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data.results);
          this.listShopCard(data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    searchListItems(searchValue) {
      fetch(`${API_URL}sites/MLU/search?official_store_id=628&q=${searchValue}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data.results);
          this.listShopCard(data);
          this.filterCategories(data);
          this.filterDiscount(data);
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
          this.filterCategories(data);
          this.filterDiscount(data);
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
                  ? `<p class="original-price">antes: ${item.original_price}</p>`
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
      const messageElement = document.getElementById("#ion-padding");
      if (messageElement) {
        messageElement.classList.remove("hidden");
      }
      let productCart = "productCart";
      let productCartSaveArray = getLocalStorage(productCart) || [];
      const productExists = productCartSaveArray.some(
        (cartItem) => cartItem.id === item.id
      );
      if (!productExists) {
        productCartSaveArray.push(item);
        setLocalStorage(productCart, productCartSaveArray);
        navigateCart();
      } else {
        console.log("El producto ya existe en el carrito");
        this.renderProductRepeated();
        setTimeout(() => {
          this.hideProductRepeated();
        }, 3000);
      }
    }
    renderProductRepeated() {
      const messageElement = document.getElementById("ion-padding");
      if (messageElement) {
        messageElement.style.display = "block";
      }
      let itemHtml = "";
      itemHtml += /* html */ `
        <div><h3 class='title-error'>Este producto ya esta en el carrito</h3></div>
      `;
      this.querySelector("#ion-padding").innerHTML = itemHtml;
    }
    hideProductRepeated() {
      const messageElement = document.getElementById("ion-padding");
      if (messageElement) {
        messageElement.style.display = "none";
      }
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
      const btnShop = this.querySelector("#btn-purchase");

      let token = "token";
      let userSave = getLocalStorage(token) || [];

      if (btnShop) {
        btnShop.addEventListener("click", () => {
          if (userSave.length > 0) {
            navigateCheckout();
          } else {
            navigateLogin();
          }
        });
      }
    }
    renderCart() {
      let itemSave = getLocalStorage(productCart) || [];
      let itemHtml = "";
      for (let item of itemSave) {
        itemHtml += /* html */ `
        <item-cart
          $id="${item.id}"
          title="${item.title}"
          price="${item.price}"
          picture="${item.thumbnail}"
          currency_id="${item.currency_id}">
        </item-cart>
        `;
        this.querySelector("#cart-items").innerHTML = itemHtml;
      }
    }
    renderHeaderCart() {
      let itemSave = getLocalStorage(productCart) || [];
      const length = itemSave.length;
      let itemHtml = "";
      itemHtml += /* html */ `
      <item-header-cart
        itemSave="${length}">
      </item-header-cart>
      `;
      this.querySelector("#header-card").innerHTML = itemHtml;
    }
    renderBtnShop() {
      let itemHtml = "";
      let itemSave = getLocalStorage(productCart) || [];
      let totalProducts = itemSave.reduce((total, item) => {
        return total + item.price * (item.quantity || 1);
      }, 0);

      itemHtml += /* html */ `
          <h3 class="total-precio">Total: U$D ${totalProducts.toFixed(
            2
          )}</h3>    
          <button class="btn-purchase" id="btn-purchase">Comprar</button>
      `;
      this.querySelector("#btn-shop-container").innerHTML = itemHtml;
    }
  }
);
customElements.define(
  "page-checkout",
  class extends HTMLElement {
    connectedCallback() {
      console.log("connected page-cart");
      this.innerHTML = document.getElementById("page-checkout.html").innerHTML;
      let itemSave = getLocalStorage(productCart) || [];
      let userToken = getLocalStorage(token) || [];
      console.log(userToken[0].token, "token");
      let totalItems = itemSave.length;
      let paidItems = 0;
      itemSave.forEach((item) => {
        console.log(
          item.id,
          item.title,
          item.thumbnail,
          item.price,
          item.quantity
        );
        console.log(item, "checkout items");
        fetch(`${API_CHECKOUT}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": `${userToken[0].token}`,
          },
          body: JSON.stringify({
            shipping: "Shipping addres",
            products: [
              {
                itemId: item.id,
                name: item.title,
                picture: item.thumbnail,
                price: item.price,
                quantity: 1,
              },
            ],
          }),
        })
          .then((res) => {
            if (res.status === 200 || res.status === 201) {
              return res.json();
            } else {
              throw new Error("Error");
            }
          })
          .then((data) => {
            let dataInfo = data.info;
            console.log(dataInfo, "antes de todo");
            if (data.info.status === "PAID") {
              paidItems++;
            }
            if (paidItems === totalItems) {
              let productCart = "productCart";
              let productCartSaveArray =
                JSON.parse(localStorage.getItem(productCart)) || [];
              productCartSaveArray = productCartSaveArray.filter(
                (item) => item.id !== item.id
              );
              localStorage.setItem(
                productCart,
                JSON.stringify(productCartSaveArray)
              );
              console.log(`Item con ID ${item.id} eliminado del localStorage`);
              const compraExitosa = this.querySelector("#checkout-container");
              compraExitosa.innerHTML = /* html */ `<h1>`;
              if ((compraExitosa.innerText = "Compra Exitosa")) {
                console.log("Compra exitosa funciona");
                setTimeout(() => {
                  navigateHome();
                }, 5000);
              }
            } else if (data.info.status === "NOT_PAID") {
              retryRender();
              const btnReintentar = this.querySelector("#btn-reintentar");
              btnReintentar.addEventListener("click", () => {
                fetch(`${API_USER}`, {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    "x-access-token": `${userToken[0].token}`,
                  },
                })
                  .then((response) => response.json())
                  .then((data) => {
                    for (const key in data) {
                      if (data.hasOwnProperty(key)) {
                        const element = data[key];
                        const purchases = element.purchases;
                        for (const key in purchases) {
                          fetch(
                            `${API_CHECKOUT}/${purchases[key].purchaseId}/retry`,
                            {
                              method: "PUT",
                              headers: {
                                "Content-Type": "application/json",
                                "x-access-token": `${userToken[0].token}`,
                              },
                            }
                          )
                            .then((response) => response.json())
                            .then((data) => {
                              console.log(data, "porfa diosito");
                              thankRender();
                              localStorage.removeItem("productCart");
                            })
                            .catch((error) => {
                              console.log(error);
                            });
                        }
                      }
                    }
                  });
              });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      });
    }
  }
);
customElements.define(
  "page-login",
  class extends HTMLElement {
    fetchSignin() {
      const inputEmail = this.querySelector("#inputEmail");
      const inputPassword = this.querySelector("#inputPassword");
      fetch(`${API_LOGIN}signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: inputEmail.value,
          password: inputPassword.value,
        }),
      })
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            return res.json();
          } else {
            throw new Error("Error");
          }
        })
        .then((data) => {
          console.log(data);
          let token = "token";
          let userSave = getLocalStorage(token) || [];
          if (data.token) {
            userSave = [data];
          }
          setLocalStorage(token, userSave);
          console.log("Token guardado:", getLocalStorage(token));
          navigateHome();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
    fetchSignUp() {
      const inputName = this.querySelector("#inputName");
      const inputUsername = this.querySelector("#inputUsername");
      const inputEmail = this.querySelector("#inputEmail");
      const messError = this.querySelector("#ion-padding");

      fetch(`${API_LOGIN}signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: inputName.value,
          username: inputUsername.value,
          email: inputEmail.value,
          password: inputPassword.value,
        }),
      })
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            return res.json();
          }
          if (res.code === 401 || res.code === 402) {
            throw new Error("Error");
          }
        })
        .then((data) => {
          console.log(data);
          console.log(
            inputEmail.value,
            inputPassword.value,
            inputName.value,
            inputUsername.value
          );
        })
        .catch((error) => {
          console.error("Error:", error);
          messError.innerHTML =
            "<span class='error-signin'>Vuelve a intentarlo</span>";
          messError.className = "active-message";
          setTimeout(() => {
            messError.className = "inactive-message";
          }, 4000);
        });
    }
    connectedCallback() {
      this.innerHTML = document.getElementById("page-login.html").innerHTML;
      console.log("connected login");
      const linkSignin = this.querySelector("#link-signin");
      const btnLogin = this.querySelector("#btn-login");
      const inputEmail = this.querySelector("#inputEmail");

      linkSignin.addEventListener("click", () => {
        navigateSignin();
      });

      btnLogin.addEventListener("click", () => {
        console.log("click");
        this.fetchSignUp();
        setTimeout(() => {
          this.fetchSignin();
        }, 1000);
      });

      inputEmail.addEventListener("ionInput", (ev) => validate(ev));
      inputEmail.addEventListener("ionBlur", () => markTouched());

      const validateEmail = (email) => {
        return email.match(
          /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
        );
      };

      const validate = (ev) => {
        const value = ev.target.value;

        inputEmail.classList.remove("ion-valid");
        inputEmail.classList.remove("ion-invalid");

        if (value === "") return;

        validateEmail(value)
          ? inputEmail.classList.add("ion-valid")
          : inputEmail.classList.add("ion-invalid");
      };

      const markTouched = () => {
        inputEmail.classList.add("ion-touched");
      };
    }

    loginValidationCss() {}
  }
);
customElements.define(
  "page-signin",
  class extends HTMLElement {
    fetchSignin() {
      const inputEmail = this.querySelector("#inputEmail");
      const inputPassword = this.querySelector("#inputPassword");
      const errorContainer = this.querySelector("#ion-padding");
      fetch(`${API_LOGIN}signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: inputEmail.value,
          password: inputPassword.value,
        }),
      })
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            return res.json();
          } else {
            throw new Error("Error de inicio de sesión");
          }
        })
        .then((data) => {
          console.log(data);
          console.log(inputEmail.value, inputPassword.value);
          let token = "token";
          let userSave = getLocalStorage(token) || [];
          if (data.token) {
            userSave = [data];
          }
          setLocalStorage(token, userSave);
          console.log("Token guardado:", getLocalStorage(token));

          navigateHome();
        })
        .catch((error) => {
          console.error("Error:", error);
          errorContainer.innerHTML =
            "<span class='error-signin'>Correo o contraseña incorrectos</span>";
          errorContainer.className = "active-message";
          setTimeout(() => {
            errorContainer.className = "inactive-message";
          }, 4000);
        });
    }
    connectedCallback() {
      const inputEmail = this.querySelector("#inputEmail");
      const inputPassword = this.querySelector("#inputPassword");
      console.log("connected page-signin");
      this.innerHTML = document.getElementById("page-signin.html").innerHTML;
      const btnSignin = this.querySelector("#btn-signin");
      btnSignin.addEventListener("click", () => {
        this.fetchSignin(inputEmail, inputPassword);
      });
    }
  }
);

function getLocalStorage(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}
function setLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
function retryRender() {
  document.querySelector("#checkout-container").innerHTML = `
          <h1>El pago no se ha completado con exito</h1>
          <div class="botones-checkout">
            <button id="btn-reintentar">Reintentar compra</button>
            <button id="btn-cancelar">Cancelar compra</button>
          </div>`;
}
function thankRender() {
  document.querySelector("#checkout-container").innerHTML =
    /* html */
    `
      <div class='gif-container'>
        <iframe src="https://giphy.com/embed/ZfK4cXKJTTay1Ava29" width="480" height="398" style="" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>
        <p>
          <a href="https://giphy.com/gifs/theoffice-ZfK4cXKJTTay1Ava29">via GIPHY</a>
        </p>
      </div>

      <h1>Gracias por tu compra</h1>
      <h5 class="back-home">Volver al home</h5>
    `;
  document.querySelector(".back-home").addEventListener("click", () => {
    navigateHome();
  });
}
