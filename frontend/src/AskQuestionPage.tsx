// AskQuestionPage.tsx: Component for asking a question
import axios from 'axios';
import { useState } from 'react';
import { useIndex } from './IndexContext';

const AskQuestionPage: React.FC = () => {
  const {setRadiusMultiplier} = useIndex();
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [index, setIndex] = useState<number | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    setLoading(true); // Show loading animation
    try {
      const response = await axios.post<{ answer: string, index:string }>('https://us-central1-gpt-saver-31c4d.cloudfunctions.net/askQuestion', {
        question: question,
      });
      setAnswer(response.data.answer);
      setIndex(Number(response.data.index));
      setRadiusMultiplier(Number(response.data.index));
    } catch (error) {
      console.error("Error fetching answer:", error);
      setAnswer("An error occurred while fetching the answer. Please try again later.");
    } finally {
      setLoading(false); // Hide loading animation
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-1 border border-gray-100 w-[100vw]"> 
      <h1 className="text-3xl font-bold mb-4 text-white">What's on your mind?</h1>
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="What's on your mind?"
        className="p-2 border border-gray-300 rounded mb-4 w-[80%] h-[10vh]"
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-600"
      >
        {loading ? 'Loading...' : 'Get Answer'}
      </button>
      {answer && ( // Conditionally render the answer section
        <div className="w-[80%] text-center">
          <h2 className="text-2xl font-semibold mb-2">Answer:</h2>
          <p className="p-4 border border-gray-200 rounded bg-gray-50">{answer} {index}</p>
        </div>
      )}
    </div>
  );
};
export default AskQuestionPage;
