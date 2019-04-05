import React from 'react';
import Heading from 'Components/text/heading'
import Text from 'Components/text/text';
import styles from './starter-kit-result.styl'

const MaskImage = (props) => (
  <div className="zine-items">
    <div className="zine-item">
      <div className="mask-container">
        <img {...props} className="mask mask-4" />
      </div>
    </div>
  </div>
);

const StarterKitResult = ({ result }) => (
  <a href={result.url} className={styles.container}>
    <MaskImage src={result.imageURL} />
    <div className={styles.contentWrap}>
      <Heading tagName="h3">{result.name}</Heading>
    <Text>{result.description}</Text>
    </div>
    
  </a>
);

export default StarterKitResult;
