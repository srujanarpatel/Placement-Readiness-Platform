import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge, Check, ChevronRight, Copy, Download, AlertCircle, Building2, Users, Target, Clock, Info } from 'lucide-react';

export default function AnalysisResults() {
    const { id } = useParams();
    const [result, setResult] = useState(null);
    const [confidenceMap, setConfidenceMap] = useState({});
    const [dynamicScore, setDynamicScore] = useState(0);

    useEffect(() => {
        try {
            const history = JSON.parse(localStorage.getItem('placement_history') || '[]');
            const found = history.find(entry => entry.id === id);

            if (found) {
                setResult(found);

                // Handle schema migration or missing fields gracefully
                const initialMap = found.skillConfidenceMap || {};

                // Robust skill aggregation
                let allSkills = [];
                if (found.extractedSkills) {
                    // Support both old object-of-arrays and new structure
                    allSkills = Object.values(found.extractedSkills).flat();
                }

                allSkills.forEach(skill => {
                    if (!initialMap[skill]) {
                        initialMap[skill] = 'practice';
                    }
                });

                setConfidenceMap(initialMap);

                // Use finalScore if available, else recalculate from base
                const scoreToUse = found.finalScore !== undefined ? found.finalScore : found.readinessScore || found.baseScore;

                // If we have a saved final score, use it. But we should also verify it aligns with current map if needed.
                // For simplicity, let's recalculate dynamic score based on current map to ensure consistency.
                calculateScore(found.baseScore || found.readinessScore || 35, initialMap);
            } else if (history.length > 0) {
                // Fallback if ID invalid
                // Don't auto-redirect, just show error or let user choose from history
            }
        } catch (e) {
            console.error("Failed to load analysis results", e);
        }
    }, [id]);

    const calculateScore = (baseScore, map) => {
        let adjustment = 0;
        Object.values(map).forEach(status => {
            if (status === 'know') adjustment += 2;
            // 'practice' is neutral/negative depending on desired baseline. 
            // Previous logic: +2 for know, -2 for practice. 
            if (status === 'practice') adjustment -= 2;
        });

        let newScore = baseScore + adjustment;
        if (newScore > 100) newScore = 100;
        if (newScore < 0) newScore = 0;

        setDynamicScore(newScore);
        return newScore;
    };

    const handleToggleSkill = (skill) => {
        const newStatus = confidenceMap[skill] === 'know' ? 'practice' : 'know';
        const newMap = { ...confidenceMap, [skill]: newStatus };
        setConfidenceMap(newMap);

        const newScore = calculateScore(result.baseScore || result.readinessScore, newMap);

        // Persist to history
        const history = JSON.parse(localStorage.getItem('placement_history') || '[]');
        const updatedHistory = history.map(entry => {
            if (entry.id === result.id) {
                return {
                    ...entry,
                    skillConfidenceMap: newMap,
                    finalScore: newScore,
                    updatedAt: new Date().toISOString()
                };
            }
            return entry;
        });
        localStorage.setItem('placement_history', JSON.stringify(updatedHistory));
    };

    const copyToClipboard = (text, label) => {
        navigator.clipboard.writeText(text);
        alert(`${label} copied to clipboard!`);
    };

    const generateDownloadText = () => {
        if (!result) return "";
        return `
PLACEMENT READINESS REPORT
Role: ${result.role}
Company: ${result.company}
Date: ${new Date(result.createdAt).toLocaleDateString()}
Score: ${dynamicScore}/100

DETECTED SKILLS:
${Object.entries(result.extractedSkills).map(([cat, skills]) => skills.length ? `${cat.toUpperCase()}: ${skills.join(', ')}` : '').filter(Boolean).join('\n')}

7-DAY PREP PLAN:
${Array.isArray(result.plan7Days)
                ? result.plan7Days.map(d => `${d.day} (${d.focus}):\n${d.tasks.map(t => `- ${t}`).join('\n')}`).join('\n\n')
                : "Plan data format outdated. Please re-scan."
            }

INTERVIEW QUESTIONS:
${result.questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

CHECKLIST:
${Array.isArray(result.checklist)
                ? result.checklist.map(r => `${r.roundTitle}:\n${r.items.map(i => `- ${i}`).join('\n')}`).join('\n\n')
                : Object.entries(result.checklist).map(([round, items]) => `${round.toUpperCase()}:\n${items.map(i => `- ${i}`).join('\n')}`).join('\n\n')
            }
     `;
    };

    const downloadReport = () => {
        const element = document.createElement("a");
        const file = new Blob([generateDownloadText()], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `Placement_Plan_${result.company}_${result.role}.txt`;
        document.body.appendChild(element);
        element.click();
    };

    // Get top 3 weak skills for "Action Next"
    const weakSkills = Object.entries(confidenceMap)
        .filter(([_, status]) => status === 'practice')
        .map(([skill]) => skill)
        .slice(0, 3);

    if (!result) return <div className="p-8 text-center text-gray-500">Analysis Not Found. <Link to="/dashboard/scanner" className="text-indigo-600 underline">Start New Scan</Link></div>;

    return (
        <div className="space-y-8 pb-20">

            {/* Header Summary with Live Score */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border border-indigo-50 shadow-sm transition-all">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h1 className="text-2xl font-bold text-gray-900">{result.role}</h1>
                        <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-0.5 rounded-full font-medium">@ {result.company}</span>
                    </div>
                    <p className="text-gray-500 text-sm">
                        Analyzed: {new Date(result.createdAt).toLocaleDateString()}
                        {result.updatedAt && result.updatedAt !== result.createdAt && <span className="ml-2 text-xs italic text-gray-400">(Updated: {new Date(result.updatedAt).toLocaleDateString()})</span>}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Live Readiness</div>
                        <div className={`text-3xl font-extrabold ${dynamicScore > 70 ? 'text-green-600' : 'text-indigo-600'} transition-all duration-300`}>{dynamicScore}/100</div>
                    </div>
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 ${dynamicScore > 70 ? 'border-green-500 text-green-700' : 'border-amber-400 text-amber-600'} font-bold text-xl transition-all duration-500`}>
                        {dynamicScore}%
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Skills & Questions */}
                <div className="lg:col-span-1 space-y-8">

                    {/* COMPANY INTEL (New Feature) */}
                    {result.companyIntel && (
                        <Card className="bg-indigo-900 text-white border-0 shadow-md relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3 opacity-10">
                                <Building2 className="w-24 h-24" />
                            </div>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-indigo-100">
                                    <Building2 className="w-5 h-5" /> Company Intelligence
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-1">
                                    <div className="text-xs text-indigo-300 uppercase font-bold">Industry</div>
                                    <div className="font-semibold">{result.companyIntel.industry}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-xs text-indigo-300 uppercase font-bold">Size Category</div>
                                    <div className="font-semibold flex items-center gap-2">
                                        <Users className="w-4 h-4" /> {result.companyIntel.size}
                                    </div>
                                </div>
                                <div className="space-y-1 pt-2 border-t border-indigo-700/50">
                                    <div className="text-xs text-indigo-300 uppercase font-bold">Hiring Focus</div>
                                    <div className="text-sm leading-relaxed text-indigo-100">{result.companyIntel.focus}</div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Skills Interactive */}
                    <Card className="bg-white border-indigo-50">
                        <CardHeader>
                            <CardTitle>Skills Self-Assessment</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-xs text-gray-500 mb-2">Click tags to toggle status.</p>
                            {Object.entries(result.extractedSkills).map(([cat, skills]) =>
                                skills.length > 0 && (
                                    <div key={cat}>
                                        <h4 className="text-xs font-bold text-gray-400 uppercase mb-2 ml-1">{cat === 'coreCS' ? 'Core CS' : cat}</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {skills.map(s => (
                                                <button
                                                    key={s}
                                                    onClick={() => handleToggleSkill(s)}
                                                    className={`px-3 py-1 rounded-full text-xs font-bold border transition-all flex items-center gap-1 ${confidenceMap[s] === 'know'
                                                            ? 'bg-green-100 text-green-700 border-green-200'
                                                            : 'bg-indigo-50 text-indigo-700 border-indigo-100 opacity-80'
                                                        }`}
                                                >
                                                    {confidenceMap[s] === 'know' && <Check className="w-3 h-3" />}
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )
                            )}
                            {Object.values(result.extractedSkills).flat().length === 0 && (
                                <p className="text-sm text-gray-400 italic">No specific tech stack detected.</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Questions with Export */}
                    <Card className="bg-white border-indigo-50">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Interview Questions</CardTitle>
                            <button onClick={() => copyToClipboard(result.questions.join('\n'), 'Questions')} className="text-gray-400 hover:text-indigo-600">
                                <Copy className="w-4 h-4" />
                            </button>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {result.questions.map((q, i) => (
                                    <li key={i} className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100 italic">
                                        "{q}"
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Plan & Checklist */}
                <div className="lg:col-span-2 space-y-8">

                    {/* ROUND MAPPING (New Feature) */}
                    {result.roundMapping && (
                        <div className="bg-white p-6 rounded-xl border border-indigo-50 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <Target className="w-5 h-5 text-indigo-600" /> Typical Interview Flow
                            </h3>
                            <div className="relative pl-4 border-l-2 border-indigo-100 space-y-8">
                                {result.roundMapping.map((round, idx) => (
                                    <div key={idx} className="relative">
                                        {/* Dot for timeline */}
                                        <div className="absolute -left-[23px] top-1 w-4 h-4 rounded-full bg-indigo-600 border-4 border-white shadow-sm"></div>

                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                            <div>
                                                <h4 className="font-bold text-indigo-900 text-md">{round.roundTitle || round.name}</h4>
                                                <p className="text-indigo-600 font-medium text-sm">{round.focusAreas ? round.focusAreas.join(" + ") : round.focus}</p>
                                            </div>
                                            <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 max-w-sm italic border border-gray-100">
                                                <span className="font-semibold text-gray-400 text-xs uppercase block mb-1">Why this round?</span>
                                                "{round.whyItMatters || round.why}"
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action Next Box */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-xl p-6 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div className="bg-white/20 p-3 rounded-full">
                                <AlertCircle className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Next Priority Action</h3>
                                <p className="text-indigo-100 text-sm max-w-md">
                                    {weakSkills.length > 0
                                        ? `Focus on improving: ${weakSkills.join(', ')}.`
                                        : "You're looking strong! Review the checklists."}
                                    {" Start with Day 1 of your plan."}
                                </p>
                            </div>
                        </div>
                        <button className="bg-white text-indigo-700 px-6 py-2 rounded-lg font-bold hover:bg-indigo-50 transition shadow-sm whitespace-nowrap">
                            Start Prep Now
                        </button>
                    </div>

                    {/* 7-Day Plan with Export */}
                    <Card className="bg-white border-indigo-50">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>7-Day Preparation Strategy</CardTitle>
                            <button onClick={() => copyToClipboard(JSON.stringify(result.plan7Days || result.plan, null, 2), 'Plan')} className="text-gray-400 hover:text-indigo-600">
                                <Copy className="w-4 h-4" />
                            </button>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Backward compatibility check */}
                                {Array.isArray(result.plan7Days) ? (
                                    result.plan7Days.map((dayPlan, idx) => (
                                        <div key={idx} className={`p-4 rounded-lg border-l-4 ${idx % 2 === 0 ? 'bg-indigo-50 border-indigo-500' : 'bg-purple-50 border-purple-500'} ${(idx === result.plan7Days.length - 1) ? 'md:col-span-2 bg-green-50 border-green-500' : ''}`}>
                                            <h4 className={`font-bold mb-1 ${idx % 2 === 0 ? 'text-indigo-900' : 'text-purple-900'}`}>{dayPlan.day}</h4>
                                            <div className="text-xs font-bold uppercase tracking-wide opacity-70 mb-2">{dayPlan.focus}</div>
                                            <ul className="list-disc pl-4 text-sm text-gray-700 space-y-1">
                                                {dayPlan.tasks.map((t, i) => <li key={i}>{t}</li>)}
                                            </ul>
                                        </div>
                                    ))
                                ) : (
                                    // Fallback for old schema
                                    Object.entries(result.plan).map(([day, text]) => (
                                        <div key={day} className="p-4 bg-gray-50 rounded-lg border-l-4 border-gray-400">
                                            <h4 className="font-bold text-gray-900 mb-1">{day}</h4>
                                            <p className="text-sm text-gray-800">{text}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Checklist with Export */}
                    <Card className="bg-white border-indigo-50">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Round-wise Checklist</CardTitle>
                            <div className="flex gap-2">
                                <button onClick={() => copyToClipboard(JSON.stringify(result.checklist, null, 2), 'Checklist')} className="text-gray-400 hover:text-indigo-600" title="Copy Checklist">
                                    <Copy className="w-4 h-4" />
                                </button>
                                <button onClick={downloadReport} className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 text-xs font-bold bg-indigo-50 px-3 py-1 rounded-md" title="Download Report">
                                    <Download className="w-3 h-3" /> Download Report
                                </button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {Array.isArray(result.checklist) ? (
                                result.checklist.map((round, idx) => (
                                    <div key={idx}>
                                        <h3 className="text-md font-bold text-gray-800 mb-3 flex items-center capitalize">
                                            <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs mr-2">{idx + 1}</span>
                                            {round.roundTitle}
                                        </h3>
                                        <ul className="pl-8 space-y-2">
                                            {round.items.map((item, i) => (
                                                <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                                                    <div className="mt-1 min-w-[16px] min-h-[16px] border border-gray-300 rounded flex items-center justify-center"></div>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))
                            ) : (
                                // Fallback for old schema
                                Object.entries(result.checklist).map(([round, items], idx) => (
                                    <div key={round}>
                                        <h3 className="text-md font-bold text-gray-800 mb-3 flex items-center capitalize">
                                            <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs mr-2">{idx + 1}</span>
                                            {round.replace(/(\d)/, ' $1')}
                                        </h3>
                                        <ul className="pl-8 space-y-2">
                                            {items.map((item, i) => (
                                                <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                                                    <div className="mt-1 min-w-[16px] min-h-[16px] border border-gray-300 rounded flex items-center justify-center"></div>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    <div className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
                        <Info className="w-3 h-3" /> Demo Mode: Company intel generated heuristically.
                    </div>
                </div>
            </div>
        </div>
    );
}
