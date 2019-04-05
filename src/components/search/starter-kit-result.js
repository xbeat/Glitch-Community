import React from 'react';
import Heading from 'Components/text/heading';
import Text from 'Components/text/text';
import styles from './starter-kit-result.styl';

const MaskImage = (props) => <img {...props} className={styles.maskImage} alt="" />;

const StarterKitResult = ({ result }) => (
  <a href={result.url} className={styles.container}>
    <div className={styles.imageWrap}>
      <MaskImage src={result.imageURL} />
    </div>
    <div className={styles.contentWrap} style={{ backgroundColor: result.coverColor }}>
      <Heading tagName="h3">{result.name}</Heading>
      <Text>{result.description}</Text>
    </div>
  </a>
);

export default StarterKitResult;
