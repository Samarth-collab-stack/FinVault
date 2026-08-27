import { useState } from "react";
import axios from "axios";

function Upload() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const hours = new Date().getHours();
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
        <div className="min-h-screen bg-[#fffefc] text-[#171B22]">
            <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-10">

                {/* HEADER */}
                <header className="border-b border-[#E4E1D8] pb-7">
                    <div className="flex items-start gap-4">
                        <div>
                            <h1 className="text-3xl font-semibold tracking-tight text-[#171B22] sm:text-4xl">
                              Import transactions
                            </h1>

                            <p className="mt-2 max-w-xl text-sm leading-6 text-[#171B22]/60">
                                Upload a CSV file to add your transaction history
                                to FinVault.
                            </p>
                        </div>
                    </div>
                </header>

                {/* UPLOAD AREA */}
                <main className="mt-8">
                    <section className="grid grid-cols-1 gap-5 lg:grid-cols-[1.5fr_1fr]">

                        {/* FILE UPLOAD CARD */}
                        <div className="border border-[#E4E1D8] bg-white p-6 sm:p-8">

                            <div className="border-b border-[#E4E1D8] pb-5">
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#171B22]/45">
                                    Transaction import
                                </p>

                                <p className="mt-1 text-sm text-[#171B22]/50">
                                    Select a CSV file containing your transactions.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="mt-7">

                                {/* FILE SELECTOR */}
                                <label
                                    htmlFor="csv-upload"
                                    className="group block cursor-pointer border border-dashed border-[#D8D5CC] bg-[#FAF9F6] px-6 py-12 text-center transition-colors hover:border-[#B8925A]"
                                >
                                    <div className="mx-auto flex h-12 w-12 items-center justify-center border border-[#E4E1D8] bg-white">
                                        <svg
                                            width="22"
                                            height="22"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="#B8925A"
                                            strokeWidth="1.5"
                                            aria-hidden="true"
                                        >
                                            <path d="M12 16V4" />
                                            <path d="M7 9l5-5 5 5" />
                                            <path d="M4 20h16" />
                                        </svg>
                                    </div>

                                    <p className="mt-5 text-sm font-medium text-[#171B22]">
                                        {file
                                            ? file.name
                                            : "Select a CSV file"}
                                    </p>

                                    <p className="mt-2 text-xs text-[#171B22]/45">
                                        {file
                                            ? "File selected and ready to upload"
                                            : "CSV files only"}
                                    </p>

                                    <span className="mt-5 inline-block border border-[#D8D5CC] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#171B22]/65 group-hover:border-[#B8925A] group-hover:text-[#B8925A]">
                                        Browse file
                                    </span>

                                    <input
                                        id="csv-upload"
                                        type="file"
                                        accept=".csv"
                                        onChange={(e) => {
                                            setFile(e.target.files[0]);
                                            setError("");
                                            setSuccess("");
                                        }}
                                        className="sr-only"
                                    />
                                </label>

                                {/* STATUS */}
                                {error && (
                                    <div className="mt-5 border border-[#B23B3B]/20 bg-[#B23B3B]/5 px-4 py-3">
                                        <div className="flex items-start gap-3">
                                            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#B23B3B]" />

                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#B23B3B]">
                                                    Upload failed
                                                </p>

                                                <p className="mt-1 text-sm text-[#171B22]/65">
                                                    {error}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {success && (
                                    <div className="mt-5 border border-[#1F6F54]/20 bg-[#1F6F54]/5 px-4 py-3">
                                        <div className="flex items-start gap-3">
                                            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#1F6F54]" />

                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#1F6F54]">
                                                    Upload complete
                                                </p>

                                                <p className="mt-1 text-sm text-[#171B22]/65">
                                                    {success}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* UPLOAD BUTTON */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="mt-6 w-full border border-[#171B22] bg-[#171B22] px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#2A3038] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {loading
                                        ? "Uploading..."
                                        : "Upload transactions"}
                                </button>
                            </form>
                        </div>

                        {/* INFORMATION CARD */}
                        <div className="border border-[#E4E1D8] bg-white p-6 sm:p-8">

                            <div className="flex items-start gap-4 border-b border-[#E4E1D8] pb-5">
                                {/* Brand */}
                                <img
                                    src="/FinVault-logo.png"
                                    alt="FinVault"
                                    className="h-10 w-auto"
                                />

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#171B22]/45">
                                        Import guide
                                    </p>

                                    <p className="mt-1 text-sm text-[#171B22]/50">
                                        Keep your transaction data structured.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 space-y-6">

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#171B22]/45">
                                        File format
                                    </p>

                                    <p className="mt-2 text-sm leading-6 text-[#171B22]/65">
                                        Upload your transaction history as a
                                        comma-separated values file.
                                    </p>
                                </div>

                                <div className="border-t border-[#E4E1D8] pt-5">
                                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#171B22]/45">
                                        Supported file
                                    </p>

                                    <div className="mt-3 flex items-center justify-between border border-[#E4E1D8] bg-[#FAF9F6] px-4 py-3">
                                        <span className="text-sm font-medium text-[#171B22]">
                                            CSV
                                        </span>

                                        <span className="text-xs text-[#171B22]/45">
                                            .csv
                                        </span>
                                    </div>
                                </div>

                                <div className="border-t border-[#E4E1D8] pt-5">
                                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#171B22]/45">
                                        After upload
                                    </p>

                                    <p className="mt-2 text-sm leading-6 text-[#171B22]/65">
                                        Your transactions will be available
                                        on the dashboard for analysis and
                                        management.
                                    </p>
                                </div>

                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}

export default Upload;