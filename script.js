document.addEventListener('DOMContentLoaded', function() {
    // Random glitch effect on text elements
    const glitchTexts = document.querySelectorAll('.glitch-text');
    
    function applyRandomGlitch() {
        const randomIndex = Math.floor(Math.random() * glitchTexts.length);
        const element = glitchTexts[randomIndex];
        
        element.style.setProperty('--glitch-offset', `${Math.random() * 10 - 5}px`);
        
        setTimeout(() => {
            element.style.setProperty('--glitch-offset', '2px');
        }, 200);
    }
    
    // Apply random glitch effect every 3 seconds
    setInterval(applyRandomGlitch, 3000);
    
    // Modal functionality
    const modal = document.getElementById('loginModal');
    const joinBtn = document.querySelector('.pulsating-btn');
    const loginBtn = document.querySelector('.login-btn .cyber-btn');
    const closeBtn = document.querySelector('.close-btn');
    const expandArchive = document.querySelector('.expand-archive h2');
    
    function openModal() {
        modal.style.display = 'block';
        // Add glitch effect when opening modal
        document.body.classList.add('digital-distortion');
        setTimeout(() => {
            document.body.classList.remove('digital-distortion');
        }, 1000);
    }
    
    function closeModal() {
        modal.style.display = 'none';
    }
    
    if (joinBtn) joinBtn.addEventListener('click', openModal);
    if (loginBtn) loginBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (expandArchive) expandArchive.addEventListener('click', openModal);
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Switch between login and register forms
    const switchToRegister = document.getElementById('switchToRegister');
    const modalTitle = document.querySelector('.modal-content h2');
    const submitBtn = document.querySelector('.cyber-form button');
    const switchFormText = document.querySelector('.switch-form');
    
    if (switchToRegister) {
        switchToRegister.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (modalTitle.getAttribute('data-text') === 'Вход в систему') {
                modalTitle.setAttribute('data-text', 'Регистрация');
                modalTitle.textContent = 'Регистрация';
                submitBtn.textContent = 'Зарегистрироваться';
                switchFormText.innerHTML = 'Уже есть аккаунт? <a href="#" id="switchToLogin">Войти</a>';
                
                // Add email field for registration
                if (!document.getElementById('email')) {
                    const usernameField = document.getElementById('username').parentNode;
                    const emailField = document.createElement('div');
                    emailField.className = 'form-group';
                    emailField.innerHTML = `
                        <label for="email">Email</label>
                        <input type="email" id="email" class="cyber-input" required>
                    `;
                    usernameField.parentNode.insertBefore(emailField, usernameField.nextSibling);
                }
                
                // Update switch event listener
                document.getElementById('switchToLogin').addEventListener('click', function(e) {
                    e.preventDefault();
                    switchToLogin();
                });
            }
        });
    }
    
    function switchToLogin() {
        modalTitle.setAttribute('data-text', 'Вход в систему');
        modalTitle.textContent = 'Вход в систему';
        submitBtn.textContent = 'Войти';
        switchFormText.innerHTML = 'Нет аккаунта? <a href="#" id="switchToRegister">Зарегистрироваться</a>';
        
        // Remove email field for login
        const emailField = document.getElementById('email');
        if (emailField) {
            emailField.parentNode.remove();
        }
        
        // Update switch event listener
        document.getElementById('switchToRegister').addEventListener('click', function(e) {
            e.preventDefault();
            switchToRegister.click();
        });
    }
    
    // Scrolling blocks hover and glitch effects
    const codeBlocks = document.querySelectorAll('.code-block');
    const scrollingBlocks = document.querySelector('.scrolling-blocks');
    
    // Function to create random glitch effect on blocks
    function randomBlockGlitch() {
        const randomIndex = Math.floor(Math.random() * codeBlocks.length);
        const block = codeBlocks[randomIndex];
        
        // Create glitch effect
        block.style.transform = `translateX(${Math.random() * 10 - 5}px)`;
        block.style.filter = `hue-rotate(${Math.random() * 360}deg) brightness(1.2)`;
        
        // Reset after short delay
        setTimeout(() => {
            block.style.transform = '';
            block.style.filter = '';
        }, 200);
    }
    
    // Apply random glitch effect periodically
    setInterval(randomBlockGlitch, 2000);
    
    // Occasionally pause and stutter the scrolling animation
    function stutterScrolling() {
        if (Math.random() > 0.7) {
            scrollingBlocks.style.animationPlayState = 'paused';
            
            setTimeout(() => {
                scrollingBlocks.style.animationPlayState = 'running';
            }, Math.random() * 300 + 100);
        }
    }
    
    // Apply stutter effect periodically
    setInterval(stutterScrolling, 4000);
    
    codeBlocks.forEach(block => {
        block.addEventListener('mouseenter', function() {
            // Pause the scrolling animation on hover
            scrollingBlocks.style.animationPlayState = 'paused';
            
            // Add enhanced glow effect
            this.style.boxShadow = '0 0 25px rgba(0, 240, 255, 0.8)';
            this.style.transform = 'scale(1.05)';
            
            // Trigger glitch overlay
            const glitchOverlay = this.querySelector('.glitch-overlay');
            glitchOverlay.style.opacity = '0.5';
        });
        
        block.addEventListener('mouseleave', function() {
            // Resume the scrolling animation
            scrollingBlocks.style.animationPlayState = 'running';
            
            // Remove enhanced effects
            this.style.boxShadow = '0 0 15px rgba(0, 240, 255, 0.5)';
            this.style.transform = '';
            
            // Hide glitch overlay
            const glitchOverlay = this.querySelector('.glitch-overlay');
            glitchOverlay.style.opacity = '0';
        });
    });
    
    // Parallax effect for background
    document.addEventListener('mousemove', function(e) {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        document.body.style.backgroundPosition = `
            ${20 + x * 10}% ${35 + y * 10}%,
            ${75 - x * 10}% ${65 - y * 10}%,
            ${x * 20}px ${y * 20}px
        `;
    });
    
    // Random scanline effect
    function randomScanline() {
        const scanline = document.querySelector('.scanline');
        const randomOpacity = Math.random() * 0.5 + 0.1;
        const randomDuration = Math.random() * 5 + 3;
        
        scanline.style.opacity = randomOpacity;
        scanline.style.animationDuration = `${randomDuration}s`;
        
        setTimeout(randomScanline, Math.random() * 5000 + 3000);
    }
    
    randomScanline();
    
    // Form submission
    const cyberForm = document.querySelector('.cyber-form');
    
    if (cyberForm) {
        cyberForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulate form submission with glitch effect
            document.body.classList.add('digital-distortion');
            
            setTimeout(() => {
                document.body.classList.remove('digital-distortion');
                closeModal();
                
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.innerHTML = `
                    <div class="success-content">
                        <h3 class="glitch-text" data-text="Успешно!">Успешно!</h3>
                        <p>Вы вошли в систему</p>
                    </div>
                `;
                
                document.body.appendChild(successMessage);
                
                setTimeout(() => {
                    successMessage.classList.add('show');
                }, 100);
                
                setTimeout(() => {
                    successMessage.classList.remove('show');
                    setTimeout(() => {
                        successMessage.remove();
                    }, 500);
                }, 3000);
            }, 1000);
        });
    }
    
    // Create programming language SVG icons
    createProgrammingIcons();
});

