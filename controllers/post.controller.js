import postService from '#services/post.service';

const getPostById = async (req, res, next) => {
  try {
    const post = await postService.getPostById(req.params.postId, req.user);

    return res.status(200).json(post);
  } catch (err) {
    return next(err);
  }
};

const deletePostById = async (req, res, next) => {
  try {
    const deletedPost = await postService.deletePostById(req.params.postId, req.user);
    return res.status(200).json(deletedPost);
  } catch (err) {
    return next(err);
  }
};

const createPost = async (req, res, next) => {
  try {
    const newPost = await postService.createPost(req.body, req.user);
    return res.status(200).json(newPost);
  } catch (err) {
    return next(err);
  }
};

const queryPosts = async (req, res, next) => {
  try {
    const filteredPosts = await postService.queryPosts(req.query, req.user);

    return res.status(200).json(filteredPosts);
  } catch (err) {
    return next(err);
  }
};

const likePostById = async (req, res, next) => {
  try {
    const updatedPost = await postService.likePostById(req.params.postId, req.user);
    return res.status(200).json(updatedPost);
  } catch (err) {
    return next(err);
  }
};

const unlikePostById = async (req, res, next) => {
  try {
    const updatedPost = await postService.unlikePostById(req.params.postId);
    return res.status(200).json(updatedPost);
  } catch (err) {
    return next(err);
  }
};

export default {
  createPost,
  likePostById,
  unlikePostById,
  deletePostById,
  getPostById,
  queryPosts,
};
