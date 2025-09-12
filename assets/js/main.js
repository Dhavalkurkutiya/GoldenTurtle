// Number to words function for Indian number system (supports up to crores)
function numberToWords(num) {
    if (num === 0) return "Zero";

    const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
        'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    function inWords(n) {
        if (n < 20) return a[n];
        if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? '-' + a[n % 10] : '');
        if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' and ' + inWords(n % 100) : '');
        if (n < 100000) return inWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ', ' + inWords(n % 1000) : '');
        if (n < 10000000) return inWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ', ' + inWords(n % 100000) : '');
        return inWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ', ' + inWords(n % 10000000) : '');
    }

    return inWords(num);
}

function formatCurrency(amount) {
    return '₹ ' + amount.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

document.getElementById('calculate-sip').addEventListener('click', () => {
    const monthlyInvestment = parseFormattedNumber(document.getElementById('sip-amount').value);
    const years = parseFloat(document.getElementById('sip-years').value);
    const annualReturn = parseFloat(document.getElementById('sip-return').value);

    if (
        isNaN(monthlyInvestment) || monthlyInvestment <= 0 ||
        isNaN(years) || years <= 0 ||
        isNaN(annualReturn) || annualReturn < 0
    ) {
        alert('Please enter valid positive values for all fields');
        return;
    }

    const months = years * 12;
    const monthlyRate = annualReturn / 100 / 12;

    let totalInvestment = monthlyInvestment * months;

    // Future value (FV) of SIP formula:
    // FV = P * [((1 + r)^n - 1) / r] * (1 + r)
    // Where P = monthly investment, r = monthly rate, n = number of months
    let fv = monthlyInvestment *
        ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);

    let estimatedReturns = fv - totalInvestment;

    // Set outputs in digits
    document.getElementById('sip-monthly').textContent = formatCurrency(monthlyInvestment);
    document.getElementById('sip-total').textContent = formatCurrency(totalInvestment);
    document.getElementById('sip-returns').textContent = formatCurrency(estimatedReturns);
    document.getElementById('sip-total-value').textContent = formatCurrency(fv);

    // Outputs in words below numbers
    document.getElementById('sip-monthly-words').textContent = numberToWords(Math.round(monthlyInvestment));
    document.getElementById('sip-total-words').textContent = numberToWords(Math.round(totalInvestment));
    document.getElementById('sip-returns-words').textContent = numberToWords(Math.round(estimatedReturns));
    document.getElementById('sip-total-value-words').textContent = numberToWords(Math.round(fv));
});



// Number to words function for Indian number system (supports up to crores)
function numberToWords(num) {
    if (num === 0) return "Zero";

    const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
        'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    function inWords(n) {
        if (n < 20) return a[n];
        if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? '-' + a[n % 10] : '');
        if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' and ' + inWords(n % 100) : '');
        if (n < 100000) return inWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ', ' + inWords(n % 1000) : '');
        if (n < 10000000) return inWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ', ' + inWords(n % 100000) : '');
        return inWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ', ' + inWords(n % 10000000) : '');
    }

    return inWords(num);
}

