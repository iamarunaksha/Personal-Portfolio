import React from 'react';
import { portfolioData } from '../../config/portfolioData';

export default function SpotifyApp() {
  return (
    <div className="w-full h-full bg-[#121212] pt-6 overflow-hidden">
       <iframe 
         src={portfolioData.spotifyEmbedUrl} 
         width="100%" 
         height="100%" 
         frameBorder="0" 
         allowFullScreen="" 
         allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
         loading="lazy"
       ></iframe>
    </div>
  );
}
