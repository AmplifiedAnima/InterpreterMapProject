module.exports = {
    content: [
      './index.html',
      './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: { 
        colors: {
        primary: '#28A745',  // Primary green for navigation and CTAs
        secondary: '#218838',  // Secondary darker green
        actionBlue: '#007BFF',  // Blue for variety in CTAs or links
        backgroundLight: '#F8F9FA',  // Light background
        neutralGray: '#E9ECEF',  // Neutral tones for cards and elements
        errorRed: '#DC3545',  // Error color
        textDark: '#212529',  // Dark text color
        textGray: '#343A40',  // Slightly lighter dark text
        infoBlue: '#17A2B8',   // Highlight color for interpreter-specific elements
        scrollbar: {
          DEFAULT: '#8A94A6', // Default scrollbar color
          hover: '#4A5568',   // Hover state color
      
    
        },},},
        
    },
    plugins: [
      require('tailwind-scrollbar')({ nocompatible: true }), // Add the plugin
    ],
  }