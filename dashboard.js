// Dashboard JavaScript with Chart.js

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
    initializeMap();
    startLiveActivity();
    animateNumbers();
    initializeSparklines();
});

// Toggle sidebar
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('collapsed');
}

// Toggle activity feed
function toggleActivityFeed() {
    const feed = document.querySelector('.activity-feed');
    const toggle = document.querySelector('.feed-toggle');
    
    feed.classList.toggle('collapsed');
    toggle.textContent = feed.classList.contains('collapsed') ? '+' : '−';
}

// Change date range
function changeDateRange(range) {
    const buttons = document.querySelectorAll('.date-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Update charts based on selected range
    updateChartsData(range);
}

// Initialize all charts
function initializeCharts() {
    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart').getContext('2d');
    window.revenueChart = new Chart(revenueCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Revenue',
                data: [45000, 52000, 48000, 61000, 58000, 67000, 72000, 78000, 85000, 92000, 88000, 96000],
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }, {
                label: 'Last Year',
                data: [38000, 42000, 40000, 48000, 45000, 52000, 58000, 62000, 68000, 72000, 70000, 75000],
                borderColor: '#cbd5e0',
                backgroundColor: 'rgba(203, 213, 224, 0.1)',
                borderWidth: 2,
                fill: false,
                tension: 0.4,
                borderDash: [5, 5]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': $' + context.parsed.y.toLocaleString();
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });

    // Transaction Volume Chart
    const volumeCtx = document.getElementById('volumeChart').getContext('2d');
    new Chart(volumeCtx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Transactions',
                data: [420, 380, 520, 480, 560, 340, 290],
                backgroundColor: [
                    'rgba(102, 126, 234, 0.8)',
                    'rgba(118, 75, 162, 0.8)',
                    'rgba(102, 126, 234, 0.8)',
                    'rgba(118, 75, 162, 0.8)',
                    'rgba(102, 126, 234, 0.8)',
                    'rgba(118, 75, 162, 0.8)',
                    'rgba(102, 126, 234, 0.8)'
                ],
                borderRadius: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Payment Methods Pie Chart
    const paymentMethodsCtx = document.getElementById('paymentMethodsChart').getContext('2d');
    new Chart(paymentMethodsCtx, {
        type: 'doughnut',
        data: {
            labels: ['Credit Card', 'Debit Card', 'PayPal', 'Bank Transfer', 'Crypto'],
            datasets: [{
                data: [45, 25, 15, 10, 5],
                backgroundColor: [
                    '#667eea',
                    '#764ba2',
                    '#f093fb',
                    '#48bb78',
                    '#ffd93d'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });

    // Success Rate Chart (Gauge)
    const successRateCtx = document.getElementById('successRateChart').getContext('2d');
    new Chart(successRateCtx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [96.8, 3.2],
                backgroundColor: ['#48bb78', '#e2e8f0'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '80%',
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            }
        }
    });
}

// Initialize sparkline charts
function initializeSparklines() {
    // Revenue Sparkline
    const revenueSparkCtx = document.getElementById('revenueSparkline').getContext('2d');
    new Chart(revenueSparkCtx, {
        type: 'line',
        data: {
            labels: ['', '', '', '', '', '', ''],
            datasets: [{
                data: [30, 45, 35, 50, 40, 60, 55],
                borderColor: '#667eea',
                borderWidth: 2,
                fill: false,
                tension: 0.4,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
            },
            scales: {
                x: { display: false },
                y: { display: false }
            }
        }
    });

    // Similar sparklines for other KPIs
    createSparkline('transactionsSparkline', [20, 35, 30, 45, 35, 50, 45], '#48bb78');
    createSparkline('customersSparkline', [15, 25, 20, 30, 28, 35, 32], '#f093fb');
    createSparkline('avgSparkline', [80, 75, 78, 72, 75, 70, 73], '#ffd93d');
}

// Create sparkline helper
function createSparkline(elementId, data, color) {
    const ctx = document.getElementById(elementId).getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['', '', '', '', '', '', ''],
            datasets: [{
                data: data,
                borderColor: color,
                borderWidth: 2,
                fill: false,
                tension: 0.4,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
            },
            scales: {
                x: { display: false },
                y: { display: false }
            }
        }
    });
}

// Initialize world map
function initializeMap() {
    const mapElement = document.getElementById('worldMap');
    if (!mapElement || typeof jsVectorMap === 'undefined') {
        // Fallback if map library not loaded
        mapElement.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #718096;">Map visualization</div>';
        return;
    }

    new jsVectorMap({
        selector: '#worldMap',
        map: 'world',
        backgroundColor: 'transparent',
        regionStyle: {
            initial: {
                fill: '#e2e8f0',
                fillOpacity: 1,
                stroke: '#fff',
                strokeWidth: 1,
                strokeOpacity: 1
            },
            hover: {
                fillOpacity: 0.8,
                cursor: 'pointer'
            }
        },
        series: {
            regions: [{
                values: {
                    US: 125000,
                    CA: 85000,
                    GB: 75000,
                    DE: 65000,
                    FR: 55000,
                    AU: 45000,
                    JP: 40000,
                    CN: 35000,
                    IN: 30000,
                    BR: 25000
                },
                scale: ['#e3f2fd', '#90caf9', '#42a5f5', '#1976d2'],
                normalizeFunction: 'polynomial'
            }]
        },
        onRegionTooltipShow: function(event, tooltip, code) {
            const value = mapData[code] || 0;
            tooltip.html(
                '<div style="padding: 10px">' +
                '<strong>' + tooltip.html() + '</strong><br>' +
                'Revenue: $' + value.toLocaleString() +
                '</div>'
            );
        }
    });
}

// Map data
const mapData = {
    US: 125000,
    CA: 85000,
    GB: 75000,
    DE: 65000,
    FR: 55000,
    AU: 45000,
    JP: 40000,
    CN: 35000,
    IN: 30000,
    BR: 25000
};

// Start live activity feed
function startLiveActivity() {
    const activities = [
        { type: 'success', text: 'New payment received', amount: '$1,247.00' },
        { type: 'info', text: 'Customer registered', name: 'Tech Corp' },
        { type: 'warning', text: 'Large transaction detected', amount: '$5,892.00' },
        { type: 'success', text: 'Subscription renewed', customer: 'Pro User' },
        { type: 'info', text: 'Invoice sent', invoice: '#INV-2024-001' },
        { type: 'success', text: 'Payment processed', amount: '$892.50' },
        { type: 'error', text: 'Payment failed', reason: 'Insufficient funds' },
        { type: 'info', text: 'Refund issued', amount: '$125.00' }
    ];

    function addActivity() {
        const feed = document.getElementById('activityFeed');
        const activity = activities[Math.floor(Math.random() * activities.length)];
        
        const item = document.createElement('div');
        item.className = 'feed-item';
        
        const dotColor = {
            success: '#48bb78',
            info: '#667eea',
            warning: '#f6ad55',
            error: '#fc8181'
        }[activity.type];
        
        item.innerHTML = `
            <div class="feed-dot" style="background: ${dotColor}"></div>
            <div class="feed-content">
                <div class="feed-text">${activity.text}</div>
                <div class="feed-time">Just now</div>
            </div>
        `;
        
        feed.insertBefore(item, feed.firstChild);
        
        // Keep only last 10 items
        while (feed.children.length > 10) {
            feed.removeChild(feed.lastChild);
        }
    }

    // Add initial activities
    for (let i = 0; i < 5; i++) {
        addActivity();
    }

    // Add new activity every 5 seconds
    setInterval(addActivity, 5000);
}

// Animate numbers
function animateNumbers() {
    const elements = document.querySelectorAll('[data-value]');
    
    elements.forEach(element => {
        const value = parseFloat(element.dataset.value);
        const duration = 2000;
        const start = 0;
        const increment = value / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                element.textContent = formatNumber(value);
                clearInterval(timer);
            } else {
                element.textContent = formatNumber(current);
            }
        }, 16);
    });
}

