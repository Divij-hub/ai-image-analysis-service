import os
import base64
from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from openai import OpenAI
from fastapi_clerk_auth import ClerkConfig, ClerkHTTPBearer


load_dotenv(".env.local")
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
# Initialize FastAPI app
app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Clerk configuration
clerk_config = ClerkConfig(jwks_url=os.getenv("CLERK_JWKS_URL"))
clerk_guard = ClerkHTTPBearer(clerk_config)

# OpenAI client
#client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# File validation constants
ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

# In-memory usage tracking
usage_tracker = {}  # {user_id: count}


# Helper function to check and increment usage
def check_and_increment_usage(user_id: str, tier: str) -> bool:
    """Returns True if user can proceed, False if limit exceeded"""
    if tier == "premium":
        return True  # Unlimited for premium users
    
    current = usage_tracker.get(user_id, 0)
    if current >= 1:  # Free tier limit
        return False
    
    usage_tracker[user_id] = current + 1
    return True


# Helper function to get user tier
def get_user_tier(creds: HTTPAuthorizationCredentials) -> str:
    """Extract user tier from JWT token"""
    # Option 1: Check public_metadata
    public_metadata = creds.decoded.get("public_metadata", {})
    tier = public_metadata.get("subscription_tier", "free")
    
    # Option 2: Check subscription field
    if tier == "free":
        subscription = creds.decoded.get("subscription", {})
        plan = subscription.get("plan", "")
        if "premium" in plan.lower():
            tier = "premium"
    
    return tier


# Endpoint 1: Health Check
@app.get("/api/health")
def health_check():
    """Health check endpoint to verify service is running"""
    return {"status": "healthy", "service": "AI Vision Service"}


# Endpoint 2: Analyze Image (POST)
@app.post("/api/analyze")
async def analyze_image(
    file: UploadFile = File(...),
    creds: HTTPAuthorizationCredentials = Depends(clerk_guard)
):
    """
    Accept image upload, validate it, and return AI analysis
    
    Requirements:
    - Authenticate user via JWT (Clerk)
    - Validate file type (jpg, jpeg, png, webp only)
    - Check file size (max 5MB)
    - Convert to base64
    - Call OpenAI Vision API
    - Check usage limits (free vs premium)
    - Return analysis result
    """
    
    # Extract user ID from JWT
    user_id = creds.decoded.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid authentication token")
    
    # Get user tier
    tier = get_user_tier(creds)
    
    # Check usage limits
    if not check_and_increment_usage(user_id, tier):
        raise HTTPException(
            status_code=429,
            detail="Usage limit exceeded. Upgrade to Premium for unlimited analyses."
        )
    
    # Validate file type
    file_extension = os.path.splitext(file.filename)[1].lower()
    if file_extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # Read file content
    file_content = await file.read()
    
    # Check file size
    if len(file_content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size is {MAX_FILE_SIZE / (1024*1024)}MB"
        )
    
    # Convert to base64
    try:
        image_data = base64.b64encode(file_content).decode('utf-8')
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error encoding image: {str(e)}")
    
    # Call OpenAI Vision API
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Describe this image in detail, including objects, colors, mood, and any notable features."
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{image_data}"
                            }
                        }
                    ]
                }
            ],
            max_tokens=300
        )
        
        description = response.choices[0].message.content
        
        return {
            "success": True,
            "description": description,
            "user_id": user_id,
            "tier": tier,
            "filename": file.filename
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error analyzing image with OpenAI: {str(e)}"
        )


# Endpoint 3: Check Usage (GET)
@app.get("/api/usage")
def check_usage(creds: HTTPAuthorizationCredentials = Depends(clerk_guard)):
    """
    Return user's current usage and tier
    
    Returns:
    {
        "user_id": "...",
        "tier": "free" | "premium",
        "analyses_used": 0,
        "limit": 1 or "unlimited"
    }
    """
    
    # Extract user ID from JWT
    user_id = creds.decoded.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid authentication token")
    
    # Get user tier
    tier = get_user_tier(creds)
    
    # Get current usage
    analyses_used = usage_tracker.get(user_id, 0)
    
    # Determine limit based on tier
    limit = "unlimited" if tier == "premium" else 1
    
    return {
        "user_id": user_id,
        "tier": tier,
        "analyses_used": analyses_used,
        "limit": limit,
        "remaining": "unlimited" if tier == "premium" else max(0, 1 - analyses_used)
    }


# Root endpoint
@app.get("/")
def root():
    """Root endpoint - redirects to health check"""
    return {"message": "AI Vision Service API", "health_endpoint": "/api/health"}