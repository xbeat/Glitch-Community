// 💭 based on frontend/utils/assets in the editor

import S3Uploader from './s3-uploader';

import quantize from 'quantize';

export const COVER_SIZES = {
  large: 1000,
  medium: 700,
  small: 450,
};
export const AVATAR_SIZES = {
  large: 300,
  medium: 150,
  small: 60,
};

export const blobToImage = file =>
  new Promise(function(resolve, reject) {
    const image = new Image;
    image.onload = () => resolve(image);
    image.onerror = reject;
    return image.src = URL.createObjectURL(file);
  })
;

// Reduces the width/height and draws a new image until it reaches
// the final size. It loops by waiting for the onload to fire on the updated
// image and exits as soon as the new width/height are less than or equal to the
// final size.
const drawCanvasThumbnail = function(image, type, max) {
  let {width, height} = image;
  const quality = 0.92;
  let sourceCanvas = document.createElement('canvas');
  sourceCanvas.width = width;
  sourceCanvas.height = height;
  const sourceContext = sourceCanvas.getContext('2d');
  sourceContext.drawImage(image, 0, 0, width, height);
  while ((width > max) && (height > max)) {
    width *= 0.75;
    height *= 0.75;
    const targetCanvas = document.createElement('canvas');
    const targetContext = targetCanvas.getContext('2d');
    targetCanvas.width = width;
    targetCanvas.height = height;
    targetContext.drawImage(sourceCanvas, 0, 0, width, height);
    sourceCanvas = targetCanvas;
  }

  return new Promise(
    function(resolve) {
      return sourceCanvas.toBlob(function(blob) {
        blob.width = width;
        blob.height = height;
        return resolve(blob);
      }, type, quality);
    }
  );
};

// Takes an HTML5 File and returns a promise for an HTML5 Blob that is fulfilled
// with a thumbnail for the image. If the image is small enough the original
// blob is returned. Width and height metadata are added to the blob.
export function resizeImage(file, max) {
  return blobToImage(file)
    .then(function(image) {
      file.width = image.width;
      file.height = image.height;
      if ((image.width < max) && (image.height < max)) {
        return file;
      } 
      return drawCanvasThumbnail(image, file.type, max);
    });
}

export function getDominantColor(image) {
  const {width, height} = image;
  const PIXELS_FROM_EDGE = 11;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0, width, height);
  let colors = [];
  const outlyingColors = [];
  const outlyingColorsList = JSON.stringify([
    [255,255,255],
    [0,0,0],
  ]);
  /*
  Iterate through edge pixels and get the average color, then conditionally
  handle edge colors and transparent images
  */
  for (let x = -PIXELS_FROM_EDGE; x < PIXELS_FROM_EDGE; x++) {
    for (let y = -PIXELS_FROM_EDGE; y < PIXELS_FROM_EDGE; y++) {
      const boundedX = (x + width) % width;
      const boundedY = (y + height) % height;
      const pixelData = context.getImageData(boundedX, boundedY, 1, 1).data;
      const color = [
        pixelData[0], // r
        pixelData[1], // g
        pixelData[2], // b
      ];
      if (pixelData[3] < 255) { // alpha pixels
        continue;
      }
      if (outlyingColorsList.includes(JSON.stringify(color))) {
        outlyingColors.push(color);
      } else {
        colors.push(color);
      }
    }
  }
  if (colors.length === 0 && outlyingColors.length === 0) {
    // every pixel we checked was transparent
    return '';
  }
  if (outlyingColors.length > colors.length) {
    colors = outlyingColors;
  }
  const colorMap = quantize(colors, 5);
  const [r, g, b] = Array.from(colorMap.palette()[0]);
  return `rgb(${r},${g},${b})`;
}


export function requestFile(callback) {
  const input = document.createElement("input");
  input.type = 'file';
  input.accept = "image/*";
  input.onchange = function(event) {
    const file = event.target.files[0];
    console.log('☔️☔️☔️ input onchange', file);
    callback(file);
  };
  input.click();
  console.log('input created: ', input);
}

export function getUserCoverImagePolicy(api, id) {
  return api.get(`users/${id}/cover/policy`);
}

export function getTeamAvatarImagePolicy(api, id) {
  return api.get(`teams/${id}/avatar/policy`);
}

export function getTeamCoverImagePolicy(api, id) {
  return api.get(`teams/${id}/cover/policy`);
}

export function uploadAsset(blob, policy, key) {
  return S3Uploader(policy).upload({ key, blob });
}

export function uploadAssetSizes(blob, policy, sizes, progressHandler) {
  const upload = uploadAsset(blob, policy, 'original');
  upload.progress(progressHandler);
  
  const scaledUploads = Object.keys(sizes).map(tag => {
    return resizeImage(blob, sizes[tag]).then(resized => uploadAsset(resized, policy, tag));
  });

  return Promise.all([upload, ...scaledUploads]);
}
