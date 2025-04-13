import { RoleType, UserVerifyStatus, ReactionType, PostType, ViewScopeType, ComentScopeType } from '~/constants/enums';
export enum ViewScopeType {
  PUBLIC = 'PUBLIC',
  FOLLOWERS = 'ALL_CONNECTED',
  SOME_PEOPLE = 'SOME_PEOPLE',
  PRIVATE = 'PRIVATE',
}
export enum commentScopeType {
  PUBLIC = 'PUBLIC',
  FOLLOWERS = 'ALL_CONNECTED',
  SOME_PEOPLE = 'SOME_PEOPLE',
  PRIVATE = 'PRIVATE',
}
export interface UserType {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  created_at?: number;
  updated_at?: number;
  email_verify_token?: string;
  forgot_password_token?: string;
  verify?: UserVerifyStatus;
  role?: RoleType;
  user_cirlce?: string[];
  location?: string;
  website?: string;
  date_of_birth?: number;
  bio?: string;
  username?: string;
  avatar?: string;
  cover_photo?: string;
  school?: string;
  hometown?: string;
}

// Refresh Token Interface
export interface RefreshTokenType {
  _id?: string;
  token: string;
  created_at?: number;
  user_id: string;
}

// Reaction Interface
export interface IReaction {
  _id?: string;
  user_id: string;
  post_id: string;
  type: ReactionType;
  created_at?: Date;
}

// Post Interface
export interface IPost {
  _id?: string;
  ownerId: string;
  content: string;
  type: PostType;
  viewScope: ViewScopeType;
  commentScope: ComentScopeType;
  createdAt?: Date;
  updatedAt?: Date;
  parent_id: null | string;
  hashtags: string[];
  mentions: string[]; // Track and display users mentioned in the tweet.
  medias: Media[];
}

// Hashtag Interface
export interface HashtagType {
  _id?: string;
  name: string;
  created_at?: Date;
}

// Follower Interface
export interface FollowerType {
  _id?: string;
  user_id: string;
  followed_user_id: string;
  created_at?: Date;
}

// Comment Interface
export interface CommentType {
  _id?: string;
  user_id: string;
  post_id: string;
  content: string;
  parent_id?: string; // Specify parent comment ID if any
  created_at?: Date;
}

// Bookmark Interface
export interface BookmarkType {
  _id?: string;
  user_id: string;
  post_id: string;
  created_at?: Date;
}
