// 💭 based on frontend/utils/assets in the editor

import S3Uploader from './s3-uploader';

import quantize from 'quantize';
import Observable from 'o_0';
const COVER_SIZES = {
  large: 1000,
  medium: 700,
  small: 450,
};
const AVATAR_SIZES = {
  large: 300,
  medium: 150,
  small: 60,
};

const blobToImage = file =>
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

  return new Promise(function(resolve) {
    return sourceCanvas.toBlob(function(blob) {
      blob.width = width;
      blob.height = height;
      return resolve(blob);
    }
      , type, quality);
  });
};

// Takes an HTML5 File and returns a promise for an HTML5 Blob that is fulfilled
// with a thumbnail for the image. If the image is small enough the original
// blob is returned. Width and height metadata are added to the blob.
const resizeImage = function(file, size) {
  const max = COVER_SIZES[size] || 1000;
  return blobToImage(file)
    .then(function(image) {
      file.width = image.width;
      file.height = image.height;
      if ((image.width < max) && (image.height < max)) {
        return file;
      } 
      return drawCanvasThumbnail(image, file.type, max);
    
    });
};

const getDominantColor = function(image) {
  const {width, height} = image;
  const PIXELS_FROM_EDGE = 11;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0, width, height);
  let transparentPixels = false;
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
  for (let x = 0; x < PIXELS_FROM_EDGE; x++) {
    for (let y = 0; y < PIXELS_FROM_EDGE; y++) {
      const pixelData = context.getImageData(x, y, 1, 1).data;
      const color = [
        pixelData[0], // r
        pixelData[1], // g
        pixelData[2], // b
      ];
      const colorRegExObject = new RegExp(`(${color})`, 'g');
      if (pixelData[3] < 255) { // alpha pixels
        transparentPixels = true;
        break;
      }
      if (outlyingColorsList.match(colorRegExObject)) {
        outlyingColors.push(color);
      } else {
        colors.push(color);
      }
    }
  }
  if (outlyingColors.length > colors.length) {
    colors = outlyingColors;
  }
  if (transparentPixels) {
    return null;
  } 
  const colorMap = quantize(colors, 5);
  const [r, g, b] = Array.from(colorMap.palette()[0]);
  return `rgb(${r},${g},${b})`;
  
};


