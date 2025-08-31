// Function to create technology icons
document.addEventListener('DOMContentLoaded', function() {
    // List of technologies and their colors
    const technologies = {
        // Programming Languages
        'javascript': '#F7DF1E',
        'python': '#3776AB',
        'java': '#007396',
        'csharp': '#239120',
        'typescript': '#3178C6',
        'php': '#777BB4',
        'swift': '#FA7343',
        'kotlin': '#7F52FF',
        'go': '#00ADD8',
        'rust': '#000000',
        
        // Frontend
        'react': '#61DAFB',
        'angular': '#DD0031',
        'vue': '#4FC08D',
        'svelte': '#FF3E00',
        
        // Backend
        'nodejs': '#339933',
        'express': '#000000',
        'django': '#092E20',
        'flask': '#000000',
        'laravel': '#FF2D20',
        
        // Code Tools
        'vscode': '#007ACC',
        'webstorm': '#00CDD7',
        'sublime': '#FF9800',
        'atom': '#66595C',
        'git': '#F05032',
        'github': '#181717',
        
        // Game Development
        'unity': '#000000',
        'unreal': '#313131',
        
        // Design
        'figma': '#F24E1E',
        'photoshop': '#31A8FF',
        'illustrator': '#FF9A00',
        'xd': '#FF61F6'
    };
    
    // Create SVG icons for each technology
    for (const [tech, color] of Object.entries(technologies)) {
        createTechIcon(tech, color);
    }
});

// Function to create a tech icon SVG
function createTechIcon(tech, color) {
    // Create SVG content
    const svgContent = generateSvgForTech(tech, color);
    
    // Save the SVG file
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    
    fetch(`images/${tech}.svg`, {
        method: 'PUT',
        body: blob
    }).catch(error => {
        console.error(`Error saving ${tech} icon:`, error);
    });
}

