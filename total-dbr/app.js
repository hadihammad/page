let products = [];
let productCounts = {
    personalLoan: 0,
    creditCard: 0,
    autoLeasing: 0,
    homeLoan: 0
};

function addProduct() {
    const productType = document.getElementById('productType').value;
    const salaryInput = document.getElementById('salary').value;
    const salary = parseFloat(salaryInput) || 0;

    if (!productType) {
        alert('Please select a product');
        return;
    }

    productCounts[productType]++;
    const productNumber = productCounts[productType];

    const productNameMap = {
        personalLoan: `Personal Loan ${productNumber}`,
        creditCard: `Credit Card ${productNumber}`,
        autoLeasing: `Auto Leasing ${productNumber}`,
        homeLoan: 'Home Loan'
    };

    const product = {
        type: productType,
        name: productNameMap[productType],
        installment: 0,
        creditLimit: 0,
        dbr: 0
    };

    products.push(product);
    updateProductsList();
}

function updateProductsList() {
    const productsList = document.getElementById('productsList');
    productsList.innerHTML = '';

    products.forEach((product, index) => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product-item';
        
        let inputHTML = '';
        if (product.type === 'creditCard') {
            inputHTML = `
                <div>
                    <input type="number" 
                           placeholder="Credit Limit"
                           value="${product.creditLimit}">
                </div>
            `;
        } else {
            inputHTML = `
                <div>
                    <input type="number" 
                           placeholder="Monthly Installment"
                           value="${product.installment}">
                </div>
            `;
        }

        productDiv.innerHTML = `
            <div style="flex: 1"><strong>${product.name}</strong></div>
            ${inputHTML}
            <button class="remove-btn" onclick="removeProduct(${index})">Remove</button>
        `;

        productsList.appendChild(productDiv);
    });
}

function removeProduct(index) {
    const removedType = products[index].type;
    productCounts[removedType]--;
    products.splice(index, 1);
    updateProductsList();
}

function calculateDBR() {
    const salary = parseFloat(document.getElementById('salary').value) || 0;
    let totalDBR = 0;
    let personalProductsDBR = 0;
    let homeLoanDBR = 0;
    const errors = [];
    
    // Reset dropdown
    document.getElementById('productType').selectedIndex = 0;

    // Collect input values
    const productInputs = document.querySelectorAll('.product-item');
    products.forEach((product, index) => {
        const inputs = productInputs[index].querySelectorAll('input');
        if (product.type === 'creditCard') {
            product.creditLimit = parseFloat(inputs[0].value) || 0;
            product.dbr = (product.creditLimit * 0.05) / salary * 100;
        } else {
            product.installment = parseFloat(inputs[0].value) || 0;
            product.dbr = (product.installment / salary) * 100;
        }
    });

    // Calculate totals and validate
    products.forEach(product => {
        const cap = getProductCap(product.type);
        if (product.dbr > cap) {
            errors.push(`${product.name} exceeds ${cap}% cap`);
        }

        if (['personalLoan', 'creditCard', 'autoLeasing'].includes(product.type)) {
            personalProductsDBR += product.dbr;
        } else if (product.type === 'homeLoan') {
            homeLoanDBR += product.dbr;
        }

        totalDBR += product.dbr;
    });

    // Check combined caps
    if (personalProductsDBR > 45) {
        errors.push('Personal products combined exceed 45% cap');
    }
    if (homeLoanDBR + personalProductsDBR > 65) {
        errors.push('Combined total with home loan exceeds 65% cap');
    }

    displayResults(totalDBR, personalProductsDBR, homeLoanDBR, errors, salary);
}

function getProductCap(type) {
    const caps = {
        personalLoan: 33,
        creditCard: 33,
        autoLeasing: 33,
        homeLoan: 65
    };
    return caps[type] || 0;
}

function displayResults(totalDBR, personalDBR, homeLoanDBR, errors, salary) {
    const resultsDiv = document.getElementById('results');
    let html = '<h3>Results:</h3>';

    // Products list
    products.forEach(product => {
        html += `
            <div class="result-item">
                ${product.name}: ${product.dbr.toFixed(2)}%
            </div>
        `;
    });

    // Total DBR
    html += `<div class="total-dbr" style="margin-top: 15px; font-weight: bold;">
                Total DBR: ${totalDBR.toFixed(2)}%
             </div>`;

    // Remaining capacity
    html += '<div class="remaining-capacity">';
    
    const remainingPersonal = 45 - personalDBR;
    html += `
        <div>Remaining Personal Capacity: ${Math.max(0, remainingPersonal).toFixed(2)}%</div>
        <div>(${(salary * Math.max(0, remainingPersonal)/100).toFixed(0)} ﷼ monthly)</div>
    `;

    const remainingTotal = 65 - (personalDBR + homeLoanDBR);
    html += `
        <div style="margin-top: 10px;">Remaining Total Capacity: ${Math.max(0, remainingTotal).toFixed(2)}%</div>
        <div>(${(salary * Math.max(0, remainingTotal)/100).toFixed(0)} ﷼ monthly)</div>
    `;

    html += '</div>';

    // Errors
    if (errors.length > 0) {
        html += '<div class="errors" style="margin-top: 15px;">';
        errors.forEach(error => {
            html += `<div class="error">${error}</div>`;
        });
        html += '</div>';
    }

    resultsDiv.innerHTML = html;
}