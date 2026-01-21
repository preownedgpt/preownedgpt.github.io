// PreownedGPT - JavaScript for animations and interactivity

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initMobileMenu();
    initSmoothScroll();
    initScrollProgress();
    initScrollAnimations();
    initAnimatedCounters();
    initFAQAccordion();
    initTokenFeed();
    initInteractiveDemo();
    initArchitectureCounters();
    initPipelineCounters();
    initRevealAnimations();
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
 * Scroll Progress Bar
 */
function initScrollProgress() {
    const progressBar = document.getElementById('scroll-progress');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

/**
 * Scroll-triggered Animations
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, parseInt(delay));
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
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
 * Enhanced with status changes and fresh token injection
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

    // Token character pool for generating fake tokens
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const generateToken = () => {
        const prefix = Math.random() > 0.3 ? 'sk-proj-' : 'sk-live-';
        let token = prefix;
        const visibleLength = Math.floor(Math.random() * 4) + 3;
        for (let i = 0; i < visibleLength; i++) {
            token += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        token += '****...****';
        for (let i = 0; i < 4; i++) {
            token += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return token;
    };

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

    // Randomly change statuses
    setInterval(() => {
        const allItems = feedTrack.querySelectorAll('.feed-item');
        allItems.forEach(item => {
            const status = item.querySelector('.status');
            if (!status) return;

            // Checking -> Valid or Revoked
            if (status.classList.contains('checking') && Math.random() > 0.6) {
                if (Math.random() > 0.15) {
                    status.textContent = 'Valid';
                    status.classList.remove('checking');
                    status.classList.add('valid');
                } else {
                    status.textContent = 'Revoked';
                    status.classList.remove('checking');
                    status.classList.add('revoked');
                }
            }
            // Occasionally mark valid as checking
            else if (status.classList.contains('valid') && Math.random() > 0.98) {
                status.textContent = 'Checking...';
                status.classList.remove('valid');
                status.classList.add('checking');
            }
        });

        // Remove fresh badge after some time
        const freshItems = feedTrack.querySelectorAll('.feed-item.fresh');
        freshItems.forEach(item => {
            const age = parseInt(item.dataset.age || 0);
            if (age > 10) {
                item.classList.remove('fresh');
                const badge = item.querySelector('.fresh-badge');
                if (badge) badge.remove();
            }
        });
    }, 2000);

    // Inject new token occasionally
    setInterval(() => {
        if (Math.random() > 0.7) {
            const newItem = document.createElement('div');
            newItem.className = 'feed-item fresh';
            newItem.dataset.age = '1';
            newItem.innerHTML = `
                <span class="fresh-badge">FRESH</span>
                <span class="token">${generateToken()}</span>
                <span class="timestamp">1s ago</span>
                <span class="status checking">Checking...</span>
            `;

            const firstItem = feedTrack.querySelector('.feed-item');
            if (firstItem) {
                feedTrack.insertBefore(newItem, firstItem);
            }
        }
    }, 5000);

    // Update feed count
    const feedCount = document.querySelector('.feed-count');
    if (feedCount) {
        setInterval(() => {
            const current = parseInt(feedCount.textContent.replace(/,/g, ''));
            const change = Math.floor(Math.random() * 5) - 1;
            feedCount.textContent = (current + change).toLocaleString();
        }, 3000);
    }
}

/**
 * Interactive Terminal Demo
 */
function initInteractiveDemo() {
    const startBtn = document.getElementById('demo-start-btn');
    const resetBtn = document.getElementById('demo-reset-btn');
    const output = document.getElementById('terminal-output');
    const terminalStatus = document.querySelector('.terminal-status');
    const statusText = document.querySelector('.status-text');

    if (!startBtn || !output) return;

    let isRunning = false;
    let demoAttempts = 0;

    const demoSequence = [
        { type: 'command', text: 'pip install preownedgpt', delay: 0 },
        { type: 'output', text: 'Collecting preownedgpt...', delay: 800 },
        { type: 'output', text: 'Downloading preownedgpt-2.1.0.tar.gz (42 kB)', delay: 400 },
        { type: 'success', text: 'Successfully installed preownedgpt-2.1.0', delay: 600 },
        { type: 'prompt', delay: 400 },
        { type: 'command', text: 'python', delay: 300 },
        { type: 'output', text: 'Python 3.11.4 (main, Jun 7 2024, 00:00:00)', delay: 200 },
        { type: 'prompt', text: '>>>', delay: 200 },
        { type: 'command', text: 'from preownedgpt import OpenAI', delay: 600 },
        { type: 'prompt', text: '>>>', delay: 300 },
        { type: 'command', text: 'client = OpenAI()', delay: 500 },
        { type: 'success', text: '[✓] Connected to token pool (94,521 keys)', delay: 800 },
        { type: 'prompt', text: '>>>', delay: 300 },
        { type: 'command', text: 'response = client.chat("Hello!")', delay: 600 },
        { type: 'info', text: '[→] Routing to sk-proj-a8K***...', delay: 500 },
        { type: 'success', text: '[✓] Response received (247ms)', delay: 700 },
        { type: 'response', text: '"Hello! How can I assist you today?"', delay: 300 },
    ];

    const secondAttempt = [
        { type: 'prompt', text: '>>>', delay: 400 },
        { type: 'command', text: 'response = client.chat("Tell me a joke")', delay: 600 },
        { type: 'info', text: '[→] Routing to sk-proj-Qw9***...', delay: 500 },
        { type: 'success', text: '[✓] Response received (312ms)', delay: 700 },
        { type: 'response', text: '"Why do programmers prefer dark mode? Because light attracts bugs!"', delay: 300 },
    ];

    const jokeReveal = [
        { type: 'prompt', text: '>>>', delay: 400 },
        { type: 'command', text: 'response = client.chat("One more?")', delay: 600 },
        { type: 'info', text: '[→] Routing to sk-proj-Yx2***...', delay: 500 },
        { type: 'joke', text: 'Just kidding! 🎭<br><br>This is a satirical demo. PreownedGPT isn\'t real.<br><a href="#reveal">Learn why we made this →</a>', delay: 800 },
    ];

    const typeText = (element, text, callback) => {
        let i = 0;
        const cursor = element.querySelector('.terminal-cursor');

        const type = () => {
            if (i < text.length) {
                if (cursor) {
                    cursor.insertAdjacentText('beforebegin', text.charAt(i));
                } else {
                    element.textContent += text.charAt(i);
                }
                i++;
                setTimeout(type, 30 + Math.random() * 40);
            } else {
                // Remove cursor after typing is complete
                if (cursor) {
                    cursor.remove();
                }
                if (callback) callback();
            }
        };
        type();
    };

    const addLine = (type, text, callback) => {
        // Remove any existing cursors before adding new content
        const existingCursors = output.querySelectorAll('.terminal-cursor');
        existingCursors.forEach(cursor => cursor.remove());

        const line = document.createElement('div');
        line.className = `terminal-line ${type}`;

        if (type === 'prompt') {
            line.innerHTML = `<span class="prompt-symbol">${text || '$'}</span> <span class="terminal-cursor blink"></span>`;
            output.appendChild(line);
            if (callback) setTimeout(callback, 100);
        } else if (type === 'command') {
            line.innerHTML = `<span class="prompt-symbol">${demoAttempts > 0 ? '>>>' : '$'}</span> <span class="terminal-cursor blink"></span>`;
            output.appendChild(line);
            typeText(line, ' ' + text, callback);
        } else {
            line.innerHTML = text;
            output.appendChild(line);
            if (callback) setTimeout(callback, 100);
        }

        // Scroll to bottom
        const terminalBody = output.closest('.terminal-body');
        if (terminalBody) {
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    };

    const runSequence = (sequence, onComplete) => {
        let index = 0;

        const next = () => {
            if (index >= sequence.length) {
                if (onComplete) onComplete();
                return;
            }

            const item = sequence[index];
            index++;

            setTimeout(() => {
                addLine(item.type, item.text, next);
            }, item.delay);
        };

        next();
    };

    const startDemo = () => {
        if (isRunning) return;
        isRunning = true;
        startBtn.disabled = true;
        resetBtn.disabled = true;

        terminalStatus.classList.add('running');
        statusText.textContent = 'Running...';

        // Clear previous output
        output.innerHTML = '';

        if (demoAttempts === 0) {
            runSequence(demoSequence, () => {
                demoAttempts++;
                isRunning = false;
                resetBtn.disabled = false;
                startBtn.disabled = false;
                startBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="play-icon">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                    Try Again
                `;
                terminalStatus.classList.remove('running');
                terminalStatus.classList.add('success');
                statusText.textContent = 'Complete';
            });
        } else if (demoAttempts === 1) {
            runSequence(secondAttempt, () => {
                demoAttempts++;
                isRunning = false;
                resetBtn.disabled = false;
                startBtn.disabled = false;
                terminalStatus.classList.remove('running');
                terminalStatus.classList.add('success');
                statusText.textContent = 'Complete';
            });
        } else {
            runSequence(jokeReveal, () => {
                demoAttempts++;
                isRunning = false;
                resetBtn.disabled = false;
                startBtn.disabled = true;
                terminalStatus.classList.remove('running');
                statusText.textContent = 'Revealed!';
            });
        }
    };

    const resetDemo = () => {
        demoAttempts = 0;
        isRunning = false;
        startBtn.disabled = false;
        resetBtn.disabled = true;
        startBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="play-icon">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            Run Demo
        `;
        terminalStatus.classList.remove('running', 'success');
        statusText.textContent = 'Ready';
        output.innerHTML = `
            <div class="terminal-line prompt">
                <span class="prompt-symbol">$</span>
                <span class="terminal-cursor blink"></span>
            </div>
        `;
    };

    startBtn.addEventListener('click', startDemo);
    resetBtn.addEventListener('click', resetDemo);
}

/**
 * Architecture Diagram Counters
 */
function initArchitectureCounters() {
    const commitsCounter = document.querySelector('.commits-counter');
    const poolCount = document.querySelector('.pool-count');

    if (commitsCounter) {
        setInterval(() => {
            const current = parseInt(commitsCounter.textContent);
            const change = Math.floor(Math.random() * 30) - 10;
            const newValue = Math.max(700, Math.min(1000, current + change));
            commitsCounter.textContent = newValue;
        }, 2000);
    }

    if (poolCount) {
        let baseCount = parseInt(poolCount.dataset.count) || 94521;
        setInterval(() => {
            const change = Math.floor(Math.random() * 10) - 3;
            baseCount = Math.max(94000, baseCount + change);
            poolCount.textContent = baseCount.toLocaleString();
        }, 4000);
    }
}

/**
 * Pipeline Stage Counters
 */
function initPipelineCounters() {
    const pillValues = document.querySelectorAll('.stat-pill-value');

    pillValues.forEach(pill => {
        const target = parseInt(pill.dataset.count);
        if (!target) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animatePillCounter(pill, target);
                    observer.unobserve(pill);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(pill);
    });
}

function animatePillCounter(element, target) {
    const duration = 1500;
    const startTime = performance.now();

    const formatNumber = (num) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(num >= 10000 ? 0 : 1) + 'K';
        }
        return num.toLocaleString();
    };

    const update = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(target * easeProgress);

        element.textContent = formatNumber(currentValue);

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = formatNumber(target);
        }
    };

    requestAnimationFrame(update);
}

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

/**
 * Reveal Section Animations
 * Triggers staggered animations when the reveal section enters viewport
 */
function initRevealAnimations() {
    const revealSection = document.querySelector('.reveal');
    if (!revealSection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the is-revealed class to trigger CSS animations
                revealSection.classList.add('is-revealed');
                // Stop observing once revealed
                observer.unobserve(revealSection);
            }
        });
    }, {
        threshold: 0.15, // Trigger when 15% of section is visible
        rootMargin: '0px 0px -50px 0px'
    });

    observer.observe(revealSection);
}
