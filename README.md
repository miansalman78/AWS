# AWS Video Upload App 📹☁️

React Native mobile app built with Expo and TypeScript for uploading videos to AWS S3 using presigned URLs.

## ✨ Features

- 📂 **Video Selection** - Pick videos from device gallery
- 👀 **Video Preview** - Play and preview selected videos
- ☁️ **AWS S3 Upload** - Upload videos to AWS using presigned URLs
- 🎨 **Modern UI** - Clean, intuitive interface with AWS branding
- 🔒 **Secure** - Uses presigned URLs for secure uploads
- 📱 **Cross-platform** - Works on iOS, Android, and Web

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- Expo Go app on your mobile device (optional)
- AWS Account (for video uploads)

### Installation

Dependencies are already installed! Just navigate to the project:
```bash
cd my-expo-app
```

### Run the App

```bash
# Start development server
npm start

# Or run on specific platform
npm run android   # Android
npm run ios       # iOS (macOS only)
npm run web       # Web browser
```

### Using Expo Go
1. Install Expo Go from App/Play Store
2. Run `npm start`
3. Scan QR code with Expo Go (Android) or Camera (iOS)

## 📂 Project Structure

```
my-expo-app/
├── App.tsx                    # Main app with video upload UI
├── AWS_SETUP_GUIDE.md        # Complete AWS setup instructions
├── backend-example/          # Backend server example
│   ├── server.js            # Express server for presigned URLs
│   ├── package.json         # Backend dependencies
│   ├── .env.example         # Environment variables template
│   └── README.md            # Backend documentation
├── app.json                  # Expo configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # App dependencies
```

## 🛠️ Tech Stack

### Frontend (Mobile App)
- **React Native** - Cross-platform mobile framework
- **Expo SDK 54** - Development platform
- **TypeScript** - Type-safe JavaScript
- **expo-video** - Video playback
- **expo-image-picker** - Gallery access

### Backend (Optional)
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **AWS SDK v3** - AWS S3 integration
- **S3 Presigned URLs** - Secure upload

## 🎯 How It Works

1. **Select Video** - User picks a video from device gallery
2. **Preview** - Video plays in preview player
3. **Upload** - Click AWS upload button
4. **Generate URL** - Backend creates presigned S3 URL
5. **Upload to S3** - Video uploads directly to AWS
6. **Success** - Confirmation message displayed

## 🔧 AWS Setup

### Quick Setup Steps:

1. **Create S3 Bucket**
   - Go to AWS Console → S3
   - Create new bucket
   - Configure CORS (see AWS_SETUP_GUIDE.md)

2. **Setup Backend Server**
   ```bash
   cd backend-example
   npm install
   cp .env.example .env
   # Edit .env with your AWS credentials
   npm start
   ```

3. **Update App Configuration**
   - Open `App.tsx`
   - Update line 50 with your backend URL:
   ```typescript
   const PRESIGNED_URL_ENDPOINT = 'http://your-server:3000/api/get-presigned-url';
   ```

4. **For detailed setup**, see [AWS_SETUP_GUIDE.md](./AWS_SETUP_GUIDE.md)

## 📱 App Features

### Video Selection
- Gallery permission request
- Support for multiple video formats
- Video validation

### Video Preview
- Full video player with controls
- Fullscreen support
- Picture-in-picture mode
- Looping playback

### AWS Upload
- Progress indicator
- Error handling
- Upload confirmation
- Automatic retry support

## 🎨 UI Components

- **AWS Icon** - Orange circular badge at top
- **Video Player** - Full-featured preview
- **Select Button** - Green gallery picker
- **Upload Button** - Orange AWS upload
- **Instructions** - Helpful usage guide

## 🔒 Security Features

- Presigned URLs with expiration
- Server-side credential management
- No AWS keys in frontend
- CORS configuration
- File type validation
- Size limit enforcement

## 📝 Configuration

### App Settings (app.json)
```json
{
  "name": "my-expo-app",
  "version": "1.0.0",
  "expo": {
    "plugins": ["expo-video"]
  }
}
```

### TypeScript (tsconfig.json)
- Strict mode enabled
- Type checking enforced

## 🧪 Testing

### Test Video Upload
1. Start the app
2. Tap "Select Video from Gallery"
3. Choose a video file
4. Watch preview
5. Tap "Upload Video to AWS"
6. Check S3 bucket for uploaded file

## 📚 Documentation

- [AWS Setup Guide](./AWS_SETUP_GUIDE.md) - Complete AWS configuration
- [Backend README](./backend-example/README.md) - Server setup
- [Expo Docs](https://docs.expo.dev/) - Expo framework
- [AWS S3 Docs](https://docs.aws.amazon.com/s3/) - S3 documentation

## 🐛 Troubleshooting

### Common Issues:

**Video not uploading?**
- Check backend server is running
- Verify AWS credentials in .env
- Check S3 bucket CORS configuration
- Ensure presigned URL endpoint is correct

**Video preview not working?**
- Check device permissions
- Try different video format
- Restart Metro bundler: `npm start --clear`

**Connection errors?**
- For Android emulator: Use `http://10.0.2.2:3000`
- For physical device: Use computer's local IP
- Check firewall settings

## 🚀 Deployment

### Deploy Backend
- AWS Lambda + API Gateway
- Heroku
- DigitalOcean
- Vercel (for serverless)

### Deploy App
```bash
# Build for production
eas build --platform android
eas build --platform ios

# Submit to stores
eas submit --platform android
eas submit --platform ios
```

## 🤝 Contributing

Feel free to customize and extend this app:
- Add authentication
- Multiple video uploads
- Progress tracking
- Video compression
- Thumbnail generation

## 📄 License

MIT License - Feel free to use for your projects!

## 🎉 Happy Coding!

For questions or issues, refer to:
- [Expo Documentation](https://docs.expo.dev/)
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [React Native Documentation](https://reactnative.dev/)
