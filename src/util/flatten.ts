import { Choice, GameSetupData, JudgeAgent } from "@/store/types";

// Util fns to convert UI input to strings for use by the backend
function flattenJudgeAgent(judgeAgent: JudgeAgent) {
    return `Name: ${judgeAgent.name}, Personality: ${judgeAgent.personality}${judgeAgent.customPrompt ? ", Custom prompt: " + judgeAgent.customPrompt : ""}`;
};

function flattenChoice(choice: Choice) {
    return `Choice: ${choice.name}${choice.description ? ", Description: " + choice.description : ""}`;
}

export const flattenGameSetupData = (data: GameSetupData) => {
    return {
        choices: data.choices.map(flattenChoice),
        judges: data.judges.map(flattenJudgeAgent),
        context: data.context
    };
};