function formatComma(input) {
    let value = input.value.replace(/,/g, '');
    if (!isNaN(value) && value !== '') {
        let num = parseFloat(value);
        input.value = num.toLocaleString('en-US');
    } else {
        input.value = '';
    }
}

function unformatComma(input) {
    input.value = input.value.replace(/,/g, '');
}

function formatCurrency(number) {
    return number.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function calculateLoan() {
    // Get and parse input values
    const salary = parseFloat(document.getElementById('salary').value.replace(/,/g, '')) || 0;
    const propertyPrice = parseFloat(document.getElementById('propertyPrice').value.replace(/,/g, '')) || 0;
    const percentage = parseFloat(document.getElementById('percentage').value) || 0;
    const months = parseFloat(document.getElementById('months').value) || 0;
    const interestRate = parseFloat(document.getElementById('interestRate').value) || 0;

    // Perform calculations
    const principle = propertyPrice * (percentage / 100);
    const years = months / 12;
    const totalInterest = principle * years * (interestRate / 100);
    const totalLoan = principle + totalInterest;
    const installment = totalLoan / months;
    const fees = principle * 0.01;
    const dbr = (installment / salary) * 100;

    // Update results
    document.getElementById('loanAmount').textContent = `﷼ ${formatCurrency(principle)}`;
    document.getElementById('totalInterest').textContent = `﷼ ${formatCurrency(totalInterest)}`;
    document.getElementById('totalLoan').textContent = `﷼ ${formatCurrency(totalLoan)}`;
    document.getElementById('installment').textContent = `﷼ ${formatCurrency(installment)}`;
    document.getElementById('fees').textContent = `﷼ ${formatCurrency(fees)}`;
    document.getElementById('dbr').textContent = `${dbr.toFixed(2)}%`;
}