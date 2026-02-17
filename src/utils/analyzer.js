import { SKILL_CATEGORIES, SKILL_QUESTIONS_MAP } from './keywords';

const ENTERPRISE_COMPANIES = ["google", "amazon", "microsoft", "meta", "facebook", "apple", "netflix", "tcs", "infosys", "wipro", "accenture", "cognizant", "capgemini", "ibm", "oracle", "deloitte", "pwc", "kpmg", "ey", "jpmorgan", "goldman sachs", "morgan stanley", "adobe", "salesforce", "sap", "cisco", "intel", "nvidia"];

function getCompanyIntel(company, skills) {
    if (!company) return null;
    const lowerCompany = company.toLowerCase();
    const isEnterprise = ENTERPRISE_COMPANIES.some(c => lowerCompany.includes(c));

    return {
        name: company,
        industry: "Technology Services",
        size: isEnterprise ? "Enterprise (2000+)" : "Startup / Mid-size",
        focus: isEnterprise
            ? "Structured process emphasizing Data Structures, Algorithms, and Core CS fundamentals. Expect rigor."
            : "Practical problem solving and immediate contribution. Proficiency in specific stack is highly valued."
    };
}

function getRoundMapping(companySize, skills) {
    const rounds = [];
    const isEnterprise = companySize && companySize.includes("Enterprise");
    const hasWeb = skills.web.length > 0;

    if (isEnterprise) {
        rounds.push({
            roundTitle: "Round 1: Online Assessment",
            focusAreas: ["Aptitude", "DSA"],
            whyItMatters: "Filters candidates based on raw problem-solving speed and logic."
        });
        rounds.push({
            roundTitle: "Round 2: Technical Interview 1",
            focusAreas: ["DSA", "Core CS"],
            whyItMatters: "Validates deep understanding of data structures and efficient coding."
        });
        rounds.push({
            roundTitle: "Round 3: Technical Interview 2",
            focusAreas: rounds.length > 1 && hasWeb ? ["System Design", "Projects"] : ["Advanced DSA", "Low Level Design"],
            whyItMatters: "Tests ability to build scalable systems and discuss past work depth."
        });
        rounds.push({
            roundTitle: "Round 4: Managerial / HR",
            focusAreas: ["Behavioral", "Culture"],
            whyItMatters: "Ensures alignment with company values and long-term potential."
        });
    } else {
        rounds.push({
            roundTitle: "Round 1: Screening / Take-home",
            focusAreas: ["Practical Coding"],
            whyItMatters: "Verifies ability to write working code for real-world tasks."
        });
        rounds.push({
            roundTitle: "Round 2: Technical Deep Dive",
            focusAreas: hasWeb ? ["Frameworks", "System Discussion"] : ["Core Skills", "Problem Solving"],
            whyItMatters: "Assesses how quickly you can contribute to the existing codebase."
        });
        rounds.push({
            roundTitle: "Round 3: Culture Fit / Founder Round",
            focusAreas: ["Values", "Vision"],
            whyItMatters: "Checks if you thrive in a fast-paced, ownership-driven environment."
        });
    }
    return rounds;
}

/**
 * Main Analysis Logic for Job Descriptions with Strict Schema
 */
