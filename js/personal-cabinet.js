// Personal cabinet functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get login button and join button
    const loginBtn = document.querySelector('.login-btn .cyber-btn');
    const joinBtn = document.querySelector('.pulsating-btn');
    
    // Add click event listeners
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openPersonalCabinet();
        });
    }
    
    if (joinBtn) {
        joinBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openPersonalCabinet();
        });
    }
    
    // Function to open personal cabinet modal
    function openPersonalCabinet() {
        // Create modal if it doesn't exist
        let modal = document.getElementById('personalCabinetModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'personalCabinetModal';
            modal.className = 'modal personal-cabinet-modal';
            document.body.appendChild(modal);
        }
        
        // Set modal content
        modal.innerHTML = `
            <div class="modal-content personal-cabinet-content">
                <span class="close-btn cabinet-close">&times;</span>
                <h2 class="glitch-text" data-text="Личный кабинет">Личный кабинет</h2>
                
                <div class="user-info">
                    <div class="user-avatar glitch-hover">
                        <div class="avatar-placeholder">👤</div>
                        <span class="username">CyberNinja</span>
                    </div>
                    <div class="user-stats">
                        <div class="stat-item">
                            <span class="stat-label">Уровень:</span>
                            <span class="stat-value">Новичок</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Очки опыта:</span>
                            <span class="stat-value">120</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Ресурсов добавлено:</span>
                            <span class="stat-value">5</span>
                        </div>
                    </div>
                </div>
                
                <div class="cabinet-sections">
                    <div class="section goals-section">
                        <h3 class="glitch-text" data-text="Выбор целей">Выбор целей</h3>
                        <div class="goals-container">
                            <button class="cyber-btn goal-btn" data-goal="language">Изучить язык программирования</button>
                            <button class="cyber-btn goal-btn" data-goal="website">Написать сайт</button>
                            <button class="cyber-btn goal-btn" data-goal="telegram">Создать Telegram-бота</button>
                            <button class="cyber-btn goal-btn" data-goal="oop">Освоить ООП</button>
                            <button class="cyber-btn goal-btn" data-goal="frontend">Написать фронтенд</button>
                            <button class="cyber-btn goal-btn" data-goal="design">Освоить дизайн</button>
                        </div>
                    </div>
                    
                    <div class="section categories-section">
                        <h3 class="glitch-text" data-text="Категории">Категории</h3>
                        <div class="categories-container">
                            <!-- Categories will be added dynamically based on goal selection -->
                        </div>
                    </div>
                    
                    <div class="section favorites-section">
                        <h3 class="glitch-text" data-text="Избранное">Избранное</h3>
                        <div class="favorites-container">
                            <div class="favorite-item glitch-hover">
                                <span>JavaScript для начинающих</span>
                                <button class="cyber-btn remove-fav-btn">Удалить</button>
                            </div>
                            <div class="favorite-item glitch-hover">
                                <span>React Hooks Tutorial</span>
                                <button class="cyber-btn remove-fav-btn">Удалить</button>
                            </div>
                            <div class="favorite-item glitch-hover">
                                <span>CSS Grid Layout</span>
                                <button class="cyber-btn remove-fav-btn">Удалить</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Show modal
        modal.style.display = 'block';
        
        // Add event listeners to close buttons
        const closeBtn = modal.querySelector('.cabinet-close');
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        // Add goal button event listeners
        const goalButtons = modal.querySelectorAll('.goal-btn');
        goalButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const goal = this.getAttribute('data-goal');
                showRelevantCategories(goal);
            });
        });
    }
    
    // Function to show relevant categories based on selected goal
    function showRelevantCategories(goal) {
        const categoriesContainer = document.querySelector('.categories-container');
        if (!categoriesContainer) return;
        
        let categories = [];
        switch (goal) {
            case 'language':
                categories = ['JavaScript', 'Python', 'Java', 'C#', 'TypeScript'];
                break;
            case 'website':
                categories = ['Frontend', 'Backend', 'Design', 'Database', 'Deployment'];
                break;
            case 'telegram':
                categories = ['Python', 'Telegram API', 'Bots', 'Webhooks'];
                break;
            case 'oop':
                categories = ['Java', 'C++', 'Python', 'C#', 'Design Patterns'];
                break;
            case 'frontend':
                categories = ['HTML/CSS', 'JavaScript', 'React', 'Vue.js', 'Angular'];
                break;
            case 'design':
                categories = ['Figma', 'Photoshop', 'Illustrator', 'UI/UX Principles'];
                break;
            default:
                categories = ['General', 'Advanced', 'Specialized'];
        }
        
        categoriesContainer.innerHTML = '';
        categories.forEach(category => {
            const categoryBtn = document.createElement('button');
            categoryBtn.className = 'cyber-btn category-btn glitch-hover';
            categoryBtn.textContent = category;
            categoriesContainer.appendChild(categoryBtn);
        });
    }
});