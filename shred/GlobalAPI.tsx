import axios from "axios";
export const AIChatModel = async ({ messages }: any) => {

    // Convert structured messages → plain text
    const conversation = messages
        .map((msg: any) => `${msg.role}: ${msg.content}`)
        .join("\n");

    const response = await axios.post(
        "https://kravixstudio.com/api/v1/chat",
        {
            message: conversation,
            aiModel: "gpt-5",
            outputType: "text"
        },
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.EXPO_PUBLIC_KRAVIX_STUDIO_API}`
            }
        }
    );

    return response.data;
};
