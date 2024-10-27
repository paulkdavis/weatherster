import React, { useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface wind {
    deg: number
    speed: number
}

interface WindVaneProps {
    currWind: wind
}

function WindVane({ currWind }: WindVaneProps) {
    // Constants
    const KM_TO_MILES_RATIO = 0.621371;

    // States
    const [isMetric, setIsMetric] = useState(true);

    // Normalize direction to 0-360 range
    const normalizedDirection = ((currWind.deg % 360) + 360) % 360;
    
    // Calculate rotation transform
    const rotation = `rotate(${normalizedDirection}deg)`;
    
    // Helper function to get cardinal direction
    const getCardinalDirection = (deg: number): string => {
        const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        const index = Math.round(deg / 45) % 8;
        return directions[index];
    };

    const styles = {
        compass: {
            position: 'relative' as const,
            width: '100px',
            height: '100px',
            backgroundColor: '#282c34',
            borderRadius: '50%',
            padding: '8px'
        },
        cardinalContainer: {
            position: 'absolute' as const,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            color: '#666'
        },
        north: {
            position: 'absolute' as const,
            top: '4px',
            left: '50%',
            transform: 'translateX(-50%)'
        },
        east: {
            position: 'absolute' as const,
            right: '4px',
            top: '50%',
            transform: 'translateY(-50%)'
        },
        south: {
            position: 'absolute' as const,
            bottom: '4px',
            left: '50%',
            transform: 'translateX(-50%)'
        },
        west: {
            position: 'absolute' as const,
            left: '4px',
            top: '50%',
            transform: 'translateY(-50%)'
        },
        arrowContainer: {
            position: 'relative' as const,
            width: '100%',
            height: '100%',
            transition: 'transform 1s',
            transform: rotation
        },
        arrowWrapper: {
            position: 'absolute' as const,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '60px',
            height: '60px'
        },
        arrowHead: {
            position: 'absolute' as const,
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#ff4444'
        },
        arrowTail: {
            position: 'absolute' as const,
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#666'
        },
        directionText: {
            position: 'absolute' as const,
            bottom: '-24px',
            left: '50%',
            minWidth: '100px',
            transform: 'translateX(-50%)',
            textAlign: 'center' as const,
            fontFamily: 'monospace'
        },
        unitToggle: {
            cursor: 'pointer'
        }
    };

    return (
        <span id="wind-vane">
            <div style={styles.compass}>
                <div style={styles.cardinalContainer}>
                    <div style={styles.north}>N</div>
                    <div style={styles.east}>E</div>
                    <div style={styles.south}>S</div>
                    <div style={styles.west}>W</div>
                </div>

                <div style={styles.arrowContainer}>
                    <div style={styles.arrowWrapper}>
                        <div style={styles.arrowHead}>
                            <ArrowUp size={16} />
                        </div>
                        <div style={styles.arrowTail}>
                            <ArrowDown size={16} />
                        </div>
                    </div>
                </div>

                <div style={styles.directionText}>
                    {getCardinalDirection(normalizedDirection)}&nbsp;
                    {isMetric ? 
                        Math.round(currWind.speed) : 
                        Math.round(currWind.speed * KM_TO_MILES_RATIO)
                    }
                    <span 
                        style={styles.unitToggle}
                        onClick={() => setIsMetric(!isMetric)}
                    >
                        {isMetric ? ' km/h' : ' mph'}
                    </span>
                </div>
            </div>
        </span>
    );
}

export default WindVane;