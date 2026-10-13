/**
 * ChaCeylon API Integration Service
 * Follows the Frontend–Backend Integration and REST API Specification (Group 87)
 * Connects to Express backend at VITE_API_URL (default: http://localhost:5000/api)
 * Includes graceful mock fallback so the application works seamlessly both standalone
 * and when connected to your partner's live Express + MySQL server.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Connection state tracking
let backendStatus = {
  checked: false,
  online: false,
  url: API_BASE_URL,
  error: null,
};

const statusListeners = new Set();
export const subscribeBackendStatus = (callback) => {
  statusListeners.add(callback);
  callback(backendStatus);
  return () => statusListeners.delete(callback);
};

const notifyStatusListeners = () => {
  statusListeners.forEach((cb) => cb({ ...backendStatus }));
};

// Auth token storage helper
const TOKEN_KEY = 'chaceylon_auth_token';
const USER_KEY = 'chaceylon_auth_user';

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);
export const setStoredToken = (token) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
};

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};
export const setStoredUser = (user) => {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(USER_KEY);
};

// Generic Fetch Wrapper with Authorization & Error Handling
async function request(endpoint, options = {}) {
  const token = getStoredToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, { ...options, credentials: 'include', headers });
    
    // Server responded
    backendStatus.online = true;
    backendStatus.checked = true;
    backendStatus.error = null;
    notifyStatusListeners();

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const errorMsg = data?.error?.message || data?.message || `Request failed with status ${res.status}`;
      const err = new Error(errorMsg);
      err.status = res.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (err) {
    // If it's a network error (backend unreachable / refused connection)
    if (err.name === 'TypeError' || err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
      backendStatus.online = false;
      backendStatus.checked = true;
      backendStatus.error = 'Backend server at ' + API_BASE_URL + ' is unreachable.';
      notifyStatusListeners();
      console.warn(`[ChaCeylon API] Backend unreachable at ${API_BASE_URL}. Using fallback mock data.`);
      return handleMockFallback(endpoint, options);
    }
    throw err;
  }
}

// ==========================================
// 6. REST API Endpoints Specification
// ==========================================

// 6.1 General and Product APIs
export const checkHealth = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { method: 'GET' });
    if (res.ok) {
      backendStatus.online = true;
      backendStatus.checked = true;
      backendStatus.error = null;
      notifyStatusListeners();
      return await res.json();
    }
  } catch (e) {
    backendStatus.online = false;
    backendStatus.checked = true;
    backendStatus.error = e.message;
    notifyStatusListeners();
  }
  return { status: 'mock_fallback', message: 'Backend unreachable' };
};

export const getProducts = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);
  if (params.category_id) query.append('category_id', params.category_id);
  if (params.page) query.append('page', params.page);
  if (params.limit) query.append('limit', params.limit);
  
  const qs = query.toString();
  return request(`/products${qs ? `?${qs}` : ''}`);
};

export const getProductById = async (id) => {
  return request(`/products/${id}`);
};

export const getCategories = async () => {
  return request('/categories');
};

// 6.2 Authentication APIs
export const registerUser = async ({ name, email, password }) => {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
};

export const loginUser = async ({ email, password }) => {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

export const getCurrentUser = async () => {
  return request('/auth/me');
};

export const logoutUser = async () => {
  try {
    await request('/auth/logout', { method: 'POST' });
  } catch (e) {
    // Ignore logout error if offline
  } finally {
    setStoredToken(null);
    setStoredUser(null);
  }
};

// 6.3 Customer Order APIs
export const createOrder = async (orderPayload) => {
  return request('/orders', {
    method: 'POST',
    body: JSON.stringify(orderPayload),
  });
};

export const getMyOrders = async () => {
  return request('/orders/my-orders');
};

export const getOrderById = async (id) => {
  return request(`/orders/${id}`);
};

// 6.4 Admin Product APIs
export const getAdminProducts = async () => {
  return request('/admin/products');
};

export const createAdminProduct = async (productData) => {
  return request('/admin/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  });
};

export const updateAdminProduct = async (id, productData) => {
  return request(`/admin/products/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(productData),
  });
};

export const deleteAdminProduct = async (id) => {
  return request(`/admin/products/${id}`, {
    method: 'DELETE',
  });
};

// 6.5 Admin Order APIs
export const getAdminOrders = async () => {
  return request('/admin/orders');
};

export const updateAdminOrderStatus = async (id, status) => {
  return request(`/admin/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
};

// ==========================================
// MOCK FALLBACK IMPLEMENTATION
// (Guarantees immediate interactive demo & matches Section 7 data formats)
// ==========================================

const INITIAL_CATEGORIES = [
  { id: 1, name: 'Black Tea', description: 'World-renowned brisk orthodox and single estate Ceylon black teas' },
  { id: 2, name: 'Green Tea', description: 'Fresh, antioxidant-rich organic green tea leaves from high-grown slopes' },
  { id: 3, name: 'Herbal Drinks', description: 'Ayurvedic spiced infusions with indigenous Sri Lankan herbs & spices' },
  { id: 4, name: 'Wellness & Extracts', description: 'Therapeutic Moringa leaf extracts and superfood wellness tonics' },
  { id: 5, name: 'White Tea', description: 'Rare velvet Silver Tips hand-harvested at mountain dawn' },
];

const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: 'Ceylon Single Estate Black Tea',
    description: 'Masterfully harvested loose leaf orthodox black tea from Dimbula estates. Notes of citrus zest and golden caramel.',
    price: 1250.00,
    currency: 'LKR',
    stock_quantity: 24,
    image_url: '/images/ceylon-black-tea.jpg',
    category_id: 1,
    category_name: 'Black Tea',
    is_active: 1,
    badge: 'Best Seller',
    rating: 4.9,
    weight: '250g Tin'
  },
  {
    id: 2,
    name: 'Ceylon Organic Green Tea (Jasmine Blossom)',
    description: 'Single-origin steamed green tea layered with fragrant Ceylon night jasmine buds. Light, floral, and deeply revitalizing.',
    price: 1450.00,
    currency: 'LKR',
    stock_quantity: 18,
    image_url: '/images/ceylon-green-tea.jpg',
    category_id: 2,
    category_name: 'Green Tea',
    is_active: 1,
    badge: 'Organic',
    rating: 4.8,
    weight: '150g Ceramic Jar'
  },
  {
    id: 3,
    name: 'Artisan Ceylon Spiced Chai Infusion',
    description: 'A traditional royal Ceylon Ayurvedic elixir blending true Ceylon cinnamon, star anise, cardamom, clove, and warm herbs.',
    price: 1680.00,
    currency: 'LKR',
    stock_quantity: 15,
    image_url: '/images/herbal_tea.png',
    category_id: 3,
    category_name: 'Herbal Drinks',
    is_active: 1,
    badge: 'Ayurvedic Heritage',
    rating: 5.0,
    weight: '200g Pouch'
  },
  {
    id: 4,
    name: 'Pure Moringa Leaf Extract & Wellness Elixir',
    description: '100% Organic cold-extracted Sri Lankan Moringa oleifera. Packed with 46 antioxidants, essential plant proteins, and immune minerals.',
    price: 2850.00,
    currency: 'LKR',
    stock_quantity: 30,
    image_url: '/images/moringa.jpg',
    category_id: 4,
    category_name: 'Wellness & Extracts',
    is_active: 1,
    badge: 'Superfood',
    rating: 4.9,
    weight: '50ml Glass Dropper'
  },
  {
    id: 5,
    name: 'Royal Silver Tips Hand-Plucked White Tea',
    description: 'The pinnacle of Ceylon tea artistry. Handpicked unopened velvety silver buds gently sun-withered in high Nuwara Eliya mist.',
    price: 4200.00,
    currency: 'LKR',
    stock_quantity: 8,
    image_url: '/images/silver-tips.jpg',
    category_id: 5,
    category_name: 'White Tea',
    is_active: 1,
    badge: 'Ultra Rare',
    rating: 5.0,
    weight: '80g Luxury Box'
  },
  {
    id: 6,
    name: 'Sun-Cured Lemongrass & Ginger Herbal Tonic',
    description: 'Crisp aromatic Sri Lankan lemongrass combined with spicy sun-dried wild ginger. Naturally caffeine-free digestive harmony.',
    price: 1100.00,
    currency: 'LKR',
    stock_quantity: 20,
    image_url: '/images/herbal_tea.png',
    category_id: 3,
    category_name: 'Herbal Drinks',
    is_active: 1,
    badge: 'Caffeine Free',
    rating: 4.7,
    weight: '120g Kraft Bag'
  }
];

const INITIAL_ORDERS = [
  {
    id: 101,
    order_number: 'ORD-2026-8701',
    user_id: 1,
    total_amount: 3930.00,
    status: 'delivered',
    payment_method: 'cash_on_delivery',
    payment_status: 'paid',
    delivery_address: {
      recipient_name: 'Kavindu Wijerathna',
      phone: '0771234567',
      address_line1: 'No 45, Temple Road',
      city: 'Kandy',
      district: 'Kandy'
    },
    items: [
      { product_id: 1, name: 'Ceylon Single Estate Black Tea', quantity: 2, unit_price: 1250.00, image_url: '/images/ceylon-black-tea.jpg' },
      { product_id: 2, name: 'Ceylon Organic Green Tea', quantity: 1, unit_price: 1430.00, image_url: '/images/ceylon-green-tea.jpg' }
    ],
    created_at: '2026-10-10T09:30:00Z'
  },
  {
    id: 102,
    order_number: 'ORD-2026-8702',
    user_id: 1,
    total_amount: 4530.00,
    status: 'processing',
    payment_method: 'cash_on_delivery',
    payment_status: 'pending',
    delivery_address: {
      recipient_name: 'Kavindu Wijerathna',
      phone: '0771234567',
      address_line1: 'No 45, Temple Road',
      city: 'Kandy',
      district: 'Kandy'
    },
    items: [
      { product_id: 3, name: 'Artisan Ceylon Spiced Chai Infusion', quantity: 1, unit_price: 1680.00, image_url: '/images/herbal_tea.png' },
      { product_id: 4, name: 'Pure Moringa Leaf Extract', quantity: 1, unit_price: 2850.00, image_url: '/images/moringa.jpg' }
    ],
    created_at: '2026-10-12T14:15:00Z'
  }
];

// LocalStorage persistence for mock data
const loadLocal = (key, fallback) => {
  try {
    const raw = localStorage.getItem(`chaceylon_mock_${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
};

const saveLocal = (key, val) => {
  localStorage.setItem(`chaceylon_mock_${key}`, JSON.stringify(val));
};

let mockProducts = loadLocal('products', INITIAL_PRODUCTS);
let mockOrders = loadLocal('orders', INITIAL_ORDERS);

function handleMockFallback(endpoint, options = {}) {
  const method = options.method || 'GET';
  const body = options.body ? JSON.parse(options.body) : {};

  // GET /products
  if (endpoint.startsWith('/products') && method === 'GET') {
    const urlObj = new URL('http://dummy.com' + endpoint);
    const search = urlObj.searchParams.get('search')?.toLowerCase() || '';
    const catId = urlObj.searchParams.get('category_id');

    let filtered = mockProducts.filter((p) => p.is_active !== 0);
    if (search) {
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(search) || p.description.toLowerCase().includes(search));
    }
    if (catId) {
      filtered = filtered.filter((p) => String(p.category_id) === String(catId));
    }
    return { data: filtered };
  }

  // GET /categories
  if (endpoint === '/categories' && method === 'GET') {
    return { data: INITIAL_CATEGORIES };
  }

  // GET /products/:id
  const productMatch = endpoint.match(/^\/products\/(\d+)$/);
  if (productMatch && method === 'GET') {
    const id = parseInt(productMatch[1], 10);
    const product = mockProducts.find((p) => p.id === id);
    if (!product) throw new Error('Product not found');
    return { data: product };
  }

  // POST /auth/login
  if (endpoint === '/auth/login' && method === 'POST') {
    const isAdmin = body.email.toLowerCase().includes('admin');
    const user = {
      id: isAdmin ? 99 : 1,
      name: isAdmin ? 'Admin Manager' : (body.email.split('@')[0] || 'ChaCeylon Customer'),
      email: body.email,
      role: isAdmin ? 'admin' : 'customer'
    };
    const token = 'mock_jwt_token_' + Date.now();
    setStoredToken(token);
    setStoredUser(user);
    return { user, token };
  }

  // POST /auth/register
  if (endpoint === '/auth/register' && method === 'POST') {
    const user = {
      id: Date.now(),
      name: body.name || 'New Customer',
      email: body.email,
      role: 'customer'
    };
    const token = 'mock_jwt_token_' + Date.now();
    setStoredToken(token);
    setStoredUser(user);
    return { user, token };
  }

  // GET /auth/me
  if (endpoint === '/auth/me') {
    const user = getStoredUser() || {
      id: 1,
      name: 'ChaCeylon Customer',
      email: 'customer@example.com',
      role: 'customer'
    };
    return { user };
  }

  // POST /orders
  if (endpoint === '/orders' && method === 'POST') {
    const newId = 100 + mockOrders.length + 1;
    const orderNumber = `ORD-2026-${8700 + newId}`;
    
    // Calculate total on server as requested by Integration Doc Section 7.5
    let calculatedTotal = 0;
    const enrichedItems = (body.items || []).map((item) => {
      const prod = mockProducts.find((p) => p.id === item.product_id);
      const unitPrice = prod ? prod.price : 1200;
      calculatedTotal += unitPrice * item.quantity;
      return {
        product_id: item.product_id,
        name: prod ? prod.name : 'Tea Product',
        quantity: item.quantity,
        unit_price: unitPrice,
        image_url: prod ? prod.image_url : '/images/ceylon-black-tea.jpg'
      };
    });

    const newOrder = {
      id: newId,
      order_number: orderNumber,
      user_id: getStoredUser()?.id || 1,
      total_amount: calculatedTotal,
      status: 'pending',
      payment_method: body.payment_method || 'cash_on_delivery',
      payment_status: 'pending',
      delivery_address: body.delivery_address || {
        recipient_name: 'Valued Customer',
        phone: '0770000000',
        address_line1: 'Colombo 07',
        city: 'Colombo',
        district: 'Colombo'
      },
      items: enrichedItems,
      created_at: new Date().toISOString()
    };

    mockOrders = [newOrder, ...mockOrders];
    saveLocal('orders', mockOrders);

    // Reduce stock
    body.items?.forEach((item) => {
      const prod = mockProducts.find((p) => p.id === item.product_id);
      if (prod && prod.stock_quantity >= item.quantity) {
        prod.stock_quantity -= item.quantity;
      }
    });
    saveLocal('products', mockProducts);

    return { data: newOrder };
  }

  // GET /orders/my-orders
  if (endpoint === '/orders/my-orders') {
    return { data: mockOrders };
  }

  // GET /orders/:id
  const orderMatch = endpoint.match(/^\/orders\/(\d+)$/);
  if (orderMatch) {
    const id = parseInt(orderMatch[1], 10);
    const order = mockOrders.find((o) => o.id === id);
    if (!order) throw new Error('Order not found');
    return { data: order };
  }

  // GET /admin/products
  if (endpoint === '/admin/products') {
    return { data: mockProducts };
  }

  // POST /admin/products
  if (endpoint === '/admin/products' && method === 'POST') {
    const newProd = {
      id: mockProducts.length + 1,
      ...body,
      is_active: 1
    };
    mockProducts = [newProd, ...mockProducts];
    saveLocal('products', mockProducts);
    return { data: newProd };
  }

  // PATCH /admin/products/:id
  const adminProdPatch = endpoint.match(/^\/admin\/products\/(\d+)$/);
  if (adminProdPatch && method === 'PATCH') {
    const id = parseInt(adminProdPatch[1], 10);
    const idx = mockProducts.findIndex((p) => p.id === id);
    if (idx !== -1) {
      mockProducts[idx] = { ...mockProducts[idx], ...body };
      saveLocal('products', mockProducts);
      return { data: mockProducts[idx] };
    }
  }

  // DELETE /admin/products/:id
  const adminProdDel = endpoint.match(/^\/admin\/products\/(\d+)$/);
  if (adminProdDel && method === 'DELETE') {
    const id = parseInt(adminProdDel[1], 10);
    const prod = mockProducts.find((p) => p.id === id);
    if (prod) prod.is_active = 0;
    saveLocal('products', mockProducts);
    return { message: 'Product deactivated' };
  }

  // GET /admin/orders
  if (endpoint === '/admin/orders') {
    return { data: mockOrders };
  }

  // PATCH /admin/orders/:id/status
  const adminOrderStatus = endpoint.match(/^\/admin\/orders\/(\d+)\/status$/);
  if (adminOrderStatus && method === 'PATCH') {
    const id = parseInt(adminOrderStatus[1], 10);
    const order = mockOrders.find((o) => o.id === id);
    if (order) {
      order.status = body.status;
      saveLocal('orders', mockOrders);
      return { data: order };
    }
  }

  return { data: [] };
}
