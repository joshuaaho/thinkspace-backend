export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class AlreadyLikedPostError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class NotLikedPostError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class AlreadyLikedCommentError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class NotLikedCommentError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class SelfLikedPostError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class SelfLikedCommentError extends Error {
  constructor(message: string) {
    super(message);
  }
}
