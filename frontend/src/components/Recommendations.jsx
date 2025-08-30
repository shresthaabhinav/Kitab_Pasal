import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const Recommendations = () => {
  const { id } = useParams(); // Book ID from URL
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/recommend/${id}?top_n=5`
        );
        setRecommendations(response.data);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [id]);

  if (loading) return <p>Loading recommendations...</p>;
  if (!recommendations.length) return <p>No recommendations found.</p>;

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold mb-4">You Might Also Like</h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {recommendations.map((book) => (
          //  <Link to={`/view-book-details/${data._id}`}></Link>
          <Link
            key={book.book_id}
            to={`/view-book-details/${book.book_id}`}
            className="bg-zinc-800 p-4 rounded w-60 flex-shrink-0 hover:scale-105 transition-transform duration-200"
          >
            <img
              src={book.url}
              alt={book.title}
              className="w-full h-40 object-cover rounded mb-2"
            />
            <h3 className="text-white font-semibold">{book.title}</h3>
            <p className="text-zinc-400 text-sm">{book.author}</p>
            <p className="text-zinc-500 text-xs mt-2 line-clamp-3">
              {book.description}
            </p>
            {book.price && (
              <p className="text-green-400 font-semibold mt-2">₹{book.price}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
