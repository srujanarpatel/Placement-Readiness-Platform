import { Link } from 'react-router-dom';

export default function Hero() {
    return (
        <section className="bg-indigo-700 text-white py-20">
            <div className="container mx-auto px-6 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Ace Your Placement</h1>
                <p className="text-lg md:text-xl text-indigo-200 mb-8">
                    Practice, assess, and prepare for your dream job with our comprehensive platform.
                </p>
                <Link
                    to="/dashboard"
                    className="bg-white text-indigo-700 font-semibold py-3 px-8 rounded-full hover:bg-indigo-100 transition duration-300"
                >
                    Get Started
                </Link>
            </div>
        </section>
    );
}
