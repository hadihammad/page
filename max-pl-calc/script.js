let maxAllowedInstalment = 0;

function formatCurrency(amount) {
    return `﷼ ${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
}

function parseCurrency(value) {
    return parseFloat(value.replace(/,/g, '')) || 0;
}

function updateInstalment() {
    const salary = parseCurrency(document.getElementById('salary').value);
    const dbr = parseFloat(document.getElementById('dbr').value) || 0;
    const instalmentInput = document.getElementById('instalment');
    
    maxAllowedInstalment = salary * dbr;
    document.getElementById('maxInstalment').textContent = formatCurrency(maxAllowedInstalment);
    
    const currentInstalment = parseCurrency(instalmentInput.value);
    
    if (currentInstalment > maxAllowedInstalment) {
        instalmentInput.value = maxAllowedInstalment.toFixed(2);
    }
}

function enforceInstalmentLimit() {
    const instalmentInput = document.getElementById('instalment');
    const currentValue = parseCurrency(instalmentInput.value);
    
    if (currentValue > maxAllowedInstalment) {
        instalmentInput.value = maxAllowedInstalment.toFixed(2);
    }
}

function calculateEndDate(startDate, months) {
    if (!startDate || !months) return '-';
    
    const [year, month] = startDate.split('-').map(Number);
    const endDate = new Date(year, month + parseInt(months) - 2);
    
    return endDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
    });
}

function calculate() {
    const instalment = parseCurrency(document.getElementById('instalment').value);
    const months = parseInt(document.getElementById('months').value) || 0;
    const interestRate = parseFloat(document.getElementById('interest').value) / 100 || 0;
    const startDate = document.getElementById('startDate').value;
    
    const totalLoan = instalment * months;
    const years = months / 12;
    const totalInterestRate = interestRate * years;
    const principal = totalLoan / (1 + totalInterestRate);
    const totalInterest = totalLoan - principal;
    const endDate = calculateEndDate(startDate, months);
    
    document.getElementById('totalLoan').textContent = formatCurrency(totalLoan);
    document.getElementById('principal').textContent = formatCurrency(principal);
    document.getElementById('totalInterest').textContent = formatCurrency(totalInterest);
    document.getElementById('endDate').textContent = endDate;
}

document.getElementById('salary').addEventListener('input', function(e) {
    let value = e.target.value.replace(/,/g, '');
    if (isNaN(value)) value = value.slice(0, -1);
    if (value.includes('.')) {
        const [int, dec] = value.split('.');
        value = int + '.' + dec.slice(0, 2);
    }
    e.target.value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    updateInstalment();
});

document.getElementById('dbr').addEventListener('input', updateInstalment);
document.getElementById('instalment').addEventListener('input', function() {
    enforceInstalmentLimit();
    let value = this.value.replace(/,/g, '');
    if (isNaN(value)) value = value.slice(0, -1);
    if (value.includes('.')) {
        const [int, dec] = value.split('.');
        value = int + '.' + dec.slice(0, 2);
    }
    this.value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
});

document.getElementById('startDate').value = new Date().toISOString().slice(0, 7);