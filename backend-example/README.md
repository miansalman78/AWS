# AWS Video Upload Backend

Backend server for generating S3 presigned URLs for video uploads.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend-example
npm install
```

### 2. Configure Environment Variables
```bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env and add your AWS credentials
```

### 3. Start Server
```bash
# Production
npm start

# Development (with auto-reload)
npm run dev
```

Server will start on `http://localhost:3000`

## 📡 API Endpoints

### Health Check
```
GET /health
```
Response:
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

### Generate Presigned URL
```
POST /api/get-presigned-url
Content-Type: application/json

{
  "fileName": "video.mp4",
  "fileType": "video/mp4"
}
```

Response:
```json
{
  "success": true,
  "presignedUrl": "https://bucket.s3.amazonaws.com/...",
  "key": "videos/1234567890-video.mp4",
  "expiresIn": 300,
  "message": "Presigned URL generated successfully"
}
```

### Verify Upload (Optional)
```
POST /api/verify-upload
Content-Type: application/json

{
  "key": "videos/1234567890-video.mp4"
}
```

## 🔧 Configuration

Required environment variables in `.env`:
- `AWS_ACCESS_KEY_ID` - Your AWS access key
- `AWS_SECRET_ACCESS_KEY` - Your AWS secret key
- `AWS_REGION` - AWS region (e.g., us-east-1)
- `AWS_BUCKET_NAME` - S3 bucket name
- `PORT` - Server port (default: 3000)

## 🧪 Testing

### Using cURL
```bash
curl -X POST http://localhost:3000/api/get-presigned-url \
  -H "Content-Type: application/json" \
  -d '{"fileName":"test.mp4","fileType":"video/mp4"}'
```

### Using Postman
1. Create POST request to `http://localhost:3000/api/get-presigned-url`
2. Set Content-Type to `application/json`
3. Add body:
```json
{
  "fileName": "test.mp4",
  "fileType": "video/mp4"
}
```

## 📱 Connect to Expo App

In your Expo app (`App.tsx`), update line 50:
```typescript
const PRESIGNED_URL_ENDPOINT = 'http://localhost:3000/api/get-presigned-url';
```

For Android emulator, use:
```typescript
const PRESIGNED_URL_ENDPOINT = 'http://10.0.2.2:3000/api/get-presigned-url';
```

For physical device, use your computer's local IP:
```typescript
const PRESIGNED_URL_ENDPOINT = 'http://192.168.1.XXX:3000/api/get-presigned-url';
```

## 🔒 Security Notes

- Never commit `.env` file
- Use environment variables for sensitive data
- Implement authentication in production
- Add rate limiting for API endpoints
- Validate file types and sizes
- Set appropriate CORS origins

## 📚 Dependencies

- **express** - Web framework
- **@aws-sdk/client-s3** - AWS S3 client
- **@aws-sdk/s3-request-presigner** - Presigned URL generator
- **cors** - CORS middleware
- **dotenv** - Environment variables
- **nodemon** - Development auto-reload (dev dependency)
