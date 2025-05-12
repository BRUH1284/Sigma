import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import Animated, {
    useAnimatedProps,
} from 'react-native-reanimated';
// import { COLORS } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import DynamicIcon, { IconLibraryName } from './DynamicIcon';

type Ring = {
    color: string;
    backgroundColor?: string;
    progress: number;
};

type IconItem = {
    name: string;
    library: IconLibraryName;
    color?: string;
};


type Props = {
    size: number
    strokeWidth: number,
    fill?: string,
    rings: Ring[];
    iconSize?: number;
    icons?: IconItem[];
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

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
                    const progress = ring.progress;

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
