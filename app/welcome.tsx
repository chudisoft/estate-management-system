'use client'

import Image from "next/image";
import Head from 'next/head';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from "react";

const Welcome: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [
    '/images/background1.jpg',
    '/images/background2.jpg',
    '/images/background3.jpg',
  ];

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };
  
  useEffect(() => {
    const interval = setInterval(() => {
      handleNextImage();
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []);

  return (
    <div>
      {/* Welcome Section with Background Carousel */}
      <section className="relative text-white text-center py-20">
        <div className="absolute inset-0 overflow-hidden">
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)', // Black background with 50% transparency
              }}
            >
              <Image
                src={image}
                alt={`Background ${index + 1}`}
                layout="fill"
                objectFit="cover"
                className="w-full h-full"
                style={{ opacity: 0.7 }} // Image opacity
              />
            </div>
          ))}
        </div>

        {/* Text Container with Semi-Transparent Background */}
        <div
          className="ml-4 me-4"
        >
          <div
            className="relative z-10 bg-white bg-opacity-20 backdrop-blur-sm p-8 rounded-lg max-w-lg mx-auto"
            style={{ backgroundColor: 'rgba(48, 48, 48, 0.59)' }} // dark background with 40% transparency
          >
            <h4 className="font-bold">Chudisoft Technologies Presents</h4>
            <h1 className="text-3xl font-bold text-amber-100">Estate Management System</h1>
            <p className="mt-4 text-lg">Your trusted partner in innovative software solutions.</p>

            {/* Login and Registration Buttons */}
            <div className="flex justify-center space-x-4 mt-4">
              <a href='/authorize' className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center">
                <FontAwesomeIcon icon={faLock} className="mr-2" />
                Login
              </a>
              <a href='/authorize/register' className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center">
                <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                Register
              </a>
            </div>
          </div>
        </div>

        {/* Carousel Controls */}
        <div className="absolute top-1/2 transform -translate-y-1/2 w-full flex justify-between px-4">
          <button
            onClick={handlePrevImage}
            className="bg-gray-800 text-white px-2 py-1 rounded-lg"
          >
            &lt;
          </button>
          <button
            onClick={handleNextImage}
            className="bg-gray-800 text-white px-2 py-1 rounded-lg"
          >
            &gt;
          </button>
        </div>
      </section>

      {/* Other sections like About, Services, Features, Contact, Footer */}
      {/* ... */}
    </div>

  );
}

export default Welcome;