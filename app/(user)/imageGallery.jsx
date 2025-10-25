import BackButton from '@/components/BackButton';
import { useImage } from '@/context/ImageContext';
import { Image, StyleSheet, View } from 'react-native';

const ImageGallery = () => {
  const { selectedImage } = useImage();

  if (!selectedImage) return null;

  return (
    <View style={styles.container}>
      
      <View style={styles.backButtonContainer}>
        <BackButton color="white" backgroundColor="rgba(0,0,0,0.3)" />
      </View>

      {/* Full-screen image */}
      <Image
        source={{ uri: selectedImage }}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

export default ImageGallery;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonContainer: {
    position: 'absolute',
    top: 40, 
    left: 20,
    zIndex: 10, 
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
