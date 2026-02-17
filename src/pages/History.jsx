import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight, Trash2, AlertTriangle } from 'lucide-react';

export default function History() {
    const [history, setHistory] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        try {
            const rawData = localStorage.getItem('placement_history');
            if (!rawData) {
                setHistory([]);
                return;
            }
            const data = JSON.parse(rawData);
            if (!Array.isArray(data)) {
                throw new Error("Invalid history format");
            }
            // Filter out corrupted entries without essential fields
            const validData = data.filter(item => item && item.id && item.createdAt);

            if (validData.length < data.length) {
                console.warn(`${data.length - validData.length} corrupted history entries were skipped.`);
            }

            setHistory(validData);
        } catch (err) {
            console.error("Failed to load history:", err);
            setError("Could not load saved history due to data corruption.");
            // Optional: reset history if completely broken?
            // localStorage.removeItem('placement_history');
        }
    }, []);

    const clearHistory = () => {
        if (confirm("Are you sure you want to clear all analysis history?")) {
            localStorage.removeItem('placement_history');
            setHistory([]);
            setError(null);
        }
    };

    return (
        <div className="space-y-8 pb-20">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Analysis History</h2>
                    <p className="text-gray-500 mt-2">Saved job descriptions and preparation plans.</p>
                </div>
                {history.length > 0 &&
                    <button onClick={clearHistory} className="text-red-500 text-sm hover:underline flex items-center gap-1">
                        <Trash2 className="w-4 h-4" /> Clear All
                    </button>
                }
            </div>

            {error && (
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 text-amber-700 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    <span>{error} <button onClick={clearHistory} className="underline font-bold ml-2">Reset Data</button></span>
                </div>
            )}

            {history.length === 0 && !error ? (
                <div className="text-center p-12 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-400">No History Yet</h3>
                    <Link to="/dashboard/scanner" className="mt-4 inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition">
                        Start First Scan
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {history.map((item) => {
                        // Safe access to score (handle legacy vs new)
                        const score = item.finalScore !== undefined ? item.finalScore : (item.readinessScore || item.baseScore || 0);
                        const companyName = item.company || "Unknown Company";
                        const roleName = item.role || "General Role";

                        return (
                            <Link to={`/dashboard/results/${item.id}`} key={item.id} className="block group">
                                <Card className="hover:shadow-md transition border-gray-100 hover:border-indigo-100 h-full">
                                    <CardHeader className="pb-3">
                                        <div className="flex justify-between items-start">
                                            <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 font-bold text-lg mb-2">
                                                {companyName.charAt(0).toUpperCase()}
                                            </div>
                                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${score > 70 ? 'bg-green-100 text-green-700' : 'bg-amber-50 text-amber-600'}`}>
                                                {score}%
                                            </span>
                                        </div>
                                        <CardTitle className="text-lg text-gray-800 group-hover:text-indigo-600 transition truncate" title={roleName}>{roleName}</CardTitle>
                                        <p className="text-sm text-gray-500 truncate">{companyName}</p>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between text-xs text-gray-400 mt-4 pt-4 border-t border-gray-50">
                                            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                            <span className="flex items-center gap-1 group-hover:translate-x-1 transition text-indigo-400 font-medium">
                                                View Report <ArrowRight className="w-3 h-3" />
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
