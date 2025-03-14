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
    const copyToCsvButton = document.getElementById('copyToCsv');
    const importFileInput = document.getElementById('importFileInput');
    const importFileButton = document.getElementById('importFileButton');

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
        addMoneyNeededField();
    });

    // Function to add a Money Needed field
    function addMoneyNeededField(description = '', amount = '') {
        const field = document.createElement('div');
        field.innerHTML = `
            <input type="text" class="moneyNeededText" placeholder="Description" value="${description}">
            <input type="text" class="moneyNeededValue amount-input" placeholder="Amount" value="${amount}">
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

        // Trigger calculation after adding a new field
        calculate();
    }

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

    // Generate CSV data with tabs as delimiters
    function generateCsvData() {
        const inputs = [
            { label: 'Salary', value: salary.value },
            { label: 'Installment', value: installment.value },
            { label: 'Months', value: months.value },
            { label: 'Paid', value: paid.value },
            { label: 'Remaining Principle', value: remainingPrinciple.value },
            { label: 'Downpayment', value: downpayment.value },
            { label: 'Percentage', value: percentage.value },
            { label: 'New Months', value: newMonths.value },
            { label: 'Admin Fees', value: document.querySelector('input[name="adminFees"]:checked').value },
        ];

        const moneyNeeded = [];
        moneyNeededFields.querySelectorAll('.moneyNeededValue').forEach((input, index) => {
            const text = input.previousElementSibling.value || `Debt${index + 1}`;
            const value = input.value;
            moneyNeeded.push({ label: text, value });
        });

        const results = [
            { label: 'Remining Months', value: reminingMonths.value },
            { label: 'Current Remaining', value: currentRemaining.value },
            { label: 'Saving Before New Loan Profit', value: savingBeforeNewLoanProfit.value },
            { label: 'Remaining', value: remaining.value },
            { label: 'Principle', value: principle.value },
            { label: 'Profit Per Year', value: profitPerYear.value },
            { label: 'New Months Formula', value: newMonthsFormula.value },
            { label: 'Principle Instalment', value: principleInstalment.value },
            { label: 'Total Months Profits', value: totalMonthsProfits.value },
            { label: 'Per Month', value: perMonth.value },
            { label: 'New Installment', value: newInstallment.value },
            { label: 'Different of New Loan Instalment Amount', value: differentOfNewLoanInstalmentAmount.value },
            { label: 'Total Loan', value: totalLoan.value },
            { label: 'Total Loan Profit', value: totalLoanProfit.value },
            { label: 'Total Cash', value: totalCash.value },
            { label: 'Old DBR', value: oldDBR.value },
            { label: 'New DBR', value: newDBR.value },
            { label: 'Difference in DBR', value: differenceDBR.value },
        ];

        // Combine all data
        const allData = [...inputs, ...moneyNeeded, ...results];

        // Convert to tab-delimited format
        const csvRows = allData.map(item => `${item.label}\t${item.value}`).join('\n');
        return csvRows;
    }

    // Copy CSV data to clipboard
    copyToCsvButton.addEventListener('click', function () {
        const csvData = generateCsvData();
        navigator.clipboard.writeText(csvData).then(() => {
            alert('Data copied to clipboard! Paste it into Excel or a .csv file.');
        }).catch(() => {
            alert('Failed to copy data. Please manually copy the data.');
        });
    });

    // Import data from file
    importFileButton.addEventListener('click', function () {
        importFileInput.click();
    });

    importFileInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const data = e.target.result.trim();
                try {
                    const parsedData = parseTabDelimitedData(data);
                    populateInputs(parsedData);
                    alert('Data imported successfully!');
                } catch (error) {
                    alert('Failed to import data. Please check the file format.');
                }
            };
            reader.readAsText(file);
        }
    });

    // Parse tab-delimited data
    function parseTabDelimitedData(data) {
        const rows = data.split('\n');
        const parsedData = {};
        rows.forEach(row => {
            const [label, value] = row.split('\t');
            if (label && value !== undefined) {
                parsedData[label.trim()] = value.trim();
            }
        });
        return parsedData;
    }

    // Populate inputs with imported data
    function populateInputs(data) {
        if (data['Salary']) salary.value = data['Salary'];
        if (data['Installment']) installment.value = data['Installment'];
        if (data['Months']) months.value = data['Months'];
        if (data['Paid']) paid.value = data['Paid'];
        if (data['Remaining Principle']) remainingPrinciple.value = data['Remaining Principle'];
        if (data['Downpayment']) downpayment.value = data['Downpayment'];
        if (data['Percentage']) percentage.value = data['Percentage'];
        if (data['New Months']) newMonths.value = data['New Months'];

        // Set Admin Fees radio button
        if (data['Admin Fees']) {
            const adminFeesValue = data['Admin Fees'];
            if (adminFeesValue === '0') {
                document.querySelector('input[name="adminFees"][value="0"]').checked = true;
                customFees.style.display = 'none';
            } else if (adminFeesValue === '1') {
                document.querySelector('input[name="adminFees"][value="1"]').checked = true;
                customFees.style.display = 'none';
            } else if (adminFeesValue === 'custom') {
                document.querySelector('input[name="adminFees"][value="custom"]').checked = true;
                customFees.style.display = 'block';
                if (data['Custom Fees']) customFees.value = data['Custom Fees'];
            }
        }

        // Clear existing money needed fields
        moneyNeededFields.innerHTML = '';

        // Add money needed fields from imported data
        Object.keys(data).forEach(key => {
            if (![
                'Salary', 'Installment', 'Months', 'Paid', 'Remaining Principle', 'Downpayment',
                'Percentage', 'New Months', 'Admin Fees', 'Custom Fees', 'Remining Months',
                'Current Remaining', 'Saving Before New Loan Profit', 'Remaining', 'Principle',
                'Profit Per Year', 'New Months Formula', 'Principle Instalment', 'Total Months Profits',
                'Per Month', 'New Installment', 'Different of New Loan Instalment Amount', 'Total Loan',
                'Total Loan Profit', 'Total Cash', 'Old DBR', 'New DBR', 'Difference in DBR'
            ].includes(key)) {
                addMoneyNeededField(key, data[key]);
            }
        });

        // Trigger calculations
        calculate();
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

        // Update moneyNeededValues array with current values
        moneyNeededValues = [];
        moneyNeededFields.querySelectorAll('.moneyNeededValue').forEach(input => {
            moneyNeededValues.push(parseNumberWithCommas(input.value));
        });

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