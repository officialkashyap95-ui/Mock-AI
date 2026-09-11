import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

function Result() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);

        console.log("Fetching result for interview:", id);

        const res = await api.get(`/interview/${id}`);

        console.log("Interview result:", res.data);

        setInterview(res.data);
      } catch (err) {
        console.error("Failed to fetch result:", err);

        setError(
          err.response?.data?.message ||
          "Failed to load interview result."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  if (loading) {
    return <h2>Loading Result...</h2>;
  }

  if (error) {
    return (
      <div>
        <h2>Something went wrong</h2>
        <p>{error}</p>

        <button onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!interview) {
    return <h2>Interview not found.</h2>;
  }

  return (
    <div>
      <h1>Interview Result</h1>

      <h2>
        Overall Score: {interview.score}/100
      </h2>

      <h3>
        Technical: {interview.technicalScore}/100
      </h3>

      <h3>
        Communication: {interview.communicationScore}/100
      </h3>

      <h3>
        Confidence: {interview.confidenceScore}/100
      </h3>

      <hr />

      <h2>Overall Feedback</h2>

      <p>
        {interview.overallFeedback || "No feedback available."}
      </p>

      <hr />

      <h2>Strengths</h2>

      {interview.strengths?.length > 0 ? (
        <ul>
          {interview.strengths.map((strength, index) => (
            <li key={index}>{strength}</li>
          ))}
        </ul>
      ) : (
        <p>No strengths available.</p>
      )}

      <hr />

      <h2>Weaknesses</h2>

      {interview.weaknesses?.length > 0 ? (
        <ul>
          {interview.weaknesses.map((weakness, index) => (
            <li key={index}>{weakness}</li>
          ))}
        </ul>
      ) : (
        <p>No weaknesses available.</p>
      )}

      <hr />

      <h2>Question Review</h2>

      {interview.questionsList?.map((item, index) => (
        <div key={item._id || index}>
          <h3>Question {index + 1}</h3>

          <p>
            <strong>Question:</strong>
          </p>

          <p>{item.question}</p>

          <p>
            <strong>Your Answer:</strong>
          </p>

          <p>
            {item.answer || "Not answered"}
          </p>

          <p>
            <strong>Score:</strong>{" "}
            {item.score}/100
          </p>

          <p>
            <strong>AI Feedback:</strong>
          </p>

          <p>
            {item.feedback || "No feedback available."}
          </p>

          <hr />
        </div>
      ))}

      <button onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </button>

    </div>
  );
}

export default Result;