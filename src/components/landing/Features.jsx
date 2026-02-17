import { Code, Video, BarChart2 } from 'lucide-react';

export default function Features() {
    const features = [
        {
            title: "Practice Problems",
            description: "Solve hundreds of coding challenges tailored for top company interviews.",
            icon: <Code className="w-12 h-12 text-indigo-500 mb-4" />
        },
        {
            title: "Mock Interviews",
            description: "Simulate real interview scenarios with AI-driven feedback and peer sessions.",
            icon: <Video className="w-12 h-12 text-indigo-500 mb-4" />
        },
        {
            title: "Track Progress",
            description: "Monitor your performance and identify areas for improvement with detailed analytics.",
            icon: <BarChart2 className="w-12 h-12 text-indigo-500 mb-4" />
        }
    ];

    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Choose Us?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1">
                            <div className="flex justify-center">{feature.icon}</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">{feature.title}</h3>
                            <p className="text-gray-600 text-center">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
