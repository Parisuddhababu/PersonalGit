import {
  WINDOW,
} from './constants';

/**
 * Check if the given value is a positive number.
 * @param {*} value - The value to check.
 * @returns {boolean} Returns `true` if the given value is a positive number, else `false`.
 */
export const isPositiveNumber = (value) => value > 0 && value < Infinity;

const { slice } = Array.prototype;

/**
 * Convert array-like or iterable object to an array.
 * @param {*} value - The value to convert.
 * @returns {Array} Returns a new array.
 */
export function toArray(value) {
  return Array.from ? Array.from(value) : slice.call(value);
}

const REGEXP_IMAGE_TYPE = /^image\/.+$/;

/**
 * Check if the given value is a mime type of image.
 * @param {*} value - The value to check.
 * @returns {boolean} Returns `true` if the given is a mime type of image, else `false`.
 */
export function isImageType(value) {
  return REGEXP_IMAGE_TYPE.test(value);
}

/**
 * Convert image type to extension.
 * @param {string} value - The image type to convert.
 * @returns {boolean} Returns the image extension.
 */
export function imageTypeToExtension(value) {
  let extension = isImageType(value) ? value.slice(6) : '';

  if (extension === 'jpeg') {
    extension = 'jpg';
  }

  return `.${extension}`;
}

const { fromCharCode } = String;

/**
 * Get string from char code in data view.
 * @param {DataView} dataView - The data view for read.
 * @param {number} start - The start index.
 * @param {number} length - The read length.
 * @returns {string} The read result.
 */
export function getStringFromCharCode(dataView, start, length) {
  let str = '';
  let i;

  length += start;

  for (i = start; i < length; i += 1) {
    str += fromCharCode(dataView.getUint8(i));
  }

  return str;
}

const { btoa } = WINDOW;

/**
 * Transform array buffer to Data URL.
 * @param {ArrayBuffer} arrayBuffer - The array buffer to transform.
 * @param {string} mimeType - The mime type of the Data URL.
 * @returns {string} The result Data URL.
 */
export function arrayBufferToDataURL(arrayBuffer, mimeType) {
  const chunks = [];
  const chunkSize = 8192;
  let uint8 = new Uint8Array(arrayBuffer);

  while (uint8.length > 0) {
    // XXX: Babel's `toConsumableArray` helper will throw error in IE or Safari 9
    // eslint-disable-next-line prefer-spread
    chunks.push(fromCharCode.apply(null, toArray(uint8.subarray(0, chunkSize))));
    uint8 = uint8.subarray(chunkSize);
  }

  return `data:${mimeType};base64,${btoa(chunks.join(''))}`;
}

/**
 * Get orientation value from given array buffer.
 * @param {ArrayBuffer} arrayBuffer - The array buffer to read.
 * @returns {number} The read orientation value.
 */
export function resetAndGetOrientation(arrayBuffer) { //NOSONAR
  const dataView = new DataView(arrayBuffer);
  let orientation;

  // Ignores range error when the image does not have correct Exif information
  try {
    let littleEndian;
    let app1Start;
    let ifdStart;

    // Only handle JPEG image (start by 0xFFD8)
    if (dataView.getUint8(0) === 0xFF && dataView.getUint8(1) === 0xD8) {
      const length = dataView.byteLength;
      let offset = 2;

      while (offset + 1 < length) {
        if (dataView.getUint8(offset) === 0xFF && dataView.getUint8(offset + 1) === 0xE1) {
          app1Start = offset;
          break;
        }

        offset += 1;
      }
    }

    if (app1Start) {
      const exifIDCode = app1Start + 4;
      const tiffOffset = app1Start + 10;

      if (getStringFromCharCode(dataView, exifIDCode, 4) === 'Exif') {
        const endianness = dataView.getUint16(tiffOffset);

        littleEndian = endianness === 0x4949;

        if (littleEndian || endianness === 0x4D4D /* bigEndian */) {
          if (dataView.getUint16(tiffOffset + 2, littleEndian) === 0x002A) {
            const firstIFDOffset = dataView.getUint32(tiffOffset + 4, littleEndian);

            if (firstIFDOffset >= 0x00000008) {
              ifdStart = tiffOffset + firstIFDOffset;
            }
          }
        }
      }
    }

    if (ifdStart) {
      const length = dataView.getUint16(ifdStart, littleEndian);
      let offset;
      let i;

      for (i = 0; i < length; i += 1) {
        offset = ifdStart + (i * 12) + 2;

        if (dataView.getUint16(offset, littleEndian) === 0x0112 /* Orientation */) {
          // 8 is the offset of the current tag's value
          offset += 8;

          // Get the original orientation value
          orientation = dataView.getUint16(offset, littleEndian);

          // Override the orientation with its default value
          dataView.setUint16(offset, 1, littleEndian);
          break;
        }
      }
    }
  } catch (e) {
    orientation = 1;
  }

  return orientation;
}

/**
 * Parse Exif Orientation value.
 * @param {number} orientation - The orientation to parse.
 * @returns {Object} The parsed result.
 */
export function parseOrientation(orientation) {
  let rotate = 0;
  let scaleX = 1;
  let scaleY = 1;

  switch (orientation) {
    // Flip horizontal
    case 2:
      scaleX = -1;
      break;

    // Rotate left 180°
    case 3:
      rotate = -180;
      break;

    // Flip vertical
    case 4:
      scaleY = -1;
      break;

    // Flip vertical and rotate right 90°
    case 5:
      rotate = 90;
      scaleY = -1;
      break;

    // Rotate right 90°
    case 6:
      rotate = 90;
      break;

    // Flip horizontal and rotate right 90°
    case 7:
      rotate = 90;
      scaleX = -1;
      break;

    // Rotate left 90°
    case 8:
      rotate = -90;
      break;

    default:
  }

  return {
    rotate,
    scaleX,
    scaleY,
  };
}

const REGEXP_DECIMALS = new RegExp("/\.\d*(?:0|9){12}\d*$/"); // NOSONAR

/**
 * Normalize decimal number.
 * Check out {@link https://0.30000000000000004.com/}
 * @param {number} value - The value to normalize.
 * @param {number} [times=100000000000] - The times for normalizing.
 * @returns {number} Returns the normalized number.
 */
export function normalizeDecimalNumber(value, times = 100000000000) {
  return REGEXP_DECIMALS.test(value) ? (Math.round(value * times) / times) : value;
}

/**
 * Get the max sizes in a rectangle under the given aspect ratio.
 * @param {Object} data - The original sizes.
 * @param {string} [type='contain'] - The adjust type.
 * @returns {Object} The result sizes.
 */
export function getAdjustedSizes(
  {
    aspectRatio,
    height,
    width,
  },

  // 'none' | 'contain' | 'cover'
  type = 'none',
) {
  const isValidWidth = isPositiveNumber(width);
  const isValidHeight = isPositiveNumber(height);

  if (isValidWidth && isValidHeight) {
    const adjustedWidth = height * aspectRatio;

    if (((type === 'contain' || type === 'none') && adjustedWidth > width) || (type === 'cover' && adjustedWidth < width)) {
      height = width / aspectRatio;
    } else {
      width = height * aspectRatio;
    }
  } else if (isValidWidth) {
    height = width / aspectRatio;
  } else if (isValidHeight) {
    width = height * aspectRatio;
  }

  return {
    width,
    height,
  };
}
