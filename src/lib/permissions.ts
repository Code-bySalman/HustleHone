
import { SubscriptionLevel } from "./subscription";

export function canCreateResume(
    subcriptionLevel: SubscriptionLevel,
    currentResumeCount: number
){
    const maxResumeMap: Record<SubscriptionLevel, number> = {
          free  : 1,
          premium: 3,
          premiumPlus: Infinity
    }
    const maxResumes = maxResumeMap[subcriptionLevel];
    return currentResumeCount < maxResumes;

}

export function canUseAITools(
    subscriptionLevel: SubscriptionLevel
){
     return subscriptionLevel !== "free";
}

export function canUseCustomization(
    subscriptionLevel: SubscriptionLevel
){
    return subscriptionLevel === "premiumPlus";
}