useEffect(() => {
    const updateWrapperPosition = () => {
        if (isGameOver || !gifWrapperRef.current || !obstacleRef.current) {
            return;
        }
        gifWrapperRef.current.measureInWindow((x1, y1, height1, width1) => {
            const playerTop = y1;
            const playerBottom = y1 + height1;
            if (isGameOver || !gifWrapperRef.current || !obstacleRef.current) {
                return;
            }
            obstacleRef.current.measureInWindow((x2, y2, width2, height2) => {
                const obstacleTop = y2;
                const obstacleBottom = obstacleTop + height2;

                // Check collision only if obstacle is within player's vicinity
                if (playerTop < obstacleBottom && playerBottom > obstacleTop) {
                    if (!freeSpaceRef.current.includes(playerLocationRef.current)) {
                        let damage = 0;
                        if (!obstacleRef.current.collided) { // Check if obstacle has already collided
                            obstacleRef.current.collided = true; // Set collided flag

                            if (obstacleImageRef.current === earthImage) {
                                damage = 1; // Earth: heal 1 health point
                            } else if (obstacleImageRef.current === sunImage) {
                                damage = -3; // Sun: deduct 3 health points
                            } else if (obstacleImageRef.current === asteroidImage) {
                                damage = -1; // Asteroid: deduct 1 health point
                            } else if (obstacleImageRef.current === saturnImage || obstacleImageRef.current === jupiterImage) {
                                damage = -2; // Saturn or Jupiter: deduct 2 health points
                            } else if (obstacleImageRef.current === blackImage) {
                                healthRef.current = 0; // Black Hole: instantly set health to 0
                            }
                            if (bonusLife) {
                                healthRef.current = Math.min(Math.max(healthRef.current + damage, 0), 4);
                            }
                            if (!bonusLife) {
                                healthRef.current = Math.min(Math.max(healthRef.current + damage, 0), 3);
                            }
                            storage.save({
                                key: 'bonusLife',
                                data: false,
                            });
 
                        }
                    }
                } else {
                    obstacleRef.current.collided = false; // Reset collided flag when obstacle moves out of player's vicinity
                }
            });
        });
    };


    const intervalId = setInterval(updateWrapperPosition, 1000 / 60);

    return () => {
        clearInterval(intervalId);
    };
}, [isGameOver]);