// Format number with commas
function formatNumber(num) {
    if (num >= 1000) {
        return num.toLocaleString();
    }
    return num.toFixed(2);
}

// Update charts data based on date range
function updateChartsData(range) {
    // This would typically fetch new data from an API
    // For demo, we'll just update with random data
    
    const newData = {
        today: [45, 52, 48, 61, 58, 67, 72],
        week: [320, 380, 420, 480, 520, 490, 510],
        month: [45000, 52000, 48000, 61000, 58000, 67000, 72000, 78000, 85000, 92000, 88000, 96000],
        year: [450000, 520000, 480000, 610000, 580000, 670000, 720000, 780000, 850000, 920000, 880000, 960000]
    };
    
    // Update revenue chart
    if (window.revenueChart) {
        window.revenueChart.data.datasets[0].data = generateRandomData(12);
        window.revenueChart.update();
    }
    
    // Animate KPI changes
    animateNumbers();
}

// Generate random data for demo
function generateRandomData(count) {
    const data = [];
    for (let i = 0; i < count; i++) {
        data.push(Math.floor(Math.random() * 100000) + 50000);
    }
    return data;
}

// Export dashboard
function exportDashboard() {
    // This would typically generate a PDF or Excel report
    alert('Dashboard exported successfully!');
}

// Show custom date picker
function showCustomDatePicker() {
    // This would open a date range picker modal
    alert('Custom date range picker');
}

// Add smooth scroll
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