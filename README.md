# StyleSync AI 👗✨
## AI Wardrobe & Outfit Planner

StyleSync AI is an AI-assisted wardrobe management and outfit planning platform that helps users organize their clothes, understand their wardrobe, and generate suitable outfit combinations based on **weather, occasion, personal style, and available garments**.

The project combines a **React + Vite frontend**, **Node.js + Express backend**, AI-assisted garment processing, weather integration, wardrobe analytics, recommendation logic, authentication, input validation, security controls, and automated testing into a complete wardrobe-planning workflow.

---

## 🚀 Problem Statement

People often own many clothes but still struggle with:

- Deciding what to wear for a particular occasion.
- Remembering what is already available in their wardrobe.
- Creating combinations from existing garments.
- Choosing suitable clothing according to weather.
- Identifying missing or underrepresented wardrobe categories.
- Understanding whether an outfit combination works well.

Most fashion recommendation systems provide generic suggestions. StyleSync AI instead focuses on the user's **actual wardrobe** and uses the available garments as the basis for outfit planning.

---

## 💡 Our Approach

StyleSync AI converts a user's wardrobe into structured garment data and uses that information together with contextual inputs to generate outfit suggestions.

```text
User Wardrobe
      ↓
Garment Attributes
      ↓
Weather + Occasion + Personal Style
      ↓
Outfit Recommendation Engine
      ↓
Multiple Outfit Suggestions
      ↓
Wardrobe Insights + Gap Analysis + Outfit Rating

Key Features
1. 👗 Digital Wardrobe

Users can maintain a structured digital wardrobe containing garments and attributes such as:

Garment name
Category
Color
Pattern
Formality
Season
Warmth
Material
Fit
Image

The wardrobe can contain different categories such as:

Topwear
Bottomwear
Outerwear
Footwear
Dress
Accessory

A bundled demo wardrobe is also provided so that the application can be evaluated without manually adding every item.

2. 🤖 AI-Assisted Garment Tagging

Users can add garment images and process them through the AI-assisted garment tagging workflow.

The system can work with garment attributes such as:

Category
Color
Pattern
Formality
Season
Warmth
Material
Fit

The generated information is validated before being used by the application.

The project also includes a deterministic fallback mechanism so that the demonstration can continue even when an external AI provider is unavailable or an API key is not configured.

Garment Image
      ↓
AI / Demo Processing
      ↓
Garment Attributes
      ↓
Validation
      ↓
Digital Wardrobe
3. 🧠 AI-Assisted Outfit Planning

The main recommendation workflow considers multiple inputs instead of generating a completely generic outfit.

Inputs include:

Available wardrobe items
Weather conditions
Occasion
Personal style
Garment category
Formality
Warmth
Compatibility rules

Example:

Weather   : Cool
Occasion  : College
Style     : Smart Casual

The recommendation engine uses these inputs to construct suitable combinations from the user's wardrobe.

4. 🌤️ Weather-Aware Recommendations

StyleSync AI integrates Open-Meteo to retrieve weather information.

Weather conditions are used to classify the environment and influence outfit recommendations.

Example:

Higher Temperature
        ↓
Prefer lighter clothing

Cooler Temperature
        ↓
Consider warmer garments / layers

This allows recommendations to consider practical environmental conditions rather than only appearance.

5. 🎯 Occasion-Aware Outfit Planning

The recommendation workflow also considers the purpose of the outfit.

Examples include:

Casual
Smart Casual
College
Interview
Gym
Party
Wedding
Weekend

The same garment may be suitable for one occasion and unsuitable for another, so occasion is treated as an important recommendation parameter.

6. 👚 Multiple Outfit Suggestions

Instead of relying on a single combination, StyleSync AI can generate multiple possible looks from the available wardrobe.

Wardrobe
   +
Weather
   +
Occasion
   +
Personal Style
   ↓
Recommendation Engine
   ↓
Look 1
Look 2
Look 3

This gives the user multiple options rather than forcing one fixed recommendation.

7. 📊 Wardrobe Gap Analysis

StyleSync AI analyzes the existing wardrobe to identify missing or underrepresented garment categories.

Current Wardrobe
       ↓
Category Analysis
       ↓
Identify Gaps
       ↓
Suggested Categories / Items

This helps users understand what types of garments could improve the variety of combinations available in their wardrobe.

8. ⭐ Rate My Outfit

Users can evaluate an outfit through the outfit-rating workflow.

This extends the application from:

"What should I wear?"

to:

"How well does this outfit work?"

The rating workflow also supports fallback behaviour for reliable demonstrations.

9. 📈 Wardrobe Insights

The Insights functionality provides information about the user's wardrobe and usage patterns.

Examples include:

Wardrobe composition
Color distribution
Frequently used garments
Outfit history
Wear history

This converts the wardrobe from a simple collection of images into structured, analyzable data.

10. 📅 Calendar Export

Planned outfits can be exported using the standard .ics calendar format.

Select Outfit
      ↓
Plan Outfit
      ↓
Generate Calendar File
      ↓
.ics

The generated calendar file can then be imported into compatible calendar applications.

🧠 AI & Recommendation Architecture

One of the main design decisions in StyleSync AI is separating AI-assisted processing from deterministic recommendation logic.

AI Service
backend/services/aiService.js

The AI service handles AI-assisted operations such as garment processing and AI-based outfit feedback.

Outfit Engine
backend/services/outfitEngine.js

The outfit engine contains deterministic recommendation and compatibility logic.

Weather Service
backend/services/weatherService.js

The weather service handles weather retrieval and weather-related processing.

Overall Flow
                    ┌───────────────────┐
                    │   User Request    │
                    └─────────┬─────────┘
                              ↓
                    ┌───────────────────┐
                    │   Backend API     │
                    └─────────┬─────────┘
                              ↓
             ┌────────────────┼────────────────┐
             ↓                ↓                ↓
        AI Service       Outfit Engine    Weather Service
             │                │                │
             └────────────────┼────────────────┘
                              ↓
                    ┌───────────────────┐
                    │ Recommendation /  │
                    │ Application Result │
                    └───────────────────┘
🔄 AI Fallback & Reliability

The application is designed to remain usable when external AI services are unavailable.

AI Request
    ↓
AI Provider Available?
    │
    ├── YES
    │    ↓
    │  AI Response
    │
    └── NO / FAILURE
         ↓
   Deterministic Fallback
         ↓
    Continue Workflow

This makes the prototype more reliable during demonstrations and reduces dependency on a single external AI service.

🏗️ System Architecture
                    ┌──────────────────────┐
                    │    React + Vite      │
                    │      Frontend        │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               ↓
                    ┌──────────────────────┐
                    │   Node.js + Express  │
                    │       Backend        │
                    └──────────┬───────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
          ↓                    ↓                    ↓
   Authentication         Validation          Middleware
          │                    │                    │
          └────────────────────┼────────────────────┘
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
             ↓                 ↓                 ↓
        AI Service       Outfit Engine    Weather Service
             │                 │                 │
             └─────────────────┼─────────────────┘
                               ↓
                         Data Storage
🛠️ Technology Stack
Frontend
React
Vite
JavaScript
CSS
Lucide React
Backend
Node.js
Express.js
REST APIs
AI
AI provider abstraction
AI-assisted garment processing
AI-assisted outfit feedback
Deterministic fallback logic
Weather
Open-Meteo API
Storage
JSON-based prototype storage
Supabase/PostgreSQL schema for production-oriented migration
Testing
Node.js built-in test runner
🔐 Security

Security was considered as part of the improved backend implementation.

Authentication

Protected routes use JWT-based authentication.

Authorization: Bearer <token>
Password Security

Passwords are hashed using:

Node.js crypto.scrypt

with random salts.

Additional Security Controls

The backend includes:

JWT authentication
Protected API routes
Input validation
Request rate limiting
Configurable CORS
Request/body size limits
Environment-based secret configuration
AI output validation/sanitization
User-level data separation

Sensitive configuration is stored through environment variables rather than hardcoded secrets.

Example configuration file:

.env.example

Security documentation:

SECURITY.md
📊 Dataset

The project contains a lightweight local demonstration dataset and visual assets.

Dataset Assets
frontend/public/dataset/

The dataset includes garment examples such as:

Shirts
T-Shirts
Polo Shirts
Knit Tops
Jeans
Trousers
Chinos
Joggers
Jackets
Blazer
Trench Coat
Hoodie
Sneakers
Running Shoes
Loafers
Boots
Dresses

The project also contains predefined visual look boards used for demonstration.

Dataset documentation:

dataset/DATASET.md
dataset/DATASET_AND_LOOKS.md

The repository uses lightweight demonstration assets rather than requiring a large external fashion dataset to run the prototype.

📁 Project Structure
AI-Wardrobe/
│
├── backend/
│   ├── routes/
│   │   ├── auth.js
│   │   ├── insights.js
│   │   ├── outfits.js
│   │   ├── profile.js
│   │   ├── rate.js
│   │   ├── wardrobe.js
│   │   └── weather.js
│   │
│   ├── services/
│   │   ├── aiService.js
│   │   ├── outfitEngine.js
│   │   └── weatherService.js
│   │
│   ├── tests/
│   │   ├── outfitEngine.test.js
│   │   └── validation.test.js
│   │
│   ├── auth.js
│   ├── db.js
│   ├── middleware.js
│   ├── validation.js
│   ├── server.js
│   └── SUPABASE_SCHEMA.sql
│
├── frontend/
│   ├── public/
│   │   └── dataset/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── dataset/
│   ├── DATASET.md
│   ├── DATASET_AND_LOOKS.md
│   └── fashion_demo.json
│
├── scripts/
│
├── .env.example
├── .gitignore
├── DEPLOYMENT.md
├── PLAN.md
├── SECURITY.md
├── SUBMISSION.md
├── TESTING.md
├── CHANGES_FOR_EVALUATION.md
├── package.json
├── README.md
└── vercel.json
🔌 Backend API Structure

The backend is divided into independent route modules.

Route	Purpose
/api/auth	Authentication and user access
/api/wardrobe	Wardrobe management
/api/profile	User profile and preferences
/api/weather	Weather information
/api/outfits	Outfit recommendations
/api/rate	Outfit rating
/api/insights	Wardrobe analytics
/api/health	Backend health check

This modular structure keeps authentication, wardrobe management, recommendations, weather, and analytics independently maintainable.

🧪 Testing

Automated backend tests are included for important application logic.

Run:

cd backend
npm install
npm test

The test suite covers areas including:

Outfit recommendation logic
Recommendation rules
Input validation
Core backend behaviour

Test files:

backend/tests/outfitEngine.test.js
backend/tests/validation.test.js
▶️ Installation & Setup
1. Clone the Repository
git clone https://github.com/yaswanipriyabevara/AI-Wardrobe.git
cd AI-Wardrobe
2. Setup Backend
cd backend
npm install

Create your environment configuration using:

.env.example

Then start the backend:

npm start

The backend runs on the configured server port.

3. Setup Frontend

Open another terminal:

cd frontend
npm install
npm run dev

Vite will provide the local development URL.

🚀 Deployment

The project contains deployment configuration for hosting the application.

Deployment documentation:

DEPLOYMENT.md

The frontend can be deployed using platforms such as Vercel, while the backend can be deployed to a suitable Node.js hosting environment.

Production secrets should be configured through environment variables and should never be committed to the repository.

🗄️ Production Database Migration

The prototype uses lightweight storage for demonstration purposes.

For a production-oriented deployment, a Supabase/PostgreSQL schema is provided:

backend/SUPABASE_SCHEMA.sql

The intended production architecture is:

React Frontend
      ↓
Express Backend
      ↓
JWT Authentication
      ↓
Application Services
      ↓
Supabase / PostgreSQL

This allows the prototype storage approach to be migrated to managed persistent storage as the application scales.

🎯 Complete Application Flow
                    ┌──────────────┐
                    │    Login     │
                    └──────┬───────┘
                           ↓
                    ┌──────────────┐
                    │   Dashboard  │
                    └──────┬───────┘
                           ↓
                  ┌──────────────────┐
                  │ Digital Wardrobe │
                  └────────┬─────────┘
                           ↓
                  ┌──────────────────┐
                  │ Add / Tag Garment│
                  └────────┬─────────┘
                           ↓
             ┌─────────────────────────────┐
             │ Weather + Occasion + Style │
             └─────────────┬───────────────┘
                           ↓
                  ┌──────────────────┐
                  │ Outfit Engine    │
                  └────────┬─────────┘
                           ↓
                 ┌────────────────────┐
                 │ Outfit Suggestions │
                 └─────────┬──────────┘
                           ↓
            ┌──────────────┼──────────────┐
            ↓              ↓              ↓
      Gap Analysis     Rate Outfit    Insights
            │              │              │
            └──────────────┼──────────────┘
                           ↓
                    Calendar Export
🌟 What Makes StyleSync AI Different?

StyleSync AI is designed as an end-to-end wardrobe planning system, rather than only a conversational fashion assistant.

It combines:

Digital Wardrobe
       +
Garment Attributes
       +
AI Assistance
       +
Weather
       +
Occasion
       +
Personal Style
       +
Recommendation Engine
       +
Wardrobe Analytics

The system therefore connects the user's existing clothes with contextual information to generate practical outfit recommendations.

📌 Project Documentation

Additional technical documentation is available in the repository:

SECURITY.md
TESTING.md
DEPLOYMENT.md
PLAN.md
SUBMISSION.md
CHANGES_FOR_EVALUATION.md
dataset/DATASET.md
dataset/DATASET_AND_LOOKS.md
🔮 Future Enhancements

Potential future improvements include:

Full migration to managed Supabase/PostgreSQL storage
Advanced garment segmentation and background removal
Fine-tuned fashion classification models
More advanced outfit compatibility scoring
Feedback-driven personalization
Larger and more diverse fashion datasets
Expanded account management
Mobile application
Direct calendar integrations
Improved personalization based on long-term wardrobe usage
👩‍💻 Project Information

Project: StyleSync AI — AI Wardrobe & Outfit Planner

Primary Technologies:
React • Vite • Node.js • Express • JavaScript • AI Services • Open-Meteo • JWT • PostgreSQL/Supabase-ready schema