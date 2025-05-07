import { Timestamp } from "react-native-reanimated/lib/typescript/commonTypes";
import { UserSummary } from "./userTypes";

export interface UserPost {
    id: number,
    author: UserSummary,
    content: string,
    imageUrls: string[],
    createdAt: Date
}