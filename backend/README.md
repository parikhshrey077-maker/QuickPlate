# QuickPlate Backend

Flask backend with Google Gemini AI integration for QuickPlate food ordering app.

## Features

- 🔐 **Authentication**: SAP ID-based login/signup
- 🍽️ **Menu Management**: Browse meals by category
- 📦 **Order Processing**: Create and track orders
- 🎁 **Loyalty Points**: Earn and redeem points
- 🤖 **AI Chatbot**: Gemini-powered help & support
- ✨ **Smart Recommendations**: Personalized meal suggestions

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Environment

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Edit `.env` and add your Gemini API key:

```
GEMINI_API_KEY=your_actual_api_key_here
```

**Get your Gemini API key**: https://makersuite.google.com/app/apikey

### 3. Initialize Database

```bash
python seed_db.py
```

This will create the SQLite database and populate it with sample meals and offers.

### 4. Run the Server

```bash
python app.py
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with SAP ID
- `POST /api/auth/signup` - Create new account
- `GET /api/auth/users/:id` - Get user profile
- `PUT /api/auth/users/:id` - Update profile

### Meals
- `GET /api/meals` - Get all meals (optional: `?category=Breakfast`)
- `GET /api/meals/:id` - Get single meal

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/user/:userId` - Get user's order history
- `PUT /api/orders/:id/status` - Update order status

### Loyalty
- `GET /api/loyalty/:userId` - Get loyalty points balance
- `GET /api/loyalty/offers` - Get all offers
- `POST /api/loyalty/redeem` - Redeem points

### AI Features
- `POST /api/ai/chat` - AI chatbot (send: `{message, history}`)
- `GET /api/ai/recommendations/:userId` - Get personalized recommendations

## Testing

Test the API health:
```bash
curl http://localhost:5000/health
```

Test AI chatbot:
```bash
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What vegetarian options do you have?"}'
```

## Project Structure

```
backend/
├── app.py              # Main Flask application
├── config.py           # Configuration
├── models.py           # Database models
├── seed_db.py          # Database seeder
├── routes/
│   ├── auth.py        # Authentication endpoints
│   ├── meals.py       # Meal endpoints
│   ├── orders.py      # Order endpoints
│   ├── loyalty.py     # Loyalty endpoints
│   └── ai.py          # AI endpoints
├── services/
│   └── ai_service.py  # Gemini AI integration
└── requirements.txt
```

## Next Steps

1. Update frontend to use these API endpoints instead of AsyncStorage
2. Add error handling and loading states in frontend
3. Test AI chatbot and recommendations
4. Deploy to production (Render, Railway, or PythonAnywhere)
