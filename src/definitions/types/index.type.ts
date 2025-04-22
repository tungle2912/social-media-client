
import { MessageStatus, UserActivityStatus, UserRole, UserVerifyStatus } from "~/definitions/enums/index.enum";

export interface UserType {
  _id?: string;
  first_name: string;
  last_name: string;
  user_name: string;
  email: string;
  password: string;
  email_verify_token?: string;
  forgot_password_token?: string;
  role: UserRole;
  bio?: string;
  avatar?: string;
  cover_photo?: string;
  friends: string[];
  personalSettings: {
    notificationPreferences?: {
      email: boolean;
      push: boolean;
    };
    theme?: string;
  };
  verify: UserVerifyStatus;
  status: UserActivityStatus;
  lastActiveAt?: Date;
  groups: string[];
  coursesEnrolled: string[];
  coursesTeaching: string[];
  date_of_birth?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface cho RefreshToken
export interface RefreshTokenType {
  _id?: string;
  userId: string;
  token: string;
  created_At: Date; // Thay number bằng Date
}


// Interface cho Conversation
export interface ConversationType {
  _id?: string;
  name?: string;
  participants: string[];
  type: 'private' | 'group';
  createdAt: Date; // Thay number bằng Date
  updatedAt: Date; // Thay number bằng Date
  lastMessage?: {
    content: string;
    senderId: string;
    createdAt: Date; // Thay number bằng Date
  };
}

// Interface cho Message
export interface MessageType {
  _id?: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: Date; // Thay number bằng Date
  status: MessageStatus;
  attachments?: string[];
  reactions?: {
    userId: string;
    reaction: string;
  }[];
}

// Interface cho Notification
export interface NotificationType {
  _id?: string;
  userId: string;
  type: NotificationType;
  referenceId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  link?: string;
  createdAt: Date; // Thay number bằng Date
}

// Interface cho GroupMember
export interface GroupMemberType {
  _id?: string;
  groupId: string;
  userId: string;
  role: string; // "member", "admin"
  joinedAt: Date; // Thay number bằng Date
}

// Interface cho CourseStudent
export interface CourseStudentType {
  _id?: string;
  courseId: string;
  studentId: string;
  enrolledAt: Date; // Thay number bằng Date
  status: string;
  grade?: number;
}

// Interface cho Otp
export interface OtpType {
  _id?: string;
  userId: string;
  otp: string;
  status: boolean;
  created_At: Date; // Thay number bằng Date
  expires_at: Date; // Thay number bằng Date
}

// Interface cho Group
export interface GroupType {
  _id?: string;
  name: string;
  description: string;
  createdBy: string;
  type: GroupType;
  membersCount: number;
  membersPreview?: {
    userId: string;
    name: string;
  }[];
  createdAt?: Date; // Thay number bằng Date
  updatedAt?: Date; // Thay number bằng Date
}

// Interface cho Course
export interface CourseType {
  _id?: string;
  code: string;
  title: string;
  description: string;
  term: string;
  teachers: string[];
  studentsCount: number;
  createdAt?: Date; // Thay number bằng Date
  updatedAt?: Date; // Thay number bằng Date
}
