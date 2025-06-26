document.addEventListener('DOMContentLoaded', function() {
    // Данные товаров
    const products = [
        {
            id: 1,
            title: "Мужская футболка",
            price: 1999,
            image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            category: "men",
            badge: "Новинка"
        },
        {
            id: 2,
            title: "Женское платье",
            price: 3499,
            image: "https://images.unsplash.com/photo-1539008835657-https://www.google.com/url?sa=i&url=https%3A%2F%2Fhappywear.ru%2Fzhenshchinam%2Fplatya%2F6692477&psig=AOvVaw3NkFJIdxP4jp3uiZm2-TS7&ust=1751039056155000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCMCLlvq2j44DFQAAAAAdAAAAABAU9e8e9680e956?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            category: "women",
            badge: "Хит"
        },
        {
            id: 3,
            title: "Детская куртка",
            price: 2799,
            image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            category: "kids"
        },
        {
            id: 4,
            title: "Мужские джинсы",
            price: 3999,
            image: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            category: "men"
        },
        {
            id: 5,
            title: "Женская блузка",
            price: 2299,
            image: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            category: "women",
            badge: "Скидка"
        },
        {
            id: 6,
            title: "Детские кроссовки",
            price: 2599,
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            category: "kids",
            badge: "Новинка"
        },
        {
            id: 7,
            title: "Мужская рубашка",
            price: 2899,
            image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            category: "men"
        },
        {
            id: 8,
            title: "Женские джинсы",
            price: 3799,
            image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            category: "women"
        }
    ];

    // Корзина
    let cart = [];

    // DOM элементы
    const productGrid = document.getElementById('product-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const cartIcon = document.getElementById('cart-icon');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCart = document.querySelector('.close-cart');
    const cartContent = document.getElementById('cart-content');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.querySelector('.cart-count');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const testimonials = document.querySelectorAll('.testimonial');

    // Отображение товаров
    function displayProducts(filter = 'all') {
        productGrid.innerHTML = '';
        
        const filteredProducts = filter === 'all' 
            ? products 
            : products.filter(product => product.category === filter);
        
        filteredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.dataset.category = product.category;
            
            let badge = '';
            if (product.badge) {
                badge = `<span class="product-badge">${product.badge}</span>`;
            }
            
            productCard.innerHTML = `
                <div class="product-image">
                    ${badge}
                    <img src="${product.image}" alt="${product.title}">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <p class="product-price">${product.price} руб.</p>
                    <button class="add-to-cart" data-id="${product.id}">Добавить в корзину</button>
                </div>
            `;
            
            productGrid.appendChild(productCard);
        });
        
        // Добавление обработчиков событий для кнопок "Добавить в корзину"
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', addToCart);
        });
    }

    // Фильтрация товаров
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const filter = button.dataset.filter;
            displayProducts(filter);
        });
    });

    // Добавление товара в корзину
    function addToCart(e) {
        const productId = parseInt(e.target.dataset.id);
        const product = products.find(p => p.id === productId);
        
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
        updateCart();
        
        // Анимация добавления в корзину
        const cartIconRect = cartIcon.getBoundingClientRect();
        const buttonRect = e.target.getBoundingClientRect();
        
        const flyingItem = document.createElement('div');
        flyingItem.className = 'flying-item';
        flyingItem.innerHTML = `<img src="${product.image}" alt="${product.title}">`;
        
        flyingItem.style.position = 'fixed';
        flyingItem.style.left = `${buttonRect.left}px`;
        flyingItem.style.top = `${buttonRect.top}px`;
        flyingItem.style.width = '50px';
        flyingItem.style.height = '50px';
        flyingItem.style.borderRadius = '50%';
        flyingItem.style.overflow = 'hidden';
        flyingItem.style.zIndex = '1000';
        flyingItem.style.transition = 'all 0.5s ease-in-out';
        flyingItem.style.pointerEvents = 'none';
        
        document.body.appendChild(flyingItem);
        
        setTimeout(() => {
            flyingItem.style.left = `${cartIconRect.left}px`;
            flyingItem.style.top = `${cartIconRect.top}px`;
            flyingItem.style.width = '10px';
            flyingItem.style.height = '10px';
            flyingItem.style.opacity = '0.5';
        }, 0);
        
        setTimeout(() => {
            flyingItem.remove();
        }, 500);
    }

    // Обновление корзины
    function updateCart() {
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
        
        if (cart.length === 0) {
            cartContent.innerHTML = '<p class="empty-cart">Ваша корзина пуста</p>';
            cartTotal.textContent = '0';
            return;
        }
        
        cartContent.innerHTML = '';
        let total = 0;
        
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="cart-item-img">
                <div class="cart-item-info">
                    <h4 class="cart-item-title">${item.title}</h4>
                    <p class="cart-item-price">${item.price} руб.</p>
                    <button class="cart-item-remove" data-id="${item.id}">Удалить</button>
                    <div class="cart-item-quantity">
                        <button class="decrease" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="increase" data-id="${item.id}">+</button>
                    </div>
                </div>
            `;
            
            cartContent.appendChild(cartItem);
            total += item.price * item.quantity;
        });
        
        cartTotal.textContent = total;
        
        // Добавление обработчиков событий для кнопок в корзине
        document.querySelectorAll('.cart-item-remove').forEach(button => {
            button.addEventListener('click', removeFromCart);
        });
        
        document.querySelectorAll('.increase').forEach(button => {
            button.addEventListener('click', increaseQuantity);
        });
        
        document.querySelectorAll('.decrease').forEach(button => {
            button.addEventListener('click', decreaseQuantity);
        });
    }

    // Удаление товара из корзины
    function removeFromCart(e) {
        const productId = parseInt(e.target.dataset.id);
        cart = cart.filter(item => item.id !== productId);
        updateCart();
    }

    // Увеличение количества товара
    function increaseQuantity(e) {
        const productId = parseInt(e.target.dataset.id);
        const item = cart.find(item => item.id === productId);
        item.quantity += 1;
        updateCart();
    }

    // Уменьшение количества товара
    function decreaseQuantity(e) {
        const productId = parseInt(e.target.dataset.id);
        const item = cart.find(item => item.id === productId);
        
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            cart = cart.filter(item => item.id !== productId);
        }
        
        updateCart();
    }

    // Открытие/закрытие корзины
    cartIcon.addEventListener('click', () => {
        cartOverlay.classList.add('active');
    });

    closeCart.addEventListener('click', () => {
        cartOverlay.classList.remove('active');
    });

    // Закрытие корзины при клике вне ее области
    cartOverlay.addEventListener('click', (e) => {
        if (e.target === cartOverlay) {
            cartOverlay.classList.remove('active');
        }
    });

    // Слайдер отзывов
    let currentTestimonial = 0;

    function showTestimonial(index) {
        testimonials.forEach(testimonial => {
            testimonial.classList.remove('active');
        });
        
        testimonials[index].classList.add('active');
    }

    prevBtn.addEventListener('click', () => {
        currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
        showTestimonial(currentTestimonial);
    });

    nextBtn.addEventListener('click', () => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    });

    // Автоматическое переключение отзывов
    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }, 5000);

    // Плавная прокрутка для ссылок в меню
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });

    // Изменение шапки при прокрутке
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        header.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Инициализация
    displayProducts();
    showTestimonial(0);
});