// Resonance Studios - Main JavaScript File
// Handles all interactive functionality across the website

// Global variables
let audioContext;
let audioElement;
let analyser;
let dataArray;
let visualizer;
let isPlaying = false;
let currentTrack = 'electronic';
let selectedDate = null;
let selectedTime = null;

// Equipment data for modals
const equipmentData = {
    'neumann-u87': {
        name: 'Neumann U87',
        price: '$3,500',
        type: 'Condenser Microphone',
        description: 'The Neumann U87 is a legendary condenser microphone known for its warm, rich sound and exceptional detail. Used on countless hit records, it features three switchable polar patterns (cardioid, omnidirectional, and figure-8) making it incredibly versatile for various recording applications.',
        specs: {
            'Polar Patterns': 'Cardioid, Omni, Figure-8',
            'Frequency Response': '20Hz - 20kHz',
            'Sensitivity': '28 mV/Pa',
            'Self Noise': '12 dB-A',
            'Max SPL': '117 dB'
        },
        features: [
            'Three switchable polar patterns',
            'Classic Neumann transformer-balanced circuit',
            'Low self-noise and high SPL handling',
            'Includes shock mount and wooden case',
            'Industry-standard vocal microphone'
        ]
    },
    'akg-c414': {
        name: 'AKG C414 XLII',
        price: '$1,100',
        type: 'Multi-Pattern Condenser',
        description: 'The AKG C414 XLII is a highly versatile condenser microphone featuring nine selectable polar patterns. Its bright, modern sound makes it ideal for vocals and solo instruments, while its flexibility allows it to excel in any recording situation.',
        specs: {
            'Polar Patterns': '9 selectable patterns',
            'Frequency Response': '20Hz - 20kHz',
            'Sensitivity': '23 mV/Pa',
            'Self Noise': '6 dB-A',
            'Max SPL': '140 dB'
        },
        features: [
            'Nine polar patterns including hypercardioid',
            'Peak hold LED for overload detection',
            'Three bass-cut filters and pre-attenuation pads',
            'Exceptional dynamic range and clarity',
            'Perfect for vocals and instruments'
        ]
    },
    'ssl-4000e': {
        name: 'SSL 4000E Console',
        price: 'Custom Quote',
        type: 'Mixing Console',
        description: 'The SSL 4000E is a legendary mixing console that has shaped the sound of countless hit records. Known for its punchy master buss compression and musical EQ, it remains the gold standard for professional mixing and recording.',
        specs: {
            'Channels': '24, 32, 40, or 48 channel configurations',
            'EQ': 'E-Series "Black Knob" 4-band EQ',
            'Dynamics': 'Compressor/limiter per channel',
            'Routing': 'Advanced patchbay and routing',
            'Automation': 'Total Recall automation system'
        },
        features: [
            'Iconic master buss compression',
            'Musical E-Series EQ sections',
            'Comprehensive routing capabilities',
            'Professional automation system',
            'Used on countless hit records'
        ]
    }
};

// Project data for portfolio
const projectData = {
    'synthwave-dreams': {
        title: 'Synthwave Dreams',
        artist: 'Neon Horizon',
        genre: 'Electronic',
        year: '2024',
        description: 'A retro-futuristic journey through 80s-inspired soundscapes, featuring analog synthesizers, driving basslines, and nostalgic melodies that transport listeners to a neon-soaked digital world.',
        credits: {
            'Producer': 'Alex Chen',
            'Engineer': 'Sarah Martinez',
            'Mixing': 'Resonance Studios',
            'Mastering': 'Resonance Studios',
            'Equipment': 'Moog Grandmother, Nord Stage 3, SSL Console'
        },
        tracks: [
            'Midnight Drive',
            'Neon Nights',
            'Digital Dreams',
            'Retro Wave',
            'Future Past'
        ]
    },
    'intimate-sessions': {
        title: 'Intimate Sessions',
        artist: 'Sarah Moon',
        genre: 'Acoustic',
        year: '2024',
        description: 'Raw and authentic acoustic recordings that capture the pure emotion and vulnerability of live performance. Each track showcases the artist\'s intimate storytelling and musical craftsmanship.',
        credits: {
            'Producer': 'Sarah Moon',
            'Engineer': 'Mike Johnson',
            'Recording': 'Resonance Studios',
            'Mixing': 'Resonance Studios',
            'Equipment': 'Neumann U87, API Preamps, ADAM Monitors'
        },
        tracks: [
            'Whispered Secrets',
            'Moonlight Serenade',
            'Gentle Rain',
            'Acoustic Memories',
            'Quiet Moments'
        ]
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollReveal();
    initializeAudioVisualizer();
    initializeEquipmentFilters();
    initializeProjectFilters();
    initializeCarousels();
    initializeBookingSystem();
    initializeFormValidation();
    
    // Page-specific initializations
    const currentPage = getCurrentPage();
    if (currentPage === 'index') {
        initializeHomePage();
    } else if (currentPage === 'services') {
        initializeServicesPage();
    } else if (currentPage === 'portfolio') {
        initializePortfolioPage();
    } else if (currentPage === 'contact') {
        initializeContactPage();
    }
});

