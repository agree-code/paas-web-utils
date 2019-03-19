import View from "./view";
import InsertView from "./insert-view";
import EditView from "./edit-view";
import DetailView from "./detail-view";
import ListView from "./list-view";
import organization from "./organization";

//将时间转换成字符串格式
export const formatDate = function(date, format) {
  if (typeof date === "number") {
    date = new Date(date);
  } else if (typeof date === "string") {
    // date = Date.parse(date);
    if(isNaN(parseInt(date))){
      return date;
    }
    date = new Date(parseInt(date));
  } else if (!(date instanceof Date)) {
    return "";
  }
  let o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
    "q+": Math.floor((date.getMonth() + 3) / 3),
    "S+": date.getMilliseconds()
  };
  if (/(y+)/i.test(format)) {
    format = format.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  for (let k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
    }
  }
  return format;
};

export const CONDITION_TYPE = {
  EQ: {
    label: "等于",
    value: 3
  },
  GTE: {
    label: "大于等于",
    value: 4
  },
  GT: {
    label: "大于",
    value: 1
  },
  LTE: {
    label: "小于等于",
    value: 5
  },
  LT: {
    label: "小于",
    value: 2
  },
  LIKE: {
    label: "包含",
    value: 6
  },
  NEQ: {
    label: "不等于",
    value: 7
  },
  CUSTOM: {
    label: "自定义",
    value: 8,
    type: "Region"
  },
  BETWEEN: {
    label: "时间间隔",
    value: 9,
    type: "Select"
  }
};

export const COLUMN_ENUM = {
  TEXT_INPUT: {
    val: "input",
    text: "文本输入框",
    placeholder: function(label) {
      return `请输入${label}`;
    },
    full: false
  },
  TEXT_LONG_INPUT: {
    val: "input",
    text: "文本输入框",
    placeholder: function(label) {
      return `请输入${label}`;
    },
    full: true
  },
  TEXT_AREA: {
    val: "textArea",
    text: "文本域",
    placeholder: function(label) {
      return `请填写${label}`;
    },
    full: true
  },
  FILE: {
    val: "file",
    text: "文件",
    placeholder: function(label) {
      return `请上传${label}`;
    },
    format: function(val) {
      let showValue = [];
      if (Boolean(val)) {
        let value = JSON.parse(val) || [];
        for (const v of value) {
          showValue.push(v.msg);
        }
      }
      return showValue.join(",");
    },
    full: false
  },
  IMAGE: {
    val: "image",
    text: "图片",
    placeholder: function(label) {
      return `请上传${label}`;
    },
    format: function(val) {
      let showValue = [];
      if (Boolean(val)) {
        let value = JSON.parse(val);
        for (const v of value) {
          showValue.push(v.msg);
        }
      }
      return showValue.join(",");
    },
    full: false
  },
  RADIO: {
    val: "radio",
    text: "单选",
    placeholder: function(label) {
      return `请选择${label}`;
    },
    full: false
  },
  RADIO_GROUP: {
    val: "radioGroup",
    text: "单选组",
    placeholder: function(label) {
      return `请选择${label}`;
    },
    full: false
  },
  CHECKBOX: {
    val: "checkbox",
    text: "多选",
    placeholder: function(label) {
      return `请选择${label}`;
    },
    full: false
  },
  CHECKBOX_GROUP: {
    val: "checkboxGroup",
    text: "多选组",
    placeholder: function(label) {
      return `请选择${label}`;
    },
    full: false
  },
  MONTH_DAY: {
    val: "monthDay",
    text: "月日",
    placeholder: function(label) {
      return `请选择${label}`;
    },
    formatVal: "MM-dd",
    format: function(val) {
      return formatDate(val, "MM-dd");
    },
    full: false
  },
  MONTH: {
    val: "month",
    text: "月",
    placeholder: function(label) {
      return `请选择${label}`;
    },
    formatVal: "MM",
    format: function(val) {
      return formatDate(val, "MM");
    },
    full: false
  },
  YEAR: {
    val: "year",
    text: "年",
    placeholder: function(label) {
      return `请选择${label}`;
    },
    formatVal: "yyyy",
    format: function(val) {
      return formatDate(val, "yyyy");
    },
    full: false
  },
  YEAR_MONTH: {
    val: "year-month",
    text: "年月",
    placeholder: function(label) {
      return `请选择${label}`;
    },
    formatVal: "yyyy-MM",
    format: function(val) {
      return formatDate(val, "yyyy-MM");
    },
    full: false
  },
  TIME: {
    val: "time",
    text: "时间",
    placeholder: function(label) {
      return `请选择${label}`;
    },
    formatVal: "hh:mm",
    format: function(val) {
      return formatDate(val, "hh:mm");
    },
    full: false
  },
  DATE: {
    val: "date",
    text: "日期",
    placeholder: function(label) {
      return `请选择${label}`;
    },
    formatVal: "yyyy-MM-dd",
    format: function(val) {
      return formatDate(val, "yyyy-MM-dd");
    },
    full: false
  },
  DATETIME: {
    val: "datetime",
    text: "日期时间",
    placeholder: function(label) {
      return `请选择${label}`;
    },
    formatVal: "yyyy-MM-dd hh:mm",
    format: function(val) {
      return formatDate(val, "yyyy-MM-dd hh:mm");
    },
    full: false
  },
  COLOR: {
    val: "color",
    text: "颜色",
    placeholder: function(label) {
      return `请选择颜色`;
    },
    full: false
  },
  SELECT: {
    val: "select",
    text: "下拉框",
    placeholder: function(label) {
      return `请选择${label}`;
    },
    full: false
  },
  RELATED_SELECT: {
    val: "relatedInput",
    text: "依赖选择",
    placeholder: function(label) {
      return `请选择${label}`;
    },
    full: false
  },
  FOREIGNKEY: {
    val: "dataFkSelect",
    text: "外键选择",
    placeholder: function(label) {
      return `请选择${label}`;
    },
    full: false
  },
  DATA_SELECT: {
    val: "dataSelect",
    text: "数据选择",
    placeholder: function(label) {
      return `请选择${label}`;
    },
    full: false
  },
  USER_SELECT: {
    val: "userSelect",
    text: "用户选择",
    placeholder: function(label) {
      return `请选择${label}`;
    },
    full: false
  },
  DEPT_SELECT: {
    val: "deptSelect",
    text: "部门选择",
    placeholder: function(label) {
      return `请选择${label}`;
    },
    format: function (val) {
      let showVals = organization.loadSycnShowVal(val) || [];
      if (showVals.length > 0) {
        return showVals.join(" / ");
      }
      return val;
    },
    full: false
  }
};

