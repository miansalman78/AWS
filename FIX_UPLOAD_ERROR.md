# 🔧 Fix "Failed to Upload Video to AWS" Error

## 🔍 Common Causes & Solutions:

### Issue 1: S3 Bucket CORS Not Configured ⚠️
**Most likely cause!**

Your S3 bucket needs CORS policy to allow uploads from your app.

#### Fix:
1. Go to: https://s3.console.aws.amazon.com/
2. Click on bucket: **softcodec**
3. Go to **Permissions** tab
4. Scroll to **Cross-origin resource sharing (CORS)**
5. Click **Edit**
6. Paste this configuration:

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

7. Click **Save changes**
8. Try uploading again in app ✅

---

### Issue 2: S3 Bucket Block Public Access

Check if bucket allows uploads:

1. In S3 bucket → **Permissions** tab
2. Look at **Block public access (bucket settings)**
3. Make sure uploads are not blocked
4. For private uploads (recommended), keep "Block all public access" ON
5. Just ensure CORS is configured above

---

### Issue 3: IAM User Permissions

Verify your IAM user has correct permissions:

1. Go to: https://console.aws.amazon.com/iam/
2. Click **Users** → Find your user
3. Check **Permissions** tab
4. Should have: `s3:PutObject` permission

Minimum required policy:
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
            "Resource": "arn:aws:s3:::softcodec/*"
        }
    ]
}
```

---

### Issue 4: App Needs to Reload

App might still be using old code. Force reload:

**On Device:**
1. Shake phone
2. Tap **"Reload"**

**Or restart:**
```bash
# In terminal where expo is running
Press: r
```

---

### Issue 5: Network Connection

Verify backend is accessible:

```bash
cd backend-example
node test-api.js
```

Should show:
```
✅ Presigned URL Generated Successfully!
✅ AWS Status: CONFIGURED
```

---

## 🧪 Debug Steps:

### Step 1: Check Backend Logs
Look at the backend terminal. When you try to upload, it should show:
```
✅ Generated presigned URL for: videos/xxxxx-video.mp4
```

If you see errors, that's the issue.

### Step 2: Check App Error Message
What exact error does app show?
- "Network request failed" → Backend connection issue
- "Failed to upload video to AWS" → S3 CORS issue
- "Failed to generate presigned URL" → AWS credentials issue

### Step 3: Test Backend Directly
```bash
cd backend-example
node test-api.js
```

### Step 4: Check S3 Bucket Exists
1. Go to S3 console
2. Verify bucket **softcodec** exists
3. Check region is **us-east-1**

---

## 🎯 Most Likely Fix (CORS):

**99% of upload failures are due to missing CORS configuration!**

### Quick Fix:
1. S3 Console → **softcodec** bucket
2. **Permissions** → **CORS**
3. Add the JSON config above
4. **Save**
5. Try upload again ✅

---

## 📱 Test Upload Again:

After fixing CORS:
1. Open app
2. Select video
3. Tap "Upload Video to AWS"
4. Should work! ✅

Check S3 bucket → videos/ folder for uploaded file.

---

## 🆘 Still Not Working?

### Get More Info:

1. **Check backend terminal** - Shows detailed errors
2. **Shake device** → Enable Remote Debugging → Check browser console
3. **Run test script:**
   ```bash
   cd backend-example
   node test-api.js
   ```

### Common Error Messages:

| Error | Cause | Fix |
|-------|-------|-----|
| "Network request failed" | Can't reach backend | Check IP address in App.tsx |
| "403 Forbidden" | CORS or permissions | Add CORS to S3 bucket |
| "Failed to generate presigned URL" | AWS credentials wrong | Check .env file |
| "No Bucket" | Bucket doesn't exist | Create bucket in S3 |
| "Access Denied" | IAM permissions | Add PutObject permission |

---

## ✅ Checklist:

Before upload works, verify:

- [ ] Backend running on port 3000
- [ ] AWS credentials in .env file
- [ ] S3 bucket "softcodec" exists
- [ ] CORS configured on bucket
- [ ] IAM user has PutObject permission
- [ ] App reloaded with latest code
- [ ] Device on same network as computer (192.168.100.32)

---

**Most important:** Configure CORS on S3 bucket! That's usually the issue! 🎯
