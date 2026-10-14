document.addEventListener('DOMContentLoaded', () => {
  const products = [
    {id:1,name:'Smooth Flow Ball Pens (Pack of 3)',category:'Pens',price:45,image:'https://m.media-amazon.com/images/I/71B40ADF3+L.jpg',description:'Comfortable everyday writing pens.'},
    {id:2,name:'Classic Ruled Notebook',category:'Notebooks',price:85,image:'https://thepaperco.in/cdn/shop/files/Rhodia_social_01copy.jpg?v=1752419343&width=1946',description:'A reliable notebook for class or work.'},
    {id:3,name:'HB Pencils (Pack of 10)',category:'Pencils',price:60,image:'https://m.media-amazon.com/images/I/41Pdjt3IiKL._SX522_.jpg',description:'Everyday pencils for writing and sketching.'},
    {id:4,name:'Soft Erasers (Pack of 3)',category:'Erasers',price:25,image:'https://www.himalayafineart.com/cdn/shop/files/A00021343_1800x1800.jpg?v=1752142223',description:'Clean erasing with minimal paper damage.'},
    {id:5,name:'Weekly Planner',category:'Planners',price:150,image:'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=600&q=80',description:'Plan your week and keep priorities clear.'},
    {id:6,name:'Pastel Highlighters (Set of 4)',category:'Highlighters',price:120,image:'https://static1.industrybuying.com/products/office-supplies/pens-pencils-writing-supplies/highlighters/OFF.HIG.833503214_1749810514486.webp',description:'Mark important notes with bright colours.'},
    {id:7,name:'Colour Sticky Notes',category:'Sticky Notes',price:55,image:'https://static1.industrybuying.com/products/office-supplies/stationary-items/sticky-notes/OFF.STI.625306703_1708409928518.webp',description:'Quick reminders for your desk or books.'},
    {id:8,name:'Geometry Set',category:'Geometry Sets',price:95,image:'https://m.media-amazon.com/images/I/61OvT25W38L._AC_UF1000,1000_QL80_.jpg',description:'Maths drawing tools for school and college.'},
    {id:9,name:'Pocket Memo Pad',category:'Memo Pads',price:40,image:'https://i.etsystatic.com/31772906/r/il/c5046c/3465367563/il_1080xN.3465367563_21vt.jpg',description:'Keep quick notes close at hand.'},
    {id:10,name:'Desk Calendar',category:'Calendars',price:110,image:'https://m.media-amazon.com/images/I/614ZKMTY-rL._SX522_.jpg',description:'A simple way to keep dates in view.'},
    {id:11,name:'Journal',category:'Journals',price:130,image:'https://cpimg.tistatic.com/06324103/b/6/Practical-Book-Big-Two-Sided-Ruled-170-Pages.jpg',description:'A place for ideas, notes and reflections.'},
    {id:12,name:'Transparent Ruler',category:'Rulers',price:20,image:'https://www.giftoo.in/cdn/shop/files/2412cc7b-592d-4d9a-bf31-0e801863f23a_0_af3d37de-a930-406f-9f20-9a5671aeb657.jpg?v=1775123901&width=1946',description:'A handy ruler for everyday measuring.'}
  ];
  let cart = [];
  let activeCategory = 'All Stationery';
  let searchTerm = '';
  const $ = id => document.getElementById(id);
  const productGrid = $('productGrid'), cartDrawer = $('cartDrawer'), cartOverlay =$('cartOverlay');
  const money = amount => `₹${amount.toLocaleString('en-IN')}`;
  const toast = message => {
    const el = $('toast'); el.textContent = message; el.classList.add('show');
    clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove('show'), 2200);
  };
  $('year').textContent = new Date().getFullYear();

  $('closePromo').addEventListener('click', () =>$('promoBar').remove());
  document.querySelectorAll('.shop-btn,.hero-cta').forEach(link => link.addEventListener('click', () => {
    activeCategory = 'All Stationery'; renderProducts(); updateCategoryHighlight();
  }));
  $('searchForm').addEventListener('submit', e => { e.preventDefault(); searchTerm =$('searchInput').value.trim().toLowerCase(); renderProducts(); $('products').scrollIntoView({behavior:'smooth'}); });$('searchInput').addEventListener('input', e => { searchTerm = e.target.value.trim().toLowerCase(); renderProducts(); });
  document.querySelectorAll('.cat-card').forEach(card => card.addEventListener('click', () => {
    activeCategory = card.dataset.category; updateCategoryHighlight(); renderProducts(); $('products').scrollIntoView({behavior:'smooth'});
  }));
  function updateCategoryHighlight() {
    document.querySelectorAll('.cat-card').forEach(card => card.classList.toggle('active', card.dataset.category === activeCategory));
  }
  function renderProducts() {
    const filtered = products.filter(p => (activeCategory === 'All Stationery' || p.category === activeCategory) &&
      `${p.name} ${p.category} ${p.description}`.toLowerCase().includes(searchTerm));
    $('emptyResults').hidden = filtered.length > 0;
    productGrid.innerHTML = filtered.map(p => `
      <article class="product-card">
        <div class="product-image"><img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.style.display='none'"></div>
        <div class="product-info"><p class="product-category">${p.category}</p><h3>${p.name}</h3>
          <p style="font-size:11px;color:#697386">${p.description}</p>
          <div class="product-bottom"><span class="price">${money(p.price)}</span><button class="add-btn" data-add="${p.id}"><i class="fa-solid fa-plus"></i> Add to bag</button></div>
        </div>
      </article>`).join('');
    productGrid.querySelectorAll('[data-add]').forEach(btn => btn.addEventListener('click', () => addToCart(Number(btn.dataset.add))));
  }
  function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);
    existing ? existing.qty++ : cart.push({...product, qty:1});
    updateCart(); toast(`${product.name} added to your bag`);
  }
  function changeQty(id, amount) {
    const item = cart.find(p => p.id === id); if (!item) return;
    item.qty += amount; if (item.qty <= 0) cart = cart.filter(p => p.id !== id);
    updateCart();
  }
  function updateCart() {
    const count = cart.reduce((sum,p) => sum + p.qty, 0);
    const total = cart.reduce((sum,p) => sum + p.price*p.qty, 0);
    $('cartCount').textContent = count;
    $('cartSubtotal').textContent = money(total);$('cartItems').innerHTML = cart.length ? cart.map(p => `
      <div class="cart-line"><div><h3>${p.name}</h3><small>${money(p.price)} each</small>
        <div class="cart-line-controls"><button class="qty-btn" data-qty="${p.id}" data-delta="-1" aria-label="Decrease quantity">−</button><span>${p.qty}</span><button class="qty-btn" data-qty="${p.id}" data-delta="1" aria-label="Increase quantity">+</button><button class="remove-btn" data-remove="${p.id}">Remove</button></div>
      </div><div class="cart-line-price">${money(p.price*p.qty)}</div></div>`).join('') :
      '<div class="empty-cart"><i class="fa-solid fa-bag-shopping"></i><strong>Your bag is empty</strong><p>Add a few stationery essentials to get started.</p></div>';
    $('cartItems').querySelectorAll('[data-qty]').forEach(btn => btn.addEventListener('click', () => changeQty(Number(btn.dataset.qty), Number(btn.dataset.delta))));$('cartItems').querySelectorAll('[data-remove]').forEach(btn => btn.addEventListener('click', () => { cart = cart.filter(p => p.id !== Number(btn.dataset.remove)); updateCart(); }));
  }
  function toggleCart(open) {
    cartDrawer.classList.toggle('open', open); cartOverlay.classList.toggle('active', open);
    cartDrawer.setAttribute('aria-hidden', String(!open)); document.body.style.overflow = open ? 'hidden' : '';
  }
  $('cartIconBtn').addEventListener('click', () => toggleCart(true));$('closeCartBtn').addEventListener('click', () => toggleCart(false));
  cartOverlay.addEventListener('click', () => toggleCart(false));

  function openOrderModal() {
    if (!cart.length) { toast('Your bag is empty. Add a product first.'); return; }
    $('orderSummary').innerHTML = cart.map(p => `<div class="summary-row"><span>${p.name} × ${p.qty}</span><span>${money(p.price*p.qty)}</span></div>`).join('') +
      `<div class="summary-row summary-total"><span>Order subtotal</span><span>${money(cart.reduce((sum,p)=>sum+p.price*p.qty,0))}</span></div>`;
    $('orderSuccess').hidden = true; $('orderForm').hidden = false;
    toggleCart(false); $('orderModal').classList.add('active'); document.body.style.overflow = 'hidden';$('customerName').focus();
  }
  $('checkoutBtn').addEventListener('click', openOrderModal);$('closeOrderModal').addEventListener('click', closeOrderModal);
  $('orderModal').addEventListener('click', e => { if (e.target ===$('orderModal')) closeOrderModal(); });
  function closeOrderModal() { $('orderModal').classList.remove('active'); document.body.style.overflow = ''; }
  
  // Updated order form submission to save data into MongoDB via backend server
  $('orderForm').addEventListener('submit', async e => {
    e.preventDefault();
    if (!cart.length) { closeOrderModal(); toast('Your bag is empty.'); return; }
    const data = new FormData(e.currentTarget);
    const orderNo = 'JMV-' + Date.now().toString().slice(-7);
    const itemsText = cart.map(p => `${p.name} × ${p.qty} — ${money(p.price*p.qty)}`).join('\n');
    const total = cart.reduce((sum,p) => sum + p.price*p.qty, 0);
    const order = {
      orderNumber: orderNo, 
      name: data.get('name').trim(), 
      phone: data.get('phone').trim(),
      email: data.get('email').trim(), 
      address: data.get('address').trim(),
      payment: data.get('payment'), 
      items: cart.map(({id,name,category,price,qty}) => ({id,name,category,price,qty})),
      total: total
    };

    // Send order to your Render backend server
    try {
      const response = await fetch('https://webbsite-backend.onrender.com/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
      const result = await response.json();
      if (!result.success) throw new Error('Failed to save to database');
    } catch (err) {
      console.error('Error:', err);
      toast('Could not connect to server to place order.');
      return;
    }

    $('orderForm').hidden = true;
    $('orderSuccess').hidden = false;
    $('orderSuccess').innerHTML = `<strong><i class="fa-solid fa-circle-check"></i> Order Placed Successfully!</strong><p>Reference: <b>${orderNo}</b></p><p>Thank you, ${escapeHtml(order.name)}. Your total is <b>${money(total)}</b>.</p><p style="margin-top:8px"><b>Items</b><br>${escapeHtml(itemsText).replace(/\n/g,'<br>')}</p><p style="margin-top:8px"><b>Delivery address</b><br>${escapeHtml(order.address)}</p><button type="button" class="primary-btn" id="finishOrder" style="margin-top:14px">Continue Shopping</button>`;
    
    $('finishOrder').addEventListener('click', () => {
      cart = []; updateCart(); closeOrderModal(); renderProducts(); toast(`Thank you! Order ${orderNo} placed.`);
    });
  });

  function escapeHtml(value) { return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  $('accountBtn').addEventListener('click', () => toast('Add items to your bag to place an order.'));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { toggleCart(false); closeOrderModal(); } });
  renderProducts(); updateCart();
});