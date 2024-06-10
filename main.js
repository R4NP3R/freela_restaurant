// cart Items
const cart = document.querySelector('.checkoutCart')
const cartItemsQuantity = document.querySelector('.cartItemsQuantity')
const checkoutCartList = document.querySelector('.checkoutCartList')
const checkoutButton = document.querySelector('.checkoutButton')

// restaurant page items
const restaurantSectionList = document.querySelector('.restaurantSectionList')
const orderNowSectionList = document.querySelector('.orderNowSectionList')

// checkout page items
const checkoutPageCartList = document.querySelector('.checkoutPageCartList')
const checkoutConfirmation = document.querySelector('.checkoutConfirmation')

//global variables
const page = window.location.pathname
let isOpen = false

// Array of food products
let foods = []

// Array of food products in cart
let cartItems = []

// function to get food content from mockFoods.json
// and save cart informations
async function initApp () {
  await fetch('/mockFoods.json')
  .then((response) => response.json())
  .then((data) => {
      foods = data
      foodsList()
  })
  if (localStorage.getItem('cart')) {
    cartItems = JSON.parse(localStorage.getItem('cart'));
    reloadInfo()
  }
}

initApp()


function addCartToMemory() {
  localStorage.setItem('cart', JSON.stringify(cartItems))
}

// function to remove errors in page where this functions is not are used
function reloadInfo() {
  if (page == '/checkout/') {
    reloadCheckoutItems()
    reloadCheckoutPrice()
    totalPriceItems()
  } else {
    reloadCart()
  }
}

// cart interactions
function switchCartIsVisible() {
  if (isOpen) {
    isOpen = false
    cart.classList.remove('active')
  } else {
    isOpen = true
    cart.classList.add('active')
  }
}

function closeCart() {
  cart.classList.remove('active')
}

function addToCart(foodId) {
  let positionProductInCart = cartItems.findIndex((value) => value.foodId == foodId)
  if (cartItems.length <= 0) {
    cartItems = [{
        foodId: foodId,
        quantity: 1
    }]
  } else if (positionProductInCart < 0) {
    cartItems.push({
      foodId: foodId,
      quantity: 1
    })
  } else {
    cartItems[positionProductInCart].quantity = cartItems[positionProductInCart].quantity + 1
  }
  reloadInfo()
  addCartToMemory();
}

function removeFood(foodId) {  
  let productPosition = cartItems.findIndex((value) => value.id == foodId)
  cartItems.splice(productPosition, 1)
  addCartToMemory()
  reloadInfo()
  
  if (cartItems.length == 0) {
  cartItemsQuantity.classList.remove('notEmpty')
  checkoutButton.classList.remove('checkoutButtonVisible')
  reloadInfo()
  }
}

//function to increase and decrease food quantity in cart
function changeFoodQuantity (foodId, type) {
  let itemPosition = cartItems.findIndex((value) => value.foodId == foodId) 
  if (itemPosition >= 0) {
    switch (type) {
      case 'increase':
        cartItems[itemPosition].quantity = cartItems[itemPosition].quantity + 1
        break;
      
        default:
        let valueChange = cartItems[itemPosition].quantity - 1;
        if (valueChange > 0) {
          cartItems[itemPosition].quantity = valueChange
        }
        break;  
    }
  }
  addCartToMemory()
  reloadInfo()
}

// calculate total price in checkout page
function totalPriceItems() {
  if (cartItems.length != 0) {
    let amount = cartItems.map((x) => {
      const {foodId, quantity} = x
      let itemIndex = foods.findIndex((value) => value.id == foodId)
      let itemPrice = foods[itemIndex].price
      return itemPrice * quantity
      }).reduce((prev, val) => prev + val, 0)
    return amount
  } else {
    return 0;
  }
}

