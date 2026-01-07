import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchMyPosts, updatePost, deletePost } from "../services/post.service";

const TABS = {
  ALL: "all",
  DRAFTS: "drafts",
  PUBLISHED: "published",
};

const MyPosts = () => {
  const [actionLoading, setActionLoading] = useState({});
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState(TABS.ALL);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadMyPosts();
  }, []);

  const loadMyPosts = async () => {
    try {
      setLoading(true);
      const res = await fetchMyPosts();
      setPosts(res.data.posts || []);
    } catch (err) {
      setError("Failed to load your posts.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmed) return;

    try {
      await deletePost(postId);
      setPosts((prev) => prev.filter((post) => post._id !== postId));
    } catch (err) {
      alert("Failed to delete post.");
    }
  };

  const handlePublish = async (postId) => {
    if (actionLoading[postId]) return;

    const previousPosts = [...posts];

    setPosts((prev) =>
      prev.map((post) =>
        post._id === postId
          ? { ...post, isDraft: false, status: "published" }
          : post
      )
    );

    setActionLoading((prev) => ({ ...prev, [postId]: true }));

    try {
      const res = await updatePost(postId, {
        isDraft: false,
        status: "published",
      });

      setPosts((prev) =>
        prev.map((post) => (post._id === postId ? res.data.post : post))
      );
    } catch (err) {
      setPosts(previousPosts);
      alert("Failed to publish post.");
    } finally {
      setActionLoading((prev) => {
        const copy = { ...prev };
        delete copy[postId];
        return copy;
      });
    }
  };

  const handleUnpublish = async (postId) => {
    if (actionLoading[postId]) return;

    const previousPosts = [...posts];

    setPosts((prev) =>
      prev.map((post) =>
        post._id === postId ? { ...post, isDraft: true, status: "draft" } : post
      )
    );

    setActionLoading((prev) => ({ ...prev, [postId]: true }));

    try {
      const res = await updatePost(postId, {
        isDraft: true,
        status: "draft",
      });

      setPosts((prev) =>
        prev.map((post) => (post._id === postId ? res.data.post : post))
      );
    } catch (err) {
      setPosts(previousPosts);
      alert("Failed to unpublish post.");
    } finally {
      setActionLoading((prev) => {
        const copy = { ...prev };
        delete copy[postId];
        return copy;
      });
    }
  };

  const filteredPosts = posts.filter((post) => {
    if (activeTab === TABS.DRAFTS) return post.isDraft;
    if (activeTab === TABS.PUBLISHED) return !post.isDraft;
    return true;
  });

  if (loading) {
    return <div className="p-6">Loading your posts...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
      <h1 className="text-2xl font-semibold mb-6">My Posts</h1>

      <div className="flex flex-wrap gap-3 mb-6">
        <TabButton
          label="All"
          active={activeTab === TABS.ALL}
          onClick={() => setActiveTab(TABS.ALL)}
        />
        <TabButton
          label="Drafts"
          active={activeTab === TABS.DRAFTS}
          onClick={() => setActiveTab(TABS.DRAFTS)}
        />
        <TabButton
          label="Published"
          active={activeTab === TABS.PUBLISHED}
          onClick={() => setActiveTab(TABS.PUBLISHED)}
        />
      </div>

      {filteredPosts.length === 0 ? (
        <div className="text-gray-500">
          {activeTab === TABS.DRAFTS && "You have no drafts."}
          {activeTab === TABS.PUBLISHED &&
            "You haven’t published any posts yet."}
          {activeTab === TABS.ALL && "You haven’t created any posts yet."}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <div
              key={post._id}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start"
            >
              <div className="flex-1 min-w-0">
                <Link to={`/posts/${post._id}`} className="hover:underline">
                  <h2 className="text-lg font-medium truncate sm:whitespace-normal">
                    {post.title}
                  </h2>
                </Link>
                <div className="text-sm text-gray-500 mt-1">
                  {post.isDraft ? "Draft" : "Published"} •{" "}
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => navigate(`/posts/${post._id}/edit`)}
                  className="text-sm px-3 py-1 border border-gray-300 rounded bg-white hover:bg-gray-100"
                >
                  Edit
                </button>

                {post.isDraft ? (
                  <button
                    onClick={() => handlePublish(post._id)}
                    disabled={actionLoading[post._id]}
                    className="text-sm px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    {actionLoading[post._id] ? "Publishing..." : "Publish"}
                  </button>
                ) : (
                  <button
                    onClick={() => handleUnpublish(post._id)}
                    disabled={actionLoading[post._id]}
                    className="text-sm px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
                  >
                    {actionLoading[post._id] ? "Updating..." : "Unpublish"}
                  </button>
                )}

                <button
                  onClick={() => handleDelete(post._id)}
                  className="text-sm px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const TabButton = ({ label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md text-sm ${
        active
          ? "bg-black text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {label}
    </button>
  );
};

export default MyPosts;
