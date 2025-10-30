// Simple test script to check backend and AWS connectivity

const testBackend = async () => {
  console.log('🧪 Testing Backend API...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...');
    const healthResponse = await fetch('http://localhost:3000/health');
    const healthData = await healthResponse.json();
    console.log('✅ Health Check:', healthData);
    console.log('');

    // Test 2: Presigned URL Generation
    console.log('2️⃣ Testing Presigned URL Generation...');
    const presignedResponse = await fetch('http://localhost:3000/api/get-presigned-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName: 'test-video.mp4',
        fileType: 'video/mp4'
      })
    });

    const presignedData = await presignedResponse.json();
    
    if (presignedResponse.ok) {
      console.log('✅ Presigned URL Generated Successfully!');
      console.log('   - Key:', presignedData.key);
      console.log('   - Expires In:', presignedData.expiresIn, 'seconds');
      console.log('   - URL Length:', presignedData.presignedUrl?.length || 0, 'characters');
      console.log('');
      console.log('🎉 Backend is working correctly!');
      console.log('');
      
      // Check if AWS credentials are configured
      if (presignedData.presignedUrl && presignedData.presignedUrl.includes('test-bucket-name')) {
        console.log('⚠️  AWS Status: NOT CONFIGURED');
        console.log('   AWS credentials are using test/placeholder values.');
        console.log('   Update .env file with real AWS credentials to enable S3 uploads.');
      } else if (presignedData.presignedUrl) {
        console.log('✅ AWS Status: CONFIGURED');
        console.log('   AWS credentials appear to be set correctly!');
      }
    } else {
      console.log('❌ Error:', presignedData.error);
      console.log('   Details:', presignedData.details);
      console.log('');
      console.log('⚠️  AWS Status: NOT CONFIGURED');
      console.log('   Please update .env file with valid AWS credentials.');
    }

  } catch (error) {
    console.log('❌ Test Failed:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('   1. Make sure backend server is running (npm start)');
    console.log('   2. Check if .env file exists with AWS credentials');
    console.log('   3. Verify AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_BUCKET_NAME');
  }

  console.log('\n' + '='.repeat(60));
};

// Run the test
testBackend();
