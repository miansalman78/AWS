import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { VideoView, useVideoPlayer } from 'expo-video';

export default function App() {
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  
  // Create video player
  const player = useVideoPlayer(videoUri || '', (player) => {
    player.loop = true;
  });

  // Function to pick video from gallery
  const pickVideo = async () => {
    try {
      // Request permission
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access gallery is required!');
        return;
      }

      // Launch image picker for video
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['videos'],
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setVideoUri(result.assets[0].uri);
        Alert.alert('Success', 'Video selected successfully!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick video');
      console.error(error);
    }
  };

  // Function to upload video to AWS using presigned URL
  const uploadToAWS = async () => {
    if (!videoUri) {
      Alert.alert('No Video', 'Please select a video first!');
      return;
    }

    try {
      setUploading(true);

      // Backend API endpoint
      // Your device IP: 192.168.100.32, so using computer's local network IP
      // Change this to your computer's actual IP address
      const PRESIGNED_URL_ENDPOINT = 'http://192.168.100.32:3000/api/get-presigned-url';
      
      // Step 1: Get presigned URL from your backend
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
      
      const data = await response.json();
      
      if (!response.ok || !data.presignedUrl) {
        throw new Error(data.error || 'Failed to get presigned URL');
      }
      
      const presignedUrl = data.presignedUrl;

      // Step 2: Upload video to S3 using presigned URL
      const videoBlob = await fetch(videoUri).then(r => r.blob());
      
      const uploadResponse = await fetch(presignedUrl, {
        method: 'PUT',
        body: videoBlob,
        headers: {
          'Content-Type': 'video/mp4',
        },
      });

      if (uploadResponse.ok) {
        Alert.alert('Success', 'Video uploaded to AWS successfully!');
      } else {
        Alert.alert('Error', 'Failed to upload video to AWS');
      }
    } catch (error) {
      Alert.alert('Error', 'Upload failed: ' + error);
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      {/* AWS Logo/Icon at the top */}
      <View style={styles.header}>
        <View style={styles.awsIconContainer}>
          <Text style={styles.awsText}>AWS</Text>
        </View>
        <Text style={styles.title}>Video Upload to AWS</Text>
      </View>

      {/* Video Preview - Updated with latest fixes */}
      <View style={styles.videoContainer}>
        {videoUri ? (
          <VideoView
            style={styles.video}
            player={player}
            nativeControls
            contentFit="contain"
            allowsPictureInPicture
          />
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderIcon}>📹</Text>
            <Text style={styles.placeholderText}>No video selected</Text>
          </View>
        )}
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        {/* Select Video Button */}
        <TouchableOpacity style={styles.selectButton} onPress={pickVideo}>
          <Text style={styles.selectButtonText}>📂 Select Video from Gallery</Text>
        </TouchableOpacity>

        {/* Upload to AWS Button */}
        <TouchableOpacity 
          style={[styles.uploadButton, (!videoUri || uploading) && styles.disabledButton]} 
          onPress={uploadToAWS}
          disabled={!videoUri || uploading}
        >
          {uploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.uploadButtonText}>☁️ Upload Video to AWS</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Instructions */}
      <View style={styles.instructions}>
        <Text style={styles.instructionText}>📝 Instructions:</Text>
        <Text style={styles.instructionStep}>1. Tap "Select Video" to choose from gallery</Text>
        <Text style={styles.instructionStep}>2. Preview your video</Text>
        <Text style={styles.instructionStep}>3. Tap "Upload to AWS" to upload</Text>
        <Text style={styles.note}>⚠️ Configure presigned URL endpoint in code</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  awsIconContainer: {
    backgroundColor: '#FF9900',
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  awsText: {
    color: '#232F3E',
    fontSize: 28,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#232F3E',
  },
  videoContainer: {
    width: '90%',
    height: 300,
    backgroundColor: '#000',
    borderRadius: 12,
    overflow: 'hidden',
    alignSelf: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
  },
  placeholderIcon: {
    fontSize: 60,
    marginBottom: 10,
  },
  placeholderText: {
    color: '#888',
    fontSize: 16,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    gap: 15,
  },
  selectButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  uploadButton: {
    backgroundColor: '#FF9900',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  instructions: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 20,
  },
  instructionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#232F3E',
    marginBottom: 8,
  },
  instructionStep: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  note: {
    fontSize: 12,
    color: '#FF6B6B',
    marginTop: 8,
    fontStyle: 'italic',
  },
});
