import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Check, Calendar } from 'lucide-react';

const radarData = [
    { subject: 'DSA', A: 75, fullMark: 100 },
    { subject: 'System Design', A: 60, fullMark: 100 },
    { subject: 'Communication', A: 80, fullMark: 100 },
    { subject: 'Resume', A: 85, fullMark: 100 },
    { subject: 'Aptitude', A: 70, fullMark: 100 },
];

const CircularProgress = ({ value }) => {
    const radius = 60;
    const stroke = 12;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (value / 100) * circumference;

    return (
        <div className="relative flex flex-col items-center justify-center">
            <div className="relative">
                <svg
                    height={radius * 2}
                    width={radius * 2}
                    className="transform -rotate-90"
                >
                    <circle
                        stroke="#e0e7ff"
                        strokeWidth={stroke}
                        fill="transparent"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />
                    <circle
                        stroke="#4f46e5"
                        strokeWidth={stroke}
                        strokeDasharray={circumference + ' ' + circumference}
                        style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                        strokeLinecap="round"
                        fill="transparent"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-extrabold text-indigo-900">{value}</span>
                </div>
            </div>
            <span className="mt-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Readiness Score</span>
        </div>
    );
};

export default function DashboardHome() {
    const navigate = useNavigate();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">

            {/* 1. Overall Readiness */}
            <Card className="flex flex-col items-center justify-center p-6 bg-white shadow-sm border-indigo-50">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-bold text-gray-800">Overall Readiness</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center h-[250px]">
                    <CircularProgress value={72} />
                </CardContent>
            </Card>

            {/* 2. Skill Breakdown (Radar Chart) */}
            <Card className="p-6 bg-white shadow-sm border-indigo-50">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-bold text-gray-800">Skill Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                            <PolarGrid stroke="#e5e7eb" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#4b5563', fontSize: 12 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                            <Radar
                                name="Student"
                                dataKey="A"
                                stroke="#4f46e5"
                                fill="#4f46e5"
                                fillOpacity={0.4}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* 3. Continue Practice */}
            <Card className="bg-white shadow-sm border-indigo-50">
                <CardHeader>
                    <CardTitle className="text-lg font-bold text-gray-800">Continue Practice</CardTitle>
                    <CardDescription>Pick up where you left off</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold text-indigo-900">Dynamic Programming</span>
                            <span className="text-sm text-gray-500">3/10</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                            <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '30%' }}></div>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/dashboard/practice')}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition"
                    >
                        Continue
                    </button>
                </CardContent>
            </Card>

            {/* 4. Weekly Goals */}
            <Card className="bg-white shadow-sm border-indigo-50">
                <CardHeader>
                    <CardTitle className="text-lg font-bold text-gray-800">Weekly Goals</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-600">Problems Solved</span>
                        <span className="text-sm font-bold text-indigo-600">12/20</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 mb-6">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>

                    <div className="flex justify-between items-center px-2">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                            <div key={i} className="flex flex-col items-center gap-1">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${[0, 1, 3, 4].includes(i) ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-400'
                                    }`}>
                                    {day}
                                </div>
                                {/* Optional check or dot */}
                                {[0, 1, 3, 4].includes(i) && <div className="w-1 h-1 bg-green-500 rounded-full"></div>}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* 5. Upcoming Assessments (Full width on laptop if wanted, but grid handles layout) */}
            <Card className="md:col-span-2 bg-white shadow-sm border-indigo-50">
                <CardHeader>
                    <CardTitle className="text-lg font-bold text-gray-800">Upcoming Assessments</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[
                            { title: "DSA Mock Test", time: "Tomorrow, 10:00 AM", type: "Technical" },
                            { title: "System Design Review", time: "Wed, 2:00 PM", type: "Architecture" },
                            { title: "HR Interview Prep", time: "Friday, 11:00 AM", type: "Behavioral" }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-100 transition">
                                <div className="flex items-center gap-4">
                                    <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{item.title}</h4>
                                        <p className="text-sm text-gray-500">{item.time}</p>
                                    </div>
                                </div>
                                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                                    {item.type}
                                </span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

        </div>
    );
}
