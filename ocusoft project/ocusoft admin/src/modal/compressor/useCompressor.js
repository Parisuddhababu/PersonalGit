import {
  WINDOW,
} from './constants';
import {
  arrayBufferToDataURL,
  getAdjustedSizes,
  imageTypeToExtension,
  isImageType,
  isPositiveNumber,
  normalizeDecimalNumber,
  parseOrientation,
  resetAndGetOrientation,
} from './utilities';
import { useState } from 'react';

const { ArrayBuffer, FileReader } = WINDOW;
const URL = WINDOW.URL || WINDOW.webkitURL;
const REGEXP_EXTENSION = /\.\w+$/;


export const useCompressor = () => { // NOSONAR
  const [newImage] = useState(new Image());
  const [result, setResult] = useState(null);


  const init = (fileUpdated, optionsUpdated) => { // NOSONAR
    const file = fileUpdated;
    const options = optionsUpdated;
    if (typeof (file) !== 'object') {
      fail(new Error('The first argument must be a File or Blob object.'), optionsUpdated);
      return;
    }

    const mimeType = file.type;
    if (!isImageType(mimeType)) {
      fail(new Error('The first argument must be an image File or Blob object.'), optionsUpdated);
      return;
    }

    if (!URL || !FileReader) {
      fail(new Error('The current browser does not support image compression.'), optionsUpdated);
      return;
    }

    if (!ArrayBuffer) {
      options.checkOrientation = false;
    }

    if (URL && !options.checkOrientation) {
      load({
        url: URL.createObjectURL(file),
      }, fileUpdated, optionsUpdated);
    } else {
      const reader = new FileReader();
      alert(mimeType)
      const checkOrientation = options.checkOrientation && (mimeType === 'image/jpeg' || mimeType === 'image/png');

      reader.onload = ({ target }) => {
        const { result } = target;
        const data = {};

        if (checkOrientation) {
          // Reset the orientation value to its default value 1
          // as some iOS browsers will render image with its orientation
          const orientation = resetAndGetOrientation(result);

          if (orientation > 1 || !URL) {
            // Generate a new URL which has the default orientation value
            data.url = arrayBufferToDataURL(result, mimeType);

            if (orientation > 1) {
              Object.assign(data, parseOrientation(orientation));
            }
          } else {
            data.url = URL.createObjectURL(file);
          }
        } else {
          data.url = result;
        }

        load(data, fileUpdated, optionsUpdated);
      };
      reader.onabort = () => {
        fail(new Error('Aborted to read the image with FileReader.'), optionsUpdated);
      };
      reader.onerror = () => {
        fail(new Error('Failed to read the image with FileReader.'), optionsUpdated);
      };
      reader.onloadend = () => {
        console.log("load ended");
      };

      if (checkOrientation) {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsDataURL(file);
      }
    }
  }

  const load = (data, fileUpdated, optionsUpdated) => {
    const file = fileUpdated;
    const image = newImage;
    image.onload = e => {
      draw(
        { ...data, naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight },
        fileUpdated,
        optionsUpdated.options,
        e
      );
    };
    image.onabort = () => {
      fail(new Error('Aborted to load the image.'), optionsUpdated.options);
    };
    image.onerror = () => {
      fail(new Error('Failed to load the image.'), optionsUpdated.options);
    };

    // Match all browsers that use WebKit as the layout engine in iOS devices,
    // such as Safari for iOS, Chrome for iOS, and in-app browsers.
    if (WINDOW.navigator && /(?:iPad|iPhone|iPod).*?AppleWebKit/i.test(WINDOW.navigator.userAgent)) {
      // Fix the `The operation is insecure` error (#57)
      image.crossOrigin = 'anonymous';
    }

    image.alt = file.name;
    image.src = data.url;
  }

  const draw = ({
    naturalWidth,
    naturalHeight,
    rotate = 0,
    scaleX = 1,
    scaleY = 1,
  }, fileUpdated, optionsUpdated, e) => { // NOSONAR
    const file = fileUpdated;
    const image = newImage;
    const options = optionsUpdated;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const is90DegreesRotated = Math.abs(rotate) % 180 === 90;
    const resizable = (options.resize === 'contain' || options.resize === 'cover') && isPositiveNumber(options.width) && isPositiveNumber(options.height);
    let maxWidth = Math.max(options.maxWidth, 0) || Infinity;
    let maxHeight = Math.max(options.maxHeight, 0) || Infinity;
    let minWidth = Math.max(options.minWidth, 0) || 0;
    let minHeight = Math.max(options.minHeight, 0) || 0;
    let aspectRatio = naturalWidth / naturalHeight;
    let { width, height } = options;

    if (is90DegreesRotated) {
      [maxWidth, maxHeight] = [maxHeight, maxWidth];
      [minWidth, minHeight] = [minHeight, minWidth];
      [width, height] = [height, width];
    }

    if (resizable) {
      aspectRatio = width / height;
    }

    ({ width: maxWidth, height: maxHeight } = getAdjustedSizes({
      aspectRatio,
      width: maxWidth,
      height: maxHeight,
    }, 'contain'));
    ({ width: minWidth, height: minHeight } = getAdjustedSizes({
      aspectRatio,
      width: minWidth,
      height: minHeight,
    }, 'cover'));

    if (resizable) {
      ({ width, height } = getAdjustedSizes({
        aspectRatio,
        width,
        height,
      }, options.resize));
    } else {
      ({ width = naturalWidth, height = naturalHeight } = getAdjustedSizes({
        aspectRatio,
        width,
        height,
      }));
    }

    width = Math.floor(normalizeDecimalNumber(Math.min(Math.max(width, minWidth), maxWidth)));
    height = Math.floor(normalizeDecimalNumber(Math.min(Math.max(height, minHeight), maxHeight)));

    const destX = -width / 2;
    const destY = -height / 2;
    const destWidth = width;
    const destHeight = height;
    const params = [];

    if (resizable) {
      let srcX = 0, srcY = 0;

      let { width: srcWidth, height: srcHeight } = getAdjustedSizes({
        aspectRatio,
        width: naturalWidth,
        height: naturalHeight,
      }, {
        contain: 'cover',
        cover: 'contain',
      }[options.resize]);
      srcX = (naturalWidth - srcWidth) / 2;
      srcY = (naturalHeight - srcHeight) / 2;

      params.push(srcX, srcY, srcWidth, srcHeight);
    }

    params.push(destX, destY, destWidth, destHeight);

    if (is90DegreesRotated) {
      [width, height] = [height, width];
    }

    canvas.width = width;
    canvas.height = height;

    if (!isImageType(options.mimeType)) {
      options.mimeType = file.type;
    }

    let fillStyle = 'transparent';

    // Converts PNG files over the `convertSize` to JPEGs.
    if (file.size > options.convertSize && options.convertTypes.indexOf(options.mimeType) >= 0) {
      options.mimeType = file.type || 'image/jpeg';
    }

    // Override the default fill color (#000, black)
    context.fillStyle = fillStyle;
    context.fillRect(0, 0, width, height);

    if (options.beforeDraw) {
      options.beforeDraw.call(e, context, canvas);
    }

    context.save();
    context.translate(width / 2, height / 2);
    context.rotate((rotate * Math.PI) / 180);
    context.scale(scaleX, scaleY);
    context.drawImage(image, ...params);
    context.restore();

    if (options.drew) {
      options.drew(context, canvas);
    }

    const newDone = (result) => {
      done({
        naturalWidth,
        naturalHeight,
        result,
      }, fileUpdated, options);
    };

    if (canvas.toBlob) {
      canvas.toBlob(newDone, options.mimeType, options.quality);
    }
  }

  const done = ({
    naturalWidth,
    naturalHeight,
    result
  },
    fileUpdated,
    optionsUpdated) => {
    const file = fileUpdated;
    const image = newImage;
    const options = optionsUpdated;
    if (URL && !options.checkOrientation) {
      URL.revokeObjectURL(image.src);
    }

    if (result) {
      // Returns original file if the result is greater than it and without size related options
      if (options.strict && result.size > file.size && options.mimeType === file.type && !(
        options.width > naturalWidth
        || options.height > naturalHeight
        || options.minWidth > naturalWidth
        || options.minHeight > naturalHeight
        || options.maxWidth < naturalWidth
        || options.maxHeight < naturalHeight
      )) {
        setResult(file);
      } else {
        const date = new Date();

        result.lastModified = date.getTime();
        result.lastModifiedDate = date;
        result.name = file.name;

        // Convert the extension to match its type
        if (result.name && result.type !== file.type) {
          result.name = result.name.replace(
            REGEXP_EXTENSION,
            imageTypeToExtension(result.type),
          );
        }
      }
    } else {
      // Returns original file if the result is null in some cases.
      result = file;
      setResult(result);
    }
    setResult(result);

    if (options.success) {
      options.success(result);
    }
  }

  const fail = (err, optionsNew) => {
    const options = optionsNew;
    if (options.error) {
      options.error(err);
    } else {
      throw err;
    }
  }

  return [result, init];
}

export default useCompressor;