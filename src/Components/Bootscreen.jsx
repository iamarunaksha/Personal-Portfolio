import React, { useState, useEffect } from 'react';

export default function Bootscreen({ theme, onComplete }) {
  const [imageIndex, setImageIndex] = useState(0);

  // Determine which array of images to use based on the theme prop
  const images = theme === 'dark' 
    ? ['/boot/dark-1.jpeg', '/boot/dark-2.png']
    : ['/boot/light-1.png', '/boot/light-2.jpg'];

  useEffect(() => {
    // If we've shown all 3 images, wait 1s and tell the App we are done!
    if (imageIndex >= images.length) {
      const finishTimer = setTimeout(() => onComplete(), 1000);
      return () => clearTimeout(finishTimer);
    }
    // Set a timer to move to the next image every 2.5 seconds
    const intervalTimer = setTimeout(() => {
      setImageIndex(prev => prev + 1);
    }, 2500);
    return () => clearTimeout(intervalTimer);
  }, [imageIndex, images.length, onComplete]);
  // If we advanced past the last image, keep showing a black screen briefly
  if (imageIndex >= images.length) {
    return <div className={`fixed inset-0 z-50 ${theme === 'dark' ? 'bg-black' : 'bg-gray-100'}`} />
  }
  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-colors duration-700 ${
        theme === 'dark' 
          ? 'bg-black' 
          : 'bg-gradient-to-r from-[#d8fdf5] via-[#e2ecf9] to-[#e5e5fa]'
      }`}
    >
      <img 
        key={images[imageIndex]} 
        src={images[imageIndex]} 
        alt="booting..." 
        className={`w-full h-full animate-pulse ${
          imageIndex === 0 ? 'object-cover' : 'object-contain'
        }`}
      />
    </div>
  );
}