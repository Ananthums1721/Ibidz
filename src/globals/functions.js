import {
  Dimensions,
  PixelRatio,
  Platform
} from 'react-native';
import CONFIG from './config';

export const getImage = (imageUrl) => {
  return CONFIG.image_base_url + imageUrl;
};
// To Find Display wise font pixel size

export const getFontontSize = (size) => {
  const {
    width : SCREEN_WIDTH,
    height : SCREEN_HEIGHT
  } = Dimensions.get('window');
  const scale = SCREEN_WIDTH / 375;
  const newSize = size * scale ;
  if( Platform.OS === 'ios'){
    return Math.round(PixelRatio.roundToNearestPixel(newSize))
  } else{
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
  }
};