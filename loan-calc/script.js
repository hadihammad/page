function formatNumberInput(input) {
    // Remove non-numeric characters (e.g., commas)
    let value = input.value.replace(/[^0-9]/g, '');

    // Add commas as a thousand separator
    if (value.length > 3) {
        value = parseFloat(value).toLocaleString('en-US');
    }

    // Update the input value
    input.value = value;
}

function calculateLoan() {
    // Get user inputs
    const principle = parseFloat(document.getElementById('principle').value.replace(/,/g, ''));
    const percentage = parseFloat(document.getElementById('percentage').value);
    const months = parseFloat(document.getElementById('months').value);

    // Perform calculations
    const adminFees = Math.min(0.01 * principle, 5000); // 1% of principle, capped at 5000
    const principleAccount = principle - adminFees;
    const years = months / 12;
    const interestPerYear = principle * (percentage / 100); // Convert percentage to decimal
    const interestsTotal = years * interestPerYear;
    const totalLoan = principle + interestsTotal;
    const instalmentPerMonth = totalLoan / months;
    const principleInstalment = principle / months;

    // Format numbers with comma separators
    const formatNumber = (num) => num.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    // Display results
    document.getElementById('adminFees').textContent = formatNumber(adminFees);
    document.getElementById('principleAccount').textContent = formatNumber(principleAccount);
    document.getElementById('years').textContent = formatNumber(years);
    document.getElementById('interestPerYear').textContent = formatNumber(interestPerYear);
    document.getElementById('interestsTotal').textContent = formatNumber(interestsTotal);
    document.getElementById('totalLoan').textContent = formatNumber(totalLoan);
    document.getElementById('instalmentPerMonth').textContent = formatNumber(instalmentPerMonth);
    document.getElementById('principleInstalment').textContent = formatNumber(principleInstalment);
}