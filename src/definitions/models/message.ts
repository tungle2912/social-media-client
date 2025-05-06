export enum ConversationFilterType {
  ALL = 'ALL',
  CONNECTED = 'DIRECT_MESSAGE',
  NON_CONNECTED = 'NOT_CHATTED',
  GROUP = 'GROUP_CHAT',
  GROUP_OR_CONNECTED = 'GROUP_OR_CONNECTED',
}
export enum ConversationType {
  GROUP_CHAT = 'GROUP_CHAT',
  DIRECT_MESSAGE = 'DIRECT_MESSAGE',
  NOT_CHATTED = 'NOT_CHATTED',
}

export enum ConversationMessageStatus {
  READ = 'READ',
  UNREAD = 'UNREAD',
}
export const MESSAGE_TYPE = {
  REMOVE_MEMBER: 'REMOVE_MEMBER',
  ADD_MEMBER: 'ADD_MEMBER',
  LEAVE_GROUP: 'LEAVE_GROUP',
  JOIN_GROUP: 'JOIN_GROUP',
  CREATE_GROUP: 'CREATE_GROUP',
  TEXT: 'TEXT',
  PROFILE: 'PROFILE',
  MEDIA: 'MEDIA',
  POST: 'POST',
};

export enum messageDeleteType {
  onlyMe,
  all,
}

