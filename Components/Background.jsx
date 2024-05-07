import React, { useState, useEffect } from 'react';
import { View, Image, Dimensions } from 'react-native';

const Background = () => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        const generateInitialImages = (imageList, numberOfInitialStars) => {
            const screenWidth = Dimensions.get('window').width;
            const screenHeight = Dimensions.get('window').height;
            const initialImages = [];
            for (let i = 0; i < numberOfInitialStars; i++) {
                const randomX = Math.floor(Math.random() * screenWidth);
                const randomY = Math.floor(Math.random() * screenHeight);
                const randomImageIndex = Math.floor(Math.random() * imageList.length);
                const imageUrl = imageList[randomImageIndex];
                initialImages.push({ x: randomX, y: randomY, imageUrl });
            }
            return initialImages;
        };

        const generateRandomImage = (imageList, numberOfImages) => {
            const screenWidth = Dimensions.get('window').width;
            const randomX = Math.floor(Math.random() * screenWidth);
            const randomImageIndex = Math.floor(Math.random() * imageList.length);
            const imageUrl = imageList[randomImageIndex];
            return Array.from({ length: numberOfImages }, () => ({
                x: randomX,
                y: 0,
                imageUrl,
            }));
        };
        
        const moveImages = () => {
            setImages(prevImages =>
                prevImages.map(image => ({ ...image, y: image.y + 1 }))
                    .filter(image => image.y < Dimensions.get('window').height)
            );
        };

        const starImageUrls = [
            require('../assets/sprites/bgObjects/star1.png'),
            require('../assets/sprites/bgObjects/star1red.png'),
            require('../assets/sprites/bgObjects/star2.png'),
            require('../assets/sprites/bgObjects/star2red.png'),
            require('../assets/sprites/bgObjects/star3.png'),
            require('../assets/sprites/bgObjects/star3red.png'),
        ];

        const initialImages = generateInitialImages(starImageUrls, 15);
        setImages(initialImages);

        const intervalId = setInterval(() => {
            const newStars = generateRandomImage(starImageUrls, 5);
            setImages(prevImages => [...prevImages, ...newStars]);
        }, 2000);

        const moveIntervalId = setInterval(moveImages);

        return () => {
            clearInterval(intervalId);
            clearInterval(moveIntervalId);
        };
    }, []);

    return (
        <View className="flex-1 bg-black z-0">
            {images.map((image, index) => (
                <Image
                    key={index}
                    source={image.imageUrl}
                    style={{ position: 'absolute', left: image.x, top: image.y }}
                />
            ))}
        </View>
    );
};

export default Background;
