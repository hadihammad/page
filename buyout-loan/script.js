function toggleCustomFees() {
    const customFeesInput = document.getElementById('customFees');
    const customRadio = document.querySelector('input[name="adminFees"][value="custom"]');
    customFeesInput.classList.toggle('hidden', !customRadio.checked);
}

function formatNumberInput(input) {
    // Remove non-numeric characters except decimal point
    let value = input.value.replace(/[^0-9.]/g, '');

    // Ensure only one decimal point
    const decimalCount = value.split('.').length - 1;
    if (decimalCount > 1) {
        value = value.substring(0, value.lastIndexOf('.'));
    }

    // Format with commas and two decimal places
    if (value !== '' && value !== '.') {
        const [integer, decimal] = value.split('.');
        const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        const formattedDecimal = decimal ? `.${decimal.substring(0, 2)}` : '';
        input.value = formattedInteger + formattedDecimal;
    }
}

function calculateBuyoutLoan() {
    // Get user inputs and remove commas
    const salary = parseFloat(document.getElementById('salary').value.replace(/,/g, '')) || 0;
    const installment = parseFloat(document.getElementById('installment').value.replace(/,/g, '')) || 0;
    const months = parseFloat(document.getElementById('months').value);
    const paid = parseFloat(document.getElementById('paid').value);
    const remainingPrinciple = parseFloat(document.getElementById('remainingPrinciple').value.replace(/,/g, '')) || 0;
    const downpayment = parseFloat(document.getElementById('downpayment').value.replace(/,/g, '')) || 0;
    const moneyNeeded = parseFloat(document.getElementById('moneyNeeded').value.replace(/,/g, '')) || 0;
    const percentage = parseFloat(document.getElementById('percentage').value);
    const newMonths = parseFloat(document.getElementById('newMonths').value);

    // Get administration fees option
    const adminFeeOption = document.querySelector('input[name="adminFees"]:checked').value;
    let adminFees = 0;
    const adminFeesBase = remainingPrinciple + (moneyNeeded || 0); // Updated calculation
    if (adminFeeOption === 'standard') {
        adminFees = Math.min(adminFeesBase * 0.01, 5000);
    } else if (adminFeeOption === 'custom') {
        adminFees = parseFloat(document.getElementById('customFees').value.replace(/,/g, '')) || 0;
    }

    // Perform calculations
    const reminingMonths = months - paid;
    const currentRemaining = installment * reminingMonths;
    const savingBeforeNewLoanProfit = currentRemaining - remainingPrinciple;
    const remaining = remainingPrinciple - downpayment + moneyNeeded;
    const principle = remaining;
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

    // Calculate DBR
    const oldDBR = installment / salary;
    const newDBR = newInstallment / salary;
    const differenceDBR = oldDBR - newDBR;

    // Format numbers with comma separators
    const formatNumber = (num) => num.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    // Display input summary
    document.getElementById('inputSalary').textContent = formatNumber(salary);
    document.getElementById('inputInstallment').textContent = formatNumber(installment);
    document.getElementById('inputMonths').textContent = formatNumber(months);
    document.getElementById('inputPaid').textContent = formatNumber(paid);
    document.getElementById('inputRemainingPrinciple').textContent = formatNumber(remainingPrinciple);
    document.getElementById('inputDownpayment').textContent = formatNumber(downpayment);
    document.getElementById('inputMoneyNeeded').textContent = formatNumber(moneyNeeded);
    document.getElementById('inputPercentage').textContent = percentage;
    document.getElementById('inputNewMonths').textContent = formatNumber(newMonths);
    document.getElementById('inputAdminFees').textContent = formatNumber(adminFees);

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
    document.getElementById('oldDBR').textContent = formatNumber(oldDBR);
    document.getElementById('newDBR').textContent = formatNumber(newDBR);
    document.getElementById('differenceDBR').textContent = formatNumber(differenceDBR);

    // Set background color for Difference in DBR
    const differenceDBRElement = document.getElementById('differenceDBR');
    if (differenceDBR > 0) {
        differenceDBRElement.className = 'green-bg'; // Old DBR is bigger
    } else {
        differenceDBRElement.className = 'orange-bg'; // New DBR is bigger or equal
    }
}