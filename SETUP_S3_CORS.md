# 🔧 Fix Upload Error - S3 CORS Configuration

## ❌ Current Error:
```
Failed to upload video to AWS
Status: 403 Forbidden
```

## ✅ Solution: Add CORS to S3 Bucket

---

## 📋 Step-by-Step Instructions:

### Step 1: Open AWS S3 Console
Click this link: **https://s3.console.aws.amazon.com/**
- Login with your AWS credentials if needed

### Step 2: Find Your Bucket
- Look for bucket named: **softcodec**
- Click on it to open

### Step 3: Go to Permissions Tab
- You'll see tabs: Objects, Properties, **Permissions**, etc.
- Click **Permissions** tab

### Step 4: Scroll to CORS Section
- Scroll down the page
- Find section: **Cross-origin resource sharing (CORS)**
- Click **Edit** button

### Step 5: Add CORS Configuration
- **Delete** any existing text in the box
- **Copy** the JSON below:

```json
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "GET",
            "PUT",
            "POST",
            "DELETE",
            "HEAD"
        ],
        "AllowedOrigins": [
            "*"
        ],
        "ExposeHeaders": [
            "ETag",
            "x-amz-server-side-encryption",
            "x-amz-request-id",
            "x-amz-id-2"
        ],
        "MaxAgeSeconds": 3000
    }
]
```

- **Paste** it in the CORS configuration box
- Click **Save changes** button at bottom

### Step 6: Verify CORS is Saved
- You should see: "Successfully edited CORS configuration"
- CORS section should now show the policy

---

## 🧪 Test After Adding CORS:

### Test 1: Backend Test
```bash
cd backend-example
node test-upload.js
```

**Expected output:**
```
✅ Presigned URL received
✅ Upload successful!
🎉 EVERYTHING IS WORKING!
```

### Test 2: App Test
1. Open app on your phone
2. Select a video from gallery
3. Tap "Upload Video to AWS"
4. Should show: **"Video uploaded to AWS successfully!"** ✅

---

## 🎯 What This CORS Configuration Does:

| Setting | What It Allows |
|---------|----------------|
| AllowedMethods: PUT, POST | Your app can upload files |
| AllowedOrigins: * | Any source can upload (can restrict later) |
| AllowedHeaders: * | All headers accepted |
| ExposeHeaders | S3 response headers visible to app |

---

## ⚠️ Important Notes:

### Security:
- Current config allows uploads from anywhere (*)
- For production, change `AllowedOrigins` to your domain
- Example: `"AllowedOrigins": ["https://yourapp.com"]`

### Public Access:
- Your bucket can stay **private** (recommended)
- CORS doesn't make files public
- It only allows your app to upload
- Files remain accessible only with permissions

---

## 🔍 Troubleshooting:

### If CORS save fails:
- Check you have permission to edit bucket
- Make sure JSON is valid (copy exactly as shown)
- No extra commas or missing brackets

### If upload still fails after CORS:
1. Wait 1-2 minutes for AWS to apply changes
2. Restart backend: `npm start`
3. Try upload again
4. Check backend terminal for new errors

### If you see different error:
Check these:
- [ ] Bucket name is exactly: **softcodec**
- [ ] Bucket region is: **us-east-1**
- [ ] IAM user has PutObject permission
- [ ] .env file has correct credentials

---

## ✅ Quick Checklist:

Before upload works:
- [ ] AWS S3 Console opened
- [ ] Bucket "softcodec" found
- [ ] Permissions tab opened
- [ ] CORS section edited
- [ ] JSON pasted exactly
- [ ] Changes saved
- [ ] Backend test passed
- [ ] App upload tested

---

## 🎉 Success Indicators:

After CORS is configured:

### Backend test shows:
```
✅ Upload Status: 200 OK
✅ Upload successful!
```

### App shows:
```
✅ "Video uploaded to AWS successfully!"
```

### S3 Console shows:
- Bucket: softcodec
- Folder: videos/
- Files: [timestamp]-video.mp4 ✅

---

## 📞 Still Need Help?

If CORS configuration doesn't work:

1. **Screenshot the error** in S3 console
2. **Run:** `node test-upload.js` and share output
3. **Check:** IAM user permissions
4. **Verify:** Bucket exists in correct region

---

**Next Step:** Add CORS configuration to S3 bucket (takes 2 minutes) 🚀

Direct link: https://s3.console.aws.amazon.com/s3/buckets/softcodec?region=us-east-1&tab=permissions
