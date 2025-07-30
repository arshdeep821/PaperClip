import Trade from "../models/Trade.js";

export const calculateUserAchievements = async (userId) => {
    try {
        // Count successful trades for this user
        const successfulTrades = await Trade.countDocuments({
            $or: [{ user1: userId }, { user2: userId }],
            status: "successful"
        });

        const achievements = [];

        // Check for "From Nothing" achievement (1 successful trade)
        if (successfulTrades >= 1) {
            achievements.push(
                {
                    title: "From Nothing",
                    description: "Yay! you completed your first trade",
                    icon: "paperClipIcon"
                }
            );
        }

        // Check for "Trade Master" achievement (5 successful trades)
        if (successfulTrades >= 5) {
            achievements.push(
                {
                    title: "Trade Master",
                    description: "Completed 5 successful trades",
                    icon: "hustlerIcon"
                }
            );
        }

        // Check for "Trade Legend" achievement (10 successful trades)
        if (successfulTrades >= 10) {
            achievements.push(
                {
                    title: "Trade Legend",
                    description: "Completed 10 successful trades",
                    icon: "houseIcon"
                }
            );
        }

        return achievements;
    } catch (error) {
        console.error("Error calculating achievements:", error);
        return [];
    }
};