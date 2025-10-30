// Backend Server for AWS S3 Presigned URL Generation
// Install dependencies: npm install express @aws-sdk/client-s3 @aws-sdk/s3-request-presigner dotenv cors

const express = require('express');
const cors = require('cors');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configure AWS S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Generate presigned URL for video upload
app.post('/api/get-presigned-url', async (req, res) => {
  try {
    const { fileName, fileType } = req.body;

    // Validate input
    if (!fileName || !fileType) {
      return res.status(400).json({ 
        error: 'fileName and fileType are required' 
      });
    }

    // Validate file type (only allow videos)
    const allowedTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/mpeg'];
    if (!allowedTypes.includes(fileType)) {
      return res.status(400).json({ 
        error: 'Invalid file type. Only video files are allowed.' 
      });
    }

    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const key = `videos/${timestamp}-${sanitizedFileName}`;

    // Create S3 PutObject command
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
      // Optional: Add metadata
      Metadata: {
        'uploaded-at': new Date().toISOString(),
      },
    });

    // Generate presigned URL (valid for 5 minutes)
    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 300, // 5 minutes
    });

    console.log(`✅ Generated presigned URL for: ${key}`);

    res.json({
      success: true,
      presignedUrl,
      key,
      expiresIn: 300,
      message: 'Presigned URL generated successfully',
    });

  } catch (error) {
    console.error('❌ Error generating presigned URL:', error);
    res.status(500).json({ 
      error: 'Failed to generate presigned URL',
      details: error.message 
    });
  }
});

// Verify upload (optional)
app.post('/api/verify-upload', async (req, res) => {
  try {
    const { key } = req.body;
    
    // Here you can add logic to verify the upload
    // For example, check if the object exists in S3
    
    res.json({
      success: true,
      message: 'Upload verified',
      s3Url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
    });
  } catch (error) {
    console.error('❌ Error verifying upload:', error);
    res.status(500).json({ 
      error: 'Failed to verify upload',
      details: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 Presigned URL endpoint: http://localhost:${PORT}/api/get-presigned-url`);
  console.log(`\n⚙️  Configuration:`);
  console.log(`   AWS Region: ${process.env.AWS_REGION || 'us-east-1'}`);
  console.log(`   S3 Bucket: ${process.env.AWS_BUCKET_NAME || 'NOT_CONFIGURED'}`);
});

module.exports = app;
