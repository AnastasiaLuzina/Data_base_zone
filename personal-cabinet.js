// Personal cabinet functionality
document.addEventListener('DOMContentLoaded', function() {
    // Utility function for fetch with credentials
    function fetchWithCredentials(url, options = {}) {
        return fetch(url, {
            ...options,
            credentials: 'same-origin' // Always include cookies
        });
    }
    
    // Get login button and join button
    const loginBtn = document.querySelector('.login-btn .cyber-btn');
    const joinBtn = document.querySelector('.pulsating-btn');
    
    // User state
    let currentUser = null;
    let isAdminUser = false;
    let userRole = null;
    let userAvatar = null;
    
    // Check if user is logged in
    checkUserSession();
    
    // Add click event listeners
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (currentUser) {
                openPersonalCabinet();
            } else {
                openLoginModal();
            }
        });
    }
    
    if (joinBtn) {
        joinBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (currentUser) {
                openPersonalCabinet();
            } else {
                openLoginModal();
            }
        });
    }
    
    // Load top rated users
    loadTopRatedUsers();
    
    // Function to check user session
    function checkUserSession() {
        console.log('Checking user session...');
        fetchWithCredentials('api/check_session.php')
            .then(response => {
                console.log('Session check response:', response);
                return response.json();
            })
            .then(data => {
                console.log('Session data:', data);
                if (data.status === 'success' && data.logged_in) {
                    currentUser = data.username;
                    isAdminUser = data.is_admin;
                    userRole = data.role || 'student';
                    userAvatar = data.avatar;
                    console.log('User logged in:', currentUser, 'Is admin:', isAdminUser, 'Role:', userRole);
                    
                    // Update login button text
                    if (loginBtn) {
                        loginBtn.textContent = currentUser;
                    }
                    
                    // If admin, add admin panel link
                    if (isAdminUser && loginBtn) {
                        const adminLink = document.createElement('a');
                        adminLink.href = '#';
                        adminLink.className = 'cyber-btn admin-btn';
                        adminLink.textContent = 'Админ панель';
                        adminLink.addEventListener('click', function(e) {
                            e.preventDefault();
                            openAdminPanel();
                        });
                        
                        loginBtn.parentNode.appendChild(adminLink);
                    }
                } else {
                    console.log('User not logged in');
                }
            })
            .catch(error => console.error('Error checking session:', error));
    }
    
    // Function to load top rated users
    function loadTopRatedUsers() {
        // Load top students
        fetchWithCredentials('api/top_users.php?role=student&limit=5')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    displayTopUsers(data.data, 'student');
                }
            })
            .catch(error => console.error('Error loading top students:', error));
        
        // Load top teachers
        fetchWithCredentials('api/top_users.php?role=teacher&limit=5')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    displayTopUsers(data.data, 'teacher');
                }
            })
            .catch(error => console.error('Error loading top teachers:', error));
    }
    
    // Function to display top users
    function displayTopUsers(users, role) {
        // Check if the sidebar exists, if not create it
        let sidebar = document.querySelector('.sidebar');
        if (!sidebar) {
            sidebar = document.createElement('div');
            sidebar.className = 'sidebar';
            document.body.appendChild(sidebar);
            
            // Create sections for students and teachers
            const studentsSection = document.createElement('div');
            studentsSection.className = 'sidebar-section students-section';
            studentsSection.innerHTML = `
                <h3 class="glitch-text" data-text="Топ студентов">Топ студентов</h3>
                <div class="users-list students-list"></div>
            `;
            sidebar.appendChild(studentsSection);
            
            const teachersSection = document.createElement('div');
            teachersSection.className = 'sidebar-section teachers-section';
            teachersSection.innerHTML = `
                <h3 class="glitch-text" data-text="Топ преподавателей">Топ преподавателей</h3>
                <div class="users-list teachers-list"></div>
            `;
            sidebar.appendChild(teachersSection);
        }
        
        // Get the appropriate list
        const listSelector = role === 'student' ? '.students-list' : '.teachers-list';
        const usersList = sidebar.querySelector(listSelector);
        
        // Clear the list
        usersList.innerHTML = '';
        
        // Add users to the list
        users.forEach(user => {
            const userItem = document.createElement('div');
            userItem.className = 'user-item glitch-hover';
            
            // Create avatar element
            const avatarElement = document.createElement('div');
            avatarElement.className = 'user-avatar';
            
            if (user.avatar) {
                avatarElement.innerHTML = `<img src="${user.avatar}" alt="${user.username}">`;
            } else {
                avatarElement.innerHTML = `<div class="avatar-placeholder">👤</div>`;
            }
            
            // Create user info element
            const userInfo = document.createElement('div');
            userInfo.className = 'user-info';
            userInfo.innerHTML = `
                <span class="username">${user.username}</span>
                <span class="rating">${user.rating} очков</span>
            `;
            
            // Add elements to user item
            userItem.appendChild(avatarElement);
            userItem.appendChild(userInfo);
            
            // Add user item to list
            usersList.appendChild(userItem);
        });
    }
    
    // Function to open login modal
    function openLoginModal() {
        // Create modal if it doesn't exist
        let modal = document.getElementById('loginModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'loginModal';
            modal.className = 'modal login-modal';
            document.body.appendChild(modal);
        }
        
        // Set modal content
        modal.innerHTML = `
            <div class="modal-content login-content">
                <span class="close-btn login-close">&times;</span>
                <h2 class="glitch-text" data-text="Вход в систему">Вход в систему</h2>
                
                <div class="login-tabs">
                    <button class="tab-btn active" data-tab="login">Вход</button>
                    <button class="tab-btn" data-tab="register">Регистрация</button>
                </div>
                
                <div class="tab-content" id="login-tab">
                    <form id="login-form">
                        <div class="form-group">
                            <label for="login-username">Логин:</label>
                            <input type="text" id="login-username" name="username" class="cyber-input" required>
                        </div>
                        <div class="form-group">
                            <label for="login-password">Пароль:</label>
                            <input type="password" id="login-password" name="password" class="cyber-input" required>
                        </div>
                        <div class="form-error" id="login-error"></div>
                        <button type="submit" class="cyber-btn submit-btn">Войти</button>
                    </form>
                </div>
                
                <div class="tab-content" id="register-tab" style="display: none;">
                    <form id="register-form">
                        <div class="form-group">
                            <label for="register-username">Логин:</label>
                            <input type="text" id="register-username" name="username" class="cyber-input" required>
                        </div>
                        <div class="form-group">
                            <label for="register-password">Пароль:</label>
                            <input type="password" id="register-password" name="password" class="cyber-input" required>
                        </div>
                        <div class="form-group">
                            <label for="register-email">Email (необязательно):</label>
                            <input type="email" id="register-email" name="email" class="cyber-input">
                        </div>
                        <div class="form-group">
                            <label for="register-role">Роль:</label>
                            <select id="register-role" name="role" class="cyber-input">
                                <option value="student">Студент</option>
                                <option value="teacher">Преподаватель</option>
                            </select>
                        </div>
                        <div class="form-error" id="register-error"></div>
                        <button type="submit" class="cyber-btn submit-btn">Зарегистрироваться</button>
                    </form>
                </div>
            </div>
        `;
        
        // Show modal
        modal.style.display = 'block';
        
        // Add event listeners to close buttons
        const closeBtn = modal.querySelector('.login-close');
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        // Tab switching
        const tabBtns = modal.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                tabBtns.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Hide all tab contents
                const tabContents = modal.querySelectorAll('.tab-content');
                tabContents.forEach(content => content.style.display = 'none');
                
                // Show selected tab content
                const tabId = this.getAttribute('data-tab') + '-tab';
                document.getElementById(tabId).style.display = 'block';
            });
        });
        
        // Login form submission
        const loginForm = document.getElementById('login-form');
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;
            
            console.log('Attempting login for user:', username);
            
            fetchWithCredentials('api/login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            })
            .then(response => {
                console.log('Login response:', response);
                return response.json();
            })
            .then(data => {
                console.log('Login data:', data);
                if (data.status === 'success') {
                    // Update current user
                    currentUser = username;
                    isAdminUser = data.is_admin;
                    userRole = data.user?.role || 'student';
                    userAvatar = data.user?.avatar;
                    console.log('Login successful. User:', currentUser, 'Is admin:', isAdminUser, 'Role:', userRole);
                    
                    // Update login button text
                    if (loginBtn) {
                        loginBtn.textContent = currentUser;
                    }
                    
                    // Close modal
                    modal.style.display = 'none';
                    
                    // If admin, add admin panel link
                    if (isAdminUser && loginBtn) {
                        const adminLink = document.createElement('a');
                        adminLink.href = '#';
                        adminLink.className = 'cyber-btn admin-btn';
                        adminLink.textContent = 'Админ панель';
                        adminLink.addEventListener('click', function(e) {
                            e.preventDefault();
                            openAdminPanel();
                        });
                        
                        loginBtn.parentNode.appendChild(adminLink);
                    }
                    
                    // Open personal cabinet
                    openPersonalCabinet();
                } else {
                    // Show error
                    console.error('Login failed:', data.message);
                    document.getElementById('login-error').textContent = data.message;
                }
            })
            .catch(error => {
                console.error('Error logging in:', error);
                document.getElementById('login-error').textContent = 'Произошла ошибка при входе';
            });
        });
        
        // Register form submission
        const registerForm = document.getElementById('register-form');
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('register-username').value;
            const password = document.getElementById('register-password').value;
            const email = document.getElementById('register-email').value;
            const role = document.getElementById('register-role').value;
            
            fetchWithCredentials('api/register.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password, email, role })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    // Show success message
                    document.getElementById('register-error').textContent = '';
                    document.getElementById('register-form').innerHTML = `
                        <div class="success-message">
                            Регистрация успешна! Теперь вы можете войти в систему.
                        </div>
                    `;
                    
                    // Switch to login tab after 2 seconds
                    setTimeout(() => {
                        tabBtns[0].click();
                    }, 2000);
                } else {
                    // Show error
                    document.getElementById('register-error').textContent = data.message;
                }
            })
            .catch(error => {
                console.error('Error registering:', error);
                document.getElementById('register-error').textContent = 'Произошла ошибка при регистрации';
            });
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
                    <div class="user-avatar-container">
                        <div class="user-avatar glitch-hover">
                            ${userAvatar ? 
                                `<img src="${userAvatar}" alt="${currentUser}" class="avatar-image">` : 
                                `<div class="avatar-placeholder">👤</div>`
                            }
                        </div>
                        <button id="change-avatar-btn" class="cyber-btn small-btn">Изменить аватар</button>
                    </div>
                    <div class="user-stats">
                        <div class="stat-item">
                            <span class="stat-label">Пользователь:</span>
                            <span class="stat-value">${currentUser || 'CyberNinja'}</span>
                            <button class="cyber-btn small-btn edit-btn" data-field="username">Изменить</button>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Роль:</span>
                            <span class="stat-value">${userRole === 'teacher' ? 'Преподаватель' : 'Студент'}</span>
                            <button class="cyber-btn small-btn edit-btn" data-field="role">Изменить</button>
                        </div>
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
                
                <div class="profile-actions">
                    <button id="change-password-btn" class="cyber-btn">Изменить пароль</button>
                    <button id="change-email-btn" class="cyber-btn">Изменить email</button>
                    <button id="logout-btn" class="cyber-btn danger-btn">Выйти</button>
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
                    
                    <div class="section add-resource-section">
                        <button id="add-resource-btn" class="cyber-btn add-resource-btn">Добавить свой ресурс</button>
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
        
        // Add resource button event listener
        const addResourceBtn = modal.querySelector('#add-resource-btn');
        if (addResourceBtn) {
            addResourceBtn.addEventListener('click', function() {
                openAddResourceModal();
            });
        }
        
        // Add change avatar button event listener
        const changeAvatarBtn = modal.querySelector('#change-avatar-btn');
        if (changeAvatarBtn) {
            changeAvatarBtn.addEventListener('click', function() {
                openChangeAvatarModal();
            });
        }
        
        // Add change password button event listener
        const changePasswordBtn = modal.querySelector('#change-password-btn');
        if (changePasswordBtn) {
            changePasswordBtn.addEventListener('click', function() {
                openChangePasswordModal();
            });
        }
        
        // Add change email button event listener
        const changeEmailBtn = modal.querySelector('#change-email-btn');
        if (changeEmailBtn) {
            changeEmailBtn.addEventListener('click', function() {
                openChangeEmailModal();
            });
        }
        
        // Add logout button event listener
        const logoutBtn = modal.querySelector('#logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function() {
                logoutUser();
            });
        }
        
        // Add edit buttons event listeners
        const editButtons = modal.querySelectorAll('.edit-btn');
        editButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const field = this.getAttribute('data-field');
                if (field === 'username') {
                    openChangeUsernameModal();
                } else if (field === 'role') {
                    openChangeRoleModal();
                }
            });
        });
    }
    
    // Function to logout user
    function logoutUser() {
        fetchWithCredentials('api/logout.php')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    // Reset user state
                    currentUser = null;
                    isAdminUser = false;
                    userRole = null;
                    userAvatar = null;
                    
                    // Update login button text
                    if (loginBtn) {
                        loginBtn.textContent = 'Войти';
                    }
                    
                    // Remove admin panel link if exists
                    const adminLink = document.querySelector('.admin-btn');
                    if (adminLink) {
                        adminLink.parentNode.removeChild(adminLink);
                    }
                    
                    // Close personal cabinet modal
                    const modal = document.getElementById('personalCabinetModal');
                    if (modal) {
                        modal.style.display = 'none';
                    }
                    
                    // Show login modal
                    openLoginModal();
                }
            })
            .catch(error => console.error('Error logging out:', error));
    }
    
    // Function to open change avatar modal
    function openChangeAvatarModal() {
        // Create modal if it doesn't exist
        let modal = document.getElementById('changeAvatarModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'changeAvatarModal';
            modal.className = 'modal change-avatar-modal';
            document.body.appendChild(modal);
        }
        
        // Set modal content
        modal.innerHTML = `
            <div class="modal-content change-avatar-content">
                <span class="close-btn avatar-close">&times;</span>
                <h2 class="glitch-text" data-text="Изменить аватар">Изменить аватар</h2>
                
                <form id="avatar-form" enctype="multipart/form-data">
                    <div class="form-group">
                        <label for="avatar-file">Выберите изображение:</label>
                        <input type="file" id="avatar-file" name="avatar" class="cyber-input" accept="image/*" required>
                    </div>
                    <div class="avatar-preview">
                        <img id="avatar-preview-img" src="#" alt="Preview" style="display: none; max-width: 100%; max-height: 200px;">
                    </div>
                    <div class="form-error" id="avatar-error"></div>
                    <button type="submit" class="cyber-btn submit-btn">Загрузить</button>
                </form>
            </div>
        `;
        
        // Show modal
        modal.style.display = 'block';
        
        // Add event listeners to close buttons
        const closeBtn = modal.querySelector('.avatar-close');
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        // Add file input change event listener for preview
        const fileInput = document.getElementById('avatar-file');
        const previewImg = document.getElementById('avatar-preview-img');
        
        fileInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    previewImg.src = e.target.result;
                    previewImg.style.display = 'block';
                };
                
                reader.readAsDataURL(this.files[0]);
            }
        });
        
        // Add form submit event listener
        const avatarForm = document.getElementById('avatar-form');
        avatarForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData();
            formData.append('avatar', fileInput.files[0]);
            
            fetch('api/upload_avatar.php', {
                method: 'POST',
                credentials: 'same-origin',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    // Update user avatar
                    userAvatar = data.avatar_url;
                    
                    // Close modal
                    modal.style.display = 'none';
                    
                    // Reopen personal cabinet to refresh avatar
                    openPersonalCabinet();
                    
                    // Refresh top rated users
                    loadTopRatedUsers();
                } else {
                    // Show error
                    document.getElementById('avatar-error').textContent = data.message;
                }
            })
            .catch(error => {
                console.error('Error uploading avatar:', error);
                document.getElementById('avatar-error').textContent = 'Произошла ошибка при загрузке аватара';
            });
        });
    }
    
    // Function to open change password modal
    function openChangePasswordModal() {
        // Create modal if it doesn't exist
        let modal = document.getElementById('changePasswordModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'changePasswordModal';
            modal.className = 'modal change-password-modal';
            document.body.appendChild(modal);
        }
        
        // Set modal content
        modal.innerHTML = `
            <div class="modal-content change-password-content">
                <span class="close-btn password-close">&times;</span>
                <h2 class="glitch-text" data-text="Изменить пароль">Изменить пароль</h2>
                
                <form id="password-form">
                    <div class="form-group">
                        <label for="current-password">Текущий пароль:</label>
                        <input type="password" id="current-password" name="current_password" class="cyber-input" required>
                    </div>
                    <div class="form-group">
                        <label for="new-password">Новый пароль:</label>
                        <input type="password" id="new-password" name="new_password" class="cyber-input" required>
                    </div>
                    <div class="form-group">
                        <label for="confirm-password">Подтвердите пароль:</label>
                        <input type="password" id="confirm-password" name="confirm_password" class="cyber-input" required>
                    </div>
                    <div class="form-error" id="password-error"></div>
                    <button type="submit" class="cyber-btn submit-btn">Изменить</button>
                </form>
            </div>
        `;
        
        // Show modal
        modal.style.display = 'block';
        
        // Add event listeners to close buttons
        const closeBtn = modal.querySelector('.password-close');
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        // Add form submit event listener
        const passwordForm = document.getElementById('password-form');
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            // Validate passwords
            if (newPassword !== confirmPassword) {
                document.getElementById('password-error').textContent = 'Пароли не совпадают';
                return;
            }
            
            if (newPassword.length < 6) {
                document.getElementById('password-error').textContent = 'Новый пароль должен быть не менее 6 символов';
                return;
            }
            
            fetchWithCredentials('api/update_password.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    current_password: currentPassword,
                    new_password: newPassword
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    // Show success message
                    document.getElementById('password-error').textContent = '';
                    document.getElementById('password-form').innerHTML = `
                        <div class="success-message">
                            Пароль успешно изменен!
                        </div>
                    `;
                    
                    // Close modal after 2 seconds
                    setTimeout(() => {
                        modal.style.display = 'none';
                    }, 2000);
                } else {
                    // Show error
                    document.getElementById('password-error').textContent = data.message;
                }
            })
            .catch(error => {
                console.error('Error changing password:', error);
                document.getElementById('password-error').textContent = 'Произошла ошибка при изменении пароля';
            });
        });
    }
    
    // Function to open change email modal
    function openChangeEmailModal() {
        // Create modal if it doesn't exist
        let modal = document.getElementById('changeEmailModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'changeEmailModal';
            modal.className = 'modal change-email-modal';
            document.body.appendChild(modal);
        }
        
        // Set modal content
        modal.innerHTML = `
            <div class="modal-content change-email-content">
                <span class="close-btn email-close">&times;</span>
                <h2 class="glitch-text" data-text="Изменить email">Изменить email</h2>
                
                <form id="email-form">
                    <div class="form-group">
                        <label for="new-email">Новый email:</label>
                        <input type="email" id="new-email" name="email" class="cyber-input" required>
                    </div>
                    <div class="form-error" id="email-error"></div>
                    <button type="submit" class="cyber-btn submit-btn">Изменить</button>
                </form>
            </div>
        `;
        
        // Show modal
        modal.style.display = 'block';
        
        // Add event listeners to close buttons
        const closeBtn = modal.querySelector('.email-close');
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        // Add form submit event listener
        const emailForm = document.getElementById('email-form');
        emailForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('new-email').value;
            
            fetchWithCredentials('api/update_profile.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    // Show success message
                    document.getElementById('email-error').textContent = '';
                    document.getElementById('email-form').innerHTML = `
                        <div class="success-message">
                            Email успешно изменен!
                        </div>
                    `;
                    
                    // Close modal after 2 seconds
                    setTimeout(() => {
                        modal.style.display = 'none';
                    }, 2000);
                } else {
                    // Show error
                    document.getElementById('email-error').textContent = data.message;
                }
            })
            .catch(error => {
                console.error('Error changing email:', error);
                document.getElementById('email-error').textContent = 'Произошла ошибка при изменении email';
            });
        });
    }
    
    // Function to open change username modal
    function openChangeUsernameModal() {
        // Create modal if it doesn't exist
        let modal = document.getElementById('changeUsernameModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'changeUsernameModal';
            modal.className = 'modal change-username-modal';
            document.body.appendChild(modal);
        }
        
        // Set modal content
        modal.innerHTML = `
            <div class="modal-content change-username-content">
                <span class="close-btn username-close">&times;</span>
                <h2 class="glitch-text" data-text="Изменить логин">Изменить логин</h2>
                
                <form id="username-form">
                    <div class="form-group">
                        <label for="new-username">Новый логин:</label>
                        <input type="text" id="new-username" name="username" class="cyber-input" required>
                    </div>
                    <div class="form-error" id="username-error"></div>
                    <button type="submit" class="cyber-btn submit-btn">Изменить</button>
                </form>
            </div>
        `;
        
        // Show modal
        modal.style.display = 'block';
        
        // Add event listeners to close buttons
        const closeBtn = modal.querySelector('.username-close');
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        // Add form submit event listener
        const usernameForm = document.getElementById('username-form');
        usernameForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('new-username').value;
            
            fetchWithCredentials('api/update_profile.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    // Update current user
                    currentUser = username;
                    
                    // Update login button text
                    if (loginBtn) {
                        loginBtn.textContent = currentUser;
                    }
                    
                    // Show success message
                    document.getElementById('username-error').textContent = '';
                    document.getElementById('username-form').innerHTML = `
                        <div class="success-message">
                            Логин успешно изменен!
                        </div>
                    `;
                    
                    // Close modal after 2 seconds
                    setTimeout(() => {
                        modal.style.display = 'none';
                        
                        // Reopen personal cabinet to refresh username
                        openPersonalCabinet();
                    }, 2000);
                } else {
                    // Show error
                    document.getElementById('username-error').textContent = data.message;
                }
            })
            .catch(error => {
                console.error('Error changing username:', error);
                document.getElementById('username-error').textContent = 'Произошла ошибка при изменении логина';
            });
        });
    }
    
    // Function to open change role modal
    function openChangeRoleModal() {
        // Create modal if it doesn't exist
        let modal = document.getElementById('changeRoleModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'changeRoleModal';
            modal.className = 'modal change-role-modal';
            document.body.appendChild(modal);
        }
        
        // Set modal content
        modal.innerHTML = `
            <div class="modal-content change-role-content">
                <span class="close-btn role-close">&times;</span>
                <h2 class="glitch-text" data-text="Изменить роль">Изменить роль</h2>
                
                <form id="role-form">
                    <div class="form-group">
                        <label for="new-role">Выберите роль:</label>
                        <select id="new-role" name="role" class="cyber-input">
                            <option value="student" ${userRole === 'student' ? 'selected' : ''}>Студент</option>
                            <option value="teacher" ${userRole === 'teacher' ? 'selected' : ''}>Преподаватель</option>
                        </select>
                    </div>
                    <div class="form-error" id="role-error"></div>
                    <button type="submit" class="cyber-btn submit-btn">Изменить</button>
                </form>
            </div>
        `;
        
        // Show modal
        modal.style.display = 'block';
        
        // Add event listeners to close buttons
        const closeBtn = modal.querySelector('.role-close');
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        // Add form submit event listener
        const roleForm = document.getElementById('role-form');
        roleForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const role = document.getElementById('new-role').value;
            
            fetchWithCredentials('api/update_profile.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ role })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    // Update user role
                    userRole = role;
                    
                    // Show success message
                    document.getElementById('role-error').textContent = '';
                    document.getElementById('role-form').innerHTML = `
                        <div class="success-message">
                            Роль успешно изменена!
                        </div>
                    `;
                    
                    // Close modal after 2 seconds
                    setTimeout(() => {
                        modal.style.display = 'none';
                        
                        // Reopen personal cabinet to refresh role
                        openPersonalCabinet();
                        
                        // Refresh top rated users
                        loadTopRatedUsers();
                    }, 2000);
                } else {
                    // Show error
                    document.getElementById('role-error').textContent = data.message;
                }
            })
            .catch(error => {
                console.error('Error changing role:', error);
                document.getElementById('role-error').textContent = 'Произошла ошибка при изменении роли';
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
    
    // Function to open add resource modal
    function openAddResourceModal() {
        // Check if user is logged in
        if (!currentUser) {
            alert('Пожалуйста, войдите в систему, чтобы добавить ресурс');
            return;
        }
        
        // Create modal if it doesn't exist
        let modal = document.getElementById('addResourceModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'addResourceModal';
            modal.className = 'modal add-resource-modal';
            document.body.appendChild(modal);
        }
        
        // Set modal content
        modal.innerHTML = `
            <div class="modal-content add-resource-content">
                <span class="close-btn resource-close">&times;</span>
                <h2 class="glitch-text" data-text="Добавить ресурс">Добавить ресурс</h2>
                
                <form id="add-resource-form">
                    <div class="form-group">
                        <label for="resource-title">Название ресурса:</label>
                        <input type="text" id="resource-title" name="title" class="cyber-input" required>
                    </div>
                    <div class="form-group">
                        <label for="resource-link">Ссылка:</label>
                        <input type="url" id="resource-link" name="link" class="cyber-input" required>
                    </div>
                    <div class="form-group">
                        <label for="resource-category">Категория:</label>
                        <select id="resource-category" name="category_id" class="cyber-input" required>
                            <option value="">Выберите категорию</option>
                            <!-- Categories will be loaded dynamically -->
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="resource-type">Тип ресурса:</label>
                        <select id="resource-type" name="resource_type" class="cyber-input" required>
                            <option value="">Выберите тип</option>
                            <option value="course">Курс</option>
                            <option value="video">Видео</option>
                            <option value="article">Статья</option>
                            <option value="book">Книга</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="resource-difficulty">Уровень сложности:</label>
                        <select id="resource-difficulty" name="difficulty_level" class="cyber-input" required>
                            <option value="">Выберите уровень</option>
                            <option value="easy">Легкий</option>
                            <option value="medium">Средний</option>
                            <option value="pro">Продвинутый</option>
                        </select>
                    </div>
                    <div class="form-error" id="resource-error"></div>
                    <button type="submit" class="cyber-btn submit-btn">Отправить</button>
                </form>
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
        
        // Load categories
        loadCategories();
        
        // Add resource form submission
        const addResourceForm = document.getElementById('add-resource-form');
        addResourceForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = document.getElementById('resource-title').value;
            const link = document.getElementById('resource-link').value;
            const category_id = document.getElementById('resource-category').value;
            const resource_type = document.getElementById('resource-type').value;
            const difficulty_level = document.getElementById('resource-difficulty').value;
            
            fetchWithCredentials('api/resources.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    link,
                    category_id,
                    resource_type,
                    difficulty_level
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    // Show success message
                    document.getElementById('resource-error').textContent = '';
                    document.getElementById('add-resource-form').innerHTML = `
                        <div class="success-message">
                            Ресурс отправлен на проверку. Спасибо за вклад!
                        </div>
                    `;
                    
                    // Close modal after 3 seconds
                    setTimeout(() => {
                        modal.style.display = 'none';
                    }, 3000);
                } else {
                    // Show error
                    document.getElementById('resource-error').textContent = data.message;
                }
            })
            .catch(error => {
                console.error('Error adding resource:', error);
                document.getElementById('resource-error').textContent = 'Произошла ошибка при добавлении ресурса';
            });
        });
    }
    
    // Function to load categories
    function loadCategories() {
        fetchWithCredentials('api/categories.php')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    const categorySelect = document.getElementById('resource-category');
                    if (categorySelect) {
                        // Clear existing options except the first one
                        while (categorySelect.options.length > 1) {
                            categorySelect.remove(1);
                        }
                        
                        // Add new options
                        data.data.forEach(category => {
                            const option = document.createElement('option');
                            option.value = category.id;
                            option.textContent = category.name;
                            categorySelect.appendChild(option);
                        });
                    }
                }
            })
            .catch(error => console.error('Error loading categories:', error));
    }
    
    // Function to open admin panel
    function openAdminPanel() {
        // Check if user is admin
        if (!isAdminUser) {
            alert('У вас нет доступа к админ панели');
            return;
        }
        
        // Create modal if it doesn't exist
        let modal = document.getElementById('adminPanelModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'adminPanelModal';
            modal.className = 'modal admin-panel-modal';
            document.body.appendChild(modal);
        }
        
        // Set modal content
        modal.innerHTML = `
            <div class="modal-content admin-panel-content">
                <span class="close-btn admin-close">&times;</span>
                <h2 class="glitch-text" data-text="Админ панель">Админ панель</h2>
                
                <div class="admin-tabs">
                    <button class="admin-tab-btn active" data-tab="categories">Категории</button>
                    <button class="admin-tab-btn" data-tab="resources">Ресурсы</button>
                    <button class="admin-tab-btn" data-tab="pending">Ресурсы на проверку</button>
                    <button class="admin-tab-btn" data-tab="telegram">Telegram Бот</button>
                </div>
                
                <div class="admin-tab-content" id="categories-tab">
                    <h3>Управление категориями</h3>
                    
                    <form id="add-category-form" class="admin-form">
                        <div class="form-group">
                            <label for="category-name">Название категории:</label>
                            <input type="text" id="category-name" name="name" class="cyber-input" required>
                        </div>
                        <div class="form-group">
                            <label for="category-description">Описание (необязательно):</label>
                            <textarea id="category-description" name="description" class="cyber-input"></textarea>
                        </div>
                        <button type="submit" class="cyber-btn submit-btn">Добавить категорию</button>
                    </form>
                    
                    <div class="category-list">
                        <h4>Существующие категории</h4>
                        <div id="categories-container" class="admin-list-container">
                            <!-- Categories will be loaded dynamically -->
                            <div class="loading">Загрузка категорий...</div>
                        </div>
                    </div>
                </div>
                
                <div class="admin-tab-content" id="resources-tab" style="display: none;">
                    <h3>Управление ресурсами</h3>
                    
                    <form id="add-admin-resource-form" class="admin-form">
                        <div class="form-group">
                            <label for="admin-resource-title">Название ресурса:</label>
                            <input type="text" id="admin-resource-title" name="title" class="cyber-input" required>
                        </div>
                        <div class="form-group">
                            <label for="admin-resource-link">Ссылка:</label>
                            <input type="url" id="admin-resource-link" name="link" class="cyber-input" required>
                        </div>
                        <div class="form-group">
                            <label for="admin-resource-category">Категория:</label>
                            <select id="admin-resource-category" name="category_id" class="cyber-input" required>
                                <option value="">Выберите категорию</option>
                                <!-- Categories will be loaded dynamically -->
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="admin-resource-type">Тип ресурса:</label>
                            <select id="admin-resource-type" name="resource_type" class="cyber-input" required>
                                <option value="">Выберите тип</option>
                                <option value="course">Курс</option>
                                <option value="video">Видео</option>
                                <option value="article">Статья</option>
                                <option value="book">Книга</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="admin-resource-difficulty">Уровень сложности:</label>
                            <select id="admin-resource-difficulty" name="difficulty_level" class="cyber-input" required>
                                <option value="">Выберите уровень</option>
                                <option value="easy">Легкий</option>
                                <option value="medium">Средний</option>
                                <option value="pro">Продвинутый</option>
                            </select>
                        </div>
                        <button type="submit" class="cyber-btn submit-btn">Добавить ресурс</button>
                    </form>
                    
                    <div class="resource-list">
                        <h4>Существующие ресурсы</h4>
                        <div id="resources-container" class="admin-list-container">
                            <!-- Resources will be loaded dynamically -->
                            <div class="loading">Загрузка ресурсов...</div>
                        </div>
                    </div>
                </div>
                
                <div class="admin-tab-content" id="pending-tab" style="display: none;">
                    <h3>Ресурсы на проверку</h3>
                    
                    <div id="pending-resources-container" class="admin-list-container">
                        <!-- Pending resources will be loaded dynamically -->
                        <div class="loading">Загрузка ресурсов на проверку...</div>
                    </div>
                </div>
                
                <div class="admin-tab-content" id="telegram-tab" style="display: none;">
                    <h3>Настройка Telegram Бота</h3>
                    
                    <div class="telegram-bot-info">
                        <p>Telegram бот позволяет пользователям добавлять ресурсы и категории через мессенджер Telegram.</p>
                        <p>Токен бота: <code>8092413671:AAG_tkBYpkd8GKDeXGEA8Fvl7qgDxcAHqL8</code></p>
                        
                        <div class="telegram-setup-actions">
                            <a href="telegram_setup.php" target="_blank" class="cyber-btn">Настроить Webhook</a>
                            <button id="telegram-test-btn" class="cyber-btn">Проверить соединение</button>
                        </div>
                        
                        <div class="telegram-instructions">
                            <h4>Инструкции по использованию:</h4>
                            <ol>
                                <li>Найдите бота в Telegram по токену или ссылке</li>
                                <li>Отправьте команду /start для начала работы</li>
                                <li>Используйте команду /add для добавления ресурса</li>
                                <li>Используйте команду /category для добавления категории</li>
                                <li>Используйте команду /setadmin чтобы получать уведомления о новых ресурсах</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Show modal
        modal.style.display = 'block';
        
        // Add event listeners to close buttons
        const closeBtn = modal.querySelector('.admin-close');
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        // Tab switching
        const tabBtns = modal.querySelectorAll('.admin-tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                tabBtns.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Hide all tab contents
                const tabContents = modal.querySelectorAll('.admin-tab-content');
                tabContents.forEach(content => content.style.display = 'none');
                
                // Show selected tab content
                const tabId = this.getAttribute('data-tab') + '-tab';
                document.getElementById(tabId).style.display = 'block';
                
                // Load data for the selected tab
                if (this.getAttribute('data-tab') === 'categories') {
                    loadAdminCategories();
                } else if (this.getAttribute('data-tab') === 'resources') {
                    loadAdminCategories();
                    loadAdminResources();
                } else if (this.getAttribute('data-tab') === 'pending') {
                    loadPendingResources();
                } else if (this.getAttribute('data-tab') === 'telegram') {
                    // Nothing to load for Telegram tab
                }
            });
        });
        
        // Load initial data
        loadAdminCategories();
        
        // Add category form submission
        const addCategoryForm = document.getElementById('add-category-form');
        addCategoryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('category-name').value;
            const description = document.getElementById('category-description').value;
            
            fetchWithCredentials('api/categories.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, description })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    // Clear form
                    document.getElementById('category-name').value = '';
                    document.getElementById('category-description').value = '';
                    
                    // Reload categories
                    loadAdminCategories();
                    
                    // Show success message
                    alert('Категория успешно добавлена');
                } else {
                    // Show error
                    alert('Ошибка: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error adding category:', error);
                alert('Произошла ошибка при добавлении категории');
            });
        });
        
        // Add resource form submission
        const addAdminResourceForm = document.getElementById('add-admin-resource-form');
        addAdminResourceForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = document.getElementById('admin-resource-title').value;
            const link = document.getElementById('admin-resource-link').value;
            const category_id = document.getElementById('admin-resource-category').value;
            const resource_type = document.getElementById('admin-resource-type').value;
            const difficulty_level = document.getElementById('admin-resource-difficulty').value;
            
            fetchWithCredentials('api/resources.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    link,
                    category_id,
                    resource_type,
                    difficulty_level
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    // Clear form
                    document.getElementById('admin-resource-title').value = '';
                    document.getElementById('admin-resource-link').value = '';
                    document.getElementById('admin-resource-category').value = '';
                    document.getElementById('admin-resource-type').value = '';
                    document.getElementById('admin-resource-difficulty').value = '';
                    
                    // Reload resources
                    loadAdminResources();
                    
                    // Show success message
                    alert('Ресурс успешно добавлен');
                } else {
                    // Show error
                    alert('Ошибка: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error adding resource:', error);
                alert('Произошла ошибка при добавлении ресурса');
            });
        });
    }
    
    // Function to load categories for admin panel
    function loadAdminCategories() {
        fetchWithCredentials('api/categories.php')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    // Update categories container
                    const categoriesContainer = document.getElementById('categories-container');
                    if (categoriesContainer) {
                        if (data.data.length === 0) {
                            categoriesContainer.innerHTML = '<div class="empty-message">Нет категорий</div>';
                        } else {
                            let html = '';
                            data.data.forEach(category => {
                                html += `
                                    <div class="admin-list-item">
                                        <div class="item-info">
                                            <h5>${category.name}</h5>
                                            <p>${category.description || 'Нет описания'}</p>
                                        </div>
                                        <div class="item-actions">
                                            <button class="cyber-btn delete-btn" data-id="${category.id}" data-type="category">Удалить</button>
                                        </div>
                                    </div>
                                `;
                            });
                            categoriesContainer.innerHTML = html;
                            
                            // Add delete button event listeners
                            const deleteButtons = categoriesContainer.querySelectorAll('.delete-btn');
                            deleteButtons.forEach(btn => {
                                btn.addEventListener('click', function() {
                                    const id = this.getAttribute('data-id');
                                    if (confirm('Вы уверены, что хотите удалить эту категорию?')) {
                                        deleteCategory(id);
                                    }
                                });
                            });
                        }
                    }
                    
                    // Update category selects
                    const categorySelects = [
                        document.getElementById('admin-resource-category'),
                        document.getElementById('resource-category')
                    ];
                    
                    categorySelects.forEach(select => {
                        if (select) {
                            // Clear existing options except the first one
                            while (select.options.length > 1) {
                                select.remove(1);
                            }
                            
                            // Add new options
                            data.data.forEach(category => {
                                const option = document.createElement('option');
                                option.value = category.id;
                                option.textContent = category.name;
                                select.appendChild(option);
                            });
                        }
                    });
                }
            })
            .catch(error => console.error('Error loading categories:', error));
    }
    
    // Function to load resources for admin panel
    function loadAdminResources() {
        fetchWithCredentials('api/resources.php?status=approved')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    const resourcesContainer = document.getElementById('resources-container');
                    if (resourcesContainer) {
                        if (data.data.length === 0) {
                            resourcesContainer.innerHTML = '<div class="empty-message">Нет ресурсов</div>';
                        } else {
                            let html = '';
                            data.data.forEach(resource => {
                                html += `
                                    <div class="admin-list-item">
                                        <div class="item-info">
                                            <h5>${resource.title}</h5>
                                            <p><strong>Ссылка:</strong> <a href="${resource.link}" target="_blank">${resource.link}</a></p>
                                            <p><strong>Категория:</strong> ${resource.category_name}</p>
                                            <p><strong>Тип:</strong> ${getResourceTypeText(resource.resource_type)}</p>
                                            <p><strong>Сложность:</strong> ${getDifficultyLevelText(resource.difficulty_level)}</p>
                                        </div>
                                        <div class="item-actions">
                                            <button class="cyber-btn delete-btn" data-id="${resource.id}" data-type="resource">Удалить</button>
                                        </div>
                                    </div>
                                `;
                            });
                            resourcesContainer.innerHTML = html;
                            
                            // Add delete button event listeners
                            const deleteButtons = resourcesContainer.querySelectorAll('.delete-btn');
                            deleteButtons.forEach(btn => {
                                btn.addEventListener('click', function() {
                                    const id = this.getAttribute('data-id');
                                    if (confirm('Вы уверены, что хотите удалить этот ресурс?')) {
                                        deleteResource(id);
                                    }
                                });
                            });
                        }
                    }
                }
            })
            .catch(error => console.error('Error loading resources:', error));
    }
    
    // Function to load pending resources
    function loadPendingResources() {
        fetchWithCredentials('api/resources.php?status=pending')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    const pendingResourcesContainer = document.getElementById('pending-resources-container');
                    if (pendingResourcesContainer) {
                        if (data.data.length === 0) {
                            pendingResourcesContainer.innerHTML = '<div class="empty-message">Нет ресурсов на проверку</div>';
                        } else {
                            let html = '';
                            data.data.forEach(resource => {
                                html += `
                                    <div class="admin-list-item">
                                        <div class="item-info">
                                            <h5>${resource.title}</h5>
                                            <p><strong>Ссылка:</strong> <a href="${resource.link}" target="_blank">${resource.link}</a></p>
                                            <p><strong>Категория:</strong> ${resource.category_name}</p>
                                            <p><strong>Тип:</strong> ${getResourceTypeText(resource.resource_type)}</p>
                                            <p><strong>Сложность:</strong> ${getDifficultyLevelText(resource.difficulty_level)}</p>
                                            <p><strong>Добавил:</strong> ${resource.added_by || 'Неизвестно'}</p>
                                        </div>
                                        <div class="item-actions">
                                            <button class="cyber-btn approve-btn" data-id="${resource.id}">Одобрить</button>
                                            <button class="cyber-btn reject-btn" data-id="${resource.id}">Отклонить</button>
                                        </div>
                                    </div>
                                `;
                            });
                            pendingResourcesContainer.innerHTML = html;
                            
                            // Add approve/reject button event listeners
                            const approveButtons = pendingResourcesContainer.querySelectorAll('.approve-btn');
                            approveButtons.forEach(btn => {
                                btn.addEventListener('click', function() {
                                    const id = this.getAttribute('data-id');
                                    updateResourceStatus(id, 'approved');
                                });
                            });
                            
                            const rejectButtons = pendingResourcesContainer.querySelectorAll('.reject-btn');
                            rejectButtons.forEach(btn => {
                                btn.addEventListener('click', function() {
                                    const id = this.getAttribute('data-id');
                                    updateResourceStatus(id, 'rejected');
                                });
                            });
                        }
                    }
                }
            })
            .catch(error => console.error('Error loading pending resources:', error));
    }
    
    // Function to delete category
    function deleteCategory(id) {
        fetchWithCredentials(`api/categories.php?id=${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // Reload categories
                loadAdminCategories();
                
                // Show success message
                alert('Категория успешно удалена');
            } else {
                // Show error
                alert('Ошибка: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error deleting category:', error);
            alert('Произошла ошибка при удалении категории');
        });
    }
    
    // Function to delete resource
    function deleteResource(id) {
        fetchWithCredentials(`api/resources.php?id=${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // Reload resources
                loadAdminResources();
                
                // Show success message
                alert('Ресурс успешно удален');
            } else {
                // Show error
                alert('Ошибка: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error deleting resource:', error);
            alert('Произошла ошибка при удалении ресурса');
        });
    }
    
    // Function to update resource status
    function updateResourceStatus(id, status) {
        fetchWithCredentials('api/resources.php', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id, status })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // Reload pending resources
                loadPendingResources();
                
                // Show success message
                alert('Статус ресурса успешно обновлен');
            } else {
                // Show error
                alert('Ошибка: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error updating resource status:', error);
            alert('Произошла ошибка при обновлении статуса ресурса');
        });
    }
    
    // Helper function to get resource type text
    function getResourceTypeText(type) {
        switch (type) {
            case 'course': return 'Курс';
            case 'video': return 'Видео';
            case 'article': return 'Статья';
            case 'book': return 'Книга';
            default: return type;
        }
    }
    
    // Helper function to get difficulty level text
    function getDifficultyLevelText(level) {
        switch (level) {
            case 'easy': return 'Легкий';
            case 'medium': return 'Средний';
            case 'pro': return 'Продвинутый';
            default: return level;
        }
    }
});