import axios from "axios";

export const AIChatModel = async ({messages}:any) => {

    const response = await axios.post(
        "https://kravixstudio.com/api/v1/chat",
        {
            message: messages,
            aiModel: "gpt-5",                     // Selected AI model
            outputType: "text"                         // 'text' or 'json'
        },
        {
            headers: {
                "Content-Type": "application/json",     // Tell server we're sending JSON
                "Authorization": "Bearer YOUR_API_KEY"+process.env.EXPO_PUBLIC_KRAVIX_STUDIO_API  // Replace with your API key
            }
        }
    );

    console.log(response.data); // Log API response
    return response.data;
}