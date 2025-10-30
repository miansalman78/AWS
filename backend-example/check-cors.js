// Comprehensive CORS and S3 diagnostic tool

const { S3Client, GetBucketCorsCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
require('dotenv').config();

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const checkCORS = async () => {
  console.log('🔍 S3 CORS Configuration Diagnostic\n');
  console.log('='.repeat(60));

  try {
    // Check 1: AWS Credentials
    console.log('\n1️⃣ Checking AWS Credentials...');
    console.log('   Access Key:', process.env.AWS_ACCESS_KEY_ID ? '✅ Set' : '❌ Missing');
    console.log('   Secret Key:', process.env.AWS_SECRET_ACCESS_KEY ? '✅ Set' : '❌ Missing');
    console.log('   Region:', process.env.AWS_REGION || 'us-east-1');
    console.log('   Bucket:', process.env.AWS_BUCKET_NAME);

    // Check 2: CORS Configuration
    console.log('\n2️⃣ Checking S3 Bucket CORS...');
    try {
      const corsCommand = new GetBucketCorsCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
      });
      
      const corsResponse = await s3Client.send(corsCommand);
      
      if (corsResponse.CORSRules && corsResponse.CORSRules.length > 0) {
        console.log('   ✅ CORS is configured!');
        console.log('\n   Current CORS Rules:');
        corsResponse.CORSRules.forEach((rule, index) => {
          console.log(`\n   Rule ${index + 1}:`);
          console.log('     - Allowed Methods:', rule.AllowedMethods.join(', '));
          console.log('     - Allowed Origins:', rule.AllowedOrigins.join(', '));
          console.log('     - Allowed Headers:', rule.AllowedHeaders ? rule.AllowedHeaders.join(', ') : 'None');
          
          // Check if PUT method is allowed
          if (rule.AllowedMethods.includes('PUT')) {
            console.log('     ✅ PUT method allowed');
          } else {
            console.log('     ❌ PUT method NOT allowed (required for upload)');
          }
          
          // Check if all origins are allowed
          if (rule.AllowedOrigins.includes('*')) {
            console.log('     ✅ All origins allowed');
          } else {
            console.log('     ⚠️  Limited origins:', rule.AllowedOrigins.join(', '));
          }
        });
      } else {
        console.log('   ❌ No CORS rules found!');
      }
    } catch (corsError) {
      if (corsError.name === 'NoSuchCORSConfiguration') {
        console.log('   ❌ CORS NOT CONFIGURED on this bucket');
        console.log('\n   ⚠️  This is likely why uploads are failing!');
      } else {
        console.log('   ❌ Error checking CORS:', corsError.message);
      }
    }

    // Check 3: Test Direct Upload (bypassing presigned URL)
    console.log('\n3️⃣ Testing Direct S3 Upload (with IAM credentials)...');
    try {
      const testKey = `test-direct-${Date.now()}.txt`;
      const putCommand = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: testKey,
        Body: 'Test upload via IAM credentials',
        ContentType: 'text/plain',
      });
      
      await s3Client.send(putCommand);
      console.log('   ✅ Direct upload successful!');
      console.log('   ✅ IAM permissions are working correctly');
      console.log(`   ✅ Test file created: ${testKey}`);
    } catch (uploadError) {
      console.log('   ❌ Direct upload failed:', uploadError.message);
      if (uploadError.name === 'AccessDenied') {
        console.log('   ⚠️  IAM user lacks PutObject permission');
      }
    }

    // Check 4: Test Presigned URL Generation
    console.log('\n4️⃣ Testing Presigned URL Generation...');
    try {
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `test-presigned-${Date.now()}.mp4`,
        ContentType: 'video/mp4',
      });
      
      const presignedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 300,
      });
      
      console.log('   ✅ Presigned URL generated successfully');
      console.log('   URL preview:', presignedUrl.substring(0, 100) + '...');
      
      // Check if bucket name is in URL
      if (presignedUrl.includes(process.env.AWS_BUCKET_NAME)) {
        console.log('   ✅ Bucket name in URL');
      }
    } catch (presignedError) {
      console.log('   ❌ Presigned URL generation failed:', presignedError.message);
    }

    // Summary and Recommendations
    console.log('\n' + '='.repeat(60));
    console.log('\n📊 DIAGNOSTIC SUMMARY:\n');
    
    console.log('If you see "CORS NOT CONFIGURED" above:');
    console.log('  → CORS needs to be added to S3 bucket');
    console.log('  → Go to S3 Console → softcodec → Permissions → CORS');
    console.log('  → Add the CORS JSON configuration');
    console.log('');
    console.log('If CORS is configured but upload fails:');
    console.log('  → Check CORS includes "PUT" method');
    console.log('  → Check AllowedOrigins includes "*"');
    console.log('  → Wait 1-2 minutes for AWS to apply changes');
    console.log('  → Clear browser/app cache');
    console.log('');
    console.log('If direct upload works but presigned URL fails:');
    console.log('  → CORS configuration issue');
    console.log('  → Make sure ExposeHeaders includes "ETag"');
    console.log('');

  } catch (error) {
    console.log('\n❌ Diagnostic failed:', error.message);
    console.log('\nPossible issues:');
    console.log('  - AWS credentials invalid');
    console.log('  - Bucket does not exist');
    console.log('  - Network connectivity issues');
  }

  console.log('='.repeat(60));
};

checkCORS();
