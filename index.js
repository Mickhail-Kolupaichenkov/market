import { products1 } from "./data1.js";
import { products2 } from "./data2.js";

const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-button");
const productsContainer = document.getElementById("products-container");
const loader = document.getElementById("loader");

const data1 = JSON.parse(products1);
const data2 = JSON.parse(products2);

const allData = [...data1, ...data2];
// const allData = data1.concat(data2);

// console.log(allData)

// console.log(allData[1].type);

const sortAllData = allData.sort((a, b) => {
    if(a.type.toLowerCase() === 'аксессуары' && b.type.toLowerCase() === 'велосипеды' ) {
        return 1;
    }
    if(a.type.toLowerCase() === 'велосипеды' && b.type.toLowerCase() === 'аксессуары') {
        return -1;
    }
    return 0;
});

// console.log(sortAllData);

const currentDate = new Date();
console.log(currentDate)

const discountedProducts = sortAllData.map((product) => {
    const arrivalDate = new Date(product.arrival_date);
    const timeDifference = currentDate - arrivalDate; //разница между сегоднешней датой и датой прибытия товара
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    let discountedPrice = product.price;
    if(daysDifference >= 365) {
        discountedPrice = product.price * 0.9;
    } else if(daysDifference >= 500) {
        discountedPrice = product.price * 0.8;
    };
    
    return {
        ...product,
        newPrice: discountedPrice,
    };
});
console.log(discountedProducts)

const cardRender = (discountedProducts) => {

    if(discountedProducts.length === 0) {
        productsContainer.innerHTML = '<p class="message">Товар не найден</p>'
        loaderHide()
        return;
    }

    const cardItem = discountedProducts.map((el) => {
        const {
            name,
            brand,
            img,
            price,
            newPrice,
            color,
            description,
            size,
            weight,
        } = el;
        
        return `
        <div class="product">
            <h2>${name}</h2>
            <p><strong>Производитель:</strong> ${brand}</p>
            <img src="${img}" alt="" />
            <p class="product-price">
                <strong>Цена:</strong>
                <span class="new-price">${newPrice} руб.</span>
                ${price !== newPrice ? `<p class="product-old-price">
                    <strong>Старая цена:</strong>
                    <span class="old-price">${price} руб.</span>
                    </p>` : ''}
            </p>
            <p><strong>Цвет:</strong> ${color}</p>
            <p class="product-description">
                <strong>Описание:</strong> ${description}
            </p>
            ${size ? `<p class="product-size"><strong>Размер:</strong> ${size}</p>` : ""}
            <p class="product-weight"><strong>Вес:</strong> ${weight}</p>
        </div>
        `
    })
    .join("");
    productsContainer.innerHTML = cardItem;
};

function loaderShow() {
    loader.style.display = "block";
    productsContainer.style.display = "none";
}
function loaderHide() {
    loader.style.display = "none";
    productsContainer.style.display = "flex";
}

loaderShow();

setTimeout(() => {
    cardRender(discountedProducts);
    loaderHide()
}, 1000);

function performSearch() {
    const searchQuery = searchInput.value.toLowerCase().trim();
    const foundProducts = discountedProducts.filter((product) => 
        product.name.toLowerCase().includes(searchQuery)
    );
    loaderShow();
    setTimeout(() => {
        cardRender(foundProducts);
        loaderHide();
    }, 2000)
};

searchBtn.addEventListener('click', performSearch);
searchInput.addEventListener('keyup', (event) => {
    if(event.key === 'Enter') {
        performSearch();
    }
});