// Navigation functionality
function initializeNavigation() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Smooth scrolling for anchor links
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
}

// Scroll reveal animations
function initializeScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.scroll-reveal').forEach(el => {
        observer.observe(el);
    });
}

// Audio visualizer functionality
function initializeAudioVisualizer() {
    const visualizerContainer = document.getElementById('audio-visualizer');
    if (!visualizerContainer) return;
    
    // Create p5.js sketch for audio visualization
    const sketch = function(p) {
        let particles = [];
        let waves = [];
        
        p.setup = function() {
            const canvas = p.createCanvas(visualizerContainer.offsetWidth, visualizerContainer.offsetHeight);
            canvas.parent(visualizerContainer);
            
            // Initialize particles
            for (let i = 0; i < 50; i++) {
                particles.push({
                    x: p.random(p.width),
                    y: p.random(p.height),
                    vx: p.random(-1, 1),
                    vy: p.random(-1, 1),
                    size: p.random(2, 6),
                    alpha: p.random(0.3, 0.8)
                });
            }
        };
        
        p.draw = function() {
            p.clear();
            
            // Draw particles
            particles.forEach(particle => {
                p.fill(0, 212, 255, particle.alpha * 255);
                p.noStroke();
                p.ellipse(particle.x, particle.y, particle.size);
                
                // Update particle position
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Wrap around edges
                if (particle.x < 0) particle.x = p.width;
                if (particle.x > p.width) particle.x = 0;
                if (particle.y < 0) particle.y = p.height;
                if (particle.y > p.height) particle.y = 0;
            });
            
            // Draw connecting lines
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dist = p.dist(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
                    if (dist < 100) {
                        p.stroke(0, 212, 255, (1 - dist / 100) * 50);
                        p.strokeWeight(1);
                        p.line(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
                    }
                }
            }
            
            // Add audio-reactive elements if audio is playing
            if (isPlaying && dataArray) {
                const bassLevel = getAverageFrequency(0, 10);
                const midLevel = getAverageFrequency(10, 100);
                const trebleLevel = getAverageFrequency(100, 200);
                
                // Draw frequency bars
                const barWidth = p.width / 64;
                for (let i = 0; i < 64; i++) {
                    const amplitude = dataArray[i] / 255;
                    const barHeight = amplitude * p.height * 0.5;
                    
                    let color;
                    if (i < 20) color = [255, 183, 0]; // Bass - amber
                    else if (i < 40) color = [0, 212, 255]; // Mids - blue
                    else color = [0, 255, 255]; // Treble - cyan
                    
                    p.fill(color[0], color[1], color[2], 150);
                    p.noStroke();
                    p.rect(i * barWidth, p.height - barHeight, barWidth - 2, barHeight);
                }
            }
        };
        
        p.windowResized = function() {
            p.resizeCanvas(visualizerContainer.offsetWidth, visualizerContainer.offsetHeight);
        };
    };
    
    visualizer = new p5(sketch);
}

// Audio functionality
function initializeAudioSystem() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioElement = new Audio();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        
        const source = audioContext.createMediaElementSource(audioElement);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
    }
}

function getAverageFrequency(startIndex, endIndex) {
    if (!dataArray) return 0;
    let sum = 0;
    for (let i = startIndex; i < endIndex && i < dataArray.length; i++) {
        sum += dataArray[i];
    }
    return sum / (endIndex - startIndex);
}

