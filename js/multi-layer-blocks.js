// Function to handle multi-layer scrolling blocks
document.addEventListener('DOMContentLoaded', function() {
    // Create chain effect by duplicating blocks
    createChainEffect();
    
    // Get all scrolling blocks containers
    const scrollingBlocksContainers = document.querySelectorAll('.scrolling-blocks');
    
    // Initialize each container with appropriate animation
    scrollingBlocksContainers.forEach(container => {
        // Get speed from data attribute or use default
        const speed = container.getAttribute('data-speed') || 30;
        const direction = container.getAttribute('data-direction') || 'left';
        
        // Set animation properties
        container.style.animationDuration = `${speed}s`;
        if (direction === 'right') {
            container.style.animationDirection = 'reverse';
        }
        
        // Add glitch to scrolling
        addScrollingGlitch(container);
    });
    
    // Add hover effects to blocks
    const codeBlocks = document.querySelectorAll('.code-block');
    codeBlocks.forEach(block => {
        block.addEventListener('mouseenter', function() {
            // Find parent scrolling container and pause it
            const parentContainer = this.closest('.scrolling-blocks');
            if (parentContainer) {
                parentContainer.style.animationPlayState = 'paused';
            }
            
            // Add enhanced glow effect
            this.style.boxShadow = '0 0 25px var(--primary-light)';
            this.style.transform = 'scale(1.05)';
            this.style.zIndex = '10';
            
            // Trigger glitch overlay
            const glitchOverlay = this.querySelector('.glitch-overlay');
            if (glitchOverlay) {
                glitchOverlay.style.opacity = '0.5';
            }
        });
        
        block.addEventListener('mouseleave', function() {
            // Resume scrolling animation
            const parentContainer = this.closest('.scrolling-blocks');
            if (parentContainer) {
                parentContainer.style.animationPlayState = 'running';
            }
            
            // Remove enhanced effects
            this.style.boxShadow = '';
            this.style.transform = '';
            this.style.zIndex = '';
            
            // Hide glitch overlay
            const glitchOverlay = this.querySelector('.glitch-overlay');
            if (glitchOverlay) {
                glitchOverlay.style.opacity = '0';
            }
        });
    });
    
    // Add layer title hover effects
    const layerTitles = document.querySelectorAll('.layer-title');
    layerTitles.forEach(title => {
        title.addEventListener('mouseenter', function() {
            this.style.textShadow = '0 0 20px var(--primary-light)';
            this.style.color = 'white';
        });
        
        title.addEventListener('mouseleave', function() {
            this.style.textShadow = '0 0 10px var(--primary-light)';
            this.style.color = 'var(--primary-light)';
        });
    });
});

// Function to create chain effect by duplicating blocks
function createChainEffect() {
    const scrollingContainers = document.querySelectorAll('.scrolling-blocks');
    
    scrollingContainers.forEach(container => {
        // Get all direct children (code blocks)
        const blocks = Array.from(container.children);
        
        // Create a group for the original blocks
        const originalGroup = document.createElement('div');
        originalGroup.className = 'code-block-group';
        
        // Move all blocks into the group
        blocks.forEach(block => {
            originalGroup.appendChild(block);
        });
        
        // Add the original group to the container
        container.appendChild(originalGroup);
        
        // Create a clone of the group for seamless scrolling
        const cloneGroup = originalGroup.cloneNode(true);
        container.appendChild(cloneGroup);
        
        // Add connecting elements between blocks
        const allBlocks = container.querySelectorAll('.code-block');
        allBlocks.forEach((block, index) => {
            if (index < allBlocks.length - 1) {
                const connector = document.createElement('div');
                connector.className = 'block-connector';
                block.after(connector);
            }
        });
    });
}

// Function to add glitch to scrolling animation
function addScrollingGlitch(container) {
    // Periodically add glitch to scrolling
    function glitchScroll() {
        // Only apply glitch sometimes
        if (Math.random() > 0.7) {
            // Save original state
            const originalPlayState = container.style.animationPlayState;
            const originalDuration = container.style.animationDuration;
            
            // Apply glitch effect
            if (Math.random() > 0.5) {
                // Pause briefly
                container.style.animationPlayState = 'paused';
                
                setTimeout(() => {
                    container.style.animationPlayState = originalPlayState;
                }, Math.random() * 200 + 50);
            } else {
                // Speed up or slow down briefly
                const speedFactor = Math.random() > 0.5 ? 0.5 : 2;
                const originalSpeed = parseFloat(originalDuration);
                container.style.animationDuration = `${originalSpeed * speedFactor}s`;
                
                setTimeout(() => {
                    container.style.animationDuration = originalDuration;
                }, Math.random() * 300 + 100);
            }
        }
        
        // Schedule next glitch
        const nextGlitchDelay = Math.random() * 5000 + 2000; // Between 2-7 seconds
        setTimeout(glitchScroll, nextGlitchDelay);
    }
    
    // Start glitch effects after a delay
    setTimeout(glitchScroll, Math.random() * 3000 + 1000);
}