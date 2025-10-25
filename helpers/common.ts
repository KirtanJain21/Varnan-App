import { Dimensions } from 'react-native';

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

/**
 * Width percentage helper
 * @param percentage A number between 0 and 100
 * @returns Calculated width in pixels
 */
export const wp = (percentage: number): number => {
  return (deviceWidth * percentage) / 100;
};

/**
 * Height percentage helper
 * @param percentage A number between 0 and 100
 * @returns Calculated height in pixels
 */
export const hp = (percentage: number): number => {
  return (deviceHeight * percentage) / 100;
};
