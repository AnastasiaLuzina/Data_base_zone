// Function to create periodic lag effects throughout the page
function createLagEffects() {
    // Elements that will experience lag effects
    const lagTargets = [
        'body',
        '.hero',
        '.scrolling-blocks',
        '.main-content',
        '.bottom-section',
        '.footer'
    ];
    
    // Different types of lag effects
    const lagEffects = [
        // Slight stutter
        function(element) {
            const originalTransform = element.style.transform || '';
            element.style.transition = 'none';
            element.style.transform = originalTransform + ' translateX(2px)';
            
            setTimeout(() => {
                element.style.transition = 'transform 0.1s ease';
                element.style.transform = originalTransform;
            }, 100);
        },
        
        // Freeze frame
        function(element) {
            const originalFilter = element.style.filter || '';
            element.style.transition = 'none';
            element.style.filter = originalFilter + ' contrast(1.2) brightness(1.1)';
            
            setTimeout(() => {
                element.style.transition = 'filter 0.2s ease';
                element.style.filter = originalFilter;
            }, 150);
        },
        
        // Color shift
        function(element) {
            const originalFilter = element.style.filter || '';
            element.style.transition = 'none';
            element.style.filter = originalFilter + ' hue-rotate(15deg)';
            
            setTimeout(() => {
                element.style.transition = 'filter 0.3s ease';
                element.style.filter = originalFilter;
            }, 200);
        },
        
        // Glitch displacement
        function(element) {
            const originalTransform = element.style.transform || '';
            const originalFilter = element.style.filter || '';
            
            element.style.transition = 'none';
            element.style.transform = originalTransform + ' skew(2deg, 0deg)';
            element.style.filter = originalFilter + ' saturate(1.5)';
            
            setTimeout(() => {
                element.style.transform = originalTransform + ' skew(-1deg, 0deg)';
                
                setTimeout(() => {
                    element.style.transition = 'transform 0.2s ease, filter 0.2s ease';
                    element.style.transform = originalTransform;
                    element.style.filter = originalFilter;
                }, 100);
            }, 50);
        }
    ];
    
    // Function to apply random lag effect to random element
    function applyRandomLag() {
        // Select random target
        const targetSelector = lagTargets[Math.floor(Math.random() * lagTargets.length)];
        const targets = document.querySelectorAll(targetSelector);
        
        if (targets.length > 0) {
            // Select random element if there are multiple with the same selector
            const target = targets[Math.floor(Math.random() * targets.length)];
            
            // Select random effect
            const effect = lagEffects[Math.floor(Math.random() * lagEffects.length)];
            
            // Apply effect
            effect(target);
        }
        
        // Schedule next lag effect
        const nextLagDelay = Math.random() * 5000 + 2000; // Between 2-7 seconds
        setTimeout(applyRandomLag, nextLagDelay);
    }
    
    // Start lag effects after a delay
    setTimeout(applyRandomLag, 3000);
    
    // Create more intense glitch effect occasionally
    function createMajorGlitch() {
        const body = document.body;
        const originalTransition = body.style.transition;
        const originalFilter = body.style.filter;
        
        // Create glitch overlay if it doesn't exist
        let glitchOverlay = document.getElementById('major-glitch-overlay');
        if (!glitchOverlay) {
            glitchOverlay = document.createElement('div');
            glitchOverlay.id = 'major-glitch-overlay';
            glitchOverlay.style.position = 'fixed';
            glitchOverlay.style.top = '0';
            glitchOverlay.style.left = '0';
            glitchOverlay.style.width = '100%';
            glitchOverlay.style.height = '100%';
            glitchOverlay.style.pointerEvents = 'none';
            glitchOverlay.style.zIndex = '9999';
            glitchOverlay.style.mixBlendMode = 'difference';
            glitchOverlay.style.opacity = '0';
            document.body.appendChild(glitchOverlay);
        }
        
        // Apply major glitch effect
        body.style.transition = 'none';
        body.style.filter = 'hue-rotate(15deg) contrast(1.2)';
        glitchOverlay.style.opacity = '0.2';
        glitchOverlay.style.backgroundColor = '#' + Math.floor(Math.random()*16777215).toString(16);
        
        // Shake effect
        let shakeCount = 0;
        const maxShakes = 5;
        const shakeInterval = setInterval(() => {
            body.style.transform = `translateX(${Math.random() * 10 - 5}px) translateY(${Math.random() * 6 - 3}px)`;
            shakeCount++;
            
            if (shakeCount >= maxShakes) {
                clearInterval(shakeInterval);
                body.style.transform = '';
                body.style.transition = originalTransition;
                body.style.filter = originalFilter;
                glitchOverlay.style.opacity = '0';
            }
        }, 50);
        
        // Schedule next major glitch
        const nextMajorGlitchDelay = Math.random() * 20000 + 15000; // Between 15-35 seconds
        setTimeout(createMajorGlitch, nextMajorGlitchDelay);
    }
    
    // Start major glitch effects after a delay
    setTimeout(createMajorGlitch, 10000);
}

// Initialize lag effects when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    createLagEffects();
});