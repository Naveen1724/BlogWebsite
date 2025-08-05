# 🍪 Cookie-Based Authentication System

## 🚀 **What Changed**

Your API now automatically handles authentication using **HTTP-only cookies** instead of manual token management. This provides better security and user experience.

## 🔧 **Key Features**

### ✅ **Automatic Cookie Management**

- ✅ **Signup/Login**: Automatically sets secure HTTP-only cookie
- ✅ **Protected Routes**: Automatically reads token from cookies
- ✅ **Logout**: Clears authentication cookie
- ✅ **Secure**: HTTP-only cookies prevent XSS attacks

### ✅ **Backward Compatible**

- Still supports `Authorization: Bearer <token>` header
- Cookies take priority, falls back to headers

## 📋 **Updated API Endpoints**

### **Base URL:** `http://localhost:5000`

---

## 🔐 **1. User Registration (Signup)**

### **POST** `/api/auth/signup`

- **URL:** `http://localhost:5000/api/auth/signup`
- **Headers:** `Content-Type: application/json`
- **Body:**

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "Password123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user",
      "isActive": true
    }
  }
}
```

**🍪 Cookie Set:** `authToken` (HTTP-only, 7 days expiry)

---

## 🔑 **2. User Login**

### **POST** `/api/auth/login`

- **URL:** `http://localhost:5000/api/auth/login`
- **Headers:** `Content-Type: application/json`
- **Body:**

```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user",
      "isActive": true,
      "lastLogin": "2025-07-07T10:30:00.000Z"
    }
  }
}
```

**🍪 Cookie Set:** `authToken` (HTTP-only, 7 days expiry)

---

## 👤 **3. Get User Profile (Protected)**

### **GET** `/api/auth/profile`

- **URL:** `http://localhost:5000/api/auth/profile`
- **Headers:** None required (uses cookies automatically)
- **Body:** None

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user",
      "isActive": true,
      "lastLogin": "2025-07-07T10:30:00.000Z",
      "createdAt": "2025-07-07T09:00:00.000Z",
      "updatedAt": "2025-07-07T10:30:00.000Z"
    }
  }
}
```

---

## 🚪 **4. Logout**

### **POST** `/api/auth/logout`

- **URL:** `http://localhost:5000/api/auth/logout`
- **Headers:** None required (uses cookies automatically)
- **Body:** None

**Response:**

```json
{
  "success": true,
  "message": "Logout successful"
}
```

**🍪 Cookie Cleared:** `authToken`

---

## 🧪 **Testing in Postman**

### **Important Postman Settings:**

1. **Enable Cookie Jar:**

   - Go to Settings (⚙️) → General
   - Turn ON "Automatically follow redirects"
   - Turn ON "Send cookies"

2. **Test Flow:**
   1. **Signup** → Cookie gets set automatically
   2. **Login** → Cookie gets set automatically
   3. **Get Profile** → Works without adding headers
   4. **Logout** → Cookie gets cleared

### **No Manual Token Management Needed!**

- ✅ No need to copy/paste tokens
- ✅ No need to set Authorization headers
- ✅ Works automatically after login/signup

---

## 🌐 **Frontend Integration**

### **JavaScript/React Example:**

```javascript
// All requests must include credentials: 'include'
const API_BASE = "http://localhost:5000/api";

// Signup
const signup = async (userData) => {
  const response = await fetch(`${API_BASE}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // 🍪 Include cookies
    body: JSON.stringify(userData),
  });
  return response.json();
};

// Login
const login = async (credentials) => {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // 🍪 Include cookies
    body: JSON.stringify(credentials),
  });
  return response.json();
};

// Get Profile (Protected)
const getProfile = async () => {
  const response = await fetch(`${API_BASE}/auth/profile`, {
    credentials: "include", // 🍪 Include cookies
  });
  return response.json();
};

// Logout
const logout = async () => {
  const response = await fetch(`${API_BASE}/auth/logout`, {
    method: "POST",
    credentials: "include", // 🍪 Include cookies
  });
  return response.json();
};
```

---

## 🔒 **Security Features**

### **Cookie Security:**

- ✅ **HTTP-only:** Prevents XSS attacks
- ✅ **Secure:** Uses HTTPS in production
- ✅ **SameSite:** CSRF protection
- ✅ **Expiry:** 7 days automatic expiration

### **CORS Configuration:**

- ✅ **Credentials:** `true` (allows cookies)
- ✅ **Origin:** Restricted to your frontend URL

---

## 🎯 **Quick Test Guide**

### **1. Test with HTML File:**

Open `cookie-test.html` in your browser to test the system.

### **2. Test with Postman:**

1. **Enable cookies** in Postman settings
2. **POST** `/api/auth/signup` with user data
3. **GET** `/api/auth/profile` (should work without headers)
4. **POST** `/api/auth/logout`
5. **GET** `/api/auth/profile` (should fail after logout)

### **3. Manual Cookie Check:**

- Open browser developer tools
- Go to Application → Cookies
- Check for `authToken` cookie after login

---

## 🚀 **Production Considerations**

### **Environment Variables:**

```env
NODE_ENV=production
CLIENT_URL=https://yourdomain.com
MONGODB_URL=your_production_mongodb_url
JWT_SECRET=your_super_secure_production_secret
```

### **Production Security:**

- Cookies automatically use HTTPS in production
- CORS restricted to your domain
- Secure cookie settings enabled

---

## 🎉 **Benefits of Cookie-Based Auth**

1. **🔒 More Secure:** HTTP-only cookies prevent XSS
2. **🚀 Better UX:** No manual token management
3. **🔄 Automatic:** Works seamlessly with browsers
4. **🛡️ CSRF Protection:** SameSite cookie attribute
5. **⏰ Auto-Expiry:** Automatic session management

Your authentication system is now production-ready with industry-standard security practices!
