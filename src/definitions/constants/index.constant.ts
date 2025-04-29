export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  UNPROCESSABLE_ENTITY: 422,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  FORBIDDEN: 403,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
  PARTIAL_CONTENT: 206,
} as const;

export const MAX_FILE_SIZE_DOCUMENT_MB = 2;
export const MAX_FILE_SIZE_IMAGE_MB = 5;
export const MAX_FILE_SIZE_VIDEOS_MESSAGE_MB = 30;
export const MAX_FILE_SIZE_VIDEO_COMMENT = 30;
export const MAX_FILE_SIZE_VIDEOS_MB = 3000;
export const LIMIT_UPLOAD_FILE = 2;
export const LIMIT_UPLOAD_IMAGE = 5;
export const LIMIT_UPLOAD_VIDEO = 1;
export const MAX_LENGTH_CONTENT_CHAT_POST = 3000;
export const MAX_LENGTH_CONTENT_MESSENGER = 500;
export const MAX_SIZE_VIDEO_MB = 20;
export const MAX_SIZE_IMAGE_MB = 5;
export const acceptFilesImage = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];

export const acceptFilesVideo = [
  'video/mp4',
  'video/mpeg',
  'video/mpg',
  'video/wmv',
  'video/mov',
  'video/quicktime',
  'video/x-ms-wmv',
];

export const acceptDocumentFiles = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
  'application/vnd.ms-powerpoint', // .ppt
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'application/vnd.ms-excel', // .xls
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/msword',
  'pdf',
  'vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
  'vnd.ms-powerpoint', // .ppt
  'vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'vnd.ms-excel', // .xls
  'vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'msword',
  'text/plain' 
];
export const SOCKET_EVENT_KEY = {
  CONNECT: 'connection',
  FIRE_MESSAGE: 'message',
  DELETE_MESSAGE: 'message-deletion',
  MESSAGE_READ: 'message-read',
  NOTIFICATION: 'notification',
  NEWSLETTER: 'newsletter',
  SYNCHRONIZE: 'synchronize',
  ADD_MEMBER: 'add-member',
  REMOVE_MEMBER: 'remove-member',
  MEMBER_EXIT: 'member-exit',
};
