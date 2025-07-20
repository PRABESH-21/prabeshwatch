document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  document.querySelector('.mobile-menu-toggle').addEventListener('click', function() {
    document.querySelector('.main-nav ul').classList.toggle('active');
    this.querySelector('i').classList.toggle('fa-times');
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  // Header scroll effect
  window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Form submission
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      // Here you would typically send the form data to a server
      
      form.reset();
    });
  });

  // Mobile dropdown menus
  document.querySelectorAll('.main-nav > ul > li').forEach(item => {
    if (item.querySelector('.dropdown-menu')) {
      item.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          this.querySelector('.dropdown-menu').classList.toggle('active');
        }
      });
    }
  });

  // Cart functionality
  const cart = [];
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotalElement = document.getElementById('cart-total');
  const cartCountElement = document.querySelector('.cart-count');
  const cartToggle = document.getElementById('cart-toggle');
  const closeCart = document.getElementById('close-cart');
  const cartModal = document.getElementById('cart-modal');
  const overlay = document.getElementById('overlay');
  const checkoutBtn = document.querySelector('.checkout-btn');
  const checkoutPopup = document.getElementById('checkout-popup');
  const closeCheckoutPopup = document.getElementById('close-checkout-popup');
  const checkoutSummary = document.getElementById('checkout-summary');
  const checkoutForm = document.querySelector('.checkout-form');

  // Add to cart buttons
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
      const id = this.dataset.id;
      const name = this.dataset.name;
      const price = parseFloat(this.dataset.price);
      const image = this.dataset.image;
      
      // Check if item already exists in cart
      const existingItem = cart.find(item => item.id === id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          id,
          name,
          price,
          image,
          quantity: 1
        });
      }
      
      updateCart();
      openCart();
    });
  });

  // Update cart display
  function updateCart() {
    // Clear cart items
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
      cartTotalElement.textContent = '0.00';
      cartCountElement.textContent = '0';
      if (checkoutBtn) {
        checkoutBtn.disabled = true;
        checkoutBtn.style.opacity = '0.7';
        checkoutBtn.style.cursor = 'not-allowed';
      }
      return;
    }
    
    let total = 0;
    let totalItems = 0;
    
    // Add each item to cart
    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
      totalItems += item.quantity;
      
      const cartItemElement = document.createElement('div');
      cartItemElement.className = 'cart-item';
      cartItemElement.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-details">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-price">$${item.price.toFixed(2)} × ${item.quantity}</div>
          <div class="cart-item-remove" data-id="${item.id}">Remove</div>
        </div>
      `;
      
      cartItemsContainer.appendChild(cartItemElement);
    });
    
    // Update totals
    cartTotalElement.textContent = total.toFixed(2);
    cartCountElement.textContent = totalItems;
    
    if (checkoutBtn) {
      checkoutBtn.disabled = false;
      checkoutBtn.style.opacity = '1';
      checkoutBtn.style.cursor = 'pointer';
    }
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.cart-item-remove').forEach(button => {
      button.addEventListener('click', function() {
        const id = this.dataset.id;
        const index = cart.findIndex(item => item.id === id);
        
        if (index !== -1) {
          cart.splice(index, 1);
          updateCart();
        }
      });
    });
  }

  // Open cart
  function openCart() {
    cartModal.style.display = 'block';
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  // Close cart
  function closeCartModal() {
    cartModal.style.display = 'none';
    overlay.style.display = 'none';
    document.body.style.overflow = '';
  }

  // Event listeners for cart
  if (cartToggle) {
    cartToggle.addEventListener('click', function(e) {
      e.preventDefault();
      openCart();
    });
  }

  if (closeCart) {
    closeCart.addEventListener('click', closeCartModal);
  }

  if (overlay) {
    overlay.addEventListener('click', closeCartModal);
  }

  // Checkout functionality
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
      if (cart.length === 0) {
        alert('Your cart is empty. Please add items before checkout.');
        return;
      }
      
      // Update checkout summary
      checkoutSummary.innerHTML = '';
      
      let total = 0;
      cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const summaryItem = document.createElement('div');
        summaryItem.className = 'checkout-summary-item';
        summaryItem.innerHTML = `
          <span>${item.name} (${item.quantity})</span>
          <span>$${itemTotal.toFixed(2)}</span>
        `;
        checkoutSummary.appendChild(summaryItem);
      });
      
      // Add total
      const totalElement = document.createElement('div');
      totalElement.className = 'checkout-summary-item';
      totalElement.style.fontWeight = '600';
      totalElement.style.marginTop = '10px';
      totalElement.style.paddingTop = '10px';
      totalElement.style.borderTop = '1px solid #eee';
      totalElement.innerHTML = `
        <span>Total</span>
        <span>$${total.toFixed(2)}</span>
      `;
      checkoutSummary.appendChild(totalElement);
      
      // Show popup
      checkoutPopup.style.display = 'block';
      document.body.style.overflow = 'hidden';
    });
  }

  // Close checkout popup
  if (closeCheckoutPopup) {
    closeCheckoutPopup.addEventListener('click', function() {
      checkoutPopup.style.display = 'none';
      document.body.style.overflow = '';
    });
  }

  // Form submission
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Here you would typically send the order to your server
      const name = document.getElementById('name').value;
      
      alert(`Thank you for your order, ${name}! Your watches will be shipped soon.`);
      
      // Clear the cart
      cart.length = 0;
      updateCart();
      checkoutPopup.style.display = 'none';
      document.body.style.overflow = '';
      checkoutForm.reset();
    });
  }

  // Initialize cart
  updateCart();
});
// Mobile dropdown toggle functionality
document.querySelectorAll('.mobile-dropdown-toggle').forEach(toggle => {
  // Initialize dropdown state
  const parentLi = toggle.parentElement;
  const dropdown = parentLi.querySelector('.dropdown-menu');
  dropdown.style.maxHeight = '0';
  
  toggle.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    // Close other open dropdowns first
    document.querySelectorAll('.mobile-dropdown-toggle').forEach(otherToggle => {
      if (otherToggle !== toggle) {
        otherToggle.classList.remove('active');
        const otherDropdown = otherToggle.parentElement.querySelector('.dropdown-menu');
        otherDropdown.style.maxHeight = '0';
      }
    });
    
    // Toggle current dropdown
    this.classList.toggle('active');
    if (this.classList.contains('active')) {
      dropdown.style.maxHeight = dropdown.scrollHeight + 'px';
    } else {
      dropdown.style.maxHeight = '0';
    }
  });
});

// Close dropdowns when clicking outside
document.addEventListener('click', function(e) {
  if (!e.target.closest('.main-nav li')) {
    document.querySelectorAll('.mobile-dropdown-toggle').forEach(toggle => {
      toggle.classList.remove('active');
      const dropdown = toggle.parentElement.querySelector('.dropdown-menu');
      dropdown.style.maxHeight = '0';
    });
  }
});
 document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav ul');
  
  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', function() {
      mainNav.classList.toggle('active');
    });
    
    // Mobile dropdown toggles
    document.querySelectorAll('.mobile-dropdown-toggle').forEach(toggle => {
      toggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.classList.toggle('active');
        this.parentElement.nextElementSibling.classList.toggle('active');
      });
    });
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".mobile-menu-toggle");
  const navLinks = document.querySelector("#nav-links");

  toggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });

  // Toggle dropdowns inside mobile nav
  document.querySelectorAll('.mobile-dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      const dropdown = e.target.closest('li').querySelector('.dropdown-menu');
      dropdown.classList.toggle('active');
    });
  });
});

