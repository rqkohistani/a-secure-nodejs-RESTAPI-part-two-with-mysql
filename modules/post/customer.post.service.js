import con from '../../dbConnection';
import customerService from '../customer/customer.service';

const getAllPosts = async () => {
  const sql = 'SELECT * FROM posts';
  const [results] = await con.promise().query(sql);
  return results;
};

const getPostById = async (postId) => {
  const sql = 'SELECT * FROM posts WHERE id = ?';
  const [results] = await con.promise().query(sql, [postId]);
  return results;
};

const getPostByCustomerId = async (customerId) => {
  const sql = 'SELECT * FROM posts WHERE customerId = ?';
  const [results] = await con.promise().query(sql, [customerId]);
  return results;
};

const createPostByCustomerId = async (customerId, postData) => {
  const customer = await customerService.getCustomer(customerId);
  if (customer) {
    const query = 'INSERT INTO posts SET ?';
    const newPost = {
      customerId,
      ...postData,
    };
    const [data] = await con.promise().query(query, [newPost]);
    return data;
  }
  return null;
};

const deletePost = async (customerId, postId) => {
  const sql = 'DELETE FROM posts WHERE id = ? AND customerId = ?';
  const [results] = await con.promise().query(sql, [postId, customerId]);
  return results;
};

const updatePost = async (customerId, postId, postData) => {
  const sql = 'UPDATE posts SET ? WHERE id = ? AND customerId = ?';
  const getCustomer = await customerService.getCustomer(customerId);
  const getPost = await getPostById(postId);
  const checkAll = Promise.all([getCustomer, getPost]);
  const [customer, post] = await checkAll;
  if (customer && post) {
    const updatePostData = {
      ...postData,
      updatedAt: new Date(),
    };
    const [data] = await con.promise().query(sql, [updatePostData, postId, customerId]);
    return data;
  }
  return null;
};

const customerPostService = {
  getAllPosts,
  getPostById,
  getPostByCustomerId,
  createPostByCustomerId,
  deletePost,
  updatePost,
};

export default customerPostService;