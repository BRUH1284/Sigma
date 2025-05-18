import React from 'react';
import { FontAwesome, FontAwesome6, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { StyleProp, TextStyle } from 'react-native';


/**
 * Podporované knižnice ikon.
 */
const iconLibraries = {
    MaterialIcons,
    FontAwesome,
    Ionicons,
    MaterialCommunityIcons,
    FontAwesome6
};


/**
 * Názov knižnice ikon, z ktorej sa má vykresliť ikona.
 * 
 * Môže byť: `MaterialIcons`, `FontAwesome`, `Ionicons`, `MaterialCommunityIcons`, `FontAwesome6`.
 */
export type IconLibraryName = keyof typeof iconLibraries;


/**
 * Typ pre jeden dynamický ikonový prvok.
 */
export type IconItem = {
    name: string;
    size: number;
    library: IconLibraryName;
    color?: string;
    style?: StyleProp<TextStyle>;
};

/**
 * `DynamicIcon` umožňuje dynamické vykreslenie ikon z rôznych knižníc.
 *
 * Používa sa, ak sa knižnica a názov ikony rozhodujú za behu (napr. pri generovaných zoznamoch).
 *
 * @component
 * @param name - názov ikony
 * @param size - veľkosť ikony v pixeloch
 * @param library - názov knižnice, z ktorej sa ikona má zobraziť
 * @param color - voliteľná farba ikony
 * @param style - voliteľný štýl textu
 * @returns React komponent reprezentujúci zvolenú ikonu
 */
export default function DynamicIcon({ name, size, library, color, style }: IconItem) {
    const IconLib = iconLibraries[library];
    return <IconLib name={name as any} size={size} color={color} style={style} />;
}
