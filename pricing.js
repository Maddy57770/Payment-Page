// Pricing page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializePricing();
});

// Pricing data
const pricingData = {
    monthly: {
        starter: 0,
        professional: 29,
        enterprise: 99
    },
    yearly: {
        starter: 0,
        professional: 23, // 20% discount
        enterprise: 79 // 20% discount
    }
};

function initializePricing() {
    const billingToggle = document.getElementById('billingToggle');
    
    // Handle billing toggle
    billingToggle.addEventListener('change', function() {
        updatePricing(this.checked);
    });
    
    // Add hover effects to cards
    const cards = document.querySelectorAll('.pricing-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            addCardAnimation(this);
        });
    });
    
    // Handle plan selection
    const planButtons = document.querySelectorAll('.plan-btn');
    planButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const card = this.closest('.pricing-card');
            const planName = card.dataset.plan;
            selectPlan(planName);
        });
    });
    
    // Handle CTA buttons
    document.querySelector('.btn-contact-sales').addEventListener('click', contactSales);
    document.querySelector('.btn-start-free').addEventListener('click', startFreeTrial);
    document.querySelector('.btn-schedule-demo').addEventListener('click', scheduleDemo);
    
    // Initialize animations
    observeElements();
}

function updatePricing(isYearly) {
    const billingType = isYearly ? 'yearly' : 'monthly';
    
    // Update prices
    Object.keys(pricingData[billingType]).forEach(plan => {
        const priceElement = document.querySelector(`[data-plan="${plan}"] .${billingType}-price`);
        const otherPriceElement = document.querySelector(`[data-plan="${plan}"] .${isYearly ? 'monthly' : 'yearly'}-price`);
        const noteElement = document.querySelector(`[data-plan="${plan}"] .${billingType}-note`);
        const otherNoteElement = document.querySelector(`[data-plan="${plan}"] .${isYearly ? 'monthly' : 'yearly'}-note`);
        
        if (priceElement && otherPriceElement) {
            // Animate price change
            priceElement.style.display = 'inline-block';
            otherPriceElement.style.display = 'none';
            
            // Animate the number change
            animateValue(priceElement, parseInt(otherPriceElement.textContent), pricingData[billingType][plan], 500);
        }
        
        if (noteElement && otherNoteElement) {
            noteElement.style.display = 'block';
            otherNoteElement.style.display = 'none';
        }
    });
    
    // Update period text
    const periodElements = document.querySelectorAll('.period');
    periodElements.forEach(el => {
        el.textContent = isYearly ? '/month' : '/month';
    });
    
    // Add animation to cards
    const cards = document.querySelectorAll('.pricing-card');
    cards.forEach(card => {
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = 'scale(1)';
        }, 100);
    });
}

function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            element.textContent = end;
            clearInterval(timer);
        } else {
            element.textContent = Math.round(current);
        }
    }, 16);
}

function addCardAnimation(card) {
    const glowElement = card.querySelector('.card-glow');
    if (glowElement) {
        glowElement.style.opacity = '1';
        setTimeout(() => {
            glowElement.style.opacity = '0';
        }, 1000);
    }
}

function selectPlan(planName) {
    const isYearly = document.getElementById('billingToggle').checked;
    const billingType = isYearly ? 'yearly' : 'monthly';
    const price = pricingData[billingType][planName];
    
    // Store selected plan
    const selectedPlan = {
        name: planName,
        billingType: billingType,
        price: price,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('selectedPlan', JSON.stringify(selectedPlan));
    
    // Show confirmation
    showNotification(`${planName.charAt(0).toUpperCase() + planName.slice(1)} plan selected! Redirecting to payment...`);
    
    // Redirect to payment page after delay
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

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

function contactSales() {
    showNotification('Opening contact form...');
    // Implement contact sales modal or redirect
    setTimeout(() => {
        window.location.href = 'mailto:sales@payflow.com?subject=Custom%20Plan%20Inquiry';
    }, 1000);
}

function startFreeTrial() {
    showNotification('Starting your free trial...');
    localStorage.setItem('trialStarted', new Date().toISOString());
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

function scheduleDemo() {
    showNotification('Opening calendar to schedule demo...');
    // Implement calendar integration or redirect to scheduling page
    window.open('https://calendly.com/payflow-demo', '_blank');
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">✓</span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 20px 30px;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .notification-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 30px;
            height: 30px;
            background: linear-gradient(135deg, #48bb78, #38a169);
            color: white;
            border-radius: 50%;
            font-weight: bold;
        }
        
        .notification-message {
            font-size: 16px;
            font-weight: 600;
            color: #2d3748;
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Intersection Observer for animations
function observeElements() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements
    const elementsToObserve = document.querySelectorAll(
        '.pricing-card, .trust-item, .faq-item, .custom-plan-section, .comparison-section, .cta-section'
    );
    
    elementsToObserve.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Add parallax effect to floating icons
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.float-icon');
    
    parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Add smooth scroll behavior
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