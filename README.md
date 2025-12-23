#BookLibraryFrontend

BookLibrary is a social/utility mobile application featuring a robust Phone Authentication system, user profile management, real-time Push Notifications, and a Subscription model.

🚀 Tech Stack
Framework: React Native (Expo/CLI)
Language: JavaScript (ES6+)
Authentication: Firebase Phone Auth
Navigation: React Navigation (Stack & Tab)
State Management: Context API
Storage: AsyncStorage (Local data & JWT persistence)
Push Notifications: Firebase Cloud Messaging (FCM)

🔄 Application Flow
The app follows a secure, verification-first logic to ensure all users are authenticated via their phone numbers.
1. Authentication Flow
Welcome/Signup: User enters their phone number.
OTP Request: The app communicates with Firebase to send a 6-digit SMS code.
Verification: * The app verifies the code with Firebase.
Upon success, the Firebase UID is sent to our Node.js Backend.
Backend Check (isNewUser logic):
New User: Redirected to RegisterUserScreen to provide Email, Username, and DOB.
Existing User: Authenticated via JWT and sent straight to the HomeScreen.
Already Registered Check: If a user tries to "Sign Up" with a number that already has a profile, they are redirected to the Login screen.

2. Registration Flow
Profile Setup: Users must be at least 13 years old (validated via custom DOB logic).
Data Persistence: User profile data is synced with MongoDB via a protected JWT route.
3. Subscription & Status
Users can view their membership status.
Status Format: Status: ACTIVE • Expires on (Date)
The app checks the expiryDate from the backend to restrict or allow premium features.

🔔 Key Features
📡 Push Notifications (FCM)
The app generates a unique FCM Token for every device.
The token is stored in the MongoDB User document.
Enables the backend to send targeted alerts for social updates or subscription reminders.

💳 Subscription Management
Securely tracks user tiers (Free vs. Active).
Displays expiration dates dynamically based on server-side data.

🔒 Security
JWT (JSON Web Tokens): All API calls to the backend (updating profile, fetching status) are secured with a Bearer token in the header.
Middleware: The backend uses authMiddleware to verify the user's identity before any database changes.

🛠 Installation & Setup
1. Clone the repository:
git clone https://github.com/your-username/domato-frontend.git

2. Install dependencies:
npm install

3. Environment Variables: Create a .env or constants.js file and add your Backend URL:
export const API_URL = 'http://YOUR_LOCAL_IP:5000';

4. Run the app:
npx react-native run-android
# or
npx react-native run-ios

📁 Project Structure
src/
 ┣ assets/          # Images and Icons
 ┣ components/      # Reusable UI elements
 ┣ context/         # AuthContext (JWT & User state)
 ┣ navigation/      # AppNavigator & AuthNavigator
 ┣ screens/
 ┃ ┣ Auth/          # Login, Signup, OtpVerify
 ┃ ┣ Profile/       # RegisterUser, Settings
 ┃ ┗ Main/          # HomeScreen, Subscription
 ┗ utils/           # Constants, API helpers, Validations