// Home page specific functionality
function initializeHomePage() {
    // Audio player controls
    const playBtn = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const trackBtns = document.querySelectorAll('.track-btn');
    const progressBar = document.getElementById('progress-bar');
    const durationEl = document.getElementById('duration');
    const currentTrackEl = document.getElementById('current-track');
    
    if (playBtn) {
        playBtn.addEventListener('click', playAudio);
    }
    
    if (pauseBtn) {
        pauseBtn.addEventListener('click', pauseAudio);
    }
    
    trackBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const track = this.getAttribute('data-track');
            switchTrack(track);
        });
    });
    
    // Initialize with electronic track
    switchTrack('electronic');
}

function playAudio() {
    if (!audioContext) {
        initializeAudioSystem();
    }
    
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    
    audioElement.play().then(() => {
        isPlaying = true;
        document.getElementById('play-btn').style.display = 'none';
        document.getElementById('pause-btn').style.display = 'inline-flex';
        
        // Update visualizer
        updateVisualizer();
    }).catch(e => {
        console.log('Audio play failed:', e);
    });
}

function pauseAudio() {
    if (audioElement) {
        audioElement.pause();
        isPlaying = false;
        document.getElementById('play-btn').style.display = 'inline-flex';
        document.getElementById('pause-btn').style.display = 'none';
    }
}

function switchTrack(trackName) {
    currentTrack = trackName;
    
    const trackInfo = {
        electronic: { name: 'Electronic Demo', duration: '3:45' },
        acoustic: { name: 'Acoustic Demo', duration: '4:12' },
        rock: { name: 'Rock Demo', duration: '3:28' }
    };
    
    // Update UI
    document.getElementById('current-track').textContent = trackInfo[trackName].name;
    document.getElementById('duration').textContent = trackInfo[trackName].duration;
    
    // Update active track button
    document.querySelectorAll('.track-btn').forEach(btn => {
        btn.classList.remove('bg-blue-600');
        btn.classList.add('bg-gray-700');
    });
    
    const activeBtn = document.querySelector(`[data-track="${trackName}"]`);
    if (activeBtn) {
        activeBtn.classList.remove('bg-gray-700');
        activeBtn.classList.add('bg-blue-600');
    }
    
    // In a real implementation, you would load the actual audio file here
    // For demo purposes, we'll just update the UI
    if (audioElement) {
        audioElement.src = `resources/audio/${trackName}-demo.mp3`;
        if (isPlaying) {
            audioElement.play().catch(e => console.log('Auto-play failed:', e));
        }
    }
}

function updateVisualizer() {
    if (!analyser || !dataArray) return;
    
    analyser.getByteFrequencyData(dataArray);
    
    // Update progress bar (simulated)
    const progressBar = document.getElementById('progress-bar');
    if (progressBar && audioElement) {
        const progress = (audioElement.currentTime / audioElement.duration) * 100;
        progressBar.style.width = `${progress}%`;
    }
    
    if (isPlaying) {
        requestAnimationFrame(updateVisualizer);
    }
}

// Equipment showcase functionality
function initializeEquipmentFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const equipmentCards = document.querySelectorAll('[data-category]');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active filter button
            filterBtns.forEach(b => {
                b.classList.remove('active');
                b.style.background = 'var(--secondary-bg)';
                b.style.color = 'white';
            });
            
            this.classList.add('active');
            
            // Filter equipment cards
            equipmentCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    anime({
                        targets: card,
                        opacity: [0, 1],
                        translateY: [20, 0],
                        duration: 300,
                        easing: 'easeOutQuad'
                    });
                } else {
                    anime({
                        targets: card,
                        opacity: [1, 0],
                        translateY: [0, -20],
                        duration: 200,
                        easing: 'easeInQuad',
                        complete: () => {
                            card.style.display = 'none';
                        }
                    });
                }
            });
        });
    });
}

