let from = document.querySelector('.main-from .change-area input');
let to = document.querySelector('.main-to .change-area input');
let internetAlert = document.querySelector(".alert");

let burgerMenu = document.querySelector('.burger-menu');
let aboutMenu = document.querySelector('.about');

let exchangeRates = {};
let fromCurrency = "RUB";
let toCurrency = "USD";
let activeInput = "from";
let isOnline = navigator.onLine;

async function exchangeData() {
    if (!isOnline) {
        internetAlert.style.display = 'block';
        return;
    }

    try {
        let response = await fetch('https://v6.exchangerate-api.com/v6/e49c84788180106c156e9eef/latest/USD');
        let json = await response.json();
        exchangeRates = json.conversion_rates;

        internetAlert.style.display = 'none';
        showExchangeInfo();
        selectedCurrency();
    } catch {
        alert('Məlumatları gətirərkən xəta baş verdi!');
    }

}

exchangeData();

function convertAmount() {
    if (!isOnline && fromCurrency !== toCurrency) {
        internetAlert.style.display = 'block';
        return;
    }

    internetAlert.style.display = 'none';
    let fromRate = exchangeRates[fromCurrency] || 1;
    let toRate = exchangeRates[toCurrency] || 1;
    let fromValue = parseFloat(from.value) || 0;
    let toValue = parseFloat(to.value) || 0;

    if (activeInput === 'from') {
        to.value = (fromCurrency === toCurrency) 
            ? fromValue.toFixed(5) 
            : (fromValue * (toRate / fromRate)).toFixed(5);
    } else if (activeInput === 'to') {
        from.value = (fromCurrency === toCurrency) 
            ? toValue.toFixed(5) 
            : (toValue * (fromRate / toRate)).toFixed(5);
    }

    showExchangeInfo();

}

function clearInput(input) {
    input.value = input.value.replace(/[^0-9.,]/g, '').replace(",", ".");
    input.value = input.value.replace(/^0+(?!\.|$)/, '');
    input.value = input.value.replace(/(\..*)\./g, '$1'); 
    if (input.value.startsWith('.')) input.value = input.value;
    input.value = input.value.replace(/^(\d+\.\d{5}).*$/, '$1');
    if (input.value.length > 20) input.value = input.value.slice(0, 20);
}

function showExchangeInfo() {
    let ratesDisplayFrom = document.querySelector('.main-from .change-area p');
    let ratesDisplayTo = document.querySelector('.main-to .change-area p');
    let fromRate = exchangeRates[fromCurrency] || 1;
    let toRate = exchangeRates[toCurrency] || 1;

    ratesDisplayFrom.textContent = `1 ${fromCurrency} = ${(toRate / fromRate).toFixed(5)} ${toCurrency}`;
    ratesDisplayTo.textContent = `1 ${toCurrency} = ${(fromRate / toRate).toFixed(5)} ${fromCurrency}`;
}

function selectedCurrency() {
    document.querySelectorAll('.main-from .change-button p').forEach(button => {
        button.classList.toggle('active', button.textContent === fromCurrency);
    });

    document.querySelectorAll('.main-to .change-button p').forEach(button => {
        button.classList.toggle('active', button.textContent === toCurrency);
    });
}

from.addEventListener('input', () => {
    activeInput = 'from';
    clearInput(from);
    convertAmount();
});

to.addEventListener('input', () => {
    activeInput = 'to';
    clearInput(to);
    convertAmount();
});

document.querySelectorAll('.change-button p').forEach(button => {
    button.addEventListener('click', (e) => {
        let parent = e.target.closest('.change-button').parentNode;
        let isFrom = parent.classList.contains('main-from');

        if (isFrom) fromCurrency = e.target.textContent;
        else toCurrency = e.target.textContent;

        selectedCurrency();
        convertAmount();
    });

});

window.addEventListener('online', () => {
    internetAlert.style.display = 'none';
    isOnline = true;

    exchangeData().then(() => {
        convertAmount();
    });

});

window.addEventListener('offline', () => {
    internetAlert.style.display = 'block';
    isOnline = false;
});

burgerMenu.addEventListener('click', () => {
    aboutMenu.classList.toggle('active');
});