# AWS S3 Presigned URL Setup Guide

## 📋 Overview
This guide explains how to set up AWS S3 presigned URLs for video uploads from your Expo app.

## 🔧 Backend Setup (Node.js/Express Example)

### 1. Install AWS SDK
```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### 2. Create Backend API Endpoint

```javascript
// backend/server.js
const express = require('express');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const app = express();
app.use(express.json());

// Configure AWS S3 Client
const s3Client = new S3Client({
  region: 'your-region', // e.g., 'us-east-1'
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// API endpoint to generate presigned URL
app.post('/api/get-presigned-url', async (req, res) => {
  try {
    const { fileName, fileType } = req.body;
    
    const timestamp = Date.now();
    const key = `videos/${timestamp}-${fileName}`;
    
    const command = new PutObjectCommand({
      Bucket: 'your-bucket-name',
      Key: key,
      ContentType: fileType,
    });
    
    // Generate presigned URL (valid for 5 minutes)
    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 300,
    });
    
    res.json({
      presignedUrl,
      key,
      message: 'Presigned URL generated successfully',
    });
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    res.status(500).json({ error: 'Failed to generate presigned URL' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 3. Environment Variables (.env)
```env
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=us-east-1
AWS_BUCKET_NAME=your-bucket-name
PORT=3000
```

## 🔐 AWS S3 Bucket Setup

### 1. Create S3 Bucket
- Go to AWS Console → S3
- Click "Create bucket"
- Enter bucket name
- Select region
- Keep "Block all public access" enabled (for security)

### 2. Configure CORS
Add CORS policy to your S3 bucket:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["PUT", "POST", "GET"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag"]
  }
]
```

### 3. IAM User Permissions
Create IAM user with these permissions:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

## 📱 Update React Native App

### Update App.tsx
Replace the placeholder URLs in `App.tsx`:

```typescript
// Line 50: Replace with your actual backend URL
const PRESIGNED_URL_ENDPOINT = 'http://your-backend-url.com/api/get-presigned-url';

// Uncomment lines 53-63 to use actual API call
const response = await fetch(PRESIGNED_URL_ENDPOINT, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    fileName: 'video.mp4',
    fileType: 'video/mp4'
  })
});
const { presignedUrl } = await response.json();

// Comment out or remove line 66
// const presignedUrl = 'YOUR_PRESIGNED_URL_HERE';
```

## 🚀 Testing Flow

1. **Start Backend Server**
   ```bash
   node server.js
   ```

2. **Run Expo App**
   ```bash
   npm start
   ```

3. **Test Upload**
   - Select video from gallery
   - Preview video
   - Click "Upload Video to AWS"
   - Check S3 bucket for uploaded file

## 🔍 Troubleshooting

### Common Issues:

1. **CORS Error**
   - Check S3 bucket CORS configuration
   - Ensure allowed origins include your domain

2. **403 Forbidden**
   - Verify IAM user permissions
   - Check AWS credentials in .env file

3. **Presigned URL Expired**
   - Default expiry is 5 minutes
   - Increase `expiresIn` value if needed

4. **Video Too Large**
   - S3 has 5GB limit for single PUT
   - Consider multipart upload for larger files

## 📊 Alternative: Lambda Function

You can also use AWS Lambda + API Gateway:

```javascript
// lambda function
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

exports.handler = async (event) => {
  const { fileName, fileType } = JSON.parse(event.body);
  
  const s3Client = new S3Client({ region: 'us-east-1' });
  
  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: `videos/${Date.now()}-${fileName}`,
    ContentType: fileType,
  });
  
  const presignedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 300,
  });
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({ presignedUrl }),
  };
};
```

## 📚 Additional Resources

- [AWS S3 Presigned URLs Documentation](https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html)
- [AWS SDK for JavaScript](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/)
- [Expo Image Picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/)

## 🔒 Security Best Practices

1. Never expose AWS credentials in frontend code
2. Always use presigned URLs with expiration
3. Implement file size and type validation
4. Use HTTPS for API endpoints
5. Add authentication to your backend API
6. Limit presigned URL validity period
7. Implement rate limiting on API endpoints