function formatCurrency(amount) {
    return '₹ ' + amount.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

let chartInstance;

document.getElementById('calculate-swp').addEventListener('click', () => {
    const investmentAmount = parseFormattedNumber(document.getElementById('investment-amount').value);
    const monthlyWithdrawal = parseFormattedNumber(document.getElementById('monthly-withdrawal-input').value);
    const swpYears = parseFloat(document.getElementById('swp-years').value);
    const swpReturn = parseFloat(document.getElementById('swp-return').value);

    const warningEl = document.getElementById('swp-warning');
    warningEl.textContent = '';

    if (
        isNaN(investmentAmount) || investmentAmount <= 0 ||
        isNaN(monthlyWithdrawal) || monthlyWithdrawal <= 0 ||
        isNaN(swpYears) || swpYears <= 0 ||
        isNaN(swpReturn) || swpReturn < 0
    ) {
        alert('Please enter valid positive values for all fields');
        return;
    }

    const months = swpYears * 12;
    const monthlyRate = Math.pow(1 + swpReturn / 100, 1 / 12) - 1;

    let balance = investmentAmount;
    let totalWithdrawn = 0;

    let balanceData = [];
    let monthLabels = [];

    for (let i = 1; i <= months; i++) {
        balance += balance * monthlyRate; // Interest applied before withdrawal
        balance -= monthlyWithdrawal;
        totalWithdrawn += monthlyWithdrawal;

        balanceData.push(balance > 0 ? balance : 0);
        monthLabels.push(`Month ${i}`);
    }

    document.getElementById('invested-amount').textContent = formatCurrency(investmentAmount);
    document.getElementById('invested-amount-words').textContent = numberToWords(Math.round(investmentAmount));

    document.getElementById('total-withdrawn').textContent = formatCurrency(totalWithdrawn);
    document.getElementById('total-withdrawn-words').textContent = numberToWords(Math.round(totalWithdrawn));

    document.getElementById('final-value').textContent = formatCurrency(balance);
    document.getElementById('final-value-words').textContent = balance < 0 ? 'Zero' : numberToWords(Math.round(balance));

    if (balance < 0) {
        warningEl.textContent = `Warning: Your corpus is in deficit by ₹${Math.abs(Math.round(balance))}.`;
    }

    if (chartInstance) {
        chartInstance.destroy();
    }

    const ctx = document.getElementById('swpChart').getContext('2d');
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: monthLabels,
            datasets: [{
                label: 'Corpus Balance Over Time',
                data: balanceData,
                borderColor: '#FEE715FF',
                backgroundColor: 'rgba(254, 231, 21, 0.5)',
                tension: 0.3,
                fill: true,
                pointRadius: 2,
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { display: true, title: { display: true, text: 'Month' } },
                y: { display: true, title: { display: true, text: 'Corpus Value (₹)' }, beginAtZero: true }
            },
            plugins: {
                legend: { labels: { color: '#FEE715FF' } },
                tooltip: { mode: 'index', intersect: false }
            }
        }
    });
});

