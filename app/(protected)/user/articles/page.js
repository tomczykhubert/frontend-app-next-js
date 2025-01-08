"use client";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, doc } from "firebase/firestore";
import { db, auth } from "@/app/lib/firebase/firebase";
import Spinner from "@/app/components/Spinner";

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  function formatDate(timestamp) {
    const date = timestamp.toDate();
    return date.toLocaleString();
  }

  useEffect(() => {
    const fetchArticles = async () => {
      if (!auth.currentUser) {
        setLoading(false);
        return;
      }

      try {
        const articlesRef = collection(db, "articles");

        const userRef = doc(db, "users", auth.currentUser.uid);

        const q = query(articlesRef, where("user", "==", userRef));

        const querySnapshot = await getDocs(q);
        const articlesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setArticles(articlesData);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Your Articles</h1>
      {articles.length === 0 ? (
        <p>No articles found.</p>
      ) : (
        <ul className="space-y-4">
          {articles.map((article) => (
            <li key={article.id} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{article.title}</h2>
              <p>{article.content}</p>
              <p className="text-gray-500">{formatDate(article.date)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
