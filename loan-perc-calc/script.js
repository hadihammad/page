document.getElementById('loanForm').addEventListener('submit', function (e) {
    e.preventDefault();
  
    // Get input values
    const principal = parseFloat(document.getElementById('principal').value.replace(/,/g, ''));
    const installment = parseFloat(document.getElementById('installment').value.replace(/,/g, ''));
    const lastInstallment = document.getElementById('lastInstallment').value
      ? parseFloat(document.getElementById('lastInstallment').value.replace(/,/g, ''))
      : installment;
    const months = parseInt(document.getElementById('months').value);
  
    // Calculate years
    const years = months / 12;
  
    // Calculate total loan amount
    const totalLoan = (months - 1) * installment + lastInstallment;
  
    // Calculate total interest
    const totalInterest = totalLoan - principal;
  
    // Calculate total interest percentage
    const totalInterestPercentage = ((totalInterest * 100) / principal) / 100;
  
    // Calculate yearly interest percentage
    const yearlyInterestPercentage = totalInterestPercentage / years;
  
    // Calculate monthly interest
    const monthlyInterest = totalInterest / months;
  
    // Display results
    document.getElementById('totalLoan').textContent = `﷼ ${totalLoan.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById('totalInterest').textContent = `﷼ ${totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById('totalInterestPercentage').textContent = `${(totalInterestPercentage * 100).toFixed(2)}%`;
    document.getElementById('yearlyInterestPercentage').textContent = `${(yearlyInterestPercentage * 100).toFixed(2)}%`;
    document.getElementById('monthlyInterest').textContent = `﷼ ${monthlyInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  });