export const VIEW_ENUM = {
  INSERT: {
    value: "INSERT",
    class: InsertView
  },
  EDIT: {
    value: "EDIT",
    class: EditView
  },
  DETAIL: {
    value: "DETAIL",
    class: DetailView
  },
  LIST: {
    value: "LIST",
    class: ListView
  },
  BATCH_UPDATE: {},
  CUSTOM: {
    value: "CUSTOM",
    class: View
  }
};

export const CONTENT_TYPE = {
  epub: "application/epub+zip",
  fif: "application/fractals",
  spl: "application/futuresplash",
  hta: "application/hta",
  hqx: "application/mac-binhex40",
  vsi: "application/ms-vsi",
  accdb: "application/msaccess",
  accda: "application/msaccess.addin",
  accdc: "application/msaccess.cab",
  accde: "application/msaccess.exec",
  accft: "application/msaccess.ftemplate",
  accdr: "application/msaccess.runtime",
  accdt: "application/msaccess.template",
  accdw: "application/msaccess.webapplication",
  one: "application/msonenote",
  doc: "application/msword",
  osdx: "application/opensearchdescription+xml",
  pdf: "application/pdf",
  p10: "pkcs10",
  p7c: "application/pkcs7-mime",
  p7s: "pkcs7-signature",
  cer: "x-x509-ca-cert",
  crl: "pkix-crl",
  ps: "application/postscript",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  xlam: "application/vnd.ms-excel.addin.macroEnabled.12",
  xlsb: "application/vnd.ms-excel.sheet.binary.macroEnabled.12",
  xlsm: "application/vnd.ms-excel.sheet.macroEnabled.12",
  xltm: "application/vnd.ms-excel.template.macroEnabled.12",
  thmx: "application/vnd.ms-officetheme",
  sst: "vnd.ms-pki.certstore",
  pko: "vnd.ms-pki.pko",
  cat: "vnd.ms-pki.seccat",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ppam: "application/vnd.ms-powerpoint.addin.macroEnabled.12",
  pptm: "application/vnd.ms-powerpoint.presentation.macroEnabled.12",
  sldm: "application/vnd.ms-powerpoint.slide.macroEnabled.12",
  ppsm: "application/vnd.ms-powerpoint.slideshow.macroEnabled.12",
  potm: "application/vnd.ms-powerpoint.template.macroEnabled.12",
  pub: "application/vnd.ms-publisher",
  vsd: "application/vnd.ms-visio.viewer",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  docm: "application/vnd.ms-word.document.macroEnabled.12",
  dotx: "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
  dotm: "application/vnd.ms-word.template.macroEnabled.12",
  wpl: "application/vnd.ms-wpl",
  xps: "application/vnd.ms-xpsdocument",
  odp: "application/vnd.oasis.opendocument.presentation",
  ods: "application/vnd.oasis.opendocument.spreadsheet",
  odt: "application/vnd.oasis.opendocument.text",
  sldx: "application/vnd.openxmlformats-officedocument.presentationml.slide",
  ppsx: "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
  potx: "application/vnd.openxmlformats-officedocument.presentationml.template",
  xltx: "application/vnd.openxmlformats-officedocument.spreadsheetml.template",
  "appcontent-ms": "application/windows-appcontent+xml",
  z: "application/x-compress",
  solitairetheme8: "application/x-compressed",
  "dtcp-ip": "application/x-dtcp1",
  gz: "application/x-gzip",
  itls: "application/x-itunes-itls",
  itms: "application/x-itunes-itms",
  itpc: "application/x-itunes-itpc",
  jtx: "application/x-jtx+xps",
  latex: "application/x-latex",
  nix: "application/x-mix-transfer",
  asx: "video/x-ms-asf-plugin",
  application: "application/x-ms-application",
  vsto: "application/x-ms-vsto",
  wmd: "application/x-ms-wmd",
  wmz: "application/x-ms-wmz",
  xbap: "application/x-ms-xbap",
  website: "application/x-mswebsite",
  p12: "x-pkcs12",
  p7b: "x-pkcs7-certificates",
  p7r: "x-pkcs7-certreqresp",
  pcast: "application/x-podcast",
  swf: "application/x-shockwave-flash",
  sit: "application/x-stuffit",
  tar: "application/x-tar",
  man: "application/x-troff-man",
  zip: "application/zip",
  xaml: "application/xaml+xml",
  xht: "application/xhtml+xml",
  xml: "text/xml",
  "3gp": "audio/3gpp",
  "3g2": "audio/3gpp2",
  aac: "audio/aac",
  aiff: "audio/x-aiff",
  amr: "audio/amr",
  au: "audio/basic",
  ec3: "audio/ec3",
  lpcm: "audio/l16",
  mid: "midi/mid",
  mp3: "audio/x-mpg",
  m4a: "audio/x-m4a",
  m3u: "audio/x-mpegurl",
  adts: "audio/vnd.dlna.adts",
  ac3: "audio/vnd.dolby.dd-raw",
  wav: "audio/x-wav",
  flac: "audio/x-flac",
  m4r: "audio/x-m4r",
  mka: "audio/x-matroska",
  wax: "audio/x-ms-wax",
  wma: "audio/x-ms-wma",
  dib: "image/bmp",
  gif: "image/gif",
  jpg: "image/pjpeg",
  jps: "image/jps",
  mpo: "image/mpo",
  png: "image/x-png",
  pns: "image/pns",
  svg: "image/svg+xml",
  tif: "image/tiff",
  dds: "image/vnd.ms-dds",
  wdp: "image/vnd.ms-photo",
  emf: "image/x-emf",
  ico: "image/x-icon",
  wmf: "image/x-wmf",
  dwfx: "model/vnd.dwfx+xps",
  easmx: "model/vnd.easmx+xps",
  edrwx: "model/vnd.edrwx+xps",
  eprtx: "model/vnd.eprtx+xps",
  p7m: "pkcs7-mime",
  ics: "text/calendar",
  css: "text/css",
  vcf: "text/x-vcard",
  html: "text/html",
  txt: "text/plain",
  wsc: "text/scriptlet",
  htc: "text/x-component",
  contact: "text/x-ms-contact",
  iqy: "text/x-ms-iqy",
  odc: "text/x-ms-odc",
  rqy: "text/x-ms-rqy",
  "3gpp": "video/3gpp",
  "3gp2": "video/3gpp2",
  avi: "video/x-msvideo",
  mp4: "video/mp4",
  mpeg: "video/x-mpeg2a",
  mov: "video/quicktime",
  uvu: "video/vnd.dece.mp4",
  tts: "video/vnd.dlna.mpeg-tts",
  wtv: "video/wtv",
  m4v: "video/x-m4v",
  mkv: "video/x-matroska",
  "dvr-ms": "video/x-ms-dvr",
  wm: "video/x-ms-wm",
  wmv: "video/x-ms-wmv",
  wmx: "video/x-ms-wmx",
  wvx: "video/x-ms-wvx",
  apk: "application/vnd.android.package-archive",
  obb: "application/vnd.android.obb",
  json: "application/json",
  eml: "message/rfc822"
};
