import { HttpError } from '../../errors';
import customerPostService from './customer.post.service';

const getAllPosts = async (req, res, next) => {
  try {
    const posts = await customerPostService.getAllPosts();
    res.status(200).send(posts);
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const getPostById = async (req, res, next) => {
  try {
    const postId = parseInt(req.query.postId, 10);
    const [post] = await customerPostService.getPostById(postId);
    if (!post) throw new HttpError(404, 'Post not found');
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

const getPostByCustomerId = async (req, res, next) => {
  try {
    const customerId = parseInt(req.params.customerId, 10);
    const posts = await customerPostService.getPostByCustomerId(customerId);
    if (posts.length <= 0) throw new HttpError(404, 'Posts not found');
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

const createPostByCustomerId = async (req, res, next) => {
  try {
    const { customerId } = req.body;
    const { title, body } = req.body;
    const newPost = await customerPostService.createPostByCustomerId(customerId, { title, body });
    if (!newPost) throw new HttpError(404, 'Post not created');
    res.status(201).json({ message: 'Post created', database: newPost });
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const postId = parseInt(req.params.postId, 10);
    const customerId = parseInt(req.body.customerId, 10);
    const deletedPost = await customerPostService.deletePost(customerId, postId);
    if (!deletedPost) throw new HttpError(404, 'Post not found');
    res.status(200).json({ message: 'Post deleted', database: deletedPost });
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const postId = parseInt(req.params.postId, 10);
    const customerId = parseInt(req.body.customerId, 10);
    const { title, body } = req.body;
    const updatedPost = await customerPostService.updatePost(customerId, postId, { title, body });
    if (updatedPost.affectedRows === 0) throw new HttpError(404, 'Post or customer not found');
    res.status(200).json({ message: 'Post updated', database: updatedPost });
  } catch (error) {
    next(error);
  }
};

const customerPostController = {
  getAllPosts,
  getPostById,
  getPostByCustomerId,
  createPostByCustomerId,
  deletePost,
  updatePost,
};

export default customerPostController;

export { getAllPosts, getPostById, getPostByCustomerId, createPostByCustomerId, deletePost, updatePost };