export function analyzeJobDescription(jdText, company = "", role = "") {
    // 1. Skill Extraction
    const detectedSkills = {
        coreCS: [], // Renamed from 'core' to 'coreCS' as per schema
        languages: [],
        web: [],
        data: [],
        cloud: [],
        testing: [],
        other: [] // New required field
    };

    let totalCategoriesDetected = 0;
    if (!jdText) jdText = "";
    const lowerCaseJD = jdText.toLowerCase();

    // Map old keys to new keys if needed, or iterate SKILL_CATEGORIES
    // SKILL_CATEGORIES keys: core, languages, web, data, cloud, testing
    for (const [key, categoryData] of Object.entries(SKILL_CATEGORIES)) {
        let targetKey = key;
        if (key === 'core') targetKey = 'coreCS';

        let categoryHasSkills = false;
        categoryData.keywords.forEach(keyword => {
            if (lowerCaseJD.includes(keyword.toLowerCase())) {
                if (!detectedSkills[targetKey].includes(keyword)) {
                    detectedSkills[targetKey].push(keyword);
                    categoryHasSkills = true;
                }
            }
        });
        if (categoryHasSkills) totalCategoriesDetected++;
    }

    // Fallback if empty skills
    const allSkillsFlat = Object.values(detectedSkills).flat();
    const hasSkills = allSkillsFlat.length > 0;

    if (!hasSkills) {
        detectedSkills.other = ["Communication", "Problem solving", "Basic coding", "Projects"];
    }

    // 2. Readiness Score Calculation (baseScore)
    let score = 35; // Base
    score += Math.min(totalCategoriesDetected * 5, 30); // Max 30 for skills
    if (company && company.trim().length > 0) score += 10;
    if (role && role.trim().length > 0) score += 10;
    if (jdText.length > 800) score += 10;
    if (score > 100) score = 100;

    // 3. New Intel Generation
    const companyIntel = getCompanyIntel(company, detectedSkills);
    const roundMapping = getRoundMapping(companyIntel ? companyIntel.size : "Startup", detectedSkills);

    // 4. Generate Checklist (Standardized Array Schema)
    // Was: { round1: [], ... }, Now: [{ roundTitle, items[] }]
    const checklist = [
        {
            roundTitle: "Round 1: Aptitude / Basics",
            items: [
                "Review Quantitative Aptitude (Time & Work, Permutations)",
                "Practice Logic Puzzles & Data Interpretation",
                "Refresh Verbal Ability (Reading Comprehension)",
                "Take a mock aptitude test online"
            ]
        },
        {
            roundTitle: "Round 2: DSA + Core CS",
            items: [
                "Brush up on " + (detectedSkills.coreCS.length ? detectedSkills.coreCS.join(", ") : "Core CS Fundamentals"),
                "Solve 5 Medium LeetCode problems",
                "Review Time Complexity basics",
                "Practice explaining your code while writing it"
            ]
        },
        {
            roundTitle: "Round 3: Tech interview",
            items: [
                "Prepare project deep-dive explanations",
                "Review expected questions on: " + (detectedSkills.web.concat(detectedSkills.data).length ? [...detectedSkills.web, ...detectedSkills.data].slice(0, 3).join(", ") : "Your Resume Skills"),
                "System Design: " + (detectedSkills.web.includes("React") || detectedSkills.web.includes("Node.js") ? "How to scale a web app?" : "Design a URL shortener"),
                "Check standard library functions for your preferred language"
            ]
        },
        {
            roundTitle: "Round 4: Managerial / HR",
            items: [
                "Research " + (company || "the company") + "'s core values",
                "Prepare 'Tell me about yourself' pitch",
                "Prepare behavioral answers using STAR method",
                "Draft 2 questions to ask the interviewer"
            ]
        }
    ];

    // 5. Generate 7-Day Plan (Standardized Array Schema)
    // Was: { day1_2: "...", ... }, Now: [{ day, focus, tasks[] }]
    const plan7Days = [
        {
            day: "Day 1-2",
            focus: "Basics & Fundamentals",
            tasks: ["Solidify " + (detectedSkills.languages[0] || "Architecture") + " basics", "Review " + (detectedSkills.coreCS[0] || "OOP concepts")]
        },
        {
            day: "Day 3-4",
            focus: "Problem Solving & Coding",
            tasks: ["Intense " + (detectedSkills.coreCS.includes("DSA") ? "DSA" : "Problem Solving") + " practice", "Build small " + (detectedSkills.web.length ? "frontend components" : "scripts")]
        },
        {
            day: "Day 5",
            focus: "Projects & Resume",
            tasks: ["End-to-end Project Review", "Resume alignment for " + (role || "this role")]
        },
        {
            day: "Day 6",
            focus: "Mock Interviews",
            tasks: ["Mock Interview with focus on " + (detectedSkills.data[0] || "System Design"), "Review specialized questions"]
        },
        {
            day: "Day 7",
            focus: "Revision",
            tasks: ["Final Revision of " + (allSkillsFlat.slice(0, 3).join(", ") || "General Concepts"), "HR Prep"]
        }
    ];

    // 6. Generate Likely Questions (10)
    let specificQuestions = [];
    allSkillsFlat.forEach(skill => {
        // Find exact or partial match in definitions
        if (SKILL_QUESTIONS_MAP[skill]) {
            specificQuestions.push(SKILL_QUESTIONS_MAP[skill]);
        } else {
            const mapKey = Object.keys(SKILL_QUESTIONS_MAP).find(k => k.toLowerCase() === skill.toLowerCase());
            if (mapKey) specificQuestions.push(SKILL_QUESTIONS_MAP[mapKey]);
        }
    });

    const generics = [
        "Describe a challenging bug you fixed recently.",
        "How do you stay updated with latest tech trends?",
        "Explain the difference between TCP and UDP.",
        "What is Polymorphism? Give a real-world example.",
        "How does DNS resolution work?",
        "Explain the concept of caching.",
        "What is a Deadlock? How to prevent it?",
        "Explain Big-O notation to a non-technical person."
    ];

    let finalQuestions = [...new Set([...specificQuestions, ...generics])];
    finalQuestions = finalQuestions.slice(0, 10);

    return {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        company: company || "",
        role: role || "",
        jdText,
        extractedSkills: detectedSkills,
        baseScore: score,
        finalScore: score, // Initially same as base
        skillConfidenceMap: {}, // Empty initially
        companyIntel,
        roundMapping,
        checklist,
        plan7Days,
        questions: finalQuestions
    };
}
