import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Check, AlertTriangle, RefreshCw, Lock, Unlock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const TEST_ITEMS = [
    { id: 1, label: "JD required validation works", hint: "Submit empty form -> see error." },
    { id: 2, label: "Short JD warning shows for <200 chars", hint: "Paste short text -> see amber warning." },
    { id: 3, label: "Skills extraction groups correctly", hint: "Verify 'React' goes to Web, 'Java' to Core/Lang." },
    { id: 4, label: "Round mapping changes based on company + skills", hint: "Compare 'Google' (4 rounds) vs 'Unknown' (3 rounds)." },
    { id: 5, label: "Score calculation is deterministic", hint: "Same JD should always yield same base score." },
    { id: 6, label: "Skill toggles update score live", hint: "Toggle skills on Results page -> score changes." },
    { id: 7, label: "Changes persist after refresh", hint: "Refresh Results page -> toggles remain." },
    { id: 8, label: "History saves and loads correctly", hint: "Check History page -> see new entry." },
    { id: 9, label: "Export buttons copy the correct content", hint: "Click Copy -> Convert JSON/Text -> Verify paste." },
    { id: 10, label: "No console errors on core pages", hint: "Open DevTools -> Check Console." }
];

export default function TestChecklist() {
    const [checkedItems, setCheckedItems] = useState({});
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const saved = localStorage.getItem('prp_test_checklist');
        if (saved) {
            setCheckedItems(JSON.parse(saved));
        }
    }, []);

    const handleToggle = (id) => {
        const newState = { ...checkedItems, [id]: !checkedItems[id] };
        setCheckedItems(newState);
        localStorage.setItem('prp_test_checklist', JSON.stringify(newState));
    };

    const handleReset = () => {
        if (confirm("Reset all test progress?")) {
            setCheckedItems({});
            localStorage.removeItem('prp_test_checklist');
        }
    };

    const completedCount = Object.values(checkedItems).filter(Boolean).length;
    const isComplete = completedCount === TEST_ITEMS.length;
    const progress = (completedCount / TEST_ITEMS.length) * 100;

    if (!isClient) return null;

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <Card className="max-w-2xl w-full bg-white shadow-xl border-indigo-100">
                <CardHeader className="border-b border-gray-100 bg-white sticky top-0 z-10 rounded-t-xl">
                    <div className="flex justify-between items-center mb-2">
                        <CardTitle className="text-2xl font-bold text-gray-900">Pre-Shipment Test Checklist</CardTitle>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${isComplete ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                            {completedCount} / {TEST_ITEMS.length} Passed
                        </span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-500 ${isComplete ? 'bg-green-500' : 'bg-indigo-500'}`}
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    {!isComplete && (
                        <div className="mt-3 flex items-center gap-2 text-amber-600 text-sm font-medium bg-amber-50 p-2 rounded-md">
                            <AlertTriangle className="w-4 h-4" /> Fix issues before shipping.
                        </div>
                    )}
                </CardHeader>

                <CardContent className="p-0">
                    <div className="divide-y divide-gray-100">
                        {TEST_ITEMS.map((item) => (
                            <div
                                key={item.id}
                                className={`p-4 flex items-start gap-4 hover:bg-gray-50 transition cursor-pointer ${checkedItems[item.id] ? 'opacity-75' : ''}`}
                                onClick={() => handleToggle(item.id)}
                            >
                                <div className={`mt-1 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${checkedItems[item.id] ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-300 bg-white'}`}>
                                    {checkedItems[item.id] && <Check className="w-4 h-4" />}
                                </div>
                                <div className="flex-1">
                                    <h3 className={`font-medium text-gray-900 ${checkedItems[item.id] ? 'line-through text-gray-500' : ''}`}>{item.label}</h3>
                                    <p className="text-sm text-gray-500 mt-1">{item.hint}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>

                <CardFooter className="bg-gray-50 border-t border-gray-100 p-6 flex justify-between items-center">
                    <button
                        onClick={handleReset}
                        className="text-gray-500 hover:text-gray-700 text-sm font-medium flex items-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" /> Reset Checklist
                    </button>

                    {isComplete ? (
                        <Link to="/prp/08-ship" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold shadow-md flex items-center gap-2 transition-transform active:scale-95">
                            <Unlock className="w-4 h-4" /> Ready to Ship <ArrowRight className="w-4 h-4" />
                        </Link>
                    ) : (
                        <button disabled className="bg-gray-300 text-gray-500 px-6 py-2 rounded-lg font-bold flex items-center gap-2 cursor-not-allowed">
                            <Lock className="w-4 h-4" /> Locked: Ship 08
                        </button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
