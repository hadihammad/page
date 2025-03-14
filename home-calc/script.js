function formatInputNumber(event) {
    const input = event.target;
    let value = input.value.replace(/,/g, ''); // Remove existing commas
    let cursorPosition = input.selectionStart; // Save cursor position

    // Allow only numbers and a single decimal point
    value = value.replace(/[^0-9.]/g, ''); // Remove non-numeric characters except decimal point
    value = value.replace(/(\..*)\./g, '$1'); // Allow only one decimal point

    // Format the number with commas
    if (!isNaN(value)) {
        const parts = value.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas to the integer part
        input.value = parts.join('.'); // Rejoin integer and decimal parts

        // Adjust cursor position to account for added commas
        const commaCount = (input.value.match(/,/g) || []).length;
        cursorPosition += commaCount;
    } else {
        input.value = value; // If not a number, keep the raw value
    }

    // Restore the cursor position
    input.setSelectionRange(cursorPosition, cursorPosition);
}

// Function to set the default Personal Loan Amount (33.34% of Salary)
function setDefaultPersonalLoanAmount() {
    const salary = parseFloat(document.getElementById('salary').value.replace(/,/g, '')) || 0;
    const personalLoanAmountInput = document.getElementById('personalLoanAmount');
    const defaultPersonalLoanAmount = salary * 0.3334; // 33.34% of salary
    personalLoanAmountInput.value = defaultPersonalLoanAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Function to validate Personal Loan Amount (cannot exceed 33.34% of Salary)
function validatePersonalLoanAmount() {
    const salary = parseFloat(document.getElementById('salary').value.replace(/,/g, '')) || 0;
    const personalLoanAmountInput = document.getElementById('personalLoanAmount');
    const personalLoanAmount = parseFloat(personalLoanAmountInput.value.replace(/,/g, '')) || 0;
    const maxPersonalLoanAmount = salary * 0.3334; // 33.34% of salary

    if (personalLoanAmount > maxPersonalLoanAmount) {
        alert('Personal Loan Amount cannot exceed 33.34% of Salary.');
        personalLoanAmountInput.value = maxPersonalLoanAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
}

// Event listeners for input fields
document.getElementById('salary').addEventListener('input', () => {
    formatInputNumber(event);
    setDefaultPersonalLoanAmount();
});

document.getElementById('personalLoanAmount').addEventListener('input', () => {
    formatInputNumber(event);
    validatePersonalLoanAmount();
});

document.getElementById('homeLoanAmount').addEventListener('input', formatInputNumber);
document.getElementById('desiredHomeLoanDBR').addEventListener('input', formatInputNumber);
document.getElementById('availableDownpayment').addEventListener('input', formatInputNumber);
document.getElementById('availableForLoan').addEventListener('input', formatInputNumber);
document.getElementById('currentRent').addEventListener('input', formatInputNumber);

// Function to calculate loan
function calculateLoan() {
    const salary = parseFloat(document.getElementById('salary').value.replace(/,/g, '')) || 0;
    const personalLoanAmount = parseFloat(document.getElementById('personalLoanAmount').value.replace(/,/g, '')) || 0;
    const homeLoanAmount = parseFloat(document.getElementById('homeLoanAmount').value.replace(/,/g, '')) || 0;
    const desiredHomeLoanDBR = parseFloat(document.getElementById('desiredHomeLoanDBR').value.replace(/,/g, '')) || 0;
    const years = parseFloat(document.getElementById('years').value);
    const sector = document.querySelector('input[name="sector"]:checked').value;
    const availableDownpayment = parseFloat(document.getElementById('availableDownpayment').value.replace(/,/g, '')) || 0;
    const availableForLoan = parseFloat(document.getElementById('availableForLoan').value.replace(/,/g, '')) || 0;
    const currentRent = parseFloat(document.getElementById('currentRent').value.replace(/,/g, '')) || 0;
    const percentage = parseFloat(document.getElementById('percentage').value);

    const sakaniSupportVat = 1000000;
    const sakaniSupport = 100000;

    // Home Loan Calculations
    const downpayment = homeLoanAmount * 0.1;
    const remainingDownpayment = downpayment - sakaniSupport - availableDownpayment;
    const remainingPrinciple = homeLoanAmount - sakaniSupport;
    const commission = sector === 'sakani' ? 0 : homeLoanAmount / 40;
    const commissionVat = sector === 'sakani' ? 0 : commission * 0.15;
    const vatableAmount = homeLoanAmount - sakaniSupportVat;
    const vat = vatableAmount / 20;
    const totalVat = commissionVat + vat;
    const totalBeforeLoan = remainingDownpayment + commission + totalVat;
    const cashNeeded = totalBeforeLoan - availableDownpayment;
    const totalPayableNetCash = homeLoanAmount - downpayment;
    const yearPeriod = years;
    const totalPercentage = percentage * yearPeriod;
    const totalInterest = totalPayableNetCash * totalPercentage / 100;
    const totalPayableBank = totalPayableNetCash + totalInterest;
    const monthPeriod = 12 * yearPeriod;
    const monthlyInstallment = totalPayableBank / monthPeriod;

    // Desired Home Loan DBR Calculations
    const desiredHomeLoanAmount = (desiredHomeLoanDBR / 100) * salary;

    // Combined DBR for First 5 Years
    const personalLoanDBR = (personalLoanAmount / salary) * 100;
    const combinedDBRFirst5Years = personalLoanDBR + desiredHomeLoanDBR;

    // First 5 Years: Combined Installment
    const combinedInstallmentFirst5Years = personalLoanAmount + desiredHomeLoanAmount;

    // Total Paid in First 5 Years (Only Home Loan Installment)
    const totalPaidFirst5Years = desiredHomeLoanAmount * 60; // 5 years = 60 months

    // Remaining Loan After 5 Years
    const remainingLoanAfter5Years = totalPayableBank - totalPaidFirst5Years;

    // Remaining Duration After 5 Years
    const remainingDurationAfter5Years = (years * 12) - 60;

    // Remaining Home Loan Installment After 5 Years
    const remainingHomeLoanInstallment = remainingLoanAfter5Years / remainingDurationAfter5Years;

    // Remaining Home Loan DBR After 5 Years
    const remainingHomeLoanDBR = (remainingHomeLoanInstallment / salary) * 100;

    // Difference Between Home Loan Monthly Installment and Home Loan Installment (First 5 Years)
    const differenceInHomeLoanInstallment = desiredHomeLoanAmount - monthlyInstallment;

    // Combined total of Combined Installment (First 5 Years) and Rent Installment
    const totalHomeRelatedExpenses = combinedInstallmentFirst5Years + currentRent;

    // Home Loan Monthly Installment DBR
    const homeLoanMonthlyInstallmentDBR = (monthlyInstallment / salary) * 100;

    // Color coding for DBR
    const getDbrColorClass = (dbr) => {
        if (dbr <= 33.44) return 'dbr-green';
        else if (dbr > 33.44 && dbr <= 43.44) return 'dbr-yellow';
        else if (dbr > 43.44 && dbr <= 65) return 'dbr-orange';
        else return 'dbr-red';
    };

    const formatNumber = (num) => {
        return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const resultsHTML = `
        <div class="result-item"><strong>Downpayment:</strong> ${formatNumber(downpayment)}</div>
        <div class="result-item"><strong>Remaining Downpayment:</strong> ${formatNumber(remainingDownpayment)}</div>
        <div class="result-item"><strong>Remaining Principle:</strong> ${formatNumber(remainingPrinciple)}</div>
        <div class="result-item"><strong>Commission:</strong> ${formatNumber(commission)}</div>
        <div class="result-item"><strong>Commission VAT:</strong> ${formatNumber(commissionVat)}</div>
        <div class="result-item"><strong>Vatable Amount:</strong> ${formatNumber(vatableAmount)}</div>
        <div class="result-item"><strong>VAT:</strong> ${formatNumber(vat)}</div>
        <div class="result-item"><strong>Total VAT:</strong> ${formatNumber(totalVat)}</div>
        <div class="result-item"><strong>Total Before Loan:</strong> ${formatNumber(totalBeforeLoan)}</div>
        <div class="result-item"><strong>Cash Needed:</strong> ${formatNumber(cashNeeded)}</div>
        <div class="result-item"><strong>Total Payable Net Cash:</strong> ${formatNumber(totalPayableNetCash)}</div>
        <div class="result-item"><strong>Year Period:</strong> ${yearPeriod}</div>
        <div class="result-item"><strong>Total Percentage:</strong> ${totalPercentage.toFixed(2)}%</div>
        <div class="result-item"><strong>Total Interest:</strong> ${formatNumber(totalInterest)}</div>
        <div class="result-item"><strong>Total Payable Bank:</strong> ${formatNumber(totalPayableBank)}</div>
        <div class="result-item"><strong>Month Period:</strong> ${monthPeriod}</div>
        <div class="result-item"><strong>Home Loan Monthly Installment:</strong> ${formatNumber(monthlyInstallment)}</div>
        <div class="result-item"><strong>Desired Home Loan DBR % (First 5 Years):</strong> ${desiredHomeLoanDBR.toFixed(2)}%</div>
        <div class="result-item"><strong>Home Loan Monthly Installment DBR:</strong> <span class="${getDbrColorClass(homeLoanMonthlyInstallmentDBR)}">${homeLoanMonthlyInstallmentDBR.toFixed(2)}%</span></div>
        <div class="result-item"><strong>Personal Loan Amount:</strong> ${formatNumber(personalLoanAmount)}</div>
        <div class="result-item"><strong>Home Loan Installment (First 5 Years):</strong> ${formatNumber(desiredHomeLoanAmount)}</div>
        <div class="result-item"><strong>Difference in Home Loan Installment:</strong> ${formatNumber(differenceInHomeLoanInstallment)}</div>
        <div class="result-item"><strong>Total Home Loan Installment (First 5 Years):</strong> ${formatNumber(desiredHomeLoanAmount * 60)}</div>
        <div class="result-item"><strong>Combined DBR (First 5 Years):</strong> <span class="${getDbrColorClass(combinedDBRFirst5Years)}">${combinedDBRFirst5Years.toFixed(2)}%</span></div>
        <div class="result-item"><strong>Combined Installment (First 5 Years):</strong> ${formatNumber(combinedInstallmentFirst5Years)}</div>
        <div class="result-item"><strong>Rent Installment:</strong> ${formatNumber(currentRent)}</div>
        <div class="result-item"><strong>Total Home-Related Expenses:</strong> ${formatNumber(totalHomeRelatedExpenses)}</div>
        <div class="result-item"><strong>Remaining Home Loan After 5 Years:</strong> ${formatNumber(remainingLoanAfter5Years)}</div>
        <div class="result-item"><strong>Remaining Home Loan Installment:</strong> <span class="${getDbrColorClass(remainingHomeLoanDBR)}">${formatNumber(remainingHomeLoanInstallment)}</span></div>
        <div class="result-item"><strong>Remaining Home Loan DBR:</strong> <span class="${getDbrColorClass(remainingHomeLoanDBR)}">${remainingHomeLoanDBR.toFixed(2)}%</span></div>
        <div class="result-item"><strong>Total Loan + Cash:</strong> ${formatNumber(totalBeforeLoan + totalPayableBank)}</div>
    `;

    document.getElementById('results').innerHTML = resultsHTML;
}

// Function to gather form data for CSV
function gatherFormDataForCSV() {
    const data = {
        salary: document.getElementById('salary').value,
        personalLoanAmount: document.getElementById('personalLoanAmount').value,
        homeLoanAmount: document.getElementById('homeLoanAmount').value,
        desiredHomeLoanDBR: document.getElementById('desiredHomeLoanDBR').value,
        years: document.getElementById('years').value,
        sector: document.querySelector('input[name="sector"]:checked').value,
        availableDownpayment: document.getElementById('availableDownpayment').value,
        availableForLoan: document.getElementById('availableForLoan').value,
        currentRent: document.getElementById('currentRent').value,
        percentage: document.getElementById('percentage').value,
    };

    return data;
}

// Function to convert data to CSV format (tab-delimited)
function convertToCSV(data) {
    const rows = [];
    for (const [key, value] of Object.entries(data)) {
        rows.push(`${key}\t${value}`);
    }
    return rows.join('\n');
}

// Function to copy CSV data to clipboard
function copyToCSV() {
    const data = gatherFormDataForCSV();
    const csvData = convertToCSV(data);
    navigator.clipboard.writeText(csvData).then(() => {
        alert('CSV data copied to clipboard! Paste it into Excel or a text file.');
    }).catch(() => {
        alert('Failed to copy CSV data. Please manually copy the data.');
    });
}

// Function to import data from a file
function importDataFromFile(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
        const content = e.target.result;
        const rows = content.split('\n');
        const data = {};
        rows.forEach(row => {
            const [key, value] = row.split('\t');
            if (key && value !== undefined) {
                data[key.trim()] = value.trim();
            }
        });

        // Populate form fields with imported data
        if (data.salary) document.getElementById('salary').value = data.salary;
        if (data.personalLoanAmount) document.getElementById('personalLoanAmount').value = data.personalLoanAmount;
        if (data.homeLoanAmount) document.getElementById('homeLoanAmount').value = data.homeLoanAmount;
        if (data.desiredHomeLoanDBR) document.getElementById('desiredHomeLoanDBR').value = data.desiredHomeLoanDBR;
        if (data.years) document.getElementById('years').value = data.years;
        if (data.sector) document.querySelector(`input[name="sector"][value="${data.sector}"]`).checked = true;
        if (data.availableDownpayment) document.getElementById('availableDownpayment').value = data.availableDownpayment;
        if (data.availableForLoan) document.getElementById('availableForLoan').value = data.availableForLoan;
        if (data.currentRent) document.getElementById('currentRent').value = data.currentRent;
        if (data.percentage) document.getElementById('percentage').value = data.percentage;

        alert('Data imported successfully!');
    };
    reader.readAsText(file);
}

// Event listeners for import and export buttons
document.getElementById('copyToCsvButton').addEventListener('click', copyToCSV);

document.getElementById('importButton').addEventListener('click', () => {
    document.getElementById('importFileInput').click();
});

document.getElementById('importFileInput').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        importDataFromFile(file);
    }
});