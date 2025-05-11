import React from 'react';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';

const iconLibraries = {
    MaterialIcons,
    FontAwesome,
    Ionicons,
};

export type IconLibraryName = keyof typeof iconLibraries;

export type IconItem = {
    name: string;
    size: number;
    library: IconLibraryName;
    color?: string;
    style?: any;
};

export default function DynamicIcon({ name, size, library, color, style }: IconItem) {
    const IconLib = iconLibraries[library];
    return <IconLib name={name as any} size={size} color={color} style={style} />;
}
