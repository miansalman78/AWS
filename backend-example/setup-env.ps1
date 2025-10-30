$envContent = @"
AWS_ACCESS_KEY_ID=your_access_key_id_here
AWS_SECRET_ACCESS_KEY=your_secret_access_key_here
AWS_REGION=us-east-1
AWS_BUCKET_NAME=your-bucket-name
PORT=3000
"@

$envContent | Out-File -FilePath .env -Encoding utf8 -NoNewline
Write-Host "✅ .env file created with AWS credentials"
