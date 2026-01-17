import google.generativeai as genai
from config import Config
import json
import os

class AIService:
    def __init__(self):
        # Configure Gemini with API key
        api_key = Config.GEMINI_API_KEY or os.getenv('GEMINI_API_KEY')
        if not api_key or api_key.startswith('AIzaSyDemoKey'):
            print("⚠️  WARNING: Gemini API key not configured properly")
            self.model = None
        else:
            try:
                genai.configure(api_key=api_key)
                # Try gemini-1.5-flash-latest first, fallback to gemini-pro
                self.model = genai.GenerativeModel('gemini-1.5-flash-latest')
                print("✅ Gemini AI initialized successfully")
            except Exception as e:
                print(f"⚠️  Gemini initialization error: {e}")
                self.model = None
        
        self.chat_system_prompt = """You are QuickPlate AI Assistant, a helpful chatbot for a campus food ordering app.

Your knowledge:
- QuickPlate is a campus dining app that helps students order food quickly
- We serve Breakfast, Lunch, Dinner, and Snacks
- Popular items: Masala Dosa, Idli Sambar, Veg Thali, Paneer Tikka, Coffee
- Pickup is at the main canteen counter
- Orders typically take 10-20 minutes to prepare
- We accept UPI, Cash, and Loyalty points program: Earn 5% of order total as points (1 point = ₹1)

Answer questions about:
- Menu items and ingredients
- Allergen information (ask user to specify allergies)
- Order status and timing
- Loyalty points program (Earn 5% of bill, 1 point = ₹1, redeem for discounts)
- App features

Be friendly, concise, and helpful. If you don't know something, suggest contacting support at support@quickplate.com."""

    def chat(self, user_message, conversation_history=None):
        """
        Handle chatbot conversation
        """
        # Fallback responses if Gemini is not available
        if not self.model:
            return self._fallback_chat(user_message)
        
        try:
            # Build conversation context
            messages = [self.chat_system_prompt]
            
            if conversation_history:
                for msg in conversation_history:
                    if msg.get('user'):
                        messages.append(f"User: {msg['user']}")
                    if msg.get('assistant'):
                        messages.append(f"Assistant: {msg['assistant']}")
            
            messages.append(f"User: {user_message}")
            
            # Generate response
            response = self.model.generate_content("\n".join(messages))
            
            return {
                'success': True,
                'message': response.text
            }
        except Exception as e:
            print(f"AI Error: {str(e)}")
            # Use fallback on error
            return self._fallback_chat(user_message)
    
    def _fallback_chat(self, user_message):
        """Simple rule-based chatbot fallback"""
        message_lower = user_message.lower()
        
        # Menu questions
        if 'vegetarian' in message_lower or 'veg' in message_lower or 'menu' in message_lower or 'options' in message_lower:
            return {
                'success': True,
                'message': "We have amazing vegetarian options! 🌱\n\nBreakfast: Masala Dosa, Idli Sambar, Poha, Upma\nLunch: Veg Thali, Chole Bhature, Rajma Chawal, Paneer Tikka\nDinner: Dal Tadka, Palak Paneer, Aloo Paratha\nSnacks: Samosa, Vada Pav, Pav Bhaji, Coffee, Tea\n\nAll our items are 100% vegetarian!"
            }
        
        # Thali questions
        if 'thali' in message_lower:
            return {
                'success': True,
                'message': "The Veg Thali is our most popular meal! 🍛\n\nIt includes:\n- Rice\n- 2 Rotis\n- Dal (lentils)\n- Sabzi (vegetable curry)\n- Curd\n- Pickle\n\nPrice: ₹80\nPrep time: ~20 minutes\n\nIt's a complete, balanced meal perfect for lunch!"
            }
        
        # Timing questions
        if 'time' in message_lower or 'long' in message_lower or 'prepare' in message_lower:
            return {
                'success': True,
                'message': "Most orders take 10-20 minutes to prepare. ⏱️\n\nQuick items (5-10 min): Coffee, Tea, Samosa\nRegular items (15-20 min): Dosa, Thali, Biryani\n\nYou'll get a notification when your order is ready for pickup!"
            }
        
        # Loyalty points
        if 'loyalty' in message_lower or 'points' in message_lower or 'redeem' in message_lower:
            return {
                'success': True,
                'message': "Earn loyalty points with every order! 🎁\n\n- **Earnings**: You get 5% of your total bill as points.\n- **Value**: 1 point = ₹1 rupee.\n\nYou can use your points to pay for your meals directly at checkout. Check the Rewards tab to see your current balance!"
            }
        
        # Pickup/location
        if 'pickup' in message_lower or 'where' in message_lower or 'location' in message_lower:
            return {
                'success': True,
                'message': "Pickup is at the main canteen counter. 📍\n\nYou'll receive a notification when your order is ready. Just show your order ID at the counter to collect your food!"
            }
        
        # Payment
        if 'payment' in message_lower or 'pay' in message_lower:
            return {
                'success': True,
                'message': "We accept multiple payment methods: 💳\n\n- UPI\n- Loyalty Points\n\nYou can choose your preferred method at checkout!"
            }
        
        # Default response
        return {
            'success': True,
            'message': "Hi! I'm QuickPlate Assistant. 👋\n\nI can help you with:\n- Menu and vegetarian options\n- Ingredients and preparation time\n- Loyalty points program\n- Pickup location and timing\n- Payment methods\n\nWhat would you like to know?"
        }
    
    def get_recommendations(self, user_orders, current_time=None):
        """
        Generate personalized meal recommendations based on order history
        """
        try:
            # Prepare order history summary
            if not user_orders:
                prompt = """Suggest 3 popular meals from QuickPlate menu for a new user. 
                Consider it's currently daytime. Return as JSON array with format:
                [{"name": "Meal Name", "reason": "Why recommended", "category": "Breakfast/Lunch/Dinner/Snacks"}]"""
            else:
                order_summary = self._summarize_orders(user_orders)
                prompt = f"""Based on this user's order history:
{order_summary}

Suggest 3 personalized meal recommendations. Consider:
- Their favorite items
- Time of day patterns
- Variety (don't repeat same items)

Return as JSON array with format:
[{{"name": "Meal Name", "reason": "Why recommended", "category": "Breakfast/Lunch/Dinner/Snacks"}}]"""
            
            response = self.model.generate_content(prompt)
            
            # Parse JSON response
            recommendations = json.loads(response.text.strip().replace('```json', '').replace('```', ''))
            
            return {
                'success': True,
                'recommendations': recommendations
            }
        except Exception as e:
            # Fallback recommendations
            return {
                'success': True,
                'recommendations': [
                    {'name': 'Masala Dosa', 'reason': 'Popular breakfast choice', 'category': 'Breakfast'},
                    {'name': 'Veg Thali', 'reason': 'Complete meal option', 'category': 'Lunch'},
                    {'name': 'Coffee', 'reason': 'Perfect pick-me-up', 'category': 'Snacks'}
                ]
            }
    
    def _summarize_orders(self, orders):
        """Helper to summarize order history"""
        summary = []
        for order in orders[-10:]:  # Last 10 orders
            items = json.loads(order.items) if isinstance(order.items, str) else order.items
            item_names = [item.get('name', 'Unknown') for item in items]
            summary.append(f"- Ordered: {', '.join(item_names)} at {order.created_at.strftime('%A %I:%M %p')}")
        return "\n".join(summary)

# Singleton instance
ai_service = AIService()
