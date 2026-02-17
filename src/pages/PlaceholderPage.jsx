export default function PlaceholderPage({ title }) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="bg-indigo-50 p-6 rounded-full">
                {/* Simple placeholder icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
            <p className="text-gray-500 max-w-md">
                This section is currently under development. Stay tuned for exciting new features!
            </p>
        </div>
    );
}
