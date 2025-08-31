// Lag effects functionality
document.addEventListener('DOMContentLoaded', function() {
    // Reduced lag effect intensity
    const lagIntensity = 0.3; // Reduced from original value
    
    // Apply lag effects to elements with glitch-text class
    const glitchTextElements = document.querySelectorAll('.glitch-text');
    
    glitchTextElements.forEach(element => {
        // Get the text content
        const text = element.getAttribute('data-text') || element.textContent;
        
        // Create glitch effect
        element.innerHTML = `
            <span class="glitch-text-content">${text}</span>
            <span class="glitch-text-before" aria-hidden="true">${text}</span>
            <span class="glitch-text-after" aria-hidden="true">${text}</span>
        `;
    });
    
    // Apply hover effect to elements with glitch-hover class
    const glitchHoverElements = document.querySelectorAll('.glitch-hover');
    
    glitchHoverElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.classList.add('glitch-hover-active');
            
            // Apply random lag effect with reduced intensity
            if (Math.random() < lagIntensity) {
                const lagDuration = Math.random() * 100 + 50; // Reduced duration
                this.style.transition = `all ${lagDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
            }
        });
        
        element.addEventListener('mouseleave', function() {
            this.classList.remove('glitch-hover-active');
            this.style.transition = '';
        });
    });
    
    // Apply lag effect to buttons
    const buttons = document.querySelectorAll('button, .cyber-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Apply random lag effect with reduced intensity
            if (Math.random() < lagIntensity * 0.5) { // Further reduced for buttons
                const lagDuration = Math.random() * 50 + 20; // Minimal lag for buttons
                this.style.transition = `all ${lagDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
                
                setTimeout(() => {
                    this.style.transition = '';
                }, lagDuration);
            }
        });
    });
    
    // Apply random lag effect to scrolling
    window.addEventListener('scroll', function() {
        // Apply random lag effect with significantly reduced intensity
        if (Math.random() < lagIntensity * 0.2) { // Very low chance of scroll lag
            const lagDuration = Math.random() * 30 + 10; // Very short duration
            document.body.style.transition = `all ${lagDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
            
            setTimeout(() => {
                document.body.style.transition = '';
            }, lagDuration);
        }
    });
    
    // Scanline effect
    const scanline = document.querySelector('.scanline');
    if (scanline) {
        // Reduced scanline intensity
        scanline.style.opacity = '0.3'; // Reduced from original value
    }
    
    // Noise overlay effect
    const noiseOverlay = document.querySelector('.noise-overlay');
    if (noiseOverlay) {
        // Reduced noise intensity
        noiseOverlay.style.opacity = '0.05'; // Reduced from original value
    }
    
    // Circuit background effect
    const circuitBackground = document.querySelector('.circuit-background');
    if (circuitBackground) {
        // Reduced animation speed
        circuitBackground.style.animationDuration = '60s'; // Increased duration for slower animation
    }
});