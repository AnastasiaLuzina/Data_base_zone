// Resource selection functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get all code blocks (resource blocks)
    const codeBlocks = document.querySelectorAll('.code-block');
    
    // Add click event to each block
    codeBlocks.forEach(block => {
        block.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the technology name from data attribute or block label
            const techName = this.getAttribute('data-lang') || this.querySelector('.block-label').textContent;
            
            // Open resource selection modal
            openResourceSelectionModal(techName);
        });
    });
    
    // Function to open resource selection modal
    function openResourceSelectionModal(techName) {
        // Create modal if it doesn't exist
        let modal = document.getElementById('resourceSelectionModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'resourceSelectionModal';
            modal.className = 'modal resource-modal';
            document.body.appendChild(modal);
        }
        
        // Set modal content
        modal.innerHTML = `
            <div class="modal-content resource-modal-content">
                <span class="close-btn resource-close">&times;</span>
                <h2 class="glitch-text" data-text="Что вам требуется?">Что вам требуется?</h2>
                <p class="selected-tech">Выбрано: ${techName}</p>
                
                <div class="resource-filters">
                    <h3 class="glitch-text" data-text="Виды ресурсов">Виды ресурсов</h3>
                    <div class="filter-options">
                        <button class="cyber-btn filter-btn active" data-type="all">Все</button>
                        <button class="cyber-btn filter-btn" data-type="video">Видео</button>
                        <button class="cyber-btn filter-btn" data-type="article">Статьи</button>
                        <button class="cyber-btn filter-btn" data-type="course">Курсы</button>
                        <button class="cyber-btn filter-btn" data-type="channel">Каналы</button>
                        <button class="cyber-btn filter-btn" data-type="book">Книги</button>
                    </div>
                    
                    <h3 class="glitch-text" data-text="Уровень сложности">Уровень сложности</h3>
                    <div class="difficulty-options">
                        <button class="cyber-btn difficulty-btn active" data-difficulty="all">Все</button>
                        <button class="cyber-btn difficulty-btn" data-difficulty="easy">Изи</button>
                        <button class="cyber-btn difficulty-btn" data-difficulty="medium">Средне</button>
                        <button class="cyber-btn difficulty-btn" data-difficulty="pro">Про</button>
                    </div>
                </div>
                
                <div class="resource-results">
                    <h3 class="glitch-text" data-text="Найденные ресурсы">Найденные ресурсы</h3>
                    <div class="resources-container">
                        <!-- Resources will be dynamically added here -->
                    </div>
                </div>
                
                <div class="resource-actions">
                    <button class="cyber-btn add-resource-btn">Добавить ресурс</button>
                    <button class="cyber-btn request-resource-btn">Запросить ресурс</button>
                </div>
            </div>
        `;
        
        // Show modal
        modal.style.display = 'block';
        
        // Add event listeners to close buttons
        const closeBtn = modal.querySelector('.resource-close');
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        // Add filter button event listeners
        const filterButtons = modal.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Update resources based on filter
                updateResources(techName, this.getAttribute('data-type'));
            });
        });
        
        // Add difficulty button event listeners
        const difficultyButtons = modal.querySelectorAll('.difficulty-btn');
        difficultyButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                difficultyButtons.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Update resources based on difficulty
                updateResources(techName, null, this.getAttribute('data-difficulty'));
            });
        });
        
        // Add resource button event listeners
        const addResourceBtn = modal.querySelector('.add-resource-btn');
        const requestResourceBtn = modal.querySelector('.request-resource-btn');
        
        addResourceBtn.addEventListener('click', function() {
            openAddResourceModal(techName);
        });
        
        requestResourceBtn.addEventListener('click', function() {
            openRequestResourceModal(techName);
        });
        
        // Load initial resources
        loadResources(techName);
    }
    
    // Function to load resources for a technology
    function loadResources(techName) {
        // This would normally fetch from a database
        // For now, we'll use mock data
        const resources = generateMockResources(techName);
        displayResources(resources);
    }
    
    // Function to update resources based on filters
    function updateResources(techName, typeFilter = null, difficultyFilter = null) {
        // This would normally filter database results
        // For now, we'll generate mock data with filters
        const resources = generateMockResources(techName, typeFilter, difficultyFilter);
        displayResources(resources);
    }
    
    // Function to display resources in the modal
    function displayResources(resources) {
        const container = document.querySelector('.resources-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        resources.forEach(resource => {
            const resourceElement = document.createElement('div');
            resourceElement.className = 'resource-item glitch-hover';
            resourceElement.innerHTML = `
                <div class="resource-header">
                    <span class="resource-type ${resource.type}">${getResourceTypeLabel(resource.type)}</span>
                    <span class="resource-difficulty ${resource.difficulty}">${getResourceDifficultyLabel(resource.difficulty)}</span>
                </div>
                <h4 class="resource-title">${resource.title}</h4>
                <p class="resource-description">${resource.description}</p>
                <div class="resource-footer">
                    <span class="resource-author">Автор: ${resource.author}</span>
                    <button class="cyber-btn resource-link-btn">Открыть</button>
                </div>
            `;
            
            container.appendChild(resourceElement);
        });
    }
    
    // Function to open add resource modal
    function openAddResourceModal(techName) {
        const modal = document.getElementById('resourceSelectionModal');
        if (!modal) return;
        
        modal.innerHTML = `
            <div class="modal-content resource-modal-content">
                <span class="close-btn resource-close">&times;</span>
                <h2 class="glitch-text" data-text="Добавить ресурс">Добавить ресурс</h2>
                <p class="selected-tech">Для: ${techName}</p>
                
                <form class="add-resource-form">
                    <div class="form-group">
                        <label for="resourceTitle">Название ресурса</label>
                        <input type="text" id="resourceTitle" class="cyber-input" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="resourceUrl">URL ресурса</label>
                        <input type="url" id="resourceUrl" class="cyber-input" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="resourceType">Тип ресурса</label>
                        <select id="resourceType" class="cyber-input" required>
                            <option value="video">Видео</option>
                            <option value="article">Статья</option>
                            <option value="course">Курс</option>
                            <option value="channel">Канал</option>
                            <option value="book">Книга</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="resourceDifficulty">Уровень сложности</label>
                        <select id="resourceDifficulty" class="cyber-input" required>
                            <option value="easy">Изи</option>
                            <option value="medium">Средне</option>
                            <option value="pro">Про</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="resourceDescription">Описание</label>
                        <textarea id="resourceDescription" class="cyber-input" rows="3"></textarea>
                    </div>
                    
                    <button type="submit" class="cyber-btn">Добавить</button>
                </form>
            </div>
        `;
        
        // Add event listeners
        const closeBtn = modal.querySelector('.resource-close');
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        const form = modal.querySelector('.add-resource-form');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // In a real implementation, this would submit to a database
            alert('Ресурс добавлен на проверку!');
            modal.style.display = 'none';
        });
    }
    
    // Function to open request resource modal
    function openRequestResourceModal(techName) {
        const modal = document.getElementById('resourceSelectionModal');
        if (!modal) return;
        
        modal.innerHTML = `
            <div class="modal-content resource-modal-content">
                <span class="close-btn resource-close">&times;</span>
                <h2 class="glitch-text" data-text="Запросить ресурс">Запросить ресурс</h2>
                <p class="selected-tech">Для: ${techName}</p>
                
                <form class="request-resource-form">
                    <div class="form-group">
                        <label for="requestTitle">Название ресурса</label>
                        <input type="text" id="requestTitle" class="cyber-input" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="requestDescription">Описание</label>
                        <textarea id="requestDescription" class="cyber-input" rows="3"></textarea>
                    </div>
                    
                    <button type="submit" class="cyber-btn">Отправить запрос</button>
                </form>
            </div>
        `;
        
        // Add event listeners
        const closeBtn = modal.querySelector('.resource-close');
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        const form = modal.querySelector('.request-resource-form');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // In a real implementation, this would submit to a database
            alert('Запрос отправлен!');
            modal.style.display = 'none';
        });
    }
    
    // Helper function to generate mock resources
    function generateMockResources(techName, typeFilter = null, difficultyFilter = null) {
        const resourceTypes = ['video', 'article', 'course', 'channel', 'book'];
        const difficulties = ['easy', 'medium', 'pro'];
        
        const resources = [];
        for (let i = 0; i < 8; i++) {
            const type = resourceTypes[Math.floor(Math.random() * resourceTypes.length)];
            const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
            
            // Apply filters if specified
            if (typeFilter && typeFilter !== 'all' && type !== typeFilter) continue;
            if (difficultyFilter && difficultyFilter !== 'all' && difficulty !== difficultyFilter) continue;
            
            resources.push({
                title: `${techName} Ресурс ${i + 1}`,
                description: `Полезный ресурс для изучения ${techName}. Подходит для ${getResourceDifficultyLabel(difficulty)} уровня сложности.`,
                type: type,
                difficulty: difficulty,
                author: `Автор_${Math.floor(Math.random() * 100)}`,
                url: '#'
            });
        }
        
        return resources;
    }
    
    // Helper function to get resource type label
    function getResourceTypeLabel(type) {
        const labels = {
            'video': 'Видео',
            'article': 'Статья',
            'course': 'Курс',
            'channel': 'Канал',
            'book': 'Книга'
        };
        return labels[type] || type;
    }
    
    // Helper function to get resource difficulty label
    function getResourceDifficultyLabel(difficulty) {
        const labels = {
            'easy': 'Изи',
            'medium': 'Средне',
            'pro': 'Про'
        };
        return labels[difficulty] || difficulty;
    }
});