export enum UserRole {
  Student, // Sinh viên
  Teacher, // Giảng viên
  Admin // Quản trị viên
}

export enum UserActivityStatus {
  Online,
  Offline
}

export enum GroupType {
  Study, // Nhóm học tập
  Teaching, // Nhóm giảng dạy
  Social // Nhóm sở thích
}

export enum CourseRole {
  Student, // Sinh viên
  Teacher // Giảng viên
}

export enum NotificationType {
  NewComment, // Bình luận mới
  Mention, // Được nhắc đến
  NewMessage, // Tin nhắn mới
  Like // Lượt thích
}

export enum MessageStatus {
  Sent, // Đã gửi
  Read // Đã đọc
}

export enum UserVerifyStatus {
  Unverified, // Chưa xác thực email
  Verified, // Đã xác thực email
  Banned // Bị khóa
}

export enum ForgotPasswordVerifyStatus {
  Unverified,
  Verified
}

export enum TokenType {
  AccessToken,
  RefreshToken,
  ForgotPasswordToken,
  EmailVerifyToken
}

export enum RoleType {
  Admin,
  User
}

export enum PostType {
  POST,
  RePost,
  Comment,
  QuotePOST
}

export enum ViewScopeType {
  Public,
  Friend,
  SomeOne,
  Private,
  Group,
  Course
}

export enum CommentScopeType {
  Public,
  Friend,
  Private
}

export enum ReactionTargetType {
  Post,
  Comment
}

export enum MediaType {
  IMAGE = 'IMAGE',
  FILE = 'FILE',
  VIDEO = 'VIDEO',
}
export enum ReactionType {
  Like = 'like',
  Love = 'love',
  Haha = 'haha',
  Wow = 'wow',
  Sad = 'sad',
  Angry = 'angry'
}
