# 📝 **Blog Management API Documentation**

## **Base URL:** `http://localhost:5000/api/blogs`

---

## 📋 **Complete Blog API Endpoints**

### **1. Create Blog (Private)**

- **POST** `/api/blogs`
- **Access:** Private (authenticated users only)
- **Headers:** None (uses cookies automatically)
- **Body:**

```json
{
  "title": "My First Blog Post",
  "content": "This is the full content of my blog post. It can be very long and contain HTML or markdown.",
  "summary": "This is a short summary of what the blog post is about.",
  "tags": ["javascript", "nodejs", "tutorial"],
  "category": "technology",
  "status": "published",
  "featuredImage": "https://example.com/image.jpg",
  "isPublic": true
}
```

**Response:**

```json
{
  "success": true,
  "message": "Blog created successfully",
  "data": {
    "blog": {
      "id": "blog_id",
      "title": "My First Blog Post",
      "content": "This is the full content...",
      "summary": "This is a short summary...",
      "author": {
        "id": "author_id",
        "username": "johndoe",
        "email": "john@example.com"
      },
      "tags": ["javascript", "nodejs", "tutorial"],
      "category": "technology",
      "status": "published",
      "readTime": 2,
      "views": 0,
      "likes": [],
      "likeCount": 0,
      "slug": "my-first-blog-post-1720353600000",
      "featuredImage": "https://example.com/image.jpg",
      "isPublic": true,
      "createdAt": "2025-07-07T10:00:00.000Z",
      "updatedAt": "2025-07-07T10:00:00.000Z"
    }
  }
}
```

---

### **2. Get All Blogs (Public)**

- **GET** `/api/blogs`
- **Access:** Public
- **Query Parameters:**
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)
  - `category` (optional): Filter by category
  - `status` (optional): Filter by status (default: 'published')
  - `search` (optional): Search in title, summary, tags
  - `sortBy` (optional): Sort field (default: 'createdAt')
  - `sortOrder` (optional): 'asc' or 'desc' (default: 'desc')

**URL Examples:**

- `GET /api/blogs` - Get all blogs
- `GET /api/blogs?page=2&limit=5` - Pagination
- `GET /api/blogs?category=technology` - Filter by category
- `GET /api/blogs?search=javascript` - Search blogs
- `GET /api/blogs?sortBy=views&sortOrder=desc` - Sort by views

**Response:**