// update cart info
function reloadCart() {  
  checkoutCartList.innerHTML = ""
  let totalPrice = 0
  let count = 0
  if (cartItems.length > 0) {      
  cartItems.map((food) => {
    let productPosition = foods.findIndex((value) => value.id == food.foodId)
    let info = foods[productPosition]
    totalPrice = totalPrice + food.price
    count = count + food.quantity
    let newList = document.createElement('li')      
    newList.classList.add('checkoutCartItem')

    newList.innerHTML = `
            <img
              class="foodImageInCart"
              src="/assets/${info.image}"
              alt="food image"
            />
            <div class="itemCartInfo">
              <p>${info.name}</p>
              <div class="itemCartPrice">
                <span>$${info.price}</span>
                <span class="totalPrice"></span>
              </div>
            </div>
            <div class="checkoutCartItemRight">
              <div class="checkoutCartQuantityController">
                <button onclick="changeFoodQuantity(${food.foodId})" class="checkoutCartQuantityChange">-</button>
                <span class="checkoutCartQuantityNumber">${food.quantity}</span>
                <button onclick="changeFoodQuantity(${food.foodId}, 'increase')" class="checkoutCartQuantityChange">+</button>
              </div>
              <div class="checkoutCartProductPrice">
                <span>$${info.price * food.quantity}</span>
              </div>
            </div>            
            <img
              onclick="removeFood(${food.foodId})"
              class="removeItem"
              src="/assets/icon-delete.svg"
              alt="remove item from cart"
            />
      `
      checkoutCartList.appendChild(newList)
      cartItemsQuantity.innerText = count
      cartItemsQuantity.classList.add('notEmpty')
      checkoutButton.classList.add('checkoutButtonVisible')
    })
  } else (
      emptyCart()
  )
}

// update checkout info
function reloadCheckoutItems() {
  checkoutPageCartList.innerHTML = ""
  let totalPrice = 0
  let count = 0
  if (cartItems.length > 0) {      
  cartItems.map((food) => {
    let productPosition = foods.findIndex((value) => value.id == food.foodId)
    let info = foods[productPosition]
    totalPrice = totalPrice + food.price
    count = count + food.quantity
    let newList = document.createElement('li')      
    newList.classList.add('checkoutPageCartItem')
    newList.innerHTML = `
            <div class="checkoutPageCartItemLeft">
              <img
                class="checkoutCartItemImage"
                src="/assets/${info.image}"
                alt="${info.name}"
              />
              <div class="checkoutCartInfo">
                <p>${info.name}</p>
              </div>
            </div>
            <div class="checkoutPageCartItemRight">
              <div class="checkoutCartQuantityController">
                <button onclick="changeFoodQuantity(${food.foodId})" class="checkoutCartQuantityChange">-</button>
                <span class="checkoutCartQuantityNumber">${food.quantity}</span>
                <button onclick="changeFoodQuantity(${food.foodId}, 'increase')" class="checkoutCartQuantityChange">+</button>
              </div>
              <div class="checkoutProductPrice">
                <span>$${(info.price * food.quantity).toFixed(2)}</span>
              </div>
              <img
              onclick="removeFood(${food.foodId})"
              class="removeItem"
              src="/assets/icon-delete.svg"
              alt="remove item from cart"
              />
            </div>
            
      `
      checkoutPageCartList.appendChild(newList)
    })
  } else {
    emptyCart()
    checkoutConfirmation.innerHTML = ''
  }
}

