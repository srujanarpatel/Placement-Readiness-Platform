import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Check, AlertTriangle, ExternalLink, Copy, Rocket, ShieldCheck, X } from 'lucide-react';

const STEPS = [
    { id: 1, label: "Project Setup & Routing" },
    { id: 2, label: "Job Scanner UI Implementation" },
    { id: 3, label: "Analysis Logic (Analyzer Engine)" },
    { id: 4, label: "Results Display & Design" },
    { id: 5, label: "Persistence Integration (History)" },
    { id: 6, label: "Interactive Features (Score/Skills)" },
    { id: 7, label: "Advanced Intel (Company/Rounds)" },
    { id: 8, label: "Validation & Edge Case Handling" }
];

export default function ProofPage() {
    const [stepsStatus, setStepsStatus] = useState({});
    const [links, setLinks] = useState({
        lovable: '',
        github: '',
        deployed: ''
    });
    const [testStatus, setTestStatus] = useState({ passed: 0, total: 10 });
    const [errors, setErrors] = useState({});
    const [isShipped, setIsShipped] = useState(false);

    useEffect(() => {
        // Load steps status
        const savedSteps = localStorage.getItem('prp_steps_status');
        if (savedSteps) setStepsStatus(JSON.parse(savedSteps));

        // Load links
        const savedLinks = localStorage.getItem('prp_final_submission');
        if (savedLinks) setLinks(JSON.parse(savedLinks));

        // Check tests status
        const savedTests = localStorage.getItem('prp_test_checklist');
        if (savedTests) {
            const parsed = JSON.parse(savedTests);
            const passedCount = Object.values(parsed).filter(Boolean).length;
            setTestStatus({ passed: passedCount, total: 10 });
        }
    }, []);

    useEffect(() => {
        checkShippedStatus();
    }, [stepsStatus, links, testStatus]);

    const checkShippedStatus = () => {
        const allSteps = STEPS.every(s => stepsStatus[s.id]);
        const allTests = testStatus.passed === 10;
        const allLinks = validateUrl(links.lovable) && validateUrl(links.github) && validateUrl(links.deployed);

        setIsShipped(allSteps && allTests && allLinks);
    };

    const validateUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const handleStepToggle = (id) => {
        const newStatus = { ...stepsStatus, [id]: !stepsStatus[id] };
        setStepsStatus(newStatus);
        localStorage.setItem('prp_steps_status', JSON.stringify(newStatus));
    };

    const handleLinkChange = (e) => {
        const { name, value } = e.target;
        setLinks(prev => {
            const updated = { ...prev, [name]: value };
            localStorage.setItem('prp_final_submission', JSON.stringify(updated));
            return updated;
        });

        // Validate on change
        if (value && !validateUrl(value)) {
            setErrors(prev => ({ ...prev, [name]: "Invalid URL" }));
        } else {
            setErrors(prev => {
                const newErr = { ...prev };
                delete newErr[name];
                return newErr;
            });
        }
    };

    const copySubmission = () => {
        if (!links.lovable || !links.github || !links.deployed) {
            alert("Please fill in all links first.");
            return;
        }

        const text = `
------------------------------------------
Placement Readiness Platform — Final Submission

Lovable Project: ${links.lovable}
GitHub Repository: ${links.github}
Live Deployment: ${links.deployed}

Core Capabilities:
- JD skill extraction (deterministic)
- Round mapping engine
- 7-day prep plan
- Interactive readiness scoring
- History persistence
------------------------------------------
`.trim();

        navigator.clipboard.writeText(text);
        alert("Submission copied to clipboard!");
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">

            {/* Header Status Badge */}
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Project Proof & Submission</h1>
                <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-full text-lg font-bold shadow-sm transition-all duration-500 ${isShipped ? 'bg-green-100 text-green-700 ring-2 ring-green-500' : 'bg-gray-200 text-gray-600'}`}>
                    {isShipped ? <ShieldCheck className="w-6 h-6" /> : <AlertTriangle className="w-5 h-5" />}
                    {isShipped ? "STATUS: SHIPPED" : "STATUS: IN PROGRESS"}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl w-full">

                {/* Left Column: Requirements */}
                <div className="space-y-6">

                    {/* 1. Steps Tracker */}
                    <Card className="border-indigo-50 shadow-sm">
                        <CardHeader>
                            <CardTitle>1. Build Steps Completion</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {STEPS.map(step => (
                                    <div
                                        key={step.id}
                                        onClick={() => handleStepToggle(step.id)}
                                        className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${stepsStatus[step.id] ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100 hover:border-indigo-200'}`}
                                    >
                                        <span className={`text-sm font-medium ${stepsStatus[step.id] ? 'text-green-800' : 'text-gray-600'}`}>
                                            {step.id}. {step.label}
                                        </span>
                                        {stepsStatus[step.id] && <Check className="w-4 h-4 text-green-600" />}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* 2. Test Checklist Status */}
                    <Card className={`border-indigo-50 shadow-sm ${testStatus.passed < 10 ? 'border-amber-200 bg-amber-50/30' : ''}`}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle>2. Quality Assurance Test</CardTitle>
                            <span className={`text-sm font-bold px-2 py-1 rounded ${testStatus.passed === 10 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                {testStatus.passed} / 10 Passed
                            </span>
                        </CardHeader>
                        <CardContent>
                            {testStatus.passed < 10 ? (
                                <div className="text-amber-700 text-sm flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4" />
                                    <span>Tests are incomplete. Go to <a href="/prp/07-test" className="underline font-bold">Checklist</a>.</span>
                                </div>
                            ) : (
                                <div className="text-green-700 text-sm flex items-center gap-2">
                                    <Check className="w-4 h-4" />
                                    <span>All systems operational and verified.</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                </div>

                {/* Right Column: Inputs & Submission */}
                <div className="space-y-6">

                    {/* 3. Artifact Links */}
                    <Card className="border-indigo-50 shadow-sm">
                        <CardHeader>
                            <CardTitle>3. Deployment Artifacts</CardTitle>
                            <p className="text-xs text-gray-500">Provide valid URLs to enable shipping status.</p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">Lovable Project Link</label>
                                <div className="relative">
                                    <input
                                        name="lovable"
                                        value={links.lovable}
                                        onChange={handleLinkChange}
                                        placeholder="https://lovable.dev/..."
                                        className={`w-full p-2 pl-3 pr-10 border rounded-md text-sm outline-none focus:ring-2 transition ${errors.lovable ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-200'}`}
                                    />
                                    {links.lovable && !errors.lovable && <Check className="w-4 h-4 text-green-500 absolute right-3 top-2.5" />}
                                    {errors.lovable && <X className="w-4 h-4 text-red-500 absolute right-3 top-2.5" />}
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">GitHub Repository</label>
                                <div className="relative">
                                    <input
                                        name="github"
                                        value={links.github}
                                        onChange={handleLinkChange}
                                        placeholder="https://github.com/..."
                                        className={`w-full p-2 pl-3 pr-10 border rounded-md text-sm outline-none focus:ring-2 transition ${errors.github ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-200'}`}
                                    />
                                    {links.github && !errors.github && <Check className="w-4 h-4 text-green-500 absolute right-3 top-2.5" />}
                                    {errors.github && <X className="w-4 h-4 text-red-500 absolute right-3 top-2.5" />}
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">Deployed Application URL</label>
                                <div className="relative">
                                    <input
                                        name="deployed"
                                        value={links.deployed}
                                        onChange={handleLinkChange}
                                        placeholder="https://..."
                                        className={`w-full p-2 pl-3 pr-10 border rounded-md text-sm outline-none focus:ring-2 transition ${errors.deployed ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-200'}`}
                                    />
                                    {links.deployed && !errors.deployed && <Check className="w-4 h-4 text-green-500 absolute right-3 top-2.5" />}
                                    {errors.deployed && <X className="w-4 h-4 text-red-500 absolute right-3 top-2.5" />}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Final Actions */}
                    <Card className="border-indigo-50 shadow-lg bg-gradient-to-br from-white to-indigo-50/50">
                        <CardContent className="p-6 space-y-4">
                            {isShipped ? (
                                <div className="bg-green-100 border border-green-200 rounded-lg p-4 text-center animate-in fade-in zoom-in duration-500">
                                    <Rocket className="w-10 h-10 text-green-600 mx-auto mb-2" />
                                    <h3 className="text-lg font-bold text-green-800">You built a real product.</h3>
                                    <p className="text-green-700 text-sm mt-1">
                                        Not a tutorial. Not a clone.<br />
                                        A structured tool that solves a real problem.<br />
                                        <span className="font-semibold block mt-1">This is your proof of work.</span>
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center text-gray-500 text-sm italic p-4">
                                    Complete all steps, pass all tests, and provide artifacts to unlock shipped status.
                                </div>
                            )}

                            <button
                                onClick={copySubmission}
                                className="w-full bg-indigo-900 hover:bg-indigo-800 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]"
                            >
                                <Copy className="w-4 h-4" /> Copy Final Submission
                            </button>
                        </CardContent>
                    </Card>

                </div>

            </div>
        </div>
    );
}
