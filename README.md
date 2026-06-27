# 🌈 Rainbow Shop

Rainbow Shop is a modern, responsive, and full-featured e-commerce fashion storefront built with React and Tailwind CSS v4 on the frontend, and Node.js, Express, and MongoDB on the backend. It features PayPal checkout, rich media handling via Cloudinary, and an **AI-powered Shopping Assistant** integrated with Google Gemini API for natural language shopping assistance and multimodal image search.

---

## 🚀 Key Features

- **🛒 Interactive Shopping Cart & Catalog**: Seamless browsing with filters, smooth drag-and-drop sort interfaces, and modern layout designs.
- **🤖 Intelligent AI Shopping Assistant**: Integrated with **Google Gemini**, allowing users to:
  - Search for clothes and styles using natural language (e.g. "Show me blue tops under $50").
  - Upload an image to find matching style items.
  - Automatically retrieve order status, see new arrivals, and get best sellers.
- **💳 Secure PayPal Checkout**: Integrated checkout workflow with payment confirmation.
- **👤 User Management & Authentication**: Secure user registration, JWT-based login session, user profile, and order history.
- **🛠 Admin Dashboard**: Admin interface to manage products, categories, view list of orders, and update statuses.
- **📸 Cloud Media Storage**: Image uploading supported by Cloudinary API.

---

## 🛠 Tech Stack

| Component | Technology | Key Libraries / Frameworks |
| :--- | :--- | :--- |
| **Frontend** | React (Vite) | Redux Toolkit, React Router DOM, Tailwind CSS v4, `@dnd-kit`, `@paypal/react-paypal-js`, Sonner (Toasts), Quill (Rich Text Editor), React Icons |
| **Backend** | Node.js + Express | Mongoose (MongoDB ODM), JSON Web Token (JWT), Cloudinary, Multer, Streamifier, Google Gemini AI |
| **Database** | MongoDB | Cloud-hosted MongoDB Atlas |

---

## 📂 Project Structure

```text
Rainbow-Shop/
├── backend/                  # Node.js Express backend API
│   ├── config/               # Database connection config
│   ├── controllers/          # API business logic
│   ├── middleware/           # Authentication & role middleware
│   ├── models/               # MongoDB models (User, Product, Order, etc.)
│   ├── routes/               # API endpoints structure
│   ├── seeder.js             # Database seeder script
│   ├── package.json          # Backend dependencies and scripts
│   └── .env.example          # Sample environment configuration
├── frontend/                 # React Vite frontend application
│   ├── public/               # Static assets
│   ├── src/                  # React source code
│   │   ├── components/       # Reusable components (Cart, Products, Common, Admin)
│   │   ├── context/          # Context API providers
│   │   ├── pages/            # Page templates (Home, Collection, Login, Admin, etc.)
│   │   ├── redux/            # State management store and slices
│   │   ├── App.jsx           # Root layout and routes
│   │   └── main.jsx          # Entry point
│   ├── package.json          # Frontend dependencies and scripts
│   └── .env.example          # Sample client environment configuration
└── README.md                 # Project documentation
```

---

## ⚙️ Setup & Installation

Follow these steps to run the application locally.

### 1. Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster)
- [Yarn](https://yarnpkg.com/) or npm

---

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   yarn install
   # or
   npm install
   ```

3. Create your `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

4. Open `.env` and fill in your credentials:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_uri
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   GEMINI_API_KEY=your_google_gemini_api_key
   ```

5. Seed the database with default data & admin:
   ```bash
   yarn seed
   # or
   npm run seed
   ```
   > 💡 **Default Admin Credentials:**
   > - **Email**: `admin@example.com`
   > - **Password**: `123456`

6. Start the development server:
   ```bash
   yarn dev
   # or
   npm run dev
   ```
   The backend will start running at `http://localhost:5000`.

---

### 3. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   yarn install
   # or
   npm install
   ```

3. Create your `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

4. Configure the frontend variables:
   ```env
   VITE_BACKEND_URL=http://localhost:5000
   VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
   ```

5. Start the Vite development server:
   ```bash
   yarn dev
   # or
   npm run dev
   ```
   Open `http://localhost:5173` in your browser to explore the store.

---

## 🛠 API Endpoints Summary

The backend exposes the following REST API endpoints:

| Endpoint | Method | Description | Authentication |
| :--- | :--- | :--- | :--- |
| `/api/users/register` | `POST` | Register a new customer account | Public |
| `/api/users/login` | `POST` | User authentication & issue JWT | Public |
| `/api/users/profile` | `GET` | Retrieve logged-in user profile details | User JWT |
| `/api/products` | `GET` | Retrieve and filter clothing catalog items | Public |
| `/api/cart` | `POST`/`GET` | Retrieve/Update user's active shopping cart | User JWT |
| `/api/checkout` | `POST` | Process & save pre-checkout metadata | User JWT |
| `/api/orders` | `POST`/`GET` | Create order & view active/past orders | User JWT |
| `/api/chat` | `POST` | Send queries to Gemini AI Chatbot | Public/User JWT |
| `/api/upload` | `POST` | Upload product images to Cloudinary | Admin / User |
| `/api/admin/products` | `POST`/`DELETE` | Add or delete products from directory | Admin JWT |
| `/api/admin/orders` | `GET`/`PUT` | Manage and update delivery status of orders | Admin JWT |

---

## 🤖 AI Shopping Assistant (Google Gemini)

The application features a built-in assistant designed to streamline the shopping experience. Using Google Gemini API's **Function Calling (Tools)** capability, the chatbot can:
1. **Interactive Product Search**: Executes queries via the database (`search_products`) matching categories, gender, price boundaries, and colors.
2. **Order Checkups**: Calls `check_order_status` using MongoDB ObjectIDs to report delivery updates to the customer.
3. **Multimodal Analysis**: Decodes user-uploaded images to parse colors, styles, and suggest matching visual pieces from the inventory.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to open a Pull Request or report bugs via issues.

## 📄 License

This project is licensed under the [MIT License](LICENSE).
