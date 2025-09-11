const { Blog, User } = require("../models");
const slugify = require("slugify");

/**
 * Create a new blog
 */
exports.createBlog = async (req, res) => {
  try {
    const {
      title,
      content,
      excerpt,
      status,
      metaTitle,
      metaDescription,
      metaKeywords,
    } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    const slug = slugify(title, { lower: true, strict: true });

    const blog = await Blog.create({
      title,
      slug,
      content,
      excerpt,
      featuredImage: req.file ? `${req.file.filename}` : null,
      status: status || "published",
      metaTitle,
      metaDescription,
      metaKeywords,
      authorId: req.user?.id || null, // from auth middleware
    });

    res.status(201).json(blog);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to create blog", error: err.message });
  }
};

/**
 * Get all blogs
 */
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      include: [
        { model: User, as: "author", attributes: ["id", "fullname", "email"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(blogs);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch blogs", error: err.message });
  }
};

/**
 * Get single blog by slug
 */
exports.getBlogById = async (req, res) => {
  try {
    const { slug } = req.params;

    const blog = await Blog.findByPk(slug); // fetch by primary key

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.json(blog);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch blog", error: err.message });
  }
};

/**
 * Update blog
 */
exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByPk(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const {
      title,
      content,
      excerpt,
      status,
      metaTitle,
      metaDescription,
      metaKeywords,
      featuredImage,
    } = req.body;

    if (title) blog.title = title;
    if (content) blog.content = content;
    if (excerpt) blog.excerpt = excerpt;
    if (status) blog.status = status;
    if (metaTitle) blog.metaTitle = metaTitle;
    if (metaDescription) blog.metaDescription = metaDescription;
    if (metaKeywords) blog.metaKeywords = metaKeywords;
    if (title) blog.slug = slugify(title, { lower: true, strict: true });
    if (req.file) {
      blog.featuredImage = `/uploads/${req.file.filename}`;
    } else if (featuredImage) {
      blog.featuredImage = featuredImage;
    }

    await blog.save();

    res.json(blog);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update blog", error: err.message });
  }
};

/**
 * Delete blog (soft delete because of paranoid: true)
 */
exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findByPk(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    await blog.destroy();

    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete blog", error: err.message });
  }
};
