import MyGoal from "../models/MyGoals.js";
import Conversation from "../models/Conversation.js";

/**
 * Ensure all goal items in a MyGoal document have conversation IDs
 * Creates conversations for any goal item that doesn't have one
 */
export const ensureGoalConversations = async (myGoalDoc) => {
  if (!myGoalDoc || !myGoalDoc.goals || !myGoalDoc.manager) {
    return myGoalDoc;
  }

  let hasChanges = false;

  for (const goalItem of myGoalDoc.goals) {
    if (!goalItem.conversation) {
      // Create new conversation for this goal item
      const conversation = await Conversation.findOne({ goalItem: goalItem._id });

      let convoToUse;
      if (conversation) {
        convoToUse = conversation;
      } else {
        convoToUse = await Conversation.create({
          goalItem: goalItem._id,
          myGoal: myGoalDoc._id,
          participants: [myGoalDoc.user, myGoalDoc.manager],
        });
      }

      // Update goal item with conversation ID
      goalItem.conversation = convoToUse._id;
      hasChanges = true;
    }
  }

  // Save if any changes made
  if (hasChanges) {
    await myGoalDoc.save();
  }

  return myGoalDoc;
};

/**
 * Get single goal item's conversation, creating if doesn't exist
 */
export const getOrCreateGoalConversation = async (myGoalId, goalItemId, userId, managerId) => {
  // Find the goal document
  const myGoal = await MyGoal.findById(myGoalId);
  if (!myGoal) throw new Error("Goal sheet not found");

  const goalItem = myGoal.goals.id(goalItemId);
  if (!goalItem) throw new Error("Goal item not found");

  // Check if conversation exists
  let conversation;
  if (goalItem.conversation) {
    conversation = await Conversation.findById(goalItem.conversation);
  }

  // Create if doesn't exist
  if (!conversation) {
    conversation = await Conversation.findOne({ goalItem: goalItemId });

    if (!conversation) {
      conversation = await Conversation.create({
        goalItem: goalItemId,
        myGoal: myGoalId,
        participants: [userId, managerId],
      });
    }

    // Link to goal item
    goalItem.conversation = conversation._id;
    await myGoal.save();
  }

  return conversation;
};
