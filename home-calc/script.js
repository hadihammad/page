function calculateLoan() {
    const salary = parseFloat(document.getElementById('salary').value);
    const loanAmount = parseFloat(document.getElementById('loanAmount').value);
    const years = parseFloat(document.getElementById('years').value);
    const sector = document.querySelector('input[name="sector"]:checked').value;
    const availableDownpayment = parseFloat(document.getElementById('availableDownpayment').value) || 0;
    const availableForLoan = parseFloat(document.getElementById('availableForLoan').value) || 0;
    const percentage = parseFloat(document.getElementById('percentage').value);

    const sakaniSupportVat = 1000000;
    const sakaniSupport = 100000;

    const downpayment = loanAmount * 0.1;
    const remainingDownpayment = downpayment - sakaniSupport - availableDownpayment;
    const remainingPrinciple = loanAmount - sakaniSupport; // Fixed label
    const commission = sector === 'sakani' ? 0 : loanAmount / 40;
    const commissionVat = sector === 'sakani' ? 0 : commission * 0.15;
    const vatableAmount = loanAmount - sakaniSupportVat;
    const vat = vatableAmount / 20;
    const totalVat = commissionVat + vat;
    const totalBeforeLoan = remainingDownpayment + commission + totalVat;
    const cashNeeded = totalBeforeLoan - availableDownpayment;
    const totalPayableNetCash = loanAmount - downpayment;
    const yearPeriod = years;
    const totalPercentage = percentage * yearPeriod;
    const totalInterest = totalPayableNetCash * totalPercentage / 100;
    const totalPayableBank = totalPayableNetCash + totalInterest;
    const monthPeriod = 12 * yearPeriod;
    const monthlyInstallment = totalPayableBank / monthPeriod;
    const totalLoanAndCash = totalBeforeLoan + totalPayableBank;
    const DBR = (monthlyInstallment * 100) / salary;

    let dbrColorClass;
    if (DBR < 25) {
        dbrColorClass = 'dbr-green';
    } else if (DBR >= 25 && DBR < 45) {
        dbrColorClass = 'dbr-yellow';
    } else if (DBR >= 45 && DBR < 65) {
        dbrColorClass = 'dbr-orange';
    } else {
        dbrColorClass = 'dbr-red';
    }

    // Function to format numbers with comma separators
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
        <div class="result-item"><strong>Monthly Installment:</strong> ${formatNumber(monthlyInstallment)}</div>
        <div class="result-item"><strong>Total Loan + Cash:</strong> ${formatNumber(totalLoanAndCash)}</div>
        <div class="result-item"><strong>DBR:</strong> <span class="${dbrColorClass}">${DBR.toFixed(2)}%</span></div>
    `;

    document.getElementById('results').innerHTML = resultsHTML;
}