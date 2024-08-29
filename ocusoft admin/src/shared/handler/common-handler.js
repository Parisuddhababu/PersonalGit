import moment from "moment";
import * as Regex from "../regex/regex";

export const DISPLAY_DATE_FORMAT = 'DD/MM/YYYY';
export const DISPLAY_DATE_FORMAT_FULL = 'DD/MM/YYYY hh:mm A';
export const PICKER_DISPLAY_DATE_FORMAT = 'dd/mm/yy';
export const DISPLAY_TIME_FORMAT = 'hh:mm A';

export const isEmpty = (val) => {
  return val === '' || val === undefined || val === null
}

export const isEmptyArr = (val) => {
  return val === undefined || val === null || val.length === 0
}

export const displayDateTimeFormat = (val) => {
  if (val) {
    return moment(val).format(DISPLAY_DATE_FORMAT_FULL)
  }
  return '-';
}

export const displayDateFormat = (val) => {
  if (val) {
    return moment(val).format(DISPLAY_DATE_FORMAT)
  }
  return '-';
}

export const displayTimeFormat = (val) => {
  if (val) {
    return moment(val).format(DISPLAY_TIME_FORMAT)
  }
  return '-';
}

export const requestDateFormatDD = (val) => {
  if (val) {
    return moment(val).format('DD-MM-YYYY')
  }
  return '';
}

export const requestDateFormatYY = (val) => {
  if (val) {
    return moment(val).format('YYYY-MM-DD')
  }
  return '';
}

export const customDateFormat = (date) => {
  const frmdt = date.split('-');
  if (frmdt?.length) {
    const dd = frmdt[0];
    const mm = frmdt[1];
    const yyyy = frmdt[2];
    return `${dd}/${mm}/${yyyy}`;
  }
  return '-';
}

export const isTextValid = (val) => {
  return (!Regex.BLANK_SPACE.test(val) && !Regex.SPECIAL_CHARCATER.test(val))
}

export const isTextValidForBlank = (val) => {
  return (!Regex.BLANK_SPACE.test(val))
}

export const emailLowerCase = (email) => {
  return email ? email.toLowerCase() : '';
}


export const TextTruncate = (str, limit) => {
  return str?.length > limit ? `${str.substr(0, limit)}...` : str;
};

export const uuid = () => {
  let d = new Date().getTime(), d2 = (Date.now() && Date.now() * 1000) || 0;
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    let array = new Uint8Array(1);
    crypto.getRandomValues(array);
    let r = array[0];

    if (d > 0) {
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c == "x" ? r : (r & 0x7) | 0x8).toString(16);
  });
};

export const downloadFile = (fileUrl, fileName) => {
  fetch(fileUrl)
    .then(async t => {
      return t.blob().then(b => {
        let a = document.createElement('a');
        a.href = URL.createObjectURL(b);
        a.setAttribute("download", fileName);
        a.click();
        a.remove();
      });
    })
    .catch(err => {
      console.log(err);
      showError("Unable to download the file");
    });
}

export const orderStatusDirectory = [
  "Not Available",
  "Pending",
  "In Process",
  "Shipped",
  "Delivered",
  "Cancelled",
  'Requested Cancel'
];

export const paymentStatusDirectory = ["Pending", "Paid"];

export const prescriptionStatusDirectory = ["OTC", "RX","TRAIL"];

export const camelCaseToLabel = str => {
  if (!str.length) return '';

  const camelCaseRegex = new RegExp("([a-z])([A-Z])", 'g'); // NOSONAR
  const matches = str.match(camelCaseRegex);

  matches?.forEach(match => {
    str = str.replace(match, `${match[0]} ${match[1]}`);
  });

  str = str.replace(str[0], str[0].toUpperCase());
  return str;
}