AI Vision Analyzer

1. Project Overview 

The AI Vision Analyzer is a production-ready AI-powered SaaS application that allows users to upload images and receive detailed, AI-generated descriptions. This project demonstrates mastery in full-stack deployment, API integration, and authentication.

Technologies Used: 
    - Frontend: Next.js (Pages Router) with TypeScript.
    - Backend: FastAPI (Python).
    - AI Service: OpenAI Vision API (gpt-4o-mini).
    - Authentication: Clerk.
    - Deployment: Vercel.
    - Styling: Tailwind CSS.

2. Features 

- Secure Authentication: User sign-in/sign-out and session management via Clerk .
- AI-Powered Analysis: Detailed image descriptions including objects, colors, and mood.
- Tiered Access Control: * Free Tier: Limited to 1 image analysis per session.
- Premium Tier: Unlimited analyses for users with premium metadata.
- Usage Tracking: Real-time display of current usage and remaining limits .

3. Setup Instructions 

    Prerequisites 

    - Node.js and npm installed.
    - Python 3.9+ installed.
    - Clerk and OpenAI API keys.

    Installation & Local Run 
        Clone the repository:
         - git clone: (https://github.com/Divij-hub/ai-image-analysis-service.git)
           cd ai-vision-service
    
    Install Node dependencies:
        - npm install

    Install Python dependencies:
        - pip install -r requirements.txt

    Configure Environment Variables: Create a .env.local file in the root with your Clerk and OpenAI keys

    Run locally: npm run dev

4. API Documentation
   
   All backend endpoints are hosted under /api and verified using Clerk JWTs.

    Endpoint,       Method,     Description,                            Auth Required
    /api/health,    GET,        Verifies the service status.,               No
    /api/analyze,   POST,       Analyzes uploaded image (max 5MB),          Yes 
    /api/usage,     GET,        Returns user tier and remaining analyses    Yes 


5. Deployment 

   The application is deployed on Vercel.

        - Add environment variables to the Vercel project settings .
        - Deploy using the CLI: vercel --prod

6. Known Limitations

    In-Memory Tracking: Usage tracking is stored in an in-memory dictionary, meaning data resets whenever the Vercel deployment cold-starts .