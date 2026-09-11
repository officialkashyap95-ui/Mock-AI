import fs from "fs";
import path from "path";

function shuffleArray(array) {
    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
}

export const getRandomQuestions = (
    technology,
    difficulty,
    totalQuestions
) => {

    const tech = technology
        .toLowerCase()
        .replace(/\./g, "")
        .replace(/\+\+/g, "pp")
        .replace(/\s+/g, "");

    const filePath = path.resolve(
        process.cwd(),
        "questionBank",
        `${tech}.json`
    );

    console.log("=================================");
    console.log("Technology :", technology);
    console.log("Converted  :", tech);
    console.log("Difficulty :", difficulty);
    console.log("Questions  :", totalQuestions);
    console.log("Path       :", filePath);
    console.log("Exists     :", fs.existsSync(filePath));
    console.log("=================================");

    if (!fs.existsSync(filePath)) {
        throw new Error(`Question bank not found: ${filePath}`);
    }

    const data = JSON.parse(
        fs.readFileSync(filePath, "utf8")
    );

    const questionPool = data[difficulty.toLowerCase()] || [];

    if (questionPool.length === 0) {
        throw new Error(
            `No ${difficulty} questions found in ${technology}.`
        );
    }

    const shuffled = shuffleArray(questionPool);

    return shuffled.slice(0, Number(totalQuestions));
};