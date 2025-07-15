

## Project Overview
**Thinkspace** is a social media site developed using Node.js, Express, TypeScript, Inversify, and more. The project applies Clean Architecture and Domain-Driven Design (DDD) principles. The entire project was self-taught and took approximately one year to complete.

For the frontend, please check out the [thinkspace-frontend repository](https://github.com/joshuaaho/thinkspace-frontend)..

## Key Features
- **Posts**: Create, Read, Update, and Delete (CRUD) functionality for posts.
- **Comments & Replies**: Full CRUD capabilities for comments and replies.
- **Real-Time Messages and Notifications** (Socket.IO):
  - Notifications for follows (to the followee).
  - Notifications for post likes and creations (to the post author and followee).
  - Notifications for comment likes (to the post and comment authors).
  - Real-time messaging (Notifications sent to message receivers).
- **User Management**:
  - Create and Update User profiles.
  - Follow and Unfollow functionality.
- **Image Uploading**: Integration with AWS S3 for image uploads.
- **User Filtering**: Filter users by username.
- **Post Filtering**: 
  - Filter posts by title or tags.
  - Sort posts by newest, oldest, or number of likes.

