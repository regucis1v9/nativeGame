import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

const Background = () => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        const generateRandomImage = () => {
            const screenWidth = Dimensions.get('window').width;
            const randomX = Math.floor(Math.random() * screenWidth);
            const randomImageIndex = Math.floor(Math.random() * imageUrls.length);
            const imageUrl = imageUrls[randomImageIndex];
            return { x: randomX, y: -100, imageUrl };
        };

        const imageUrls = [
            require('../assets/sprites/bgObjects/blueGalaxy.png'),
            require('../assets/sprites/bgObjects/redGalaxy.png'),
            require('../assets/sprites/bgObjects/orangeGalaxy.png'),
            require('../assets/sprites/bgObjects/purpleGalaxy.png'),
        ];
        const starImageUrls = [
            require('../assets/sprites/bgObjects/star1.png'),
            require('../assets/sprites/bgObjects/star1red.png'),
            require('../assets/sprites/bgObjects/star2.png'),
            require('../assets/sprites/bgObjects/star2red.png'),
            require('../assets/sprites/bgObjects/star3.png'),
            require('../assets/sprites/bgObjects/star3red.png'),
        ]

        const initialImages = Array.from({ length: 5 }, () => generateRandomImage());
        setImages(initialImages);

        const moveImages = () => {
            setImages(prevImages =>
                prevImages.map(image => ({ ...image, y: image.y + 1 }))
            );
        };

        const intervalId = setInterval(moveImages, 50);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <View className="w-full h-full bg-black justify-center items-center">
            {images.map((image, index) => (
                <Image
                    key={index}
                    source={image.imageUrl}
                    style={{ left: image.x, top: image.y }}
                    // className="absolute"
                />
            ))}
            {/*<Image source={require('../assets/sprites/bgObjects/blueGalaxy.png')} className="w-[10px] h-[10px]" />*/}
        </View>
    );
};
export default Background;