// Header scroll effect
window.addEventListener('scroll', function () {
    const header = document.getElementById('header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Mobile menu toggle
const mobileToggle = document.getElementById('mobile-toggle');
const nav = document.getElementById('nav');

mobileToggle.addEventListener('click', function () {
    nav.classList.toggle('active');
});

// Close mobile menu when clicking a link
const navLinks = document.querySelectorAll('nav ul li a');
navLinks.forEach(link => {
    link.addEventListener('click', function () {
        nav.classList.remove('active');
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Calculator Tab Functionality
const tabBtns = document.querySelectorAll('.tab-btn');
const calculatorContents = document.querySelectorAll('.calculator-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons and contents
        tabBtns.forEach(b => b.classList.remove('active'));
        calculatorContents.forEach(c => c.classList.remove('active'));

        // Add active class to clicked button
        btn.classList.add('active');

        // Show corresponding content
        const tabName = btn.getAttribute('data-tab');
        document.getElementById(`${tabName}-calculator`).classList.add('active');
    });
});

// Format currency for display in Indian numbering system
function formatCurrency(amount) {
    return '₹ ' + amount.toLocaleString('en-IN', {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0
    });
}

// Convert number to words for Indian numbering system
function numberToWords(num) {
    const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    if (num === 0) return 'Zero Rupees';

    // Inner function without "Rupees" to avoid recursion issues
    function convert(num) {
        let result = '';

        if (num >= 10000000) {
            const crores = Math.floor(num / 10000000);
            result += convert(crores) + ' Crore ';
            num %= 10000000;
        }

        if (num >= 100000) {
            const lakhs = Math.floor(num / 100000);
            result += convert(lakhs) + ' Lakh ';
            num %= 100000;
        }

        if (num >= 1000) {
            const thousands = Math.floor(num / 1000);
            result += convert(thousands) + ' Thousand ';
            num %= 1000;
        }

        if (num >= 100) {
            const hundreds = Math.floor(num / 100);
            result += units[hundreds] + ' Hundred ';
            num %= 100;
        }

        if (num > 0) {
            if (result !== '') {
                result += 'and ';
            }

            if (num < 10) {
                result += units[num];
            } else if (num < 20) {
                result += teens[num - 10];
            } else {
                const ten = Math.floor(num / 10);
                const unit = num % 10;
                result += tens[ten];
                if (unit > 0) {
                    result += ' ' + units[unit];
                }
            }
        }

        return result.trim();
    }

    return convert(num) + ' Rupees';
}


// Format all amount inputs with commas
const goalAmountInput = document.getElementById('goal-amount');
const currentSavingsInput = document.getElementById('current-savings');
const sipAmountInput = document.getElementById('sip-amount');
const investmentAmountInput = document.getElementById('investment-amount');
const monthlyWithdrawalInput = document.getElementById('monthly-withdrawal-input');

// Function to format number with Indian comma system
function formatIndianNumber(num) {
    return num.toLocaleString('en-IN');
}

// Function to remove commas and parse number
function parseFormattedNumber(str) {
    return parseFloat(str.replace(/,/g, ''));
}

// Function to add formatting to input field
function addInputFormatting(inputElement) {
    inputElement.addEventListener('input', function (e) {
        let value = e.target.value.replace(/,/g, ''); // Remove existing commas
        if (value && !isNaN(value)) {
            e.target.value = formatIndianNumber(parseInt(value));
        }
    });
}

// Add formatting to all amount input fields
addInputFormatting(goalAmountInput);
addInputFormatting(currentSavingsInput);
addInputFormatting(sipAmountInput);
addInputFormatting(investmentAmountInput);
addInputFormatting(monthlyWithdrawalInput);

// Goal Calculator - FIXED
const calculateGoal = document.getElementById('calculate-goal');

calculateGoal.addEventListener('click', () => {
    // Get input values
    const goalName = document.getElementById('goal-name').value || 'Dream Goal';
    const goalAmount = parseFormattedNumber(document.getElementById('goal-amount').value);
    const years = parseFloat(document.getElementById('years').value);
    const currentSavings = parseFormattedNumber(document.getElementById('current-savings').value) || 0;

    // Validate inputs
    if (!goalAmount || !years) {
        alert('Please enter valid values for Target Amount and Years');
        return;
    }

    // Constants
    const annualReturn = 12.5 / 100; // 12.5% annual return
    const months = years * 12;
    const monthlyRate = annualReturn / 12;

    // Calculate future value of current savings
    const futureValueOfSavings = currentSavings * Math.pow(1 + annualReturn, years);

    // Calculate the amount needed from investments
    let neededAmount = goalAmount - futureValueOfSavings;
    if (neededAmount < 0) {
        neededAmount = 0;
    }

    let monthlyInvestment = 0;
    let totalInvestment = 0;
    let wealthAccumulated = futureValueOfSavings;

    if (neededAmount > 0) {
        // Calculate monthly investment (annuity due) required
        const factor = ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
        monthlyInvestment = neededAmount / factor;

        // Calculate total investment amount
        totalInvestment = monthlyInvestment * months;

        // Calculate the future value of the monthly investments (annuity due)
        const futureValueOfMonthly = monthlyInvestment *
            ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);

        wealthAccumulated = futureValueOfSavings + futureValueOfMonthly;
    }

    // Round values to whole numbers
    const monthlyRounded = Math.round(monthlyInvestment);
    const totalRounded = Math.round(totalInvestment);
    const wealthRounded = Math.round(wealthAccumulated);

    // Update results
    document.getElementById('goal-result-name').textContent = goalName;

    document.getElementById('monthly-investment').textContent = formatCurrency(monthlyRounded);
    document.getElementById('monthly-investment-words').textContent = numberToWords(monthlyRounded);

    document.getElementById('total-investment').textContent = formatCurrency(totalRounded);
    document.getElementById('total-investment-words').textContent = numberToWords(totalRounded);

    document.getElementById('wealth-accumulated').textContent = formatCurrency(wealthRounded);
    document.getElementById('wealth-accumulated-words').textContent = numberToWords(wealthRounded);
});

// SIP Calculator - FIXED
const calculateSip = document.getElementById('calculate-sip');

calculateSip.addEventListener('click', () => {
    // Get input values
    const sipAmount = parseFormattedNumber(document.getElementById('sip-amount').value);
    const sipYears = parseFloat(document.getElementById('sip-years').value);
    const sipReturn = parseFloat(document.getElementById('sip-return').value) / 100;

    // Validate inputs
    if (!sipAmount || !sipYears || !sipReturn) {
        alert('Please enter valid values for all fields');
        return;
    }

    // Constants
    const months = sipYears * 12;
    const monthlyRate = sipReturn / 12;

    // Calculate future value of SIP
    const futureValue = sipAmount *
        ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);


    // Calculate total investment
    const totalInvestment = sipAmount * months;

    // Calculate returns
    const returns = futureValue - totalInvestment;

    // Round values to whole numbers
    const futureRounded = Math.round(futureValue);
    const totalRounded = Math.round(totalInvestment);
    const returnsRounded = Math.round(returns);

    // Update results
    document.getElementById('sip-monthly').textContent = formatCurrency(sipAmount);
    document.getElementById('sip-total').textContent = formatCurrency(totalRounded);
    document.getElementById('sip-returns').textContent = formatCurrency(returnsRounded);
    document.getElementById('sip-total-value').textContent = formatCurrency(futureRounded);
});

// SWP Calculator - Accurate final value simulation
const calculateSwp = document.getElementById('calculate-swp');

calculateSwp.addEventListener('click', () => {
    // Get and validate input values
    const investmentAmount = parseFormattedNumber(document.getElementById('investment-amount').value);
    const swpYears = parseFloat(document.getElementById('swp-years').value);
    const swpReturn = parseFloat(document.getElementById('swp-return').value);

    if (isNaN(investmentAmount) || isNaN(swpYears) || isNaN(swpReturn) || investmentAmount <= 0 || swpYears <= 0 || swpReturn <= 0) {
        alert('Please enter valid values for all fields');
        return;
    }

    // Constants
    const months = swpYears * 12;
    const annualRate = swpReturn / 100;
    const monthlyRate = annualRate / 12;

    // Calculate monthly withdrawal using annuity formula
    const monthlyWithdrawal = investmentAmount * monthlyRate /
        (1 - Math.pow(1 + monthlyRate, -months));

    // Calculate total withdrawn
    const totalWithdrawn = monthlyWithdrawal * months;

    // Simulate balance over time
    let balance = investmentAmount;
    let depleted = false;

    for (let i = 0; i < months; i++) {
        balance *= (1 + monthlyRate);   // Add interest
        balance -= monthlyWithdrawal;   // Subtract withdrawal

        if (balance <= 0) {
            balance = 0;
            depleted = true;
            break;
        }
    }

    const finalValue = balance;

    // Round values
    const monthlyRounded = Math.round(monthlyWithdrawal);
    const totalRounded = Math.round(totalWithdrawn);
    const finalRounded = Math.round(finalValue);

    // Debugging (optional)
    console.log("Final Rounded:", finalRounded);

    // Update results
    document.getElementById('monthly-withdrawal').textContent = formatCurrency(monthlyRounded);
    document.getElementById('total-withdrawn').textContent = formatCurrency(totalRounded);
    document.getElementById('final-value').textContent = formatCurrency(finalRounded);

    // Optional: Notify if funds deplete early
    if (depleted) {
        console.warn('⚠️ Funds depleted before the full duration.');
    }
});