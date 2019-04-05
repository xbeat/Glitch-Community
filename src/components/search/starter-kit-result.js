import React from 'react'



const MaskImage = (props) => (
  <div className="zine-items">
    <div className="zine-item">
      <div className="mask-container">
        <img {...props} className="mask mask-4" />
      </div>
    </div>
  </div>
)

const StarterKitResult = ({ result }) => (
  <a href={result.url}>
    <MaskImage src={result.imageURL}/>
    <div>{result.name}</div>
  </a>
)

export Start