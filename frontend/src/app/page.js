"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function NewsManagement() {
  const [activePage, setActivePage] = useState("news");
  const [news, setNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
    category: "",
    image: null,
  });
  const [categoryForm, setCategoryForm] = useState({ name: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const API_BASE = "http://localhost:2025/bc";

  const fetchNews = async () => {
    try {
      const response = await axios.get(`${API_BASE}/news/all`);
      setNews(response.data);
    } catch (error) {
      console.error("Error fetching news:", error);
      alert("Error fetching news");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE}/categories/all`);
      setCategories(response.data);
    } catch (error) {
      
      console.error("Error fetching categories:", error);
      alert("Error fetching categories");
    }
  };

  useEffect(() => {
    fetchNews();
    fetchCategories();
    setActivePage("articles");
  }, []);

  const handleNewsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("author", formData.author);
      formDataToSend.append("category", formData.category);
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      if (editingId) {
        await axios.put(
          `${API_BASE}/news/update/${editingId}`,
          formDataToSend,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        setEditingId(null);
      } else {
        await axios.post(`${API_BASE}/news/create`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setFormData({
        title: "",
        content: "",
        author: "",
        category: "",
        image: null,
      });
      setImagePreview(null);
      fetchNews();
      alert(
        editingId ? "News updated successfully!" : "News created successfully!"
      );
    } catch (error) {
      console.error("Error saving news:", error);
      alert("Error saving news");
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) return;

    try {
      await axios.post(`${API_BASE}/categories/create`, {
        name: categoryForm.name,
      });
      setCategoryForm({ name: "" });
      fetchCategories();
      alert("Category created successfully!");
    } catch (error) {
      console.error("Error creating category:", error);
      alert("Error creating category");
    }
  };

  const handleEdit = (newsItem) => {
    setFormData({
      title: newsItem.title,
      content: newsItem.content,
      author: newsItem.author,
      category: newsItem.category,
      image: null,
    });
    setEditingId(newsItem._id);
    setImagePreview(
      newsItem.image_url
        ? `http://localhost:2025/uploads/images/${newsItem.image_url}`
        : null
    );
    setActivePage("articles");
  };

  const handleDeleteNews = async (id) => {
    if (confirm("Are you sure you want to delete this news?")) {
      try {
        await axios.delete(`${API_BASE}/news/delete/${id}`);
        fetchNews();
        alert("News deleted successfully!");
      } catch (error) {
        console.error("Error deleting news:", error);
        alert("Error deleting news");
      }
    }
  };

  const handleDeleteCategory = async (id) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        await axios.delete(`${API_BASE}/categories/delete/${id}`);
        fetchCategories();
        alert("Category deleted successfully!");
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("Error deleting category");
      }
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      title: "",
      content: "",
      author: "",
      category: "",
      image: null,
    });
    setImagePreview(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderNavigation = () => (
    <nav className="bg-black text-white p-4 mb-8 rounded-lg">
      <div className="max-w-7xl mx-auto">
        <div className="flex space-x-8">
          <button
            onClick={() => setActivePage("articles")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activePage === "articles"
                ? "bg-white text-black"
                : "hover:bg-gray-800"
            }`}
          >
            All news
          </button>
          <button
            onClick={() => setActivePage("categories")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activePage === "categories"
                ? "bg-white text-black"
                : "hover:bg-gray-800"
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => setActivePage("news")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activePage === "news"
                ? "bg-white text-black"
                : "hover:bg-gray-800"
            }`}
          >
            Add news
          </button>
        </div>
      </div>
    </nav>
  );

  const renderNewsManagement = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex items-center justify-center">
      <div className="space-y-8">
        <section className="border border-black rounded-lg p-6">
          <h2 className="text-2xl font-bold text-black mb-4">
            {editingId ? "Edit News" : "Create New News"}
          </h2>
          <form onSubmit={handleNewsSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-black text-sm font-medium mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-black text-black bg-white"
                  placeholder="Enter news title"
                  required
                />
              </div>
              <div>
                <label className="block text-black text-sm font-medium mb-2">
                  Author
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-black text-black bg-white"
                  placeholder="Enter author name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-black text-sm font-medium mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-3 py-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-black text-black bg-white"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-black text-sm font-medium mb-2">
                Content
              </label>
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                rows="6"
                className="w-full px-3 py-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-black text-black bg-white"
                placeholder="Enter news content"
                required
              />
            </div>

            <div>
              <label className="block text-black text-sm font-medium mb-2">
                Image
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="w-full px-3 py-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-black text-black bg-white file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-black file:text-white file:cursor-pointer"
              />
              {imagePreview && (
                <div className="mt-3">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-xs max-h-48 object-cover rounded border border-black"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {loading
                  ? "Saving..."
                  : editingId
                  ? "Update News"
                  : "Create News"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-6 py-2 border border-black text-black rounded hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>
      </div>
    </div>
  );

  const renderCategories = () => (
    <div className="max-w-4xl mx-auto">
      <section className="border border-black rounded-lg p-6">
        <h2 className="text-2xl font-bold text-black mb-6">
          Manage Categories
        </h2>
        <form onSubmit={handleCategorySubmit} className="flex gap-4 mb-8">
          <input
            type="text"
            value={categoryForm.name}
            onChange={(e) => setCategoryForm({ name: e.target.value })}
            placeholder="Enter category name"
            className="flex-1 px-3 py-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-black text-black bg-white"
            required
          />
          <button
            type="submit"
            className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
          >
            Add Category
          </button>
        </form>

        <div className="border-t border-black pt-6">
          <h3 className="text-xl font-semibold text-black mb-4">
            Existing Categories ({categories.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="flex justify-between items-center p-4 border border-black rounded-lg"
              >
                <span className="text-black font-medium text-lg">
                  {cat.name}
                </span>
                <button
                  onClick={() => handleDeleteCategory(cat._id)}
                  className="px-3 py-1 bg-black text-white rounded hover:bg-gray-800 text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );

  const renderArticles = () => (
    <div className="max-w-6xl mx-auto">
      <section className="border border-black rounded-lg p-6">
        <h2 className="text-2xl font-bold text-black mb-6">
          All News ({news.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => (
            <div
              key={item._id}
              className="border border-black rounded-lg p-4 flex flex-col h-full"
            >
              {item.image_url && (
                <div className="mb-3">
                  <img
                    src={`http://localhost:2025/uploads/images/${item.image_url}`}
                    alt={item.title}
                    className="w-full h-48 object-cover rounded border border-black"
                  />
                </div>
              )}
              <h3 className="text-lg font-bold text-black mb-2 line-clamp-2">
                {item.title}
              </h3>
              <p className="text-black text-sm mb-3 line-clamp-3 flex-grow">
                {item.content}
              </p>
              <div className="text-xs text-black space-y-1 mb-3">
                <div>
                  <strong>Author:</strong> {item.author}
                </div>
                <div>
                  <strong>Category:</strong> {item.category}
                </div>
                <div>
                  <strong>Date:</strong> {item.date || ""}
                </div>
              </div>
              <div className="flex gap-2 mt-auto">
                <button
                  onClick={() =>{ handleEdit(item);     setActivePage("articles"); }}
                  className="flex-1 px-3 py-2 border border-black text-black rounded hover:bg-gray-100 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteNews(item._id)}
                  className="flex-1 px-3 py-2 bg-black text-white rounded hover:bg-gray-800 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {news.length === 0 && (
            <div className="col-span-full text-center py-12 text-black text-lg">
              No news found.
            </div>
          )}
        </div>
      </section>
    </div>
  );

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-7xl mx-auto">
        {renderNavigation()}

        {activePage === "news" && renderNewsManagement()}
        {activePage === "categories" && renderCategories()}
        {activePage === "articles" && renderArticles()}
      </div>
    </div>
  );
}
