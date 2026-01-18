import { Choice, GameSetupData, JudgeAgent } from "@/store/types";

// Util fns to convert UI input to structured data for the backend
function flattenJudgeAgent(judgeAgent: JudgeAgent) {
    // Return structured data instead of string for backend to spawn correct judges
    return {
        personality: judgeAgent.personality,
        name: judgeAgent.name
    };
}

function flattenChoice(choice: Choice) {
    return `Choice: ${choice.name}${choice.description ? ", Description: " + choice.description : ""}`;
}

export function flattenGameSetupData(data: GameSetupData) {
    return {
        choices: data.choices.map(flattenChoice),
        judges: data.judges.map(flattenJudgeAgent),
        context: data.context
    };
}

export function getChoiceName(choiceStr: string): string {
    return choiceStr.split(', Description: ')[0].trim().split('Choice: ')[1].trim();
}