```json
{
  "success": true,
  "data": {
    "blogs": [
      {
        "id": "blog_id",
        "title": "My First Blog Post",
        "summary": "This is a short summary...",
        "author": {
          "id": "author_id",
          "username": "johndoe",
          "email": "john@example.com"
        },
        "tags": ["javascript", "nodejs"],
        "category": "technology",
        "status": "published",
        "readTime": 2,
        "views": 10,
        "likeCount": 5,
        "slug": "my-first-blog-post-1720353600000",
        "featuredImage": "https://example.com/image.jpg",
        "createdAt": "2025-07-07T10:00:00.000Z",
        "updatedAt": "2025-07-07T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

---

### **3. Get Single Blog by ID (Public)**

- **GET** `/api/blogs/:id`
- **Access:** Public (but private blogs require authentication)
- **Headers:** None

**URL Example:**

- `GET /api/blogs/60d5ecb74b24a90015c4e123`

**Response:**

```json
{
  "success": true,
  "data": {
    "blog": {
      "id": "blog_id",
      "title": "My First Blog Post",
      "content": "This is the full content of my blog post...",
      "summary": "This is a short summary...",
      "author": {
        "id": "author_id",
        "username": "johndoe",
        "email": "john@example.com"
      },
      "tags": ["javascript", "nodejs", "tutorial"],
      "category": "technology",
      "status": "published",
      "readTime": 2,
      "views": 11,
      "likes": ["user_id_1", "user_id_2"],
      "likeCount": 2,
      "slug": "my-first-blog-post-1720353600000",
      "featuredImage": "https://example.com/image.jpg",
      "isPublic": true,
      "createdAt": "2025-07-07T10:00:00.000Z",
      "updatedAt": "2025-07-07T10:00:00.000Z"
    }
  }
}
```

---

### **4. Get Single Blog by Slug (Public)**

- **GET** `/api/blogs/slug/:slug`
- **Access:** Public (but private blogs require authentication)
- **Headers:** None

**URL Example:**

- `GET /api/blogs/slug/my-first-blog-post-1720353600000`

**Response:** Same as Get Single Blog by ID

---

### **5. Update Blog (Private - Owner Only)**

- **PUT** `/api/blogs/:id`
- **Access:** Private (owner only)
- **Headers:** None (uses cookies automatically)
- **Body:** (All fields optional)

```json
{
  "title": "Updated Blog Title",
  "content": "Updated content...",
  "summary": "Updated summary...",
  "tags": ["javascript", "nodejs", "updated"],
  "category": "programming",
  "status": "published",
  "featuredImage": "https://example.com/new-image.jpg",
  "isPublic": false
}
```

**Response:**

```json
{
  "success": true,
  "message": "Blog updated successfully",
  "data": {
    "blog": {
      // Updated blog object
    }
  }
}
```

---

### **6. Delete Blog (Private - Owner Only)**

- **DELETE** `/api/blogs/:id`
- **Access:** Private (owner only)
- **Headers:** None (uses cookies automatically)
- **Body:** None

**URL Example:**

- `DELETE /api/blogs/60d5ecb74b24a90015c4e123`

**Response:**

```json
{
  "success": true,
  "message": "Blog deleted successfully"
}
```

---

### **7. Get My Blogs (Private)**

- **GET** `/api/blogs/my-blogs`
- **Access:** Private
- **Headers:** None (uses cookies automatically)
- **Query Parameters:**
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)
  - `status` (optional): Filter by status
  - `sortBy` (optional): Sort field (default: 'createdAt')
  - `sortOrder` (optional): 'asc' or 'desc' (default: 'desc')

**URL Examples:**

- `GET /api/blogs/my-blogs` - Get all my blogs
- `GET /api/blogs/my-blogs?status=draft` - Get my draft blogs
- `GET /api/blogs/my-blogs?page=2&limit=5` - Pagination

**Response:**

```json
{
  "success": true,
  "data": {
    "blogs": [
      {
        // User's blog objects (including drafts and private blogs)
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "pages": 1
    }
  }
}
```

---

### **8. Like/Unlike Blog (Private)**

- **POST** `/api/blogs/:id/like`
- **Access:** Private
- **Headers:** None (uses cookies automatically)
- **Body:** None

**URL Example:**

- `POST /api/blogs/60d5ecb74b24a90015c4e123/like`

**Response:**

```json
{
  "success": true,
  "message": "Blog liked", // or "Blog unliked"
  "data": {
    "likeCount": 6,
    "isLiked": true
  }
}
```

---

## 🔐 **Authentication & Authorization**

### **Public Endpoints:**

- ✅ `GET /api/blogs` - Anyone can view public blogs
- ✅ `GET /api/blogs/:id` - Anyone can view public blogs
- ✅ `GET /api/blogs/slug/:slug` - Anyone can view public blogs

### **Private Endpoints (Require Authentication):**

- 🔒 `POST /api/blogs` - Any authenticated user can create
- 🔒 `GET /api/blogs/my-blogs` - User's own blogs
- 🔒 `POST /api/blogs/:id/like` - Any authenticated user can like

### **Owner Only Endpoints:**

- 👤 `PUT /api/blogs/:id` - Only blog owner can update
- 👤 `DELETE /api/blogs/:id` - Only blog owner can delete

---

## 📊 **Blog Model Fields**

| Field           | Type     | Required | Description                        |
| --------------- | -------- | -------- | ---------------------------------- |
| `title`         | String   | ✅       | Blog title (5-200 chars)           |
| `content`       | String   | ✅       | Full blog content (min 10 chars)   |
| `summary`       | String   | ✅       | Short summary (10-500 chars)       |
| `author`        | ObjectId | ✅       | Reference to User                  |
| `tags`          | Array    | ❌       | Array of tags                      |
| `category`      | String   | ❌       | Blog category (default: 'general') |
| `status`        | String   | ❌       | 'draft', 'published', 'archived'   |
| `readTime`      | Number   | ❌       | Auto-calculated reading time       |
| `views`         | Number   | ❌       | View count (auto-incremented)      |
| `likes`         | Array    | ❌       | Array of user IDs who liked        |
| `slug`          | String   | ❌       | Auto-generated URL slug            |
| `featuredImage` | String   | ❌       | Featured image URL                 |
| `isPublic`      | Boolean  | ❌       | Public/private visibility          |

---

## 🚀 **Quick Test Flow**

1. **Create a blog:** `POST /api/blogs`
2. **View all blogs:** `GET /api/blogs`
3. **View single blog:** `GET /api/blogs/:id`
4. **Update your blog:** `PUT /api/blogs/:id`
5. **Like a blog:** `POST /api/blogs/:id/like`
6. **View your blogs:** `GET /api/blogs/my-blogs`
7. **Delete your blog:** `DELETE /api/blogs/:id`

---

## 📝 **Error Responses**

### **Validation Error:**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title must be between 5 and 200 characters"
    }
  ]
}
```

### **Authentication Error:**

```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### **Authorization Error:**

```json
{
  "success": false,
  "message": "Access denied. You can only update your own blogs."
}
```

### **Not Found Error:**

```json
{
  "success": false,
  "message": "Blog not found"
}
```

---

## 🎯 **Advanced Features**

- ✅ **Automatic Slug Generation** from title
- ✅ **Read Time Calculation** (based on word count)
- ✅ **View Counter** (increments on each view)
- ✅ **Like System** (users can like/unlike blogs)
- ✅ **Search & Filter** (by title, summary, tags)
- ✅ **Pagination** (for large datasets)
- ✅ **Sorting** (by date, views, likes)
- ✅ **Draft System** (save drafts before publishing)
- ✅ **Privacy Control** (public/private blogs)
- ✅ **Category System** (organize blogs by category)
- ✅ **Tag System** (for better discovery)

Your blog API is now complete with all CRUD operations and advanced features!
