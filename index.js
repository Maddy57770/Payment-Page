// Complete updated index.js with all features

const cardNumberInput = document.getElementById('cardNumber');
const expiryInput = document.getElementById('expiry');
const cvvInput = document.getElementById('cvv');
const zipInput = document.getElementById('zip');
const amountInput = document.getElementById('amount');
const cardNameInput = document.getElementById('cardName');
const paymentForm = document.getElementById('paymentForm');
const successMessage = document.getElementById('successMessage');
const payButton = document.getElementById('payButton');
const spinner = document.getElementById('spinner');
const buttonText = document.querySelector('.button-text');
const cardLogo = document.getElementById('cardLogo');
const saveCardCheckbox = document.getElementById('saveCard');

const amountError = document.getElementById('amountError');
const cardNameError = document.getElementById('cardNameError');
const cardNumberError = document.getElementById('cardNumberError');
const expiryError = document.getElementById('expiryError');
const cvvError = document.getElementById('cvvError');
const zipError = document.getElementById('zipError');

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updateTodayStats();
    displayRecentTransactions();
    checkSelectedPlan();
    loadSavedCard();
});

// Mobile menu toggle
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    
    mobileMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
}

// Check if user has selected a plan from pricing page
function checkSelectedPlan() {
    const selectedPlan = JSON.parse(localStorage.getItem('selectedPlan'));
    const planBadge = document.getElementById('selectedPlanBadge');
    
    if (selectedPlan) {
        const planText = document.querySelector('.plan-text');
        planText.textContent = `${selectedPlan.name.charAt(0).toUpperCase() + selectedPlan.name.slice(1)} Plan Active`;
        planBadge.style.display = 'flex';
    }
}

// Load saved card if exists
function loadSavedCard() {
    const savedCard = JSON.parse(localStorage.getItem('savedCard'));
    if (savedCard) {
        cardNameInput.value = savedCard.name;
        cardNumberInput.value = savedCard.number;
        // Don't load CVV for security
    }
}

// Update today's statistics
function updateTodayStats() {
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const today = new Date().toISOString().split('T')[0];
    
    const todayTransactions = transactions.filter(t => 
        new Date(t.date).toISOString().split('T')[0] === today
    );
    
    const todayTotal = todayTransactions.reduce((sum, t) => sum + t.amount, 0);
    const successCount = todayTransactions.filter(t => t.status === 'success').length;
    const successRate = todayTransactions.length > 0 
        ? Math.round((successCount / todayTransactions.length) * 100) 
        : 100;
    
    document.getElementById('todayCount').textContent = todayTransactions.length;
    document.getElementById('todayAmount').textContent = `$${todayTotal.toFixed(2)}`;
    document.getElementById('successRate').textContent = `${successRate}%`;
}

// Display recent transactions
function displayRecentTransactions() {
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const recentTransactionsList = document.getElementById('recentTransactionsList');
    
    if (transactions.length === 0) {
        recentTransactionsList.innerHTML = '<p class="no-transactions">No recent transactions</p>';
        return;
    }
    
    const recentTransactions = transactions.slice(0, 3); // Show last 3 transactions
    
    recentTransactionsList.innerHTML = recentTransactions.map(transaction => {
        const date = new Date(transaction.date);
        const timeAgo = getTimeAgo(date);
        
        return `
            <div class="transaction-item">
                <div class="transaction-info">
                    <div class="transaction-status ${transaction.status}"></div>
                    <div class="transaction-details">
                        <div class="transaction-id">${transaction.id}</div>
                        <div class="transaction-time">${timeAgo}</div>
                    </div>
                </div>
                <div class="transaction-amount">$${transaction.amount.toFixed(2)}</div>
            </div>
        `;
    }).join('');
}

// Get time ago string
function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    
    return date.toLocaleDateString();
}

// Generate transaction ID
function generateTransactionId() {
    return 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Save transaction
function saveTransaction(transactionData) {
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    transactions.unshift(transactionData);
    
    // Keep only last 500 transactions
    if (transactions.length > 500) {
        transactions.length = 500;
    }
    
    localStorage.setItem('transactions', JSON.stringify(transactions));
    updateTodayStats();
    displayRecentTransactions();
}

// Save card if checkbox is checked
function saveCardIfNeeded() {
    if (saveCardCheckbox.checked) {
        const savedCard = {
            name: cardNameInput.value,
            number: cardNumberInput.value.slice(0, -4).replace(/\d/g, '*') + cardNumberInput.value.slice(-4),
            type: detectCardType(cardNumberInput.value)
        };
        localStorage.setItem('savedCard', JSON.stringify(savedCard));
    }
}

// Clear errors
function clearErrors() {
    [amountError, cardNameError, cardNumberError, expiryError, cvvError, zipError].forEach(el => {
        if (el) el.classList.remove('show');
    });
}

// Show error
function showError(element, message) {
    if (element) {
        element.textContent = message;
        element.classList.add('show');
    }
}

// Validate form
function validateForm() {
    clearErrors();
    let isValid = true;

    if (!amountInput.value || parseFloat(amountInput.value.replace('$', '')) <= 0) {
        showError(amountError, 'Please enter a valid amount.');
        isValid = false;
    }

    if (!cardNameInput.value.trim()) {
        showError(cardNameError, 'Cardholder name is required.');
        isValid = false;
    }

    const cardNumber = cardNumberInput.value.replace(/\s/g, '');
    if (cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
        showError(cardNumberError, 'Please enter a valid 16-digit card number.');
        isValid = false;
    }

    const expiry = expiryInput.value;
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        showError(expiryError, 'Please enter expiry date as MM/YY.');
        isValid = false;
    } else {
        const [month, year] = expiry.split('/');
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;
        if (parseInt(month) < 1 || parseInt(month) > 12 || parseInt(year) < currentYear || 
            (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
            showError(expiryError, 'Expiry date is invalid.');
            isValid = false;
        }
    }

    if (cvvInput.value.length !== 3 || !/^\d+$/.test(cvvInput.value)) {
        showError(cvvError, 'Please enter a valid 3-digit CVV.');
        isValid = false;
    }

    if (zipInput.value.length !== 5 || !/^\d+$/.test(zipInput.value)) {
        showError(zipError, 'Please enter a valid 5-digit ZIP code.');
        isValid = false;
    }

    return isValid;
}

// Card type detection
const cardTypes = {
    visa: 'https://img.icons8.com/color/48/000000/visa.png',
    mastercard: 'https://img.icons8.com/color/48/000000/mastercard.png',
    amex: 'https://img.icons8.com/color/48/000000/amex.png',
    discover: 'https://img.icons8.com/color/48/000000/discover.png'
};

function detectCardType(number) {
    const cleaned = number.replace(/\s/g, '');
    if (/^4/.test(cleaned)) return 'visa';
    if (/^5[1-5]/.test(cleaned)) return 'mastercard';
    if (/^3[47]/.test(cleaned)) return 'amex';
    if (/^6/.test(cleaned)) return 'discover';
    return 'unknown';
}

// Input event listeners
cardNumberInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    let matches = value.match(/.{1,4}/g);
    e.target.value = matches ? matches.join(' ') : value;

    const type = detectCardType(value);
    if (type !== 'unknown' && value.length > 0) {
        cardLogo.src = cardTypes[type];
        cardLogo.classList.add('show');
        cardNumberInput.classList.add('has-logo');
    } else {
        cardLogo.classList.remove('show');
        cardNumberInput.classList.remove('has-logo');
    }
});

expiryInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    e.target.value = value;
});

cvvInput.addEventListener('input', function(e) {
    e.target.value = e.target.value.replace(/\D/g, '');
});

zipInput.addEventListener('input', function(e) {
    e.target.value = e.target.value.replace(/\D/g, '');
});

amountInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/[^\d.]/g, '');
    if (value) {
        e.target.value = '$' + value;
    }
});

// Form submission
paymentForm.addEventListener('submit', function(e) {
    e.preventDefault();

    if (!validateForm()) {
        return;
    }

    payButton.disabled = true;
    buttonText.textContent = 'Processing...';
    spinner.classList.add('show');

    // Simulate payment processing
    setTimeout(() => {
        // Determine random success/failure (90% success rate)
        const isSuccess = Math.random() > 0.1;
        const cardNumber = cardNumberInput.value;
        const maskedCard = '**** **** **** ' + cardNumber.slice(-4);
        
        // Create transaction record
        const transaction = {
            id: generateTransactionId(),
            date: new Date().toISOString(),
            amount: parseFloat(amountInput.value.replace('$', '')),
            cardName: cardNameInput.value,
            cardNumber: maskedCard,
            cardType: detectCardType(cardNumber),
            status: isSuccess ? 'success' : 'failed',
            zip: zipInput.value,
            description: `Payment to PayFlow`,
            fee: parseFloat(amountInput.value.replace('$', '')) * 0.029 + 0.30
        };

        // Save transaction
        saveTransaction(transaction);
        
        // Save card if needed
        saveCardIfNeeded();

        if (isSuccess) {
            successMessage.textContent = '✓ Payment processed successfully!';
            successMessage.style.background = 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)';
            successMessage.classList.add('show');

            setTimeout(() => {
                paymentForm.reset();
                successMessage.classList.remove('show');
                clearErrors();
                cardLogo.classList.remove('show');
                cardNumberInput.classList.remove('has-logo');
            }, 3000);
        } else {
            successMessage.textContent = '✗ Payment failed. Please try again.';
            successMessage.style.background = 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)';
            successMessage.classList.add('show');
            
            setTimeout(() => {
                successMessage.classList.remove('show');
            }, 3000);
        }

        payButton.disabled = false;
        buttonText.textContent = 'Pay Now';
        spinner.classList.remove('show');
    }, 2000);
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Auto-refresh stats every 30 seconds
setInterval(() => {
    updateTodayStats();
    displayRecentTransactions();
}, 30000);