// update checkoutprice info
function reloadCheckoutPrice() {
  console.log('reload')
  totalPrice = totalPriceItems()
  if (cartItems.length != 0) {
    checkoutConfirmation.innerHTML = ""
    let newDiv = document.createElement('div') 
    newDiv.innerHTML = `
      <div class="checkoutInfos responsiveVisible">
        <p class="checkoutSubtotalPriceText">Subtotal:</p>
        <p class="checkoutSubtotalPriceValue">$${totalPrice.toFixed(2)}</p>
      </div>
      <div class="checkoutInfos">
        <p class="checkoutShippingPriceText">Shipping:</p>
        <p class="checkoutShippingPriceValue">${totalPrice >= 60 ? 'FREE' : (15).toFixed(2) }</p>
      </div>
      <div class="checkoutInfos checkoutTotalPaymentPrice">
        <p>You Pay:</p>
        <p>$${totalPrice >= 60 ? totalPrice : totalPrice + 15 }</p>
      </div>
      <div>
        <button class="mainButton placeOrderButton">Place Order</button>
      </div>
    `
    checkoutConfirmation.appendChild(newDiv)
  } else {
      //if the cart is empty, all prices will be reset 
      checkoutConfirmation.innerHTML = ""
      let newDiv = document.createElement('div') 
      newDiv.innerHTML = `
        <div class="checkoutInfos">
          <p class="checkoutSubtotalPriceText">Subtotal:</p>
          <p class="checkoutSubtotalPriceValue">$0.00</p>
        </div>
        <div class="checkoutInfos">
          <p class="checkoutShippingPriceText">Shipping:</p>
          <p class="checkoutShippingPriceValue">$0.00</p>
        </div>
        <div class="checkoutInfos checkoutTotalPaymentPrice">
          <p>You Pay:</p>
          <p>$0.00</p>
        </div>
        <div>
          <button class="mainButton placeOrderButton">Place Order</button>
        </div>
      `
      checkoutConfirmation.appendChild(newDiv)
  }
}

function CheckoutButton() {
  if (cartItems.length > 0) {
    let newDiv = document.createElement('div')
    newDiv.innerHTML = `
      <a
        href="/checkout"
        class="mainButton checkoutButton"
        >Checkout</a
      >
    `
    cart.appendChild(newDiv)
  }
}

// when cart or checkout is empty add this content to DOM
function emptyCart() {
  let newText = document.createElement('p')
  newText.classList.add('emptyCart')
  newText.innerText = "Cart is empty"

  if (page == '/checkout/') {
    checkoutPageCartList.appendChild(newText)
    } else {
    checkoutCartList.appendChild(newText)
  }
}

function resturantsList () {
  //used to remove error when javascript try construct this componentes in pages doens't use this
  if (page == '/home/') {
    Array.from({length: 3}).map((_) => {
      let newItem = document.createElement('li')
      newItem.classList.add('restaurantSectionItem')
      newItem.innerHTML = `
      <li class="restaurantSectionItem">
        <a href="/restaurant/"  >
          <img
            class="restaurantImage"
            src="/assets/steakhousefront.jpg"
            alt="restaurant food image"
          />
          <img
            class="restaurantLogo"
            src="/assets/steakhouselogo.png"
            alt="steak house logo"
          />
        </a>
      </li>
      `
      restaurantSectionList.appendChild(newItem)
    })
  }
  
}


function foodsList() {
  //used to remove error when javascript try construct this componentes in pages doens't use this
  if (page != '/checkout/') {
    foods.map((food) => {
      let newFood = document.createElement('li')
      newFood.classList.add('orderNowSectionItem') 
      newFood.innerHTML = `    
        <img class="foodImage" src="/assets/${food.image}" alt="food image" />
          <div class="orderNowSectionItemDetails">
            <p class="mainFoodName">${food.name}</p>
            <div class="orderNowSectionItemValue">
              <div class="orderNowSectionItemQuality">
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
              </div>
              <span>$${food.price.toFixed(2)}</span>
            </div>
            <a onclick="addToCart(${food.id})" href="/checkout/" class="orderNowButton">Checkout</a>
          </div>
          <button class="buyButton" onclick="addToCart(${food.id})">
            <img src="/assets/cart.png" alt="cart icon" />
          </button>
    `
    orderNowSectionList.appendChild(newFood)
    })
  }
}

// call function to content appears in DOM
resturantsList()
foodsList()