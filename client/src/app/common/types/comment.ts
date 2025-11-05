export interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    userName: string;
    imageUrl: string;
  }
  postId: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
