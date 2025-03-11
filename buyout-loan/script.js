function calculateBuyoutLoan() {
    // Get user inputs
    const installment = parseFloat(document.getElementById('installment').value);
    const months = parseFloat(document.getElementById('months').value);
    const paid = parseFloat(document.getElementById('paid').value);
    const remainingPrinciple = parseFloat(document.getElementById('remainingPrinciple').value);
    const downpayment = parseFloat(document.getElementById('downpayment').value) || 0; // Default to 0 if empty
    const moneyNeeded = parseFloat(document.getElementById('moneyNeeded').value) || 0; // Default to 0 if empty
    const percentage = parseFloat(document.getElementById('percentage').value);
    const newMonths = parseFloat(document.getElementById('newMonths').value);
    const adminFeesInput = parseFloat(document.getElementById('adminFees').value);

    // Perform calculations
    const reminingMonths = months - paid;
    const currentRemaining = installment * reminingMonths;
    const savingBeforeNewLoanProfit = currentRemaining - remainingPrinciple;
    const remaining = remainingPrinciple - downpayment + moneyNeeded; // Updated calculation
    const principle = remaining;
    const adminFees = adminFeesInput === 0 ? 0 : principle * 0.01; // Admin fees logic
    const profitPerYear = principle * (percentage / 100);
    const newMonthsFormula = newMonths / 12;
    const principleInstalment = principle / newMonths;
    const totalMonthsProfits = profitPerYear * newMonthsFormula;
    const perMonth = totalMonthsProfits / newMonths;
    const newInstallment = principleInstalment + perMonth;
    const differentNewLoanInstalment = installment - newInstallment;
    const totalLoan = principle + totalMonthsProfits;
    const totalLoanProfit = adminFees + totalMonthsProfits;
    const totalCash = principle - adminFees;

    // Format numbers with comma separators
    const formatNumber = (num) => num.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    // Display results
    document.getElementById('reminingMonths').textContent = formatNumber(reminingMonths);
    document.getElementById('currentRemaining').textContent = formatNumber(currentRemaining);
    document.getElementById('savingBeforeNewLoanProfit').textContent = formatNumber(savingBeforeNewLoanProfit);
    document.getElementById('remaining').textContent = formatNumber(remaining);
    document.getElementById('principle').textContent = formatNumber(principle);
    document.getElementById('adminFeesResult').textContent = formatNumber(adminFees);
    document.getElementById('profitPerYear').textContent = formatNumber(profitPerYear);
    document.getElementById('newMonthsFormula').textContent = formatNumber(newMonthsFormula);
    document.getElementById('principleInstalment').textContent = formatNumber(principleInstalment);
    document.getElementById('totalMonthsProfits').textContent = formatNumber(totalMonthsProfits);
    document.getElementById('perMonth').textContent = formatNumber(perMonth);
    document.getElementById('newInstallment').textContent = formatNumber(newInstallment);
    document.getElementById('differentNewLoanInstalment').textContent = formatNumber(differentNewLoanInstalment);
    document.getElementById('totalLoan').textContent = formatNumber(totalLoan);
    document.getElementById('totalLoanProfit').textContent = formatNumber(totalLoanProfit);
    document.getElementById('totalCash').textContent = formatNumber(totalCash);
}