// Function to create programming language SVG icons
function createProgrammingIcons() {
    // Python icon
    fetch('https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg')
        .then(response => response.text())
        .then(svgContent => {
            createIconFile('python.svg', svgContent);
        })
        .catch(() => {
            // Fallback if fetch fails
            const pythonSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
                <linearGradient id="python-original-a" gradientUnits="userSpaceOnUse" x1="70.252" y1="1237.476" x2="170.659" y2="1151.089" gradientTransform="matrix(.563 0 0 -.568 -29.215 707.817)">
                    <stop offset="0" stop-color="#5A9FD4"/>
                    <stop offset="1" stop-color="#306998"/>
                </linearGradient>
                <linearGradient id="python-original-b" gradientUnits="userSpaceOnUse" x1="209.474" y1="1098.811" x2="173.62" y2="1149.537" gradientTransform="matrix(.563 0 0 -.568 -29.215 707.817)">
                    <stop offset="0" stop-color="#FFD43B"/>
                    <stop offset="1" stop-color="#FFE873"/>
                </linearGradient>
                <path fill="url(#python-original-a)" d="M63.391 1.988c-4.222.02-8.252.379-11.8 1.007-10.45 1.846-12.346 5.71-12.346 12.837v9.411h24.693v3.137H29.977c-7.176 0-13.46 4.313-15.426 12.521-2.268 9.405-2.368 15.275 0 25.096 1.755 7.311 5.947 12.519 13.124 12.519h8.491V67.234c0-8.151 7.051-15.34 15.426-15.34h24.665c6.866 0 12.346-5.654 12.346-12.548V15.833c0-6.693-5.646-11.72-12.346-12.837-4.244-.706-8.645-1.027-12.866-1.008zM50.037 9.557c2.55 0 4.634 2.117 4.634 4.721 0 2.593-2.083 4.69-4.634 4.69-2.56 0-4.633-2.097-4.633-4.69-.001-2.604 2.073-4.721 4.633-4.721z" transform="translate(0 10.26)"/>
                <path fill="url(#python-original-b)" d="M91.682 28.38v10.966c0 8.5-7.208 15.655-15.426 15.655H51.591c-6.756 0-12.346 5.783-12.346 12.549v23.515c0 6.691 5.818 10.628 12.346 12.547 7.816 2.297 15.312 2.713 24.665 0 6.216-1.801 12.346-5.423 12.346-12.547v-9.412H63.938v-3.138h37.012c7.176 0 9.852-5.005 12.348-12.519 2.578-7.735 2.467-15.174 0-25.096-1.774-7.145-5.161-12.521-12.348-12.521h-9.268zM77.809 87.927c2.561 0 4.634 2.097 4.634 4.692 0 2.602-2.074 4.719-4.634 4.719-2.55 0-4.633-2.117-4.633-4.719 0-2.595 2.083-4.692 4.633-4.692z" transform="translate(0 10.26)"/>
                <radialGradient id="python-original-c" cx="1825.678" cy="444.45" r="26.743" gradientTransform="matrix(0 -.24 -1.055 0 532.979 557.576)" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stop-color="#B8B8B8" stop-opacity=".498"/>
                    <stop offset="1" stop-color="#7F7F7F" stop-opacity="0"/>
                </radialGradient>
                <path opacity=".444" fill="url(#python-original-c)" d="M97.309 119.597c0 3.543-14.816 6.416-33.091 6.416-18.276 0-33.092-2.873-33.092-6.416 0-3.544 14.815-6.417 33.092-6.417 18.275 0 33.091 2.872 33.091 6.417z"/>
            </svg>`;
            createIconFile('python.svg', pythonSvg);
        });
    
    // JavaScript icon
    fetch('https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg')
        .then(response => response.text())
        .then(svgContent => {
            createIconFile('javascript.svg', svgContent);
        })
        .catch(() => {
            // Fallback if fetch fails
            const jsSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
                <path fill="#F0DB4F" d="M1.408 1.408h125.184v125.185H1.408z"/>
                <path fill="#323330" d="M116.347 96.736c-.917-5.711-4.641-10.508-15.672-14.981-3.832-1.761-8.104-3.022-9.377-5.926-.452-1.69-.512-2.642-.226-3.665.821-3.32 4.784-4.355 7.925-3.403 2.023.678 3.938 2.237 5.093 4.724 5.402-3.498 5.391-3.475 9.163-5.879-1.381-2.141-2.118-3.129-3.022-4.045-3.249-3.629-7.676-5.498-14.756-5.355l-3.688.477c-3.534.893-6.902 2.748-8.877 5.235-5.926 6.724-4.236 18.492 2.975 23.335 7.104 5.332 17.54 6.545 18.873 11.531 1.297 6.104-4.486 8.08-10.234 7.378-4.236-.881-6.592-3.034-9.139-6.949-4.688 2.713-4.688 2.713-9.508 5.485 1.143 2.499 2.344 3.63 4.26 5.795 9.068 9.198 31.76 8.746 35.83-5.176.165-.478 1.261-3.666.38-8.581zM69.462 58.943H57.753l-.048 30.272c0 6.438.333 12.34-.714 14.149-1.713 3.558-6.152 3.117-8.175 2.427-2.059-1.012-3.106-2.451-4.319-4.485-.333-.584-.583-1.036-.667-1.071l-9.52 5.83c1.583 3.249 3.915 6.069 6.902 7.901 4.462 2.678 10.459 3.499 16.731 2.059 4.082-1.189 7.604-3.652 9.448-7.401 2.666-4.915 2.094-10.864 2.07-17.444.06-10.735.001-21.468.001-32.237z"/>
            </svg>`;
            createIconFile('javascript.svg', jsSvg);
        });
    
    // C++ icon
    fetch('https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg')
        .then(response => response.text())
        .then(svgContent => {
            createIconFile('cpp.svg', svgContent);
        })
        .catch(() => {
            // Fallback if fetch fails
            const cppSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
                <path fill="#D26383" d="M115.4 30.7L67.1 2.9c-.8-.5-1.9-.7-3.1-.7-1.2 0-2.3.3-3.1.7l-48 27.9c-1.7 1-2.9 3.5-2.9 5.4v55.7c0 1.1.2 2.4 1 3.5l106.8-62c-.6-1.2-1.5-2.1-2.4-2.7z"/>
                <path fill="#9C033A" d="M10.7 95.3c.5.8 1.2 1.5 1.9 1.9l48.2 27.9c.8.5 1.9.7 3.1.7 1.2 0 2.3-.3 3.1-.7l48-27.9c1.7-1 2.9-3.5 2.9-5.4V36.1c0-.9-.1-1.9-.6-2.8l-106.6 62z"/>
                <path fill="#fff" d="M85.3 76.1C81.1 83.5 73.1 88.5 64 88.5c-13.5 0-24.5-11-24.5-24.5s11-24.5 24.5-24.5c9.1 0 17.1 5 21.3 12.5l13-7.5c-6.8-11.9-19.6-20-34.3-20-21.8 0-39.5 17.7-39.5 39.5s17.7 39.5 39.5 39.5c14.6 0 27.4-8 34.2-19.8l-12.9-7.6z"/>
                <path d="M82.1 61.8h5.2v-5.3h4.4v5.3H97v4.4h-5.3v5.2h-4.4v-5.2h-5.2v-4.4zm18.5 0h5.2v-5.3h4.4v5.3h5.3v4.4h-5.3v5.2h-4.4v-5.2h-5.2v-4.4z" fill="#fff"/>
            </svg>`;
            createIconFile('cpp.svg', cppSvg);
        });
    
    // Java icon
    fetch('https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg')
        .then(response => response.text())
        .then(svgContent => {
            createIconFile('java.svg', svgContent);
        })
        .catch(() => {
            // Fallback if fetch fails
            const javaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
                <path fill="#0074BD" d="M47.617 98.12s-4.767 2.774 3.397 3.71c9.892 1.13 14.947.968 25.845-1.092 0 0 2.871 1.795 6.873 3.351-24.439 10.47-55.308-.607-36.115-5.969zm-2.988-13.665s-5.348 3.959 2.823 4.805c10.567 1.091 18.91 1.18 33.354-1.6 0 0 1.993 2.025 5.132 3.131-29.542 8.64-62.446.68-41.309-6.336z"/>
                <path fill="#EA2D2E" d="M69.802 61.271c6.025 6.935-1.58 13.17-1.58 13.17s15.289-7.891 8.269-17.777c-6.559-9.215-11.587-13.792 15.635-29.58 0 .001-42.731 10.67-22.324 34.187z"/>
                <path fill="#0074BD" d="M102.123 108.229s3.529 2.91-3.888 5.159c-14.102 4.272-58.706 5.56-71.094.171-4.451-1.938 3.899-4.625 6.526-5.192 2.739-.593 4.303-.485 4.303-.485-4.953-3.487-32.013 6.85-13.743 9.815 49.821 8.076 90.817-3.637 77.896-9.468zM49.912 70.294s-22.686 5.389-8.033 7.348c6.188.828 18.518.638 30.011-.326 9.39-.789 18.813-2.474 18.813-2.474s-3.308 1.419-5.704 3.053c-23.042 6.061-67.544 3.238-54.731-2.958 10.832-5.239 19.644-4.643 19.644-4.643zm40.697 22.747c23.421-12.167 12.591-23.86 5.032-22.285-1.848.385-2.677.72-2.677.72s.688-1.079 2-1.543c14.953-5.255 26.451 15.503-4.823 23.725 0-.002.359-.327.468-.617z"/>
                <path fill="#EA2D2E" d="M76.491 1.587S89.459 14.563 64.188 34.51c-20.266 16.006-4.621 25.13-.007 35.559-11.831-10.673-20.509-20.07-14.688-28.815C58.041 28.42 81.722 22.195 76.491 1.587z"/>
                <path fill="#0074BD" d="M52.214 126.021c22.476 1.437 57-.8 57.817-11.436 0 0-1.571 4.032-18.577 7.231-19.186 3.612-42.854 3.191-56.887.874 0 0 2.875 2.381 17.647 3.331z"/>
            </svg>`;
            createIconFile('java.svg', javaSvg);
        });
    
    // Create noise texture
    createNoiseTexture();
    
    // Create circuit pattern
    createCircuitPattern();
}

