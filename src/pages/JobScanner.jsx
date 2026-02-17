import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { analyzeJobDescription } from '@/utils/analyzer';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertTriangle } from 'lucide-react';

export default function JobScanner() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onSubmit = (data) => {
        setLoading(true);
        setTimeout(() => {
            const analysis = analyzeJobDescription(data.jdText, data.company || "Unknown Company", data.role || "General Role");

            // Persist to history
            const existingHistory = JSON.parse(localStorage.getItem('placement_history') || '[]');
            const newHistory = [analysis, ...existingHistory];
            localStorage.setItem('placement_history', JSON.stringify(newHistory));

            setLoading(false);
            navigate(`/dashboard/results/${analysis.id}`);
        }, 1500); // Simulate processing
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-gray-900">Job Description Scanner</h2>
                <p className="text-gray-500 mt-2">Analyze any JD to get a personalized prep plan instantly.</p>
            </div>

            <Card className="bg-white border-indigo-50 shadow-sm">
                <CardHeader>
                    <CardTitle>Enter Job Details</CardTitle>
                    <CardDescription>Paste the job description below to start analysis.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Company Name <span className="text-gray-400 font-normal">(Optional)</span></label>
                                <input
                                    {...register("company")}
                                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                    placeholder="e.g. Amazon, Google, Startup Inc."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Role / Title <span className="text-gray-400 font-normal">(Optional)</span></label>
                                <input
                                    {...register("role")}
                                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                    placeholder="e.g. SDE-1, Frontend Developer"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Job Description (full text) <span className="text-red-500">*</span></label>
                            <textarea
                                {...register("jdText", {
                                    required: "Please paste the Job Description",
                                    minLength: { value: 60, message: "JD is too short to analyze" },
                                    validate: {
                                        checkLength: (value) => value.length > 200 || "This JD is too short to analyze deeply. Paste full JD for better output."
                                    }
                                })}
                                className="w-full p-3 border border-gray-200 rounded-lg h-48 focus:ring-2 focus:ring-indigo-500 outline-none transition resize-none"
                                placeholder="Paste the full job description here..."
                            ></textarea>
                            {errors.jdText && (
                                <p className={`text-xs mt-1 flex items-center gap-1 ${errors.jdText.type === 'checkLength' ? 'text-amber-600' : 'text-red-500'}`}>
                                    {errors.jdText.type === 'checkLength' && <AlertTriangle className="w-3 h-3" />}
                                    {errors.jdText.message}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition shadow-md flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : "Analyze Job Profile"}
                        </button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
