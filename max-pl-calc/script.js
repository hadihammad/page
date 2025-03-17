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
    
    // Calculate max allowed instalment
    maxAllowedInstalment = salary * dbr;
    document.getElementById('maxInstalment').textContent = formatCurrency(maxAllowedInstalment);
    
    // Get current instalment value
    const currentInstalment = parseCurrency(instalmentInput.value);
    
    // Auto-update if empty or higher than max
    if (!instalmentInput.value || currentInstalment > maxAllowedInstalment) {
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
    // Get values
    const instalment = parseCurrency(document.getElementById('instalment').value);
    const months = parseInt(document.getElementById('months').value) || 0;
    const interestRate = parseFloat(document.getElementById('interest').value) / 100 || 0;
    const startDate = document.getElementById('startDate').value;
    
    // Perform calculations
    const totalLoan = instalment * months;
    const years = months / 12;
    const totalInterestRate = interestRate * years;
    const principal = totalLoan / (1 + totalInterestRate);
    const totalInterest = totalLoan - principal;
    const endDate = calculateEndDate(startDate, months);
    
    // Update results
    document.getElementById('totalLoan').textContent = formatCurrency(totalLoan);
    document.getElementById('principal').textContent = formatCurrency(principal);
    document.getElementById('totalInterest').textContent = formatCurrency(totalInterest);
    document.getElementById('endDate').textContent = endDate;
}

// Real-time listeners
document.getElementById('salary').addEventListener('input', function(e) {
    // Format salary input
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
    
    // Format instalment input
    let value = this.value.replace(/,/g, '');
    if (isNaN(value)) value = value.slice(0, -1);
    if (value.includes('.')) {
        const [int, dec] = value.split('.');
        value = int + '.' + dec.slice(0, 2);
    }
    this.value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
});

// Initialize date input
document.getElementById('startDate').value = new Date().toISOString().slice(0, 7);
updateInstalment();