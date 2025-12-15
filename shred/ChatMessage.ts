export type ChatContent =
    | string
    | {
        type: 'text';
        text: string;
    }
    | {
        type: 'image_url';
        image_url: { url: string };
    };

export type ChatMessage = {
    role: 'system' | 'user' | 'assistant';
    content: string | ChatContent[];
};
