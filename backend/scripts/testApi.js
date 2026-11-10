// Integration Test Suite for ChaCeylon Express Backend
const http = require('http');

const API_BASE = process.env.API_BASE_URL || 'http://localhost:5000/api';

function makeRequest(url, method = 'GET', data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const bodyStr = data ? JSON.stringify(data) : null;

    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(bodyStr ? { 'Content-Length': Buffer.byteLength(bodyStr) } : {}),
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', reject);
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

async function runTests() {
  console.log('=== Running ChaCeylon Fullstack Backend Test Suite ===\n');
  let passed = 0;
  let failed = 0;

  // 1. Health check
  try {
    const res = await makeRequest(`${API_BASE}/health`);
    if (res.status === 200 && res.data.status === 'ok') {
      console.log('✓ PASS: GET /api/health - Status:', res.data.status, '| DB:', res.data.database);
      passed++;
    } else {
      console.error('✗ FAIL: GET /api/health returned status', res.status);
      failed++;
    }
  } catch (err) {
    console.error('✗ FAIL: GET /api/health error:', err.message);
    failed++;
  }

  // 2. Categories
  try {
    const res = await makeRequest(`${API_BASE}/categories`);
    if (res.status === 200 && Array.isArray(res.data.data)) {
      console.log(`✓ PASS: GET /api/categories - Found ${res.data.data.length} categories`);
      passed++;
    } else {
      console.error('✗ FAIL: GET /api/categories');
      failed++;
    }
  } catch (err) {
    console.error('✗ FAIL: GET /api/categories error:', err.message);
    failed++;
  }

  // 3. Products
  try {
    const res = await makeRequest(`${API_BASE}/products`);
    if (res.status === 200 && Array.isArray(res.data.data)) {
      console.log(`✓ PASS: GET /api/products - Found ${res.data.data.length} active tea products`);
      passed++;
    } else {
      console.error('✗ FAIL: GET /api/products');
      failed++;
    }
  } catch (err) {
    console.error('✗ FAIL: GET /api/products error:', err.message);
    failed++;
  }

  // 4. Auth - Register
  const testEmail = `tester_${Date.now()}@example.com`;
  let testToken = null;
  try {
    const res = await makeRequest(`${API_BASE}/auth/register`, 'POST', {
      name: 'Automated Tester',
      email: testEmail,
      password: 'password123'
    });
    if (res.status === 201 && res.data.token) {
      testToken = res.data.token;
      console.log('✓ PASS: POST /api/auth/register - Created user:', res.data.user.email);
      passed++;
    } else {
      console.error('✗ FAIL: POST /api/auth/register', res.data);
      failed++;
    }
  } catch (err) {
    console.error('✗ FAIL: POST /api/auth/register error:', err.message);
    failed++;
  }

  // 5. Auth - Login
  try {
    const res = await makeRequest(`${API_BASE}/auth/login`, 'POST', {
      email: testEmail,
      password: 'password123'
    });
    if (res.status === 200 && res.data.token) {
      console.log('✓ PASS: POST /api/auth/login - Logged in successfully');
      passed++;
    } else {
      console.error('✗ FAIL: POST /api/auth/login', res.data);
      failed++;
    }
  } catch (err) {
    console.error('✗ FAIL: POST /api/auth/login error:', err.message);
    failed++;
  }

  // 6. Auth - Profile (/auth/me)
  if (testToken) {
    try {
      const res = await makeRequest(`${API_BASE}/auth/me`, 'GET', null, {
        Authorization: `Bearer ${testToken}`
      });
      if (res.status === 200 && res.data.user) {
        console.log('✓ PASS: GET /api/auth/me - Authenticated as:', res.data.user.name);
        passed++;
      } else {
        console.error('✗ FAIL: GET /api/auth/me', res.data);
        failed++;
      }
    } catch (err) {
      console.error('✗ FAIL: GET /api/auth/me error:', err.message);
      failed++;
    }
  }

  // 7. Orders - Create
  try {
    const res = await makeRequest(`${API_BASE}/orders`, 'POST', {
      items: [{ product_id: 1, quantity: 2 }],
      delivery_address: {
        recipient_name: 'Test Recipient',
        phone: '0771234567',
        address_line1: '123 Temple Road',
        city: 'Colombo',
        district: 'Colombo'
      },
      payment_method: 'cash_on_delivery'
    }, testToken ? { Authorization: `Bearer ${testToken}` } : {});

    if (res.status === 201 && res.data.data) {
      console.log(`✓ PASS: POST /api/orders - Created order ${res.data.data.order_number} (Total: LKR ${res.data.data.total_amount})`);
      passed++;
    } else {
      console.error('✗ FAIL: POST /api/orders', res.data);
      failed++;
    }
  } catch (err) {
    console.error('✗ FAIL: POST /api/orders error:', err.message);
    failed++;
  }

  console.log(`\n=== Test Summary: ${passed} Passed, ${failed} Failed ===\n`);
  return failed;
}

// Exit with a non-zero code when any test fails so CI pipelines go red
runTests()
  .then((failed) => process.exit(failed > 0 ? 1 : 0))
  .catch((err) => {
    console.error('Test runner crashed:', err);
    process.exit(1);
  });
