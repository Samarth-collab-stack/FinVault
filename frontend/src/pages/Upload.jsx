import { useState } from "react";
import axios from 'axios';

function Upload() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            setError("Please enter a valid csv file");
            return;
        }
        setLoading(true);
        setError("");
        setSuccess("");
        const formData = new FormData();
        formData.append("file", file);
        
        const token = localStorage.getItem("token");

        try {
            const response = await axios.post(
                "http://localhost:5000/api/upload",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setSuccess(
                `${response.data.count} transactions uploaded successfully`
            );
            setFile(null);
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message);
            } else {
                setError("could not connect to the server");
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <div>
            <h1>Upload Page</h1>
            <p>{file ? file.name : "no file selected"}</p>
            <input type="file"
                accept=".csv"
                onChange={(e) => setFile(e.target.files[0])} />
            {error && (
                <p className="text-red-600">
                    {error}
                </p>
            )}

            {success && (
                <p className="text-green-600">
                    {success}
                </p>
            )}
            <button
                onClick={handleSubmit}
                disabled={loading}
            >
                {loading ? "Uploading..." : "Upload"}
            </button>
        </div>
    );
}
export default Upload;