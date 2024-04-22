import React, { useState, useEffect } from 'react';
import { View, Image, Dimensions } from 'react-native';

const Background = () => {
    const [images, setImages] = useState([]);
    const [galaxies, setGalaxies] = useState([]);

    useEffect(() => {
        const generateInitialImages = (imageList, numberOfInitialImages) => {
            const screenWidth = Dimensions.get('window').width;
            const screenHeight = Dimensions.get('window').height;
            const initialImages = [];
            for (let i = 0; i < numberOfInitialImages; i++) {
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

        const generateRandomGalaxy = (imageList) => {
            const screenWidth = Dimensions.get('window').width;
            const randomX = Math.floor(Math.random() * screenWidth);
            const randomRotation = Math.random() * 360; // Random rotation between 0 to 360 degrees
            const randomImageIndex = Math.floor(Math.random() * imageList.length);
            const imageUrl = imageList[randomImageIndex];
            return { x: randomX, y: 0, imageUrl, rotation: randomRotation };
        };

        const moveImages = () => {
            setImages(prevImages =>
                prevImages.map(image => ({ ...image, y: image.y + 1 }))
                    .filter(image => image.y < Dimensions.get('window').height)
            );
        };

        const moveGalaxies = () => {
            setGalaxies(prevGalaxies =>
                prevGalaxies.map(galaxy => ({ ...galaxy, y: galaxy.y + 1 }))
                    .filter(galaxy => galaxy.y < Dimensions.get('window').height)
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

        const galaxyImageUrls = [
            require('../assets/sprites/bgObjects/blueGalaxy.png'),
            require('../assets/sprites/bgObjects/orangeGalaxy.png'),
            require('../assets/sprites/bgObjects/purpleGalaxy.png'),
            require('../assets/sprites/bgObjects/redGalaxy.png'),
        ];

        const initialStars = generateInitialImages(starImageUrls, 15);
        setImages(initialStars);

        const starIntervalId = setInterval(() => {
            const newStars = generateRandomImage(starImageUrls, 5);
            setImages(prevImages => [...prevImages, ...newStars]);
        }, 2000);

        const galaxyIntervalId = setInterval(() => {
            const newGalaxy = generateRandomGalaxy(galaxyImageUrls);
            setGalaxies(prevGalaxies => [...prevGalaxies, newGalaxy]);
        }, Math.random() * 8000 + 5000);

        const moveIntervalId = setInterval(() => {
            moveImages();
            moveGalaxies();
        }, 50);

        return () => {
            clearInterval(starIntervalId);
            clearInterval(galaxyIntervalId);
            clearInterval(moveIntervalId);
        };
    }, []);

    return (
        <View className="flex-1 bg-black">
            {images.map((image, index) => (
                <Image
                    key={index}
                    source={image.imageUrl}
                    style={{ position: 'absolute', left: image.x, top: image.y }}
                />
            ))}
            {galaxies.map((galaxy, index) => (
                <Image
                    key={`galaxy-${index}`}
                    source={galaxy.imageUrl}
                    style={{
                        position: 'absolute',
                        left: galaxy.x,
                        top: galaxy.y,
                        transform: [{ rotate: `${galaxy.rotation}deg` }],
                        opacity: 50,
                    }}
                />
            ))}
        </View>
    );
};

export default Background;
