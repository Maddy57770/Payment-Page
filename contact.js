// Contact page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeContact();
});

function initializeContact() {
    // Form validation and submission
    const contactForm = document.getElementById('contactForm');
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
        setupCharCounter();
        setupFormValidation();
    }
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
    
    // Initialize chat notification
    showChatNotification();
}

// Mobile menu toggle
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    
    mobileMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
}

// Character counter for message textarea
function setupCharCounter() {
    const messageTextarea = document.getElementById('message');
    const charCount = document.getElementById('charCount');
    
    if (messageTextarea && charCount) {
        messageTextarea.addEventListener('input', function() {
            const length = this.value.length;
            charCount.textContent = length;
            
            if (length > 1000) {
                this.value = this.value.substring(0, 1000);
                charCount.textContent = 1000;
            }
        });
    }
}

// Form validation
function setupFormValidation() {
    const inputs = document.querySelectorAll('#contactForm input, #contactForm select, #contactForm textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearError(this);
        });
    });
}

function validateField(field) {
    const fieldName = field.name;
    const fieldValue = field.value.trim();
    const errorElement = document.getElementById(`${fieldName}Error`);
    
    if (!errorElement) return true;
    
    // Required field validation
    if (field.hasAttribute('required') && !fieldValue) {
        showError(errorElement, 'This field is required');
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && fieldValue) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(fieldValue)) {
            showError(errorElement, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && fieldValue) {
        const phoneRegex = /^[\d\s\-\+KATEX_INLINE_OPENKATEX_INLINE_CLOSE]+$/;
        if (!phoneRegex.test(fieldValue)) {
            showError(errorElement, 'Please enter a valid phone number');
            return false;
        }
    }
    
    clearError(field);
    return true;
}

function showError(element, message) {
    if (element) {
        element.textContent = message;
        element.classList.add('show');
    }
}

function clearError(field) {
    const errorElement = document.getElementById(`${field.name}Error`);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }
}

// Handle contact form submission
async function handleContactSubmit(e) {
    e.preventDefault();
    
    // Validate all fields
    const form = e.target;
    const inputs = form.querySelectorAll('input, select, textarea');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    if (!isValid) return;
    
    // Show loading state
    const submitBtn = form.querySelector('.btn-submit');
    const btnText = submitBtn.querySelector('.btn-text');
    const spinner = document.getElementById('formSpinner');
    
    submitBtn.disabled = true;
    btnText.textContent = 'Sending...';
    spinner.classList.add('show');
    
    // Simulate API call
    setTimeout(() => {
        // Show success message
        const successMessage = document.getElementById('formSuccess');
        successMessage.classList.add('show');
        
        // Reset form
        form.reset();
        document.getElementById('charCount').textContent = '0';
        
        // Reset button
        submitBtn.disabled = false;
        btnText.textContent = 'Send Message';
        spinner.classList.remove('show');
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 5000);
        
        // Store form submission in localStorage
        const submission = {
            firstName: form.firstName.value,
            lastName: form.lastName.value,
            email: form.email.value,
            subject: form.subject.value,
            message: form.message.value,
            priority: form.priority.checked,
            timestamp: new Date().toISOString()
        };
        
        const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
        submissions.push(submission);
        localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
        
    }, 2000);
}

// Handle newsletter subscription
async function handleNewsletterSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const email = form.newsletterEmail.value;
    const successMessage = document.getElementById('newsletterSuccess');
    
    // Simulate API call
    setTimeout(() => {
        // Show success message
        successMessage.classList.add('show');
        
        // Reset form
        form.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 5000);
        
        // Store subscription
        const subscriptions = JSON.parse(localStorage.getItem('newsletterSubscriptions') || '[]');
        subscriptions.push({
            email: email,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('newsletterSubscriptions', JSON.stringify(subscriptions));
        
    }, 1000);
}

// FAQ Toggle
function toggleFaq(button) {
    const faqItem = button.closest('.faq-item');
    const allFaqItems = document.querySelectorAll('.faq-item');
    
    // Close all other FAQ items
    allFaqItems.forEach(item => {
        if (item !== faqItem) {
            item.classList.remove('active');
        }
    });
    
    // Toggle current FAQ item
    faqItem.classList.toggle('active');
}

// Live Chat Functions
let chatOpen = false;

function toggleChat() {
    const chatWidget = document.getElementById('chatWidget');
    const chatButton = document.getElementById('chatButton');
    const chatNotification = document.getElementById('chatNotification');
    
    chatOpen = !chatOpen;
    
    if (chatOpen) {
        chatWidget.classList.add('active');
        chatButton.style.display = 'none';
        chatNotification.style.display = 'none';
    } else {
        chatWidget.classList.remove('active');
        chatButton.style.display = 'flex';
    }
}

function startLiveChat() {
    toggleChat();
}

function closeLiveChat() {
    const chatWidget = document.getElementById('chatWidget');
    const chatButton = document.getElementById('chatButton');
    
    chatWidget.classList.remove('active');
    chatButton.style.display = 'flex';
    chatOpen = false;
}

function sendChatMessage() {
    const chatInput = document.getElementById('chatInput');
    const chatBody = document.getElementById('chatBody');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    // Add user message
    const userMessage = document.createElement('div');
    userMessage.className = 'chat-message user';
    userMessage.innerHTML = `<p>${message}</p>`;
    chatBody.appendChild(userMessage);
    
    // Clear input
    chatInput.value = '';
    
    // Scroll to bottom
    chatBody.scrollTop = chatBody.scrollHeight;
    
    // Simulate bot response
    setTimeout(() => {
        const botMessage = document.createElement('div');
        botMessage.className = 'chat-message bot';
        botMessage.innerHTML = `<p>${getBotResponse(message)}</p>`;
        chatBody.appendChild(botMessage);
        chatBody.scrollTop = chatBody.scrollHeight;
    }, 1000);
}

function getBotResponse(message) {
    const responses = [
        "Thank you for your message! Our team will get back to you shortly.",
        "I understand your concern. Let me connect you with a specialist.",
        "That's a great question! You can find more information in our FAQ section.",
        "We appreciate your feedback. Is there anything specific I can help you with?",
        "Our support team is available 24/7 to assist you. Would you like to schedule a call?"
    ];
    
    // Simple keyword-based responses
    if (message.toLowerCase().includes('price') || message.toLowerCase().includes('cost')) {
        return "For pricing information, please visit our Pricing page or contact our sales team at sales@payflow.com";
    }
    if (message.toLowerCase().includes('help') || message.toLowerCase().includes('support')) {
        return "I'm here to help! Please describe your issue and I'll do my best to assist you.";
    }
    if (message.toLowerCase().includes('payment') || message.toLowerCase().includes('transaction')) {
        return "For payment-related queries, please check your transaction history or contact our billing department.";
    }
    
    return responses[Math.floor(Math.random() * responses.length)];
}

// Chat input enter key
document.addEventListener('DOMContentLoaded', function() {
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
    }
});

// Show chat notification
function showChatNotification() {
    setTimeout(() => {
        const chatNotification = document.getElementById('chatNotification');
        if (chatNotification) {
            chatNotification.style.display = 'flex';
        }
    }, 5000); // Show after 5 seconds
}

// Initialize smooth scroll for anchor links
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