function formatNumberInput(input) {
    // Remove non-numeric characters except decimal point
    let value = input.value.replace(/[^0-9.]/g, '');

    // Split into integer and decimal parts
    let parts = value.split('.');
    let integerPart = parts[0].replace(/\D/g, '');
    let decimalPart = parts.length > 1 ? '.' + parts[1].replace(/\D/g, '').substring(0, 2) : '';

    // Add commas as thousand separators
    if (integerPart.length > 3) {
        integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    // Update the input value
    input.value = integerPart + decimalPart;
}

function validateMonths(input) {
    // Ensure months do not exceed 60
    if (input.value > 60) {
        input.value = 60;
    }
}

function calculateLoan() {
    // Get user inputs
    const principle = parseFloat(document.getElementById('principle').value.replace(/,/g, '')) || 0;
    const percentage = parseFloat(document.getElementById('percentage').value) || 0;
    const months = parseFloat(document.getElementById('months').value) || 0;

    // Validate months (max 60)
    if (months > 60) {
        alert("Months cannot exceed 60.");
        return;
    }

    // Perform calculations
    const adminFees = Math.min(0.01 * principle, 5000); // 1% of principle, capped at 5000
    const principleAccount = principle - adminFees;
    const years = months / 12;
    const interestPerYear = principle * (percentage / 100); // Convert percentage to decimal
    const interestsTotal = years * interestPerYear;
    const totalLoan = principle + interestsTotal;
    const instalmentPerMonth = totalLoan / months;
    const principleInstalment = principle / months;

    // Format numbers with comma separators and 2 decimal places
    const formatNumber = (num) => num.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    // Display results with money symbol ﷼
    document.getElementById('adminFees').textContent = `${formatNumber(adminFees)} ﷼`;
    document.getElementById('principleAccount').textContent = `${formatNumber(principleAccount)} ﷼`;
    document.getElementById('years').textContent = formatNumber(years);
    document.getElementById('interestPerYear').textContent = `${formatNumber(interestPerYear)} ﷼`;
    document.getElementById('interestsTotal').textContent = `${formatNumber(interestsTotal)} ﷼`;
    document.getElementById('totalLoan').textContent = `${formatNumber(totalLoan)} ﷼`;
    document.getElementById('instalmentPerMonth').textContent = `${formatNumber(instalmentPerMonth)} ﷼`;
    document.getElementById('principleInstalment').textContent = `${formatNumber(principleInstalment)} ﷼`;
}