// Equipment modal functionality
function openEquipmentModal(equipmentId) {
    const modal = document.getElementById('equipment-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    
    const equipment = equipmentData[equipmentId];
    if (!equipment) return;
    
    modalTitle.textContent = equipment.name;
    modalContent.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <img src="https://via.placeholder.com/400x300/2a2a2a/00d4ff?text=${equipment.name}" alt="${equipment.name}" class="w-full rounded-lg mb-6">
                <div class="bg-gray-800 rounded-lg p-4">
                    <h4 class="text-lg font-semibold mb-3">Key Features</h4>
                    <ul class="space-y-2">
                        ${equipment.features.map(feature => `<li class="text-sm text-gray-300">• ${feature}</li>`).join('')}
                    </ul>
                </div>
            </div>
            <div>
                <div class="mb-6">
                    <span class="text-2xl font-bold text-blue-400">${equipment.price}</span>
                    <p class="text-gray-400 mt-2">${equipment.type}</p>
                </div>
                <p class="text-gray-300 mb-6 font-body">${equipment.description}</p>
                <div class="bg-gray-800 rounded-lg p-4 mb-6">
                    <h4 class="text-lg font-semibold mb-3">Technical Specifications</h4>
                    <div class="space-y-2">
                        ${Object.entries(equipment.specs).map(([key, value]) => 
                            `<div class="flex justify-between text-sm">
                                <span class="text-gray-400">${key}:</span>
                                <span class="text-white font-mono">${value}</span>
                            </div>`
                        ).join('')}
                    </div>
                </div>
                <button class="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition-all" onclick="alert('Booking feature coming soon!')">
                    Book Equipment
                </button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

function closeEquipmentModal() {
    const modal = document.getElementById('equipment-modal');
    modal.classList.remove('active');
}

// Project portfolio functionality
function initializeProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('[data-category]');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active filter button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter project cards
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    anime({
                        targets: card,
                        opacity: [0, 1],
                        translateY: [20, 0],
                        duration: 300,
                        easing: 'easeOutQuad'
                    });
                } else {
                    anime({
                        targets: card,
                        opacity: [1, 0],
                        translateY: [0, -20],
                        duration: 200,
                        easing: 'easeInQuad',
                        complete: () => {
                            card.style.display = 'none';
                        }
                    });
                }
            });
        });
    });
}

function playProject(projectId) {
    // In a real implementation, this would play the actual audio
    console.log(`Playing project: ${projectId}`);
    
    // Update waveform visualization
    const waveform = document.getElementById(`waveform-${projectId}`);
    if (waveform) {
        // Animate waveform
        anime({
            targets: waveform,
            scaleX: [0, 1],
            duration: 2000,
            easing: 'easeOutQuad'
        });
    }
}

function openProjectModal(projectId) {
    const modal = document.getElementById('project-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    
    const project = projectData[projectId];
    if (!project) return;
    
    modalTitle.textContent = project.title;
    modalContent.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <img src="https://via.placeholder.com/400x300/2a2a2a/00d4ff?text=${project.title}" alt="${project.title}" class="w-full rounded-lg mb-6">
                <div class="bg-gray-800 rounded-lg p-4">
                    <h4 class="text-lg font-semibold mb-3">Track List</h4>
                    <ol class="space-y-2">
                        ${project.tracks.map((track, index) => 
                            `<li class="text-sm text-gray-300">${index + 1}. ${track}</li>`
                        ).join('')}
                    </ol>
                </div>
            </div>
            <div>
                <div class="mb-6">
                    <div class="flex items-center space-x-4 mb-4">
                        <span class="text-blue-400 font-semibold">${project.artist}</span>
                        <span class="text-gray-400">•</span>
                        <span class="text-gray-400">${project.year}</span>
                        <span class="text-gray-400">•</span>
                        <span class="text-cyan-400 font-mono text-sm">${project.genre}</span>
                    </div>
                    <p class="text-gray-300 font-body">${project.description}</p>
                </div>
                <div class="bg-gray-800 rounded-lg p-4 mb-6">
                    <h4 class="text-lg font-semibold mb-3">Production Credits</h4>
                    <div class="space-y-2">
                        ${Object.entries(project.credits).map(([role, name]) => 
                            `<div class="flex justify-between text-sm">
                                <span class="text-gray-400">${role}:</span>
                                <span class="text-white">${name}</span>
                            </div>`
                        ).join('')}
                    </div>
                </div>
                <button class="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition-all" onclick="alert('Streaming feature coming soon!')">
                    Listen Full Album
                </button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

function closeProjectModal() {
    const modal = document.getElementById('project-modal');
    modal.classList.remove('active');
}

// Booking system functionality
function initializeBookingSystem() {
    // Initialize booking form handlers
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmission);
    }
}

