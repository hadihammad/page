function toggleCustomFees() {
    const customFeesInput = document.getElementById('customFees');
    const customRadio = document.querySelector('input[name="adminFees"][value="custom"]');
    customFeesInput.classList.toggle('hidden', !customRadio.checked);
}

function formatNumberInput(input) {
    // Track cursor position and original value
    const cursorPosition = input.selectionStart;
    const originalValue = input.value;
    
    // Remove all non-numeric characters except decimal point
    let newValue = originalValue.replace(/[^0-9.]/g, '');
    
    // Handle multiple decimal points
    const decimalSplit = newValue.split('.');
    if (decimalSplit.length > 2) {
        newValue = decimalSplit[0] + '.' + decimalSplit.slice(1).join('');
    }
    
    // Split into integer and decimal parts
    const [integer, decimal] = newValue.split('.');
    
    // Format integer part with commas
    const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    // Build new formatted value
    let formattedValue = formattedInteger;
    if (decimal !== undefined) {
        formattedValue += `.${decimal.substring(0, 2)}`;
    }
    
    // Calculate cursor offset
    let cursorOffset = 0;
    const originalNumbers = originalValue.slice(0, cursorPosition).replace(/[^0-9]/g, '');
    const newNumbers = formattedValue.replace(/[^0-9]/g, '');
    
    // Count commas before cursor in original value
    const originalCommas = (originalValue.slice(0, cursorPosition).match(/,/g) || []).length;
    
    // Count commas before cursor in new value
    const newCommas = (formattedValue.slice(0, cursorPosition + cursorOffset).match(/,/g) || []).length;
    
    cursorOffset = newCommas - originalCommas;
    
    // Update input value
    input.value = formattedValue;
    
    // Set new cursor position
    const newCursorPosition = cursorPosition + cursorOffset;
    input.setSelectionRange(newCursorPosition, newCursorPosition);
}

function calculateBuyoutLoan() {
    // Get user inputs and remove formatting
    const getCleanValue = (id) => parseFloat(document.getElementById(id).value.replace(/,/g, '')) || 0;
    
    const salary = getCleanValue('salary');
    const installment = getCleanValue('installment');
    const months = parseFloat(document.getElementById('months').value);
    const paid = parseFloat(document.getElementById('paid').value);
    const remainingPrinciple = getCleanValue('remainingPrinciple');
    const downpayment = getCleanValue('downpayment');
    const moneyNeeded = getCleanValue('moneyNeeded');
    const percentage = parseFloat(document.getElementById('percentage').value);
    const newMonths = parseFloat(document.getElementById('newMonths').value);

    // Admin fees calculation
    const adminFeeOption = document.querySelector('input[name="adminFees"]:checked').value;
    let adminFees = 0;
    const adminFeesBase = remainingPrinciple + moneyNeeded;
    
    if (adminFeeOption === 'standard') {
        adminFees = Math.min(adminFeesBase * 0.01, 5000);
    } else if (adminFeeOption === 'custom') {
        adminFees = getCleanValue('customFees');
    }

    // Core calculations
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

    // DBR calculations
    const oldDBR = installment / salary;
    const newDBR = newInstallment / salary;
    const differenceDBR = oldDBR - newDBR;

    // Formatting helper
    const formatNumber = (num) => num.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    // Display input summary
    const displayInput = (id, value) => {
        document.getElementById(id).textContent = formatNumber(value);
    };
    
    displayInput('inputSalary', salary);
    displayInput('inputInstallment', installment);
    displayInput('inputMonths', months);
    displayInput('inputPaid', paid);
    displayInput('inputRemainingPrinciple', remainingPrinciple);
    displayInput('inputDownpayment', downpayment);
    displayInput('inputMoneyNeeded', moneyNeeded);
    document.getElementById('inputPercentage').textContent = percentage;
    displayInput('inputNewMonths', newMonths);
    displayInput('inputAdminFees', adminFees);

    // Display results
    const displayResult = (id, value) => {
        document.getElementById(id).textContent = formatNumber(value);
    };
    
    displayResult('reminingMonths', reminingMonths);
    displayResult('currentRemaining', currentRemaining);
    displayResult('savingBeforeNewLoanProfit', savingBeforeNewLoanProfit);
    displayResult('remaining', remaining);
    displayResult('principle', principle);
    displayResult('adminFeesResult', adminFees);
    displayResult('profitPerYear', profitPerYear);
    displayResult('newMonthsFormula', newMonthsFormula);
    displayResult('principleInstalment', principleInstalment);
    displayResult('totalMonthsProfits', totalMonthsProfits);
    displayResult('perMonth', perMonth);
    displayResult('newInstallment', newInstallment);
    displayResult('differentNewLoanInstalment', differentNewLoanInstalment);
    displayResult('totalLoan', totalLoan);
    displayResult('totalLoanProfit', totalLoanProfit);
    displayResult('totalCash', totalCash);
    displayResult('oldDBR', oldDBR);
    displayResult('newDBR', newDBR);
    displayResult('differenceDBR', differenceDBR);

    // DBR color coding
    const differenceDBRElement = document.getElementById('differenceDBR');
    differenceDBRElement.className = differenceDBR > 0 ? 'green-bg' : 'orange-bg';
}