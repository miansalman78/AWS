# 🚀 Quick Start Guide - AWS Video Upload App

## ✅ Current Status

### What's Already Running:
- ✅ **Frontend:** Expo app is live
- ✅ **Backend:** Server running on `http://localhost:3000`
- ⚠️ **AWS:** Needs your credentials

---

## 📱 Test App Right Now (Without AWS)

### On Your Phone/Emulator:
1. Open Expo Go app
2. Scan QR code from terminal
3. App will open showing:
   - AWS orange icon
   - Video preview area
   - "Select Video from Gallery" button
   - "Upload Video to AWS" button

### Try These Features:
✅ Tap "Select Video" → Pick a video
✅ Watch video preview (play, pause, fullscreen)
⚠️ Upload will fail (needs AWS setup)

---

## 🔑 Setup AWS (3 Easy Steps)

### Step 1: Get AWS Credentials

#### If You Have AWS Account:
1. Go to: https://console.aws.amazon.com/iam/
2. Click **Users** → **Create user** (or use existing)
3. Set permissions: `AmazonS3FullAccess` (or custom S3 policy)
4. Go to **Security credentials** tab
5. Click **Create access key** → Choose "Application running outside AWS"
6. Copy both:
   - Access Key ID (starts with `AKIA...`)
   - Secret Access Key (long random string)

#### If No AWS Account:
1. Sign up: https://aws.amazon.com/free/
2. Free tier includes 5GB S3 storage
3. Follow steps above to get credentials

### Step 2: Create S3 Bucket

1. Go to: https://s3.console.aws.amazon.com/
2. Click **Create bucket**
3. Bucket name: `your-video-uploads-bucket` (must be globally unique)
4. Region: Choose `us-east-1` (or your preferred region)
5. **Block all public access:** Keep it CHECKED (for security)
6. Click **Create bucket**
7. Open bucket → **Permissions** → **CORS**
8. Click **Edit** and paste:
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
9. Save changes

### Step 3: Configure Backend

1. Open file: `backend-example\.env`
2. Replace with your real values:
```env
AWS_ACCESS_KEY_ID=AKIA2XXXXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=abcd1234XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
AWS_REGION=us-east-1
AWS_BUCKET_NAME=your-video-uploads-bucket
PORT=3000
```

3. Save file

4. Restart backend (in backend terminal press Ctrl+C, then):
```bash
npm start
```

5. Test it:
```bash
node test-api.js
```

You should see:
```
✅ Health Check: OK
✅ Presigned URL Generated Successfully!
✅ AWS Status: CONFIGURED
```

---

## 🎬 Upload Your First Video!

### Now Everything Works:

1. **Open app on phone**
2. **Tap "Select Video from Gallery"**
3. **Choose any video**
4. **Watch preview**
5. **Tap "Upload Video to AWS"** ☁️
6. **Wait for success message** ✅
7. **Check S3 bucket** - Your video is there!

---

## 🔍 Verify Upload in AWS

1. Go to: https://s3.console.aws.amazon.com/
2. Open your bucket
3. Look in `videos/` folder
4. You'll see: `1730xxxxxxx-video.mp4`
5. That's your uploaded video!

---

## 📡 Connection Issues?

### If app can't connect to backend:

#### For Android Emulator:
Edit `App.tsx` line 57:
```typescript
const PRESIGNED_URL_ENDPOINT = 'http://10.0.2.2:3000/api/get-presigned-url';
```

#### For Physical Device:
1. Find your computer's IP:
```bash
ipconfig
# Look for "IPv4 Address" under your network adapter
# Example: 192.168.1.100
```

2. Edit `App.tsx` line 57:
```typescript
const PRESIGNED_URL_ENDPOINT = 'http://192.168.1.100:3000/api/get-presigned-url';
```

3. Make sure phone and computer on same WiFi

---

## 🧪 Test Commands

### Test Backend:
```bash
cd backend-example
node test-api.js
```

### Check Backend Health:
Open browser: http://localhost:3000/health

### View Backend Logs:
Check the terminal where `npm start` is running

---

## 📂 File Locations

```
my-expo-app/
├── App.tsx                          ← Main app code
├── backend-example/
│   ├── .env                        ← AWS credentials HERE
│   ├── server.js                   ← Backend server
│   └── test-api.js                 ← Test script
├── SYSTEM_STATUS.md                ← System status
├── QUICK_START.md                  ← This file
└── AWS_SETUP_GUIDE.md              ← Detailed AWS guide
```

---

## ⚡ Quick Reference

### Backend Commands:
```bash
cd backend-example
npm start              # Start server
node test-api.js       # Test AWS connection
```

### Frontend Commands:
```bash
cd my-expo-app
npm start              # Start app
npm start --clear      # Clear cache & start
```

### Key URLs:
- Backend Health: http://localhost:3000/health
- Backend API: http://localhost:3000/api/get-presigned-url
- AWS Console: https://console.aws.amazon.com/
- S3 Buckets: https://s3.console.aws.amazon.com/

---

## 💡 Tips

### Security:
- ✅ Never commit `.env` file to git
- ✅ Use IAM user with minimal S3 permissions only
- ✅ Keep AWS keys secret
- ✅ Rotate keys regularly

### Cost:
- ✅ AWS Free Tier: 5GB storage free
- ✅ First 12 months free (new accounts)
- ⚠️ Monitor usage in AWS Billing Dashboard

### Performance:
- Choose S3 region closest to users
- Use video compression before upload
- Monitor file sizes

---

## 🆘 Common Errors

### "Failed to generate presigned URL"
→ Check `.env` has real AWS credentials

### "No value provided for input HTTP label: Bucket"
→ Update `AWS_BUCKET_NAME` in `.env`

### "Connection refused"
→ Make sure backend is running (`npm start`)

### "Permission denied"
→ Check IAM user has S3 PutObject permission

### "Network request failed"
→ Use correct IP for physical device (see Connection Issues)

---

## 🎉 You're All Set!

Everything is ready to go:
- ✅ Frontend running
- ✅ Backend running
- ⚠️ Just add AWS credentials
- 🚀 Start uploading!

Need help? Check:
- `SYSTEM_STATUS.md` - System status
- `AWS_SETUP_GUIDE.md` - Detailed AWS setup
- `backend-example/README.md` - Backend docs
- `README.md` - Full documentation
