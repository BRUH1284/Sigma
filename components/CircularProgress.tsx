import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import Animated, {
    useAnimatedProps,
} from 'react-native-reanimated';
// import { COLORS } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import DynamicIcon, { IconLibraryName } from './DynamicIcon';

/**
 * Jeden prstenec (vrstva kruhového progress indikátora).
 */
type Ring = {
    /** Farba aktívneho úseku */
    color: string;
    /** Farba pozadia kruhu (nevyplnená časť) */
    backgroundColor?: string;
    /** Progres 0.0 - 1.0 */
    progress: number;
};

/**
 * Ikonka umiestnená do stredu progress kruhu.
 */
type IconItem = {
    /** Názov ikony */
    name: string;
    /** Knižnica, z ktorej sa ikona berie (napr. MaterialIcons) */
    library: IconLibraryName;
    /** Voliteľná farba ikony */
    color?: string;
};

/**
 * Props pre komponent `CircularProgress`.
 */
type Props = {
    /** Veľkosť kruhu v pixeloch */
    size: number;
    /** Hrúbka jednotlivých kruhov */
    strokeWidth: number;
    /** Výplň stredu kruhu */
    fill?: string;
    /** Pole kruhových prstencov */
    rings: Ring[];
    /** Voliteľná veľkosť ikon */
    iconSize?: number;
    /** Ikonky v strede kruhu */
    icons?: IconItem[];
};

// Animovaný SVG kruh
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/**
 * Komponent `CircularProgress` zobrazuje kruhový progress indikátor s podporou viacerých vrstiev (prstencov)
 * a voliteľnými ikonkami v strede.
 *
 * Používa SVG a podporuje animácie cez `react-native-reanimated`.
 *
 * @component
 * @param size - Veľkosť SVG plátna
 * @param strokeWidth - Hrúbka kruhu
 * @param rings - Zoznam prstencov s progresmi
 * @param icons - Ikony, ktoré sa vykreslia do stredu
 * @returns JSX komponent zobrazujúci kruhový progress
 */
const CircularProgress: React.FC<Props> = ({
    size,
    strokeWidth,
    fill = "none",
    rings,
    icons = [],
    iconSize = null,
}) => {
    const { colors } = useTheme();
    const iconContainerSize = (size - rings.length * strokeWidth) / 2 * Math.SQRT2;
    iconSize = iconSize || iconContainerSize / Math.ceil(Math.sqrt(icons.length)) * 0.85;;
    return (
        <View style={{
            width: size,
            height: size,
            position: 'relative',
        }}>
            <Svg width={size} height={size}>
                {rings.map((ring, index) => {
                    const progress = ring.progress <= 1 ? ring.progress : 1;

                    const padding = 2;
                    const ringSize = size - index * strokeWidth - padding;
                    const ringRadius = (ringSize - (index + 1) * strokeWidth) / 2;
                    const ringCircumference = ringRadius * 2 * Math.PI;

                    const strokeDashoffset = ringCircumference - (ringCircumference * progress);

                    return (
                        <G key={index} rotation="-90" origin={`${size / 2}, ${size / 2}`}>
                            <Circle
                                stroke={ring.backgroundColor || colors.lightGray}
                                fill={fill}
                                cx={size / 2}
                                cy={size / 2}
                                r={ringRadius}
                                strokeWidth={strokeWidth}
                            />
                            <AnimatedCircle
                                stroke={ring.color}
                                fill="none"
                                cx={size / 2}
                                cy={size / 2}
                                r={ringRadius}
                                strokeWidth={strokeWidth}
                                strokeLinecap="round"
                                strokeDasharray={`${ringCircumference}, ${ringCircumference}`}
                                strokeDashoffset={strokeDashoffset}
                            />
                        </G>
                    );
                })}
            </Svg>
            {/* Center icon */}
            <View style={[{
                position: 'absolute',
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignContent: 'center',
                top: '50%',
                left: '50%'
            }, {
                width: iconContainerSize,
                height: iconContainerSize,
                transform: [
                    { translateX: -iconContainerSize / 2 },
                    { translateY: -iconContainerSize / 2 }
                ]
            },]}>
                {icons.map((icon, index) => {
                    return (
                        <DynamicIcon
                            key={index}
                            name={icon.name}
                            size={iconSize}
                            color={icon.color}
                            library={icon.library}
                        />
                    );
                })}
            </View>
        </View>
    );
};

// const styles = StyleSheet.create({
//     container: {
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     iconContainer: {
//         position: 'absolute',
//         flexDirection: 'row',
//         justifyContent: 'center',
//         alignItems: 'center',
//         top: '50%',
//         left: '50%'
//     },
//     icon: {
//         marginHorizontal: 4,
//     },
// });


export default CircularProgress;
