import { Key } from 'react';
import {
  CommentScopeType,
  contactStatus,
  PostType,
  ReactionTargetType,
  ReactionType,
  ViewScopeType,
} from '~/definitions/enums/index.enum';

// Interface cho Reaction
export interface IReaction {
  _id?: string;
  targetId: string;
  targetType?: ReactionTargetType;
  userId: string;
  reactionType: ReactionType;
  createdAt?: Date;
}

// Interface cho Post
export interface IPost {
  _id: string;
  authorId: string;
  content: string;
  media?: string[];
  attachments?: string[];
  createdAt: number;
  updatedAt: number;
  viewScope: ViewScopeType;
  commentScope: CommentScopeType;
  groupId?: string;
  courseId?: string;
  hashtags: string[];
  mentions?: string[];
  reactions?: {
    _id: string;
    user_name: string;
    reactionType: string;
  }[];
  specificFriends?: string[];
  reactsCount?: number;
  commentsCount?: number;
  author?: {
    _id: string;
    first_name: string;
    last_name: string;
    user_name: string;
    avatar: string;
    contactStatus: contactStatus;
  };
  canEdit?: boolean;
  isFriend?: boolean;
  type: PostType;
  embeddedPost?: string;
  currentUserReaction?: string;
  canComment?: boolean;
}

// Interface cho Hashtag
export interface HashtagType {
  _id?: string;
  name: string;
  created_at?: Date;
}

// Interface cho Follower
export interface FollowerType {
  _id?: string;
  user_id: string;
  followed_user_id: string;
  created_at?: Date;
}

// Interface cho Comment
export interface CommentType {
  _id?: string;
  postId: string;
  authorId: string;
  content: string;
  mentions: string[];
  parentId?: string;
  reactsCount: number;
  createdAt?: Date; // Thay number bằng Date
  updatedAt?: Date; // Thay number bằng Date
}

// Interface cho Bookmark
export interface BookmarkType {
  _id?: string;
  user_id: string;
  post_id: string;
  created_at?: Date;
}
export interface PostMedia {
  id: Key | null | undefined;
  url: string; // URL của file
  type?: 'image' | 'video' | 'file'; // Loại file (tự động xác định)
  name?: string; // Tên file (tự động trích xuất từ URL)
}

export interface PostTag {
  id?: number;
  tagId?: number;
  name?: string;
  type?: string;
  createdBy?: string;
}
