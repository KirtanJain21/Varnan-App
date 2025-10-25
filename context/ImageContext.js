import React, { createContext, useContext, useState } from 'react';

const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageList, setImageList] = useState([]); 

  return (
    <ImageContext.Provider value={{ selectedImage, setSelectedImage, imageList, setImageList }}>
      {children}
    </ImageContext.Provider>
  );
};

export const useImage = () => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error('useImage must be used within an ImageProvider');
  }
  return context;
};
