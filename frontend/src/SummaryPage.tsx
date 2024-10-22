// SummaryPage.tsx: Component for displaying all saved GPT answers
import axios from 'axios';
import { useState, useEffect } from 'react';

const SummaryPage: React.FC = () => {
  const [answers, setAnswers] = useState<{ question: string, answer: string, index?: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchSavedAnswers = async () => {
    setLoading(true);
    try {
      const response = await axios.get<{ question: string, answer: string, index?: string }[]>('https://us-central1-gpt-saver-31c4d.cloudfunctions.net/savedAnswers');
      setAnswers(response.data);
    } catch (error) {
      console.error("Error fetching saved answers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch of saved answers
    fetchSavedAnswers();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 text-white">
      <h1 className="text-3xl font-bold mb-4">Saved Answers</h1>
      <button
        onClick={fetchSavedAnswers}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-6 hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? 'Updating...' : 'Update Answers'}
      </button>
      <div className="w-1/2">
        <ul className="list-disc list-inside">
          {answers.map((item, index) => (
            <li key={index} className="mb-4">
              <h3 className="text-lg font-semibold">Question:</h3>
              <p className="mb-2">{item.question}</p>
              <h3 className="text-lg font-semibold">Answer:</h3>
              <p className="mb-2">{item.answer}</p>
              {item.index && (
                <h3 className="text-lg font-semibold">index:</h3>
              )}
              {item.index && <span className="text-sm text-white">{item.index}</span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SummaryPage;
