document.addEventListener('DOMContentLoaded', function () {
    const amountInputs = document.querySelectorAll('.amount-input');
    const salary = document.getElementById('salary');
    const installment = document.getElementById('installment');
    const months = document.getElementById('months');
    const paid = document.getElementById('paid');
    const remainingPrinciple = document.getElementById('remainingPrinciple');
    const downpayment = document.getElementById('downpayment');
    const percentage = document.getElementById('percentage');
    const newMonths = document.getElementById('newMonths');
    const addMoneyNeeded = document.getElementById('addMoneyNeeded');
    const moneyNeededFields = document.getElementById('moneyNeededFields');
    const adminFeesRadios = document.querySelectorAll('input[name="adminFees"]');
    const customFees = document.getElementById('customFees');
    const inputSummary = document.getElementById('inputSummary');

    const reminingMonths = document.getElementById('reminingMonths');
    const currentRemaining = document.getElementById('currentRemaining');
    const savingBeforeNewLoanProfit = document.getElementById('savingBeforeNewLoanProfit');
    const remaining = document.getElementById('remaining');
    const principle = document.getElementById('principle');
    const adminFeesResult = document.getElementById('adminFeesResult');
    const profitPerYear = document.getElementById('profitPerYear');
    const newMonthsFormula = document.getElementById('newMonthsFormula');
    const principleInstalment = document.getElementById('principleInstalment');
    const totalMonthsProfits = document.getElementById('totalMonthsProfits');
    const perMonth = document.getElementById('perMonth');
    const newInstallment = document.getElementById('newInstallment');
    const differentOfNewLoanInstalmentAmount = document.getElementById('differentOfNewLoanInstalmentAmount');
    const totalLoan = document.getElementById('totalLoan');
    const totalLoanProfit = document.getElementById('totalLoanProfit');
    const totalCash = document.getElementById('totalCash');
    const oldDBR = document.getElementById('oldDBR');
    const newDBR = document.getElementById('newDBR');
    const differenceDBR = document.getElementById('differenceDBR');

    let moneyNeededValues = [];

    // Add comma separators to amount inputs
    amountInputs.forEach(input => {
        input.addEventListener('input', function () {
            this.value = formatNumberWithCommas(this.value.replace(/,/g, ''));
        });
    });

    // Format number with commas
    function formatNumberWithCommas(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    // Parse number with commas
    function parseNumberWithCommas(number) {
        return parseFloat(number.replace(/,/g, '')) || 0;
    }

    // Round to 2 decimal places
    function roundToTwoDecimals(value) {
        return Math.round((value + Number.EPSILON) * 100) / 100;
    }

    // Add Money Needed fields
    addMoneyNeeded.addEventListener('click', function () {
        const field = document.createElement('div');
        field.innerHTML = `
            <input type="text" class="moneyNeededText" placeholder="Description">
            <input type="text" class="moneyNeededValue amount-input" placeholder="Amount">
            <button class="removeMoneyNeeded">-</button>
        `;
        moneyNeededFields.appendChild(field);

        // Add comma separator to new money needed fields
        const moneyNeededValueInput = field.querySelector('.moneyNeededValue');
        moneyNeededValueInput.addEventListener('input', function () {
            this.value = formatNumberWithCommas(this.value.replace(/,/g, ''));
            updateInputSummary();
            calculate();
        });

        field.querySelector('.removeMoneyNeeded').addEventListener('click', function () {
            moneyNeededFields.removeChild(field);
            updateInputSummary();
            calculate();
        });
    });

    // Admin Fees radio buttons
    adminFeesRadios.forEach(radio => {
        radio.addEventListener('change', function () {
            customFees.style.display = this.value === 'custom' ? 'block' : 'none';
            calculate();
        });
    });

    customFees.addEventListener('input', calculate);

    // Calculate on input change
    [salary, installment, months, paid, remainingPrinciple, downpayment, percentage, newMonths].forEach(input => {
        input.addEventListener('input', calculate);
    });

    // Update input summary
    function updateInputSummary() {
        let summary = '';
        moneyNeededValues = [];

        moneyNeededFields.querySelectorAll('.moneyNeededValue').forEach((input, index) => {
            const text = input.previousElementSibling.value || `debt${index + 1}`;
            const value = parseNumberWithCommas(input.value);
            moneyNeededValues.push(value);
            summary += `<div>${text}: ${formatNumberWithCommas(value)}</div>`;
        });

        inputSummary.innerHTML = `
            <div>Salary: ${salary.value}</div>
            <div>Installment: ${installment.value}</div>
            <div>Months: ${months.value}</div>
            <div>Paid: ${paid.value}</div>
            <div>Remaining Principle: ${remainingPrinciple.value}</div>
            <div>Downpayment: ${downpayment.value}</div>
            <div>Percentage: ${percentage.value}</div>
            <div>New Months: ${newMonths.value}</div>
            <div>Money Needed: ${summary}</div>
            <div>Admin Fees: ${adminFeesResult.value}</div>
        `;
    }

    // Main calculation function
    function calculate() {
        const salaryValue = parseNumberWithCommas(salary.value);
        const installmentValue = parseNumberWithCommas(installment.value);
        const monthsValue = parseFloat(months.value) || 0;
        const paidValue = parseFloat(paid.value) || 0;
        const remainingPrincipleValue = parseNumberWithCommas(remainingPrinciple.value);
        const downpaymentValue = parseNumberWithCommas(downpayment.value);
        const percentageValue = parseFloat(percentage.value) || 0;
        const newMonthsValue = parseFloat(newMonths.value) || 0;

        const totalMoneyNeeded = moneyNeededValues.reduce((sum, value) => sum + value, 0);

        const reminingMonthsValue = monthsValue - paidValue;
        const currentRemainingValue = roundToTwoDecimals(installmentValue * reminingMonthsValue);
        const savingBeforeNewLoanProfitValue = roundToTwoDecimals(currentRemainingValue - remainingPrincipleValue);
        const remainingValue = roundToTwoDecimals(remainingPrincipleValue - downpaymentValue + totalMoneyNeeded);
        const principleValue = remainingValue;

        let adminFeesValue = 0;
        const adminFeesSelected = document.querySelector('input[name="adminFees"]:checked').value;
        if (adminFeesSelected === '1') {
            adminFeesValue = Math.min(roundToTwoDecimals(principleValue * 0.01), 5000);
        } else if (adminFeesSelected === 'custom') {
            adminFeesValue = parseNumberWithCommas(customFees.value);
        }

        const profitPerYearValue = roundToTwoDecimals(principleValue * (percentageValue / 100));
        const newMonthsFormulaValue = roundToTwoDecimals(newMonthsValue / 12);
        const principleInstalmentValue = roundToTwoDecimals(principleValue / newMonthsValue);
        const totalMonthsProfitsValue = roundToTwoDecimals(profitPerYearValue * newMonthsFormulaValue);
        const perMonthValue = roundToTwoDecimals(totalMonthsProfitsValue / newMonthsValue);
        const newInstallmentValue = roundToTwoDecimals(principleInstalmentValue + perMonthValue);
        const differentOfNewLoanInstalmentAmountValue = roundToTwoDecimals(installmentValue - newInstallmentValue);
        const totalLoanValue = roundToTwoDecimals(principleValue + totalMonthsProfitsValue);
        const totalLoanProfitValue = roundToTwoDecimals(adminFeesValue + totalMonthsProfitsValue);
        const totalCashValue = roundToTwoDecimals(principleValue - adminFeesValue);

        const oldDBRValue = roundToTwoDecimals(installmentValue / salaryValue);
        const newDBRValue = roundToTwoDecimals(newInstallmentValue / salaryValue);
        const differenceDBRValue = roundToTwoDecimals(oldDBRValue - newDBRValue);

        // Update results
        reminingMonths.value = reminingMonthsValue.toLocaleString();
        currentRemaining.value = formatNumberWithCommas(currentRemainingValue);
        savingBeforeNewLoanProfit.value = formatNumberWithCommas(savingBeforeNewLoanProfitValue);
        remaining.value = formatNumberWithCommas(remainingValue);
        principle.value = formatNumberWithCommas(principleValue);
        adminFeesResult.value = formatNumberWithCommas(adminFeesValue);
        profitPerYear.value = formatNumberWithCommas(profitPerYearValue);
        newMonthsFormula.value = newMonthsFormulaValue.toFixed(2);
        principleInstalment.value = formatNumberWithCommas(principleInstalmentValue);
        totalMonthsProfits.value = formatNumberWithCommas(totalMonthsProfitsValue);
        perMonth.value = formatNumberWithCommas(perMonthValue);
        newInstallment.value = formatNumberWithCommas(newInstallmentValue);
        differentOfNewLoanInstalmentAmount.value = formatNumberWithCommas(differentOfNewLoanInstalmentAmountValue);
        totalLoan.value = formatNumberWithCommas(totalLoanValue);
        totalLoanProfit.value = formatNumberWithCommas(totalLoanProfitValue);
        totalCash.value = formatNumberWithCommas(totalCashValue);
        oldDBR.value = oldDBRValue.toFixed(2);
        newDBR.value = newDBRValue.toFixed(2);
        differenceDBR.value = differenceDBRValue.toFixed(2);

        // Update DBR background color
        if (differenceDBRValue > 0) {
            differenceDBR.style.backgroundColor = 'green';
        } else {
            differenceDBR.style.backgroundColor = 'orange';
        }

        // Update input summary
        updateInputSummary();
    }
});