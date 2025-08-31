// Function to create circuit pattern
function createCircuitPattern() {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    
    // Set background
    ctx.fillStyle = 'rgba(1, 0, 48, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw circuit lines
    ctx.strokeStyle = 'rgba(154, 83, 208, 0.15)';
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
    ctx.fillStyle = 'rgba(255, 95, 81, 0.2)';
    for (let i = 0; i < 15; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 5 + 2;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Add additional nodes with different color
    ctx.fillStyle = 'rgba(114, 38, 255, 0.2)';
    for (let i = 0; i < 15; i++) {
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

// Call the function
createCircuitPattern();