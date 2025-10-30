// Test actual upload to S3 using presigned URL

const testUpload = async () => {
  console.log('🧪 Testing Complete Upload Flow...\n');

  try {
    // Step 1: Get presigned URL
    console.log('1️⃣ Getting presigned URL from backend...');
    const response = await fetch('http://localhost:3000/api/get-presigned-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName: 'test-video.mp4',
        fileType: 'video/mp4'
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get presigned URL');
    }

    const data = await response.json();
    console.log('✅ Presigned URL received');
    console.log('   Key:', data.key);
    console.log('');

    // Step 2: Try to upload test data
    console.log('2️⃣ Attempting upload to S3...');
    const testData = 'test video content';
    const uploadResponse = await fetch(data.presignedUrl, {
      method: 'PUT',
      body: testData,
      headers: {
        'Content-Type': 'video/mp4',
      },
    });

    console.log('   Upload Status:', uploadResponse.status, uploadResponse.statusText);

    if (uploadResponse.ok) {
      console.log('✅ Upload successful!');
      console.log('');
      console.log('🎉 EVERYTHING IS WORKING!');
      console.log('   Your S3 bucket is correctly configured.');
      console.log('   Video uploads from app should work now.');
    } else {
      console.log('❌ Upload failed!');
      console.log('   Status:', uploadResponse.status);
      console.log('');
      
      if (uploadResponse.status === 403) {
        console.log('⚠️  CORS Error (403 Forbidden)');
        console.log('   Your S3 bucket needs CORS configuration!');
        console.log('');
        console.log('   Fix:');
        console.log('   1. Go to: https://s3.console.aws.amazon.com/');
        console.log('   2. Open bucket: softcodec');
        console.log('   3. Permissions → CORS → Edit');
        console.log('   4. Add CORS policy (see FIX_UPLOAD_ERROR.md)');
      } else {
        console.log('⚠️  Unexpected error');
        console.log('   Check S3 bucket permissions and IAM user access');
      }
    }

  } catch (error) {
    console.log('❌ Test Failed:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('   1. Make sure backend is running (npm start)');
    console.log('   2. Check AWS credentials in .env file');
    console.log('   3. Verify S3 bucket exists: softcodec');
  }

  console.log('\n' + '='.repeat(60));
};

// Run the test
testUpload();
