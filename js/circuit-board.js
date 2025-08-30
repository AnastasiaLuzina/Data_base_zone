// Function to create a circuit board pattern inspired by the reference image
function createCircuitBoard() {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    
    // Set background
    ctx.fillStyle = '#010030';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw circuit paths
    drawCircuitPaths(ctx, canvas.width, canvas.height);
    
    // Draw circuit nodes
    drawCircuitNodes(ctx, canvas.width, canvas.height);
    
    // Draw chips and components
    drawComponents(ctx, canvas.width, canvas.height);
    
    // Add glow effect
    addGlowEffect(ctx, canvas.width, canvas.height);
    
    // Save the image
    canvas.toBlob(function(blob) {
        const formData = new FormData();
        formData.append('file', blob, 'circuit-board.png');
        
        fetch('images/circuit-board.png', {
            method: 'PUT',
            body: blob
        }).catch(error => {
            console.error('Error saving circuit board:', error);
        });
    });
}

// Function to draw circuit paths
function drawCircuitPaths(ctx, width, height) {
    // Main circuit paths
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Draw horizontal and vertical lines
    for (let i = 0; i < 20; i++) {
        // Horizontal lines
        const y = Math.random() * height;
        ctx.beginPath();
        ctx.moveTo(0, y);
        
        // Create path with segments
        let x = 0;
        while (x < width) {
            const segmentLength = Math.random() * 100 + 50;
            x += segmentLength;
            
            if (Math.random() > 0.7) {
                // Vertical segment
                const vertLength = Math.random() * 100 + 20;
                const direction = Math.random() > 0.5 ? 1 : -1;
                
                ctx.lineTo(x, y);
                ctx.lineTo(x, y + vertLength * direction);
                y += vertLength * direction;
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        // Random color for each path
        const colors = ['#7226FF', '#9A53D0', '#FF5F51'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.6;
        ctx.stroke();
        ctx.globalAlpha = 1.0;
    }
    
    // Draw diagonal lines
    for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        const startX = Math.random() * width;
        const startY = Math.random() * height;
        ctx.moveTo(startX, startY);
        
        const endX = startX + (Math.random() * 200 - 100);
        const endY = startY + (Math.random() * 200 - 100);
        ctx.lineTo(endX, endY);
        
        const colors = ['#7226FF', '#9A53D0', '#FF5F51'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.4;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.globalAlpha = 1.0;
    }
}

// Function to draw circuit nodes
function drawCircuitNodes(ctx, width, height) {
    // Draw connection nodes
    for (let i = 0; i < 50; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = Math.random() * 4 + 2;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        
        const colors = ['#7226FF', '#9A53D0', '#FF5F51'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        ctx.fillStyle = color;
        ctx.fill();
        
        // Add glow to some nodes
        if (Math.random() > 0.7) {
            ctx.beginPath();
            ctx.arc(x, y, radius * 2, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.globalAlpha = 0.2;
            ctx.fill();
            ctx.globalAlpha = 1.0;
        }
    }
}

// Function to draw chips and components
function drawComponents(ctx, width, height) {
    // Draw rectangular chips
    for (let i = 0; i < 5; i++) {
        const x = Math.random() * (width - 100);
        const y = Math.random() * (height - 100);
        const w = Math.random() * 60 + 40;
        const h = Math.random() * 60 + 40;
        
        // Chip body
        ctx.fillStyle = '#050520';
        ctx.fillRect(x, y, w, h);
        
        // Chip border
        ctx.strokeStyle = '#7226FF';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, w, h);
        
        // Chip pins
        const pinCount = Math.floor(Math.random() * 6) + 4;
        const pinSpacing = h / (pinCount + 1);
        
        for (let j = 0; j < pinCount; j++) {
            // Left pins
            ctx.beginPath();
            ctx.moveTo(x, y + (j + 1) * pinSpacing);
            ctx.lineTo(x - 10, y + (j + 1) * pinSpacing);
            ctx.strokeStyle = '#9A53D0';
            ctx.stroke();
            
            // Right pins
            ctx.beginPath();
            ctx.moveTo(x + w, y + (j + 1) * pinSpacing);
            ctx.lineTo(x + w + 10, y + (j + 1) * pinSpacing);
            ctx.strokeStyle = '#9A53D0';
            ctx.stroke();
        }
        
        // Chip details
        if (Math.random() > 0.5) {
            // Central square
            ctx.fillStyle = '#FF5F51';
            ctx.globalAlpha = 0.7;
            ctx.fillRect(x + w/4, y + h/4, w/2, h/2);
            ctx.globalAlpha = 1.0;
        }
    }
}

// Function to add glow effect
function addGlowEffect(ctx, width, height) {
    // Add some glowing areas
    for (let i = 0; i < 10; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = Math.random() * 50 + 20;
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        
        const colors = ['#7226FF', '#9A53D0', '#FF5F51'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.globalAlpha = 0.1;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
    }
}

// Call the function to create the circuit board
document.addEventListener('DOMContentLoaded', function() {
    createCircuitBoard();
});