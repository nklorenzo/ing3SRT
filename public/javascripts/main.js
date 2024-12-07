document.addEventListener('DOMContentLoaded', function() {
    let isLoggedIn = false;
    const cartCount = document.querySelector('.cart-count');
    const cartButton = document.getElementById('cartButton');
    const cartDropdown = document.querySelector('.cart-dropdown');
    const loginRequired = document.getElementById('loginRequired');
    const cartContent = document.getElementById('cartContent');

    const accountPreview = document.getElementById('accountPreview');
    const accountDivider = document.getElementById('accountDivider');
    const accountMenuItems = document.getElementById('accountMenuItems');
    const logoutBtn = document.getElementById('logoutBtn');
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');

    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');
    const switchToRegisterBtn = document.getElementById('switchToRegister');
    const switchToLoginBtn = document.getElementById('switchToLogin');

    const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    const registerModal = new bootstrap.Modal(document.getElementById('registerModal'));
    const profileModal = new bootstrap.Modal(document.getElementById('profileModal'));
    const ordersModal = new bootstrap.Modal(document.getElementById('ordersModal'));

    cartCount.style.transform = 'scale(0)';
    setTimeout(() => {
        cartCount.style.transition = 'transform 0.3s ease-in-out';
        cartCount.style.transform = 'scale(1)';
    }, 300);

    const cartIcon = document.querySelector('.cart-icon');
    cartIcon.addEventListener('mouseover', function() {
        this.style.transform = 'scale(1.1)';
        this.style.transition = 'transform 0.2s ease';
    });

    cartIcon.addEventListener('mouseout', function() {
        this.style.transform = 'scale(1)';
    });

    cartButton.addEventListener('click', function(e) {
        e.preventDefault();
        if (!isLoggedIn) {
            loginModal.show();
            return;
        }
        cartDropdown.classList.toggle('show');
    });

    document.addEventListener('click', function(e) {
        if (!cartButton.contains(e.target) && !cartDropdown.contains(e.target)) {
            cartDropdown.classList.remove('show');
        }
    });

    document.querySelectorAll('.quantity-controls').forEach(control => {
        const input = control.querySelector('.quantity-input');
        const minusBtn = control.querySelector('.minus');
        const plusBtn = control.querySelector('.plus');

        minusBtn.addEventListener('click', () => {
            const currentValue = parseInt(input.value);
            if (currentValue > 1) {
                input.value = currentValue - 1;
                updateTotal();
            }
        });

        plusBtn.addEventListener('click', () => {
            const currentValue = parseInt(input.value);
            if (currentValue < 99) {
                input.value = currentValue + 1;
                updateTotal();
            }
        });

        input.addEventListener('change', () => {
            let value = parseInt(input.value);
            if (isNaN(value) || value < 1) value = 1;
            if (value > 99) value = 99;
            input.value = value;
            updateTotal();
        });
    });

    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.cart-item').remove();
            updateTotal();
            updateCartCount();
        });
    });

    function updateTotal() {
        let total = 0;
        document.querySelectorAll('.cart-item').forEach(item => {
            const price = parseInt(item.querySelector('.cart-item-price').textContent);
            const quantity = parseInt(item.querySelector('.quantity-input').value);
            total += price * quantity;
        });
        document.querySelector('.total-amount').textContent = total + ' FCFA';
    }

    function updateCartCount() {
        const itemCount = document.querySelectorAll('.cart-item').length;
        cartCount.textContent = itemCount;
        if (itemCount === 0) {
            cartCount.style.display = 'none';
        } else {
            cartCount.style.display = 'flex';
        }
    }

    function updateLoginState(loggedIn) {
        isLoggedIn = loggedIn;
        const cartIcon = document.querySelector('.cart-icon');
        const cartCount = document.querySelector('.cart-count');
        const loginRequired = document.getElementById('loginRequired');
        const cartContent = document.getElementById('cartContent');

        updateAccountUI(loggedIn);

        if (isLoggedIn) {

            cartIcon.classList.remove('disabled');
            cartCount.style.display = 'flex';
            loginRequired.style.display = 'none';
            cartContent.style.display = 'block';
            //utiliser les données injectées
        } else {
            cartIcon.classList.add('disabled');
            cartCount.style.display = 'none';
            loginRequired.style.display = 'block';
            cartContent.style.display = 'none';
        }
    }

    function updateAccountUI(loggedIn) {
        if (loggedIn) {
            loginLink.classList.add('d-none');
            registerLink.classList.add('d-none');
            accountPreview.classList.remove('d-none');
            accountDivider.classList.remove('d-none');
            accountMenuItems.classList.remove('d-none');
            document.querySelectorAll('.dropdown-item[href*="login"], .dropdown-item[href*="register"]')
                .forEach(el => el.classList.add('d-none'));
        } else {
            loginLink.classList.remove('d-none');
            registerLink.classList.remove('d-none');
            accountPreview.classList.add('d-none');
            accountDivider.classList.add('d-none');
            accountMenuItems.classList.add('d-none');
            document.querySelectorAll('.dropdown-item[href*="login"], .dropdown-item[href*="register"]')
                .forEach(el => el.classList.remove('d-none'));
        }
    }

    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        updateLoginState(false);
        updateAccountUI(false);
    });

    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.show();
    });

    registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerModal.show();
    });

    switchToRegisterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.hide();
        registerModal.show();
    });

    switchToLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        registerModal.hide();
        loginModal.show();
    });


    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        // Récupérer les données du formulaire
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            // Envoyer la requête POST au serveur
            const response = await fetch('/users/connexion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            // Vérifier la réponse du serveur
            if (response.ok) {
                const result = await response.json(); // Si le serveur renvoie un JSON
                alert('Connexion réussie !');
                updateLoginState(true);
                loginModal.hide();
            } else {
                alert('Email ou mot de passe incorrect.');
                updateLoginState(false);
            }
        } catch (error) {
            console.error('Erreur lors de la connexion :', error);
            alert('Une erreur est survenue.');
        }
    });



    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        // Récupérer les données du formulaire
        const formData = new FormData(e.target);
        const prenom = formData.get('prenom');
        const nom = formData.get('nom');
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('passwordConfirm');

        if (password !== confirmPassword) {
            alert('Les mots de passe ne correspondent pas.');
            return;
        }

        try {
            // Envoyer les données au serveur via Fetch
            const response = await fetch('/users/inscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nom,
                    prenom,
                    email,
                    password
                })
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.message || 'Inscription réussie !');
                registerModal.hide();
                loginModal.show();
            } else {
                const error = await response.json();
                alert(error.message || 'Erreur lors de l\'inscription.');
            }
        } catch (error) {
            console.error('Erreur réseau :', error);
            alert('Une erreur est survenue.');
        }
    });

    // Mettre à jour l'interface utilisateur
    updateLoginState(false);
    updateAccountUI(false);

    document.getElementById('profileLink').addEventListener('click', (e) => {
        e.preventDefault();
        profileModal.show();
    });

    document.getElementById('ordersLink').addEventListener('click', (e) => {
        e.preventDefault();
        ordersModal.show();
    });

    document.getElementById('profileForm').addEventListener('submit', (e) => {
        e.preventDefault();
        profileModal.hide();
        alert('Profil mis à jour avec succès!');
    });

    updateLoginState(false);

    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Bonne pratique pour bloquer le comportement par défaut

        fetch('/users/deconnexion', {
                method: 'POST',
                credentials: 'include', //IMPORTANT : Inclure les credentials pour les cookies
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                // Vérifier le statut de la réponse
                if (response.ok) {
                    return response.json();
                } else {
                    // Gérer les erreurs HTTP
                    throw new Error('La déconnexion a échoué');
                }
            })
            .then(data => {
                // Vérifier la réponse du serveur
                if (data.success) {
                    // Redirection ou rechargement
                    window.location.href = '/'; // Rediriger vers l'accueil
                } else {
                    // Gérer le cas où success est false
                    console.error('Échec de la déconnexion');
                }
            })
            .catch(error => {
                console.error('Erreur de déconnexion:', error);
                alert('Un problème est survenu lors de la déconnexion');
            });
    });

});