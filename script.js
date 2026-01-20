// PreownedGPT - JavaScript for animations and interactivity

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initMobileMenu();
    initSmoothScroll();
    initAnimatedCounters();
    initLanguageTabs();
    initFAQAccordion();
    initTokenFeed();
});

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    // Close menu when clicking a link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
        }
    });
}

/**
 * Smooth Scroll for Navigation
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });
}

/**
 * Animated Counters
 * Uses Intersection Observer to trigger animation when visible
 */
function initAnimatedCounters() {
    const counters = document.querySelectorAll('.stat-number');
    let animated = false;

    const formatNumber = (num) => {
        if (num >= 1000000000) {
            return (num / 1000000000).toFixed(0) + 'B';
        }
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(num >= 10000 ? 0 : 1) + 'K';
        }
        return num.toLocaleString();
    };

    const animateCounter = (counter, target) => {
        const duration = 2000;
        const startTime = performance.now();
        const startValue = 0;

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out-quart)
            const easeProgress = 1 - Math.pow(1 - progress, 4);

            const currentValue = Math.floor(startValue + (target - startValue) * easeProgress);
            counter.textContent = formatNumber(currentValue);

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                counter.textContent = formatNumber(target);
            }
        };

        requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                counters.forEach(counter => {
                    const target = parseInt(counter.dataset.target, 10);
                    if (!isNaN(target)) {
                        animateCounter(counter, target);
                    }
                });
            }
        });
    }, { threshold: 0.3 });

    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
}

/**
 * Language Tabs for Code Examples
 */
function initLanguageTabs() {
    const tabs = document.querySelectorAll('.code-tabs .tab');
    const panels = document.querySelectorAll('.code-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const lang = tab.dataset.lang;

            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update active panel
            panels.forEach(panel => {
                if (panel.dataset.lang === lang) {
                    panel.classList.add('active');
                } else {
                    panel.classList.remove('active');
                }
            });
        });
    });
}

/**
 * FAQ Accordion
 */
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });

            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

/**
 * Token Feed Animation
 * Duplicates feed items for seamless infinite scroll
 */
function initTokenFeed() {
    const feedTrack = document.querySelector('.feed-track');
    if (!feedTrack) return;

    // Clone items for seamless loop
    const items = feedTrack.querySelectorAll('.feed-item');
    items.forEach(item => {
        const clone = item.cloneNode(true);
        feedTrack.appendChild(clone);
    });

    // Update timestamps periodically
    setInterval(() => {
        const timestamps = feedTrack.querySelectorAll('.timestamp');
        timestamps.forEach(timestamp => {
            const currentText = timestamp.textContent;
            const match = currentText.match(/(\d+)s/);
            if (match) {
                const seconds = parseInt(match[1], 10) + 1;
                timestamp.textContent = seconds + 's ago';
            }
        });
    }, 1000);

    // Randomly change "Checking..." to "Valid" status
    setInterval(() => {
        const checkingItems = feedTrack.querySelectorAll('.status.checking');
        checkingItems.forEach(status => {
            if (Math.random() > 0.7) {
                status.textContent = 'Valid';
                status.classList.remove('checking');
                status.classList.add('valid');
            }
        });
    }, 2000);
}

/**
 * Optional: Typing Effect for Hero
 * Uncomment to enable
 */
/*
function initTypingEffect() {
    const element = document.querySelector('.hero-title');
    if (!element) return;

    const text = element.textContent;
    element.textContent = '';

    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };

    typeWriter();
}
*/

/**
 * Add scroll-based header shadow
 */
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 10);
});

/**
 * Handle "Copy Link" button click feedback
 */
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('copy')) {
        const originalText = e.target.textContent;
        e.target.textContent = 'Copied!';
        setTimeout(() => {
            e.target.textContent = originalText;
        }, 2000);
    }
});
