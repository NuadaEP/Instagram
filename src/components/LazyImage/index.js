import React from 'react';

import {Small, Original} from './styles';

function LazyImage({smallSource, source, aspectRatio}) {
  return (
    <Small
      source={smallSource}
      ratio={aspectRatio}
      resizeMode="contain"
      blurRadius={2}>
      <Original
        source={source}
        ratio={aspectRatio}
        resizeMode="contain"
        resizeMode="contain"
      />
    </Small>
  );
}

export default LazyImage;