// Function to generate SVG content based on technology
function generateSvgForTech(tech, color) {
    // Base SVG template
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">`;
    
    // Add tech-specific content
    switch (tech) {
        case 'javascript':
            svg += `
                <rect width="100" height="100" rx="15" fill="#F7DF1E"/>
                <path d="M25,80 L35,75 L35,40 L25,45 Z" fill="#000"/>
                <path d="M75,80 L65,75 L65,40 L75,45 Z" fill="#000"/>
                <path d="M35,75 L65,75 L65,40 L35,40 Z" fill="#000"/>
            `;
            break;
        case 'python':
            svg += `
                <path d="M50,15 C30,15 30,25 30,35 L30,45 L70,45 L70,50 L20,50 C10,50 10,60 10,70 C10,80 10,90 30,90 C40,90 45,85 50,85 C55,85 60,90 70,90 C90,90 90,80 90,70 L90,60 L50,60 L50,55 L80,55 C90,55 90,45 90,35 C90,25 90,15 70,15 C60,15 55,15 50,15 Z" fill="#3776AB"/>
                <circle cx="35" cy="30" r="5" fill="#FFF"/>
                <circle cx="65" cy="75" r="5" fill="#FFF"/>
            `;
            break;
        case 'java':
            svg += `
                <path d="M40,80 C20,85 20,70 30,65 C40,60 70,60 70,65 C70,70 60,75 40,80 Z" fill="#007396"/>
                <path d="M45,15 C40,25 55,35 50,50 C45,65 20,55 30,45 C40,35 50,40 45,15 Z" fill="#007396"/>
                <path d="M60,15 C55,25 70,35 65,50 C60,65 35,55 45,45 C55,35 65,40 60,15 Z" fill="#007396"/>
            `;
            break;
        case 'csharp':
            svg += `
                <rect width="100" height="100" rx="20" fill="#239120"/>
                <text x="50" y="65" font-family="Arial" font-size="60" text-anchor="middle" fill="white">C#</text>
            `;
            break;
        case 'typescript':
            svg += `
                <rect width="100" height="100" rx="10" fill="#3178C6"/>
                <text x="50" y="65" font-family="Arial" font-size="60" text-anchor="middle" fill="white">TS</text>
            `;
            break;
        case 'php':
            svg += `
                <ellipse cx="50" cy="50" rx="45" ry="30" fill="#777BB4"/>
                <text x="50" y="60" font-family="Arial" font-size="35" text-anchor="middle" fill="white">PHP</text>
            `;
            break;
        case 'swift':
            svg += `
                <rect width="100" height="100" rx="15" fill="#FA7343"/>
                <path d="M20,20 C40,40 40,60 20,80 C40,70 60,70 80,80 C60,60 60,40 80,20 C60,30 40,30 20,20 Z" fill="white"/>
            `;
            break;
        case 'kotlin':
            svg += `
                <path d="M10,10 L50,10 L90,50 L50,90 L10,90 Z" fill="#7F52FF"/>
                <path d="M10,10 L50,50 L10,90 Z" fill="#5C39C2"/>
                <path d="M50,10 L90,50 L50,50 Z" fill="#5C39C2"/>
            `;
            break;
        case 'go':
            svg += `
                <circle cx="30" cy="50" r="15" fill="#00ADD8"/>
                <circle cx="70" cy="50" r="15" fill="#00ADD8"/>
                <path d="M30,65 Q50,80 70,65" stroke="#00ADD8" stroke-width="5" fill="none"/>
            `;
            break;
        case 'rust':
            svg += `
                <circle cx="50" cy="50" r="40" fill="#000000"/>
                <circle cx="50" cy="50" r="30" fill="none" stroke="#FF5733" stroke-width="5"/>
                <circle cx="35" cy="40" r="5" fill="#FF5733"/>
                <circle cx="65" cy="40" r="5" fill="#FF5733"/>
                <path d="M35,60 Q50,70 65,60" stroke="#FF5733" stroke-width="3" fill="none"/>
            `;
            break;
        case 'react':
            svg += `
                <ellipse cx="50" cy="50" rx="40" ry="15" stroke="#61DAFB" stroke-width="3" fill="none"/>
                <ellipse cx="50" cy="50" rx="40" ry="15" stroke="#61DAFB" stroke-width="3" fill="none" transform="rotate(60 50 50)"/>
                <ellipse cx="50" cy="50" rx="40" ry="15" stroke="#61DAFB" stroke-width="3" fill="none" transform="rotate(120 50 50)"/>
                <circle cx="50" cy="50" r="7" fill="#61DAFB"/>
            `;
            break;
        case 'angular':
            svg += `
                <path d="M50,10 L90,25 L82,75 L50,90 L18,75 L10,25 Z" fill="#DD0031"/>
                <path d="M50,10 L50,90 L82,75 L90,25 Z" fill="#C3002F"/>
                <path d="M50,20 L30,70 L40,70 L45,55 L55,55 L60,70 L70,70 Z" fill="white"/>
                <path d="M50,20 L50,40 L45,55 L55,55 Z" fill="white"/>
            `;
            break;
        case 'vue':
            svg += `
                <path d="M50,15 L65,40 L80,15 L90,15 L65,60 L40,15 Z" fill="#41B883"/>
                <path d="M50,15 L65,40 L80,15 L70,15 L65,25 L60,15 Z" fill="#35495E"/>
            `;
            break;
        case 'svelte':
            svg += `
                <path d="M30,20 C10,30 10,70 30,80 C50,90 80,70 80,50 C80,30 50,10 30,20 Z" fill="#FF3E00"/>
                <path d="M45,30 C35,35 35,65 45,70 C55,75 70,65 70,55 C70,45 55,35 45,30 Z" fill="white"/>
            `;
            break;
        case 'nodejs':
            svg += `
                <path d="M50,10 L85,30 L85,70 L50,90 L15,70 L15,30 Z" fill="#339933"/>
                <path d="M50,20 L75,35 L75,65 L50,80 L25,65 L25,35 Z" fill="#333"/>
                <path d="M45,40 L55,40 L55,60 L45,60 Z" fill="#339933"/>
            `;
            break;
        case 'express':
            svg += `
                <rect width="100" height="100" rx="10" fill="#000000"/>
                <text x="50" y="60" font-family="Arial" font-size="20" text-anchor="middle" fill="white">Express</text>
            `;
            break;
        case 'django':
            svg += `
                <rect width="100" height="100" rx="10" fill="#092E20"/>
                <text x="50" y="60" font-family="Arial" font-size="20" text-anchor="middle" fill="white">Django</text>
            `;
            break;
        case 'flask':
            svg += `
                <path d="M35,20 L65,20 L75,60 C75,75 25,75 25,60 Z" fill="none" stroke="black" stroke-width="3"/>
                <circle cx="40" cy="40" r="5" fill="black"/>
                <circle cx="60" cy="50" r="5" fill="black"/>
            `;
            break;
        case 'laravel':
            svg += `
                <rect width="100" height="100" rx="10" fill="#FF2D20"/>
                <text x="50" y="60" font-family="Arial" font-size="18" text-anchor="middle" fill="white">Laravel</text>
            `;
            break;
        case 'vscode':
            svg += `
                <path d="M80,50 L80,20 L30,10 L10,30 L10,70 L30,90 L80,80 L80,50 Z" fill="#007ACC"/>
                <path d="M30,50 L10,30 L30,10 L30,90 L10,70 Z" fill="#1F9CF0"/>
                <path d="M80,20 L30,50 L20,40 L10,50 L20,60 L30,50 L80,80 Z" fill="#FFFFFF"/>
            `;
            break;
        case 'webstorm':
            svg += `
                <rect width="100" height="100" rx="10" fill="#00CDD7"/>
                <text x="50" y="60" font-family="Arial" font-size="15" text-anchor="middle" fill="white">WebStorm</text>
            `;
            break;
        case 'sublime':
            svg += `
                <rect width="100" height="100" rx="10" fill="#FF9800"/>
                <text x="50" y="60" font-family="Arial" font-size="15" text-anchor="middle" fill="white">Sublime</text>
            `;
            break;
        case 'atom':
            svg += `
                <circle cx="50" cy="50" r="40" fill="#66595C"/>
                <ellipse cx="50" cy="50" rx="30" ry="10" stroke="white" stroke-width="2" fill="none"/>
                <ellipse cx="50" cy="50" rx="30" ry="10" stroke="white" stroke-width="2" fill="none" transform="rotate(60 50 50)"/>
                <ellipse cx="50" cy="50" rx="30" ry="10" stroke="white" stroke-width="2" fill="none" transform="rotate(120 50 50)"/>
            `;
            break;
        case 'git':
            svg += `
                <rect width="100" height="100" rx="10" fill="#F05032"/>
                <text x="50" y="65" font-family="Arial" font-size="40" text-anchor="middle" fill="white">Git</text>
            `;
            break;
        case 'github':
            svg += `
                <circle cx="50" cy="45" r="35" fill="#181717"/>
                <circle cx="35" cy="35" r="7" fill="white"/>
                <circle cx="65" cy="35" r="7" fill="white"/>
                <path d="M30,60 Q50,75 70,60" stroke="white" stroke-width="3" fill="none"/>
                <path d="M50,80 L50,65" stroke="#181717" stroke-width="10"/>
            `;
            break;
        case 'unity':
            svg += `
                <rect width="100" height="100" rx="10" fill="#000000"/>
                <text x="50" y="60" font-family="Arial" font-size="25" text-anchor="middle" fill="white">Unity</text>
            `;
            break;
        case 'unreal':
            svg += `
                <circle cx="50" cy="50" r="40" fill="#313131"/>
                <text x="50" y="60" font-family="Arial" font-size="15" text-anchor="middle" fill="white">Unreal</text>
            `;
            break;
        case 'figma':
            svg += `
                <rect x="20" y="20" width="30" height="30" rx="15" fill="#F24E1E"/>
                <rect x="20" y="50" width="30" height="30" rx="15" fill="#A259FF"/>
                <rect x="50" y="20" width="30" height="30" rx="15" fill="#FF7262"/>
                <rect x="50" y="50" width="30" height="30" rx="15" fill="#1ABCFE"/>
            `;
            break;
        case 'photoshop':
            svg += `
                <rect width="100" height="100" rx="10" fill="#31A8FF"/>
                <text x="50" y="60" font-family="Arial" font-size="25" text-anchor="middle" fill="white">Ps</text>
            `;
            break;
        case 'illustrator':
            svg += `
                <rect width="100" height="100" rx="10" fill="#FF9A00"/>
                <text x="50" y="60" font-family="Arial" font-size="25" text-anchor="middle" fill="white">Ai</text>
            `;
            break;
        case 'xd':
            svg += `
                <rect width="100" height="100" rx="10" fill="#FF61F6"/>
                <text x="50" y="60" font-family="Arial" font-size="25" text-anchor="middle" fill="white">XD</text>
            `;
            break;
        default:
            // Generic icon for any other technology
            svg += `
                <rect width="100" height="100" rx="15" fill="${color}"/>
                <text x="50" y="60" font-family="Arial" font-size="20" text-anchor="middle" fill="white">${tech}</text>
            `;
    }
    
    // Close SVG tag
    svg += `</svg>`;
    
    return svg;
}