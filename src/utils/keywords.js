/**
 * Keywords and patterns for skill detection.
 */

export const SKILL_CATEGORIES = {
    core: { label: "Core CS", keywords: ["DSA", "Data Structures", "Algorithms", "OOP", "DBMS", "Database Management", "OS", "System Design", "Operating Systems", "Networking", "Computer Networks"] },
    languages: { label: "Languages", keywords: ["Java", "Python", "JavaScript", "TypeScript", "C++", "C#", "Go", "Ruby", "Swift", "Kotlin", "PHP"] },
    web: { label: "Web Development", keywords: ["React", "Next.js", "Node.js", "Express", "REST", "GraphQL", "Angular", "Vue", "HTML", "CSS", "Tailwind"] },
    data: { label: "Data Engineering", keywords: ["SQL", "MongoDB", "PostgreSQL", "MySQL", "Redis", "NoSQL", "Big Data", "Spark", "Hadoop", "ETL"] },
    cloud: { label: "Cloud & DevOps", keywords: ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "CI/CD", "Linux", "Jenkins", "Terraform"] },
    testing: { label: "Testing", keywords: ["Selenium", "Cypress", "Playwright", "JUnit", "PyTest", "Jest", "TDD", "BDD"] }
};

export const SKILL_QUESTIONS_MAP = {
    // Core CS & Algorithms
    "DSA": "Explain time complexity vs space complexity with an example.",
    "Data Structures": "Implement a hash map from scratch. How do you handle collisions?",
    "Algorithms": "Describe how Dijkstra's algorithm works.",
    "OOP": "What are the four pillars of OOP? Explain polymorphism with a code scenario.",
    "DBMS": "Explain ACID properties in database transactions.",
    "OS": "Difference between process and thread? How does context switching work?",
    "Networking": "Explain the TCP 3-way handshake process.",

    // Languages
    "Java": "Explain the difference between interface and abstract class in Java.",
    "Python": "How does Python handle memory management and garbage collection?",
    "JavaScript": "Explain the event loop and how asynchronous code works in JS.",
    "TypeScript": "What are the benefits of using TypeScript over JavaScript? Explain Generics.",
    "C++": "What is a virtual function and how does it enable polymorphism?",
    "C#": "Explain dependency injection in .NET.",

    // Web
    "React": "Explain the Virtual DOM and how reconciliation works.",
    "Next.js": "Compare Server-Side Rendering (SSR) vs Static Site Generation (SSG).",
    "Node.js": "Explain the concept of non-blocking I/O in Node.js.",
    "Express": "How does middleware work in Express.js?",
    "REST": "What are the key constraints of RESTful architecture?",
    "GraphQL": "How does GraphQL prevent over-fetching and under-fetching?",

    // Data
    "SQL": "Explain indexing and when it helps optimize queries.",
    "MongoDB": "Difference between SQL and NoSQL databases. When to use MongoDB?",
    "PostgreSQL": "Explain JSONB data type and when you would use it in Postgres.",
    "Redis": "What are the common use cases for Redis besides caching?",

    // Cloud
    "AWS": "Explain the difference between EC2 and Lambda.",
    "Docker": "What is the difference between a Docker image and a container?",
    "Kubernetes": "Explain the architecture of a Kubernetes cluster.",
    "CI/CD": "Describe a typical CI/CD pipeline for a web application.",

    // Testing
    "Selenium": "How do you handle dynamic elements in Selenium?",
    "Cypress": "What is the trade-off of running Cypress inside the browser vs Selenium outside?",
    "JUnit": "Explain the lifecycle of a JUnit test."
};
