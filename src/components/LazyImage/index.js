import React, {useState, useEffect} from 'react';

import {Small, Original} from './styles';

function LazyImage({smallSource, source, aspectRatio}) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 1000);
  }, []);

  function handleAnimate() {}

  return (
    <Small
      source={smallSource}
      ratio={aspectRatio}
      resizeMode="contain"
      blurRadius={2}>
      {loaded && (
        <Original
          source={source}
          ratio={aspectRatio}
          resizeMode="contain"
          onLoadEnd={handleAnimate}
        />
      )}
    </Small>
  );
}

export default LazyImage;