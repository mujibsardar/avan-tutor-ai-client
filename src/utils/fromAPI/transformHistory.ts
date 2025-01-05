    // utils/transformHistory.ts
    import { HistoryItem } from "../api";

    export interface TransformedHistoryItem {
        prompt: HistoryItem;
        responses: {
            openai?: HistoryItem;
            gemini?: HistoryItem;
            search?: [];
        };
    }

    export function transformHistory(history: HistoryItem[]): TransformedHistoryItem[] {
        const transformedHistory: TransformedHistoryItem[] = [];
        let currentItem: TransformedHistoryItem | null = null;
        let searchResults: string[] | undefined;


        for (const item of history) {
            if (item.sender === "user") {
                // If it's a user prompt, start a new block
                if (currentItem) {
                    transformedHistory.push(currentItem);
                }
                currentItem = {
                    prompt: item,
                    responses: {},
                };
            }
            else if (item.sender === "openai" && currentItem) {
            currentItem.responses.openai = item
            }
            else if (item.sender === "gemini" && currentItem){
            currentItem.responses.gemini = item;
            }
            else if (item.sender === "googleSearch" && currentItem){
                // TODO Handle search results which is of type object array
                // searchResults = item.message;
            }
        }
        if (currentItem) {
            if(searchResults){
                // TODO
                // currentItem.responses.search = searchResults;
            }
            transformedHistory.push(currentItem);
        }


        return transformedHistory;
    }