export default function(application) {

  let self;
  return self = { 

    getImagePolicy(assetType) {
      if (assetType === 'avatar') {
        if (application.pageIsTeamPage()) {
          return self.getTeamAvatarImagePolicy();
        }
      }
      return self.getCoverImagePolicy();
    },

    getCoverImagePolicy() {
      if (application.pageIsTeamPage()) {
        return self.getTeamCoverImagePolicy();
      } 
      return self.getUserCoverImagePolicy();
      
    },

    getTeamCoverImagePolicy() {
      const policyPath = `teams/${application.team().id()}/cover/policy`;
      return application.api().get(policyPath)
        .then(response => response).catch(function(error) {
          application.notifyUploadFailure(true);
          return console.error('getTeamCoverImagePolicy', error);
        });
    },
    
    getTeamAvatarImagePolicy() {
      const policyPath = `teams/${application.team().id()}/avatar/policy`;
      return application.api().get(policyPath)
        .then(response => response).catch(function(error) {
          application.notifyUploadFailure(true);
          return console.error('getTeamAvatarImagePolicy', error);
        });
    },
    
    // We also use this cover bucket as a temp location for user avatars.
    getUserCoverImagePolicy() {
      const policyPath = `users/${application.user().id()}/cover/policy`;
      return application.api().get(policyPath)
        .then(response => response).catch(function(error) {
          application.notifyUploadFailure(true);
          return console.error('getUserCoverImagePolicy', error);
        });
    },
        
    generateUploadProgressEventHandler(uploadData) {
      return function({lengthComputable, loaded, total}) {
        if (lengthComputable) {
          return uploadData.ratio(loaded / total);
        } 
        // Fake progress with each event: 0, 0.5, 0.75, 0.875, ...
        return uploadData.ratio((1 + uploadData.ratio()) / 2);
        
      };
    },

    // Returns a promise that will be fulfilled with the url of the uploaded
    // asset or rejected with an error.
    uploadAsset(file, key, assetType) {
      key = key || 'original';
      const uploadData = {ratio: Observable(0)};
      application.pendingUploads.push(uploadData);
      return self.getImagePolicy(assetType)
        .then(function({data}) {
          const policy = data;
          console.log('got the policy', policy);
          console.log('uploading', file);
          return S3Uploader(policy).upload({
            key,
            blob: file}).progress(
            self.generateUploadProgressEventHandler(uploadData));
        }).finally(
          () => application.pendingUploads.remove(uploadData)
        ).catch(function(error) {
          application.notifyUploadFailure(true);
          return console.error("uploadAsset", error);
        });
    },

    uploadResized(file, size, assetType) {
      console.log('uploadResized', size);
      return resizeImage(file, size)
        .then(function(blob) {
          console.log('uploadCoverSize blob', blob);
          return self.uploadAsset(blob, size, assetType);}).catch(function(error) {
          application.notifyUploadFailure(true);
          return console.error('uploadResized', error);
        });
    },

    updateHasCoverImage(hasCover=true) {
      const HAS_COVER_IMAGE = 
        {'hasCoverImage': hasCover};
      if (application.pageIsTeamPage()) {
        application.team().updateTeam(application, HAS_COVER_IMAGE);
        application.team().hasCoverImage(hasCover);
        !hasCover && application.team().localCoverImage(null);
        return;
      } 
      application.user().hasCoverImage(hasCover);
      application.user().updateUser(application, HAS_COVER_IMAGE);
      !hasCover && application.user().localCoverImage(null);
    },

    updateHasAvatarImage(hasAvatar=true) {
      const HAS_AVATAR_IMAGE = 
        {'hasAvatarImage': hasAvatar};
      if (application.pageIsTeamPage()) {
        application.team().updateTeam(application, HAS_AVATAR_IMAGE); 
        application.team().hasAvatarImage(hasAvatar);
        !hasAvatar && application.team().localAvatarImage(null);
        return;
      } 
      console.error("hasAvatarImage does not exist in the user model.");
    },

    addCoverFile(file) {
      self.uploadAsset(file)    
        .then(() => self.updateHasCoverImage());
      for (let size in COVER_SIZES) {
        self.uploadResized(file, size);
      }      
      return blobToImage(file)
        .then(function(image) {
          const dominantColor = getDominantColor(image);
          const entity = application.pageIsTeamPage() ? application.team() : application.user();
          entity.localCoverImage(image.src);
          entity.hasCoverImage(true);
          entity.updateCoverColor(application, dominantColor);
        }).catch(function(error) {
          application.notifyUploadFailure(true);
          return console.error('addCoverFile', error);
        });
    },

    addAvatarFile(file) {
      self.uploadAsset(file, 'original', 'avatar')
        .then(() => self.updateHasAvatarImage());
      for (let size in AVATAR_SIZES) {
        self.uploadResized(file, size, 'avatar');
      }
      return blobToImage(file)
        .then(function(image) {
          const dominantColor = getDominantColor(image);
          const entity = application.pageIsTeamPage() ? application.team() : application.user();
          entity.localAvatarImage(image.src);
          entity.updateAvatarColor(application, dominantColor);
        }).catch(function(error) {
          application.notifyUploadFailure(true);
          return console.error('addAvatarFile', error);
        });
    },
  
    uploadAvatarFile() {
      return self.uploader(self.addAvatarFile);
    },
    
    uploadCoverFile() {
      return self.uploader(self.addCoverFile);
    },
    
    uploader(uploadReceiver) {
      const input = document.createElement("input");
      input.type = 'file';
      input.accept = "image/*";
      input.onchange = function(event) {
        const file = event.target.files[0];
        console.log('☔️☔️☔️ input onchange', file);
        uploadReceiver(file);
      };
      input.click();
      console.log('input created: ', input);
      return false;
    },
  };
}
