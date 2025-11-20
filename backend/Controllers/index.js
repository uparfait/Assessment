const NewsModel = require("../Schemas/NewsSchema.js");
const CategoriesModel = require("../Schemas/CategoriesSchema.js");
const multer = require("multer");
const crypto = require("crypto");


const path = require("path");
const { get } = require("http");

// note: project folder uses 'upload/images' not 'uploads/images'
const images_path = path.join(__dirname, "../upload/images");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, images_path);
  },
  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() + "-" + crypto.randomBytes(12).toString("hex");
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });


class INDEX {

    // news controllers
  async create_news(req, res) {
    try {
      const { title, content, author, category } = req.body;
      const image_url = req.file?.filename;

      if (!title || !content || !author || !category || !image_url) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const new_news = new NewsModel({
        title,
        content,
        author,
        category,
        image_url,
      });
      await new_news.save();
      return res
        .status(201)
        .json({ message: "News created successfully", news: new_news });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async get_all_news(req, res) {
    try {
      const news = await NewsModel.find();
      return res.status(200).json(news);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async get_news_by_id(req, res) {
    try {
      const { id } = req.params;
      const news = await NewsModel.findById(id);
        if (!news) {
            return res.status(404).json({ error: "News not found" });
        }
      return res.status(200).json(news);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: "Internal server error" });
    }
    }

    async get_news_by_category(req, res) {
        try {
            const { category } = req.params;
            const news = await NewsModel.find({ category: category });
            return res.status(200).json(news);
        } catch (e) {
            console.error(e);
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    async update_news(req, res) {
        try {
            const { id } = req.params;
            const { title, content, author, category } = req.body;
            const image_url = req.file?.filename || req.body.existing_image_url;

            if (!title || !content || !author || !category) {
                return res.status(400).json({ error: "All fields are required" });
            }
            const updated_news = await NewsModel.findByIdAndUpdate(
                id,
                { title, content, author, category, image_url },
                { new: true }
            );
            if (!updated_news) {
                return res.status(404).json({ error: "News not found" });
            }
            return res.status(200).json({ message: "News updated successfully", news: updated_news });
        } catch (e) {
            console.error(e);
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    async delete_news(req, res) {
        try {
            const { id } = req.params;
            const deleted_news = await NewsModel.findByIdAndDelete(id);
            if (!deleted_news) {
                return res.status(404).json({ error: "News not found" });
            }
            return res.status(200).json({ message: "News deleted successfully" });
        }
        catch (e) {
            console.error(e);
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    // categories controllers

    async create_category(req, res) {
        try {
            const { name } = req.body;
            if (!name) {
                return res.status(400).json({ error: "Category name is required" });
            } 
            const new_category = new CategoriesModel({ name });
            await new_category.save();
            return res.status(201).json({ message: "Category created successfully", category: new_category });
        } catch (e) {
            console.error(e);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
    async get_all_categories(req, res) {
        try {
            const categories = await CategoriesModel.find();
            return res.status(200).json(categories);
        } catch (e) {
            console.error(e);
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    async delete_category(req, res) {
        try {
            const { id } = req.params;
            const deleted_category = await CategoriesModel.findByIdAndDelete(id);
            if (!deleted_category) {
                return res.status(404).json({ error: "Category not found" });
            }
            return res.status(200).json({ message: "Category deleted successfully" });
        } catch (e) {
            console.error(e);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
}

module.exports = new INDEX();