function selectDate(element, date) {
    // Remove previous selection
    document.querySelectorAll('.calendar-day.selected').forEach(day => {
        day.classList.remove('selected');
    });
    
    // Select new date
    element.classList.add('selected');
    selectedDate = date;
    updateSelectedDateTime();
}

function selectTime(element, time) {
    // Remove previous selection
    document.querySelectorAll('.time-slot.selected').forEach(slot => {
        slot.classList.remove('selected');
    });
    
    // Select new time
    element.classList.add('selected');
    selectedTime = time;
    updateSelectedDateTime();
}

function updateSelectedDateTime() {
    const selectedEl = document.getElementById('selected-datetime');
    if (selectedDate && selectedTime) {
        const dateObj = new Date(selectedDate);
        const formattedDate = dateObj.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        const formattedTime = new Date(`1970-01-01T${selectedTime}:00`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
        selectedEl.textContent = `${formattedDate} at ${formattedTime}`;
    } else {
        selectedEl.textContent = 'Please select date and time';
    }
}

function handleBookingSubmission(e) {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) {
        alert('Please select a date and time for your booking.');
        return;
    }
    
    // Collect form data
    const formData = new FormData(e.target);
    const bookingData = {
        date: selectedDate,
        time: selectedTime,
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        artistName: formData.get('artistName'),
        service: formData.get('service'),
        description: formData.get('description'),
        duration: formData.get('duration'),
        requests: formData.get('requests')
    };
    
    // In a real implementation, this would send data to a server
    console.log('Booking submitted:', bookingData);
    
    // Show success message
    alert('Thank you for your booking request! We will contact you within 24 hours to confirm your session details.');
    
    // Reset form
    e.target.reset();
    selectedDate = null;
    selectedTime = null;
    document.getElementById('selected-datetime').textContent = 'Please select date and time';
    document.querySelectorAll('.calendar-day.selected, .time-slot.selected').forEach(el => {
        el.classList.remove('selected');
    });
}

// Form validation
function initializeFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearValidationError);
        });
    });
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    // Remove existing error styling
    field.classList.remove('border-red-500');
    
    // Check if field is required and empty
    if (field.hasAttribute('required') && !value) {
        field.classList.add('border-red-500');
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            field.classList.add('border-red-500');
            return false;
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            field.classList.add('border-red-500');
            return false;
        }
    }
    
    return true;
}

function clearValidationError(e) {
    e.target.classList.remove('border-red-500');
}

// Carousel initialization
function initializeCarousels() {
    const carousels = document.querySelectorAll('.splide');
    
    carousels.forEach(carousel => {
        if (typeof Splide !== 'undefined') {
            new Splide(carousel, {
                type: 'loop',
                perPage: 3,
                perMove: 1,
                gap: '2rem',
                autoplay: true,
                interval: 4000,
                breakpoints: {
                    768: {
                        perPage: 1
                    },
                    1024: {
                        perPage: 2
                    }
                }
            }).mount();
        }
    });
}

// Utility functions
function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('services')) return 'services';
    if (path.includes('portfolio')) return 'portfolio';
    if (path.includes('contact')) return 'contact';
    return 'index';
}

function openBookingModal(service) {
    // Scroll to booking section
    const bookingSection = document.getElementById('booking-form') || document.querySelector('.calendar-grid');
    if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Pre-select service in form
    const serviceSelect = document.querySelector('select[name="service"]');
    if (serviceSelect) {
        serviceSelect.value = service;
    }
}

// Animation helpers
function animateOnScroll() {
    const elements = document.querySelectorAll('.scroll-reveal:not(.revealed)');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('revealed');
        }
    });
}

// Initialize scroll animations
window.addEventListener('scroll', animateOnScroll);

// Handle window resize
window.addEventListener('resize', function() {
    if (visualizer) {
        visualizer.windowResized();
    }
});

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.hidden && isPlaying) {
        pauseAudio();
    }
});

// Export functions for global access
window.playAudio = playAudio;
window.pauseAudio = pauseAudio;
window.switchTrack = switchTrack;
window.openEquipmentModal = openEquipmentModal;
window.closeEquipmentModal = closeEquipmentModal;
window.playProject = playProject;
window.openProjectModal = openProjectModal;
window.closeProjectModal = closeProjectModal;
window.selectDate = selectDate;
window.selectTime = selectTime;
window.openBookingModal = openBookingModal;

console.log('Resonance Studios - JavaScript initialized successfully!');