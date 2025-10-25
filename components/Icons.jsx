import {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome,
  FontAwesome5,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
  SimpleLineIcons,
} from '@expo/vector-icons';
import React from 'react';

// Map of available icon sets
const iconMap = {
  Feather,
  AntDesign,
  FontAwesome,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
  Entypo,
  SimpleLineIcons,
  Octicons,
  EvilIcons,
  Foundation,
};

// Default fallback icon
const DEFAULT_ICON_TYPE = 'MaterialIcons';
const DEFAULT_ICON_NAME = 'help-outline';

const Icon = ({
  type,
  name,
  size = 24,
  color = 'black',
  solid = false, 
  style,
}) => {
  let IconComponent = iconMap[type];

  // Fallback if type is invalid
  if (!IconComponent) {
    console.warn(`⚠️ Icon type "${type}" not found, using default.`);
    IconComponent = iconMap[DEFAULT_ICON_TYPE];
  }

  // Fallback if name is missing or invalid
  const iconName = name || DEFAULT_ICON_NAME;
  if (!name) {
    console.warn(`⚠️ Icon name is missing, using default "${DEFAULT_ICON_NAME}".`);
  }

  // Handle FontAwesome5 solid prop
  if (type === 'FontAwesome5' && IconComponent === FontAwesome5) {
    return <IconComponent name={iconName} size={size} color={color} solid={solid} style={style} />;
  }

  return <IconComponent name={iconName} size={size} color={color} style={style} />;
};

export default Icon;
