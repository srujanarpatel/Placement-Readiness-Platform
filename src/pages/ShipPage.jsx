import { useEffect, useState } from 'react';
import { Card, CardContent, CardTitle, CardFooter } from '@/components/ui/card';
import { ShieldCheck, Lock, ArrowLeft, Rocket } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';

export default function ShipPage() {
    const [checklist, setChecklist] = useState({});
    const [complete, setComplete] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem('prp_test_checklist');
        if (saved) {
            const parsed = JSON.parse(saved);
            // Based on TestChecklist.jsx, assume all items must be checked (true)
            // We expect 10 items.
            const checkedCount = Object.values(parsed).filter(Boolean).length;
            if (checkedCount >= 10) {
                setComplete(true);
            }
        }
        setLoading(false);
    }, []);

    if (loading) return null;

    if (!complete) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50 flex-col gap-4">
                <Lock className="w-16 h-16 text-gray-400" />
                <h1 className="text-2xl font-bold text-gray-800">Shipment Locked</h1>
                <p className="text-gray-500 max-w-sm text-center">
                    You must pass all 10 tests in the Test Checklist before shipping.
                </p>
                <Link to="/prp/07-test" className="text-indigo-600 font-bold hover:underline flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Go to Checklist
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-8">
            <Card className="max-w-xl w-full text-center p-8 border-indigo-100 shadow-xl bg-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-green-500"></div>
                <CardContent className="flex flex-col items-center gap-6">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 shadow-sm animate-bounce">
                        <Rocket className="w-12 h-12" />
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Ready for Launch!</h1>
                        <p className="text-lg text-gray-600">
                            Congratulations! All 10 persistent tests have passed. <br />
                            Current Version: <strong>v1.2.0 (Pre-Ship)</strong>
                        </p>
                    </div>

                    <div className="bg-green-50 text-green-800 px-6 py-4 rounded-xl border border-green-100 flex items-center gap-3 w-full justify-center">
                        <ShieldCheck className="w-6 h-6" />
                        <span className="font-semibold">Quality Assurance verified.</span>
                    </div>

                    <Link to="/dashboard" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg shadow-md transition transform hover:scale-[1.02] flex items-center justify-center gap-2">
                        Go to Dashboard
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}
