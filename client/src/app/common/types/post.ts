export interface Post {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string;
  imagePath?: string;
  likes: string[];
  likesCount: number;
  commentsCount?: number;
  isDeleted: boolean;
  updatedAt: Date;
  createdAt: Date;
  author: {
    _id: string;
    userName: string;
    imageUrl: string;
  };
}