// Helper function to create icon files
function createIconFile(filename, content) {
    const blob = new Blob([content], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const img = new Image();
    img.onload = function() {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob(function(blob) {
            const formData = new FormData();
            formData.append('file', blob, filename);
            
            fetch('images/' + filename, {
                method: 'PUT',
                body: blob
            }).catch(error => {
                console.error('Error saving icon:', error);
            });
        });
    };
    img.src = url;
}

// Function to create noise texture
function createNoiseTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    
    // Create noise
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
        const value = Math.floor(Math.random() * 255);
        data[i] = value;     // red
        data[i + 1] = value; // green
        data[i + 2] = value; // blue
        data[i + 3] = 255;   // alpha
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    canvas.toBlob(function(blob) {
        const formData = new FormData();
        formData.append('file', blob, 'noise.png');
        
        fetch('images/noise.png', {
            method: 'PUT',
            body: blob
        }).catch(error => {
            console.error('Error saving noise texture:', error);
        });
    });
}

// Function to create circuit pattern
function createCircuitPattern() {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    
    // Set background
    ctx.fillStyle = 'rgba(10, 0, 31, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw circuit lines
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
    ctx.lineWidth = 1;
    
    // Horizontal lines
    for (let y = 20; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        
        // Create some randomness in the lines
        for (let x = 0; x < canvas.width; x += 20) {
            const offsetY = Math.random() * 5 - 2.5;
            ctx.lineTo(x, y + offsetY);
        }
        
        ctx.stroke();
    }
    
    // Vertical lines
    for (let x = 20; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        
        // Create some randomness in the lines
        for (let y = 0; y < canvas.height; y += 20) {
            const offsetX = Math.random() * 5 - 2.5;
            ctx.lineTo(x + offsetX, y);
        }
        
        ctx.stroke();
    }
    
    // Add circuit nodes
    ctx.fillStyle = 'rgba(0, 240, 255, 0.2)';
    for (let i = 0; i < 30; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 5 + 2;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }
    
    canvas.toBlob(function(blob) {
        const formData = new FormData();
        formData.append('file', blob, 'circuit-pattern.png');
        
        fetch('images/circuit-pattern.png', {
            method: 'PUT',
            body: blob
        }).catch(error => {
            console.error('Error saving circuit pattern:', error);
        });
    });
}