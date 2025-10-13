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

        const amountError = document.getElementById('amountError');
        const cardNameError = document.getElementById('cardNameError');
        const cardNumberError = document.getElementById('cardNumberError');
        const expiryError = document.getElementById('expiryError');
        const cvvError = document.getElementById('cvvError');
        const zipError = document.getElementById('zipError');

        function clearErrors() {
            [amountError, cardNameError, cardNumberError, expiryError, cvvError, zipError].forEach(el => el.classList.remove('show'));
        }

        function showError(element, message) {
            element.textContent = message;
            element.classList.add('show');
        }

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
                if (parseInt(month) < 1 || parseInt(month) > 12 || parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
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

        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();

            if (!validateForm()) {
                return;
            }

            payButton.disabled = true;
            buttonText.textContent = 'Processing...';
            spinner.classList.add('show');

            setTimeout(() => {
                successMessage.classList.add('show');
                payButton.disabled = false;
                buttonText.textContent = 'Pay Now';
                spinner.classList.remove('show');

                setTimeout(() => {
                    paymentForm.reset();
                    successMessage.classList.remove('show');
                    clearErrors();
                    cardLogo.classList.remove('show');
                    cardNumberInput.classList.remove('has-logo');
                }, 3000);
            }, 2000);
        });