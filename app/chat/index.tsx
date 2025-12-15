import Colors from '@/shred/Colors';
import { AIChatModel } from '@/shred/GlobalAPI';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Camera, Copy, Plus, Send, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    ToastAndroid,
    TouchableOpacity,
    View
} from 'react-native';


import { storage } from '@/config/firebase';
import * as Clipboard from 'expo-clipboard';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

type Message = {
    role: string;
    content: string | any[];
};


// Type guard for ApiFailure - adapt field names to match your GlobalAPI types
function isApiFailure(obj: any): obj is { ok: false; bodyText?: string; bodyJson?: any; error?: string } {
    return obj && obj.ok === false;
}

export default function ChatUI() {
    const navigation = useNavigation();
    const { agentName, agentPrompt, agentInitialText, agentId } = useLocalSearchParams();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>(''); // initialize as empty string
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<string>();

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: agentName || 'Chat',
            headerBackTitle: 'Back',
            headerRight: () => <Plus />
        });
    }, []);

    useEffect(() => {
        if (agentPrompt) {
            setMessages((prev) => [...prev, { role: 'system', content: agentPrompt.toString() }]);
        }
    }, [agentPrompt]);

    const extractAiText = (result: any): string | null => {
        try {
            // 1) If structured data is present under result.data
            if (result?.data && typeof result.data === 'object') {
                const d = result.data;
                if (typeof d.aiResponse === 'string') return d.aiResponse;
                if (typeof d.message === 'string') return d.message;
                if (typeof d.text === 'string') return d.text;
                if (Array.isArray(d.choices) && d.choices[0]) {
                    return d.choices[0].message?.content ?? d.choices[0].text ?? null;
                }
            }

            // 2) If result has direct fields
            if (typeof result?.aiResponse === 'string') return result.aiResponse;
            if (typeof result?.message === 'string') return result.message;
            if (typeof result?.text === 'string') return result.text;

            // 3) If result contains raw text fields
            if (typeof result?.rawText === 'string') {
                try {
                    const parsed = JSON.parse(result.rawText);
                    return parsed?.aiResponse ?? parsed?.message ?? parsed?.text ?? result.rawText;
                } catch {
                    return result.rawText;
                }
            }

            if (typeof result?.bodyText === 'string') {
                try {
                    const parsed = JSON.parse(result.bodyText);
                    return parsed?.aiResponse ?? parsed?.message ?? parsed?.text ?? result.bodyText;
                } catch {
                    return result.bodyText;
                }
            }

            // 4) If result is plain string
            if (typeof result === 'string') return result;

            // 5) Fallback to JSON string of result.data or result
            if (result?.data) return typeof result.data === 'string' ? result.data : JSON.stringify(result.data);
            return JSON.stringify(result);
        } catch (e) {
            console.warn('extractAiText error:', e);
            return null;
        }
    };

    const onSendMessage = async () => {
        const trimmed = input.trim();
        if (!trimmed) return;

        let contentText = trimmed;

        if (file) {
            const imageURL = await UploadImageToStorage();
            contentText = `${trimmed}\n[Image URL]: ${imageURL}`;
            setFile(undefined);
        }

        const userMessage: Message = {
            role: "user",
            content: contentText,
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const systemMsg = agentPrompt
                ? { role: "system", content: agentPrompt.toString() }
                : null;

            const payloadMessages = [
                ...(systemMsg ? [systemMsg] : []),
                ...messages.filter(m => m.role !== "system"),
                userMessage,
            ];

            const apiMessages = payloadMessages.map(m => ({
                role: m.role,
                content: typeof m.content === "string"
                    ? m.content
                    : m.content.find((c: any) => c.type === "text")?.text || ""
            }));

            const result = await AIChatModel({ messages: apiMessages });

            if (!result || !result.ok) {
                throw new Error("API failed");
            }

            const aiText =
                result.data?.aiResponse ??
                result.data?.text ??
                result.data?.message ??
                "No response";

            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: aiText },
            ]);
        } catch (err) {
            console.error(err);
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "Sorry, something went wrong." },
            ]);
        } finally {
            setLoading(false);
        }
    };



    const UploadImageToStorage = async () => {
        if (!file) throw new Error("No file selected");

        const response = await fetch(file);
        const blob = await response.blob();

        const imageRef = ref(storage, `images/${Date.now()}.jpg`);

        await uploadBytes(imageRef, blob);

        const imageURL = await getDownloadURL(imageRef);
        return imageURL;
    };



    const copyToClipboard = async (text: string) => {
        await Clipboard.setStringAsync(text);
        // alert('Copied to clipboard');
        ToastAndroid.show("Copied to clipboard", ToastAndroid.BOTTOM);
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: false,
            quality: 0.5,
        });

        if (!result.canceled) {
            setFile(result.assets[0].uri);
        }
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, padding: 5, borderRadius: 15 }}
            keyboardVerticalOffset={80}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <FlatList
                data={messages.filter(msg => msg.role !== 'system' && msg.content)}
                renderItem={({ item }) => (
                    <View style={[styles.messageContainer, item.role === 'assistant' ? styles.assistantMessage : styles.userMessage]}>

                        {typeof item.content == "string" ? (item.content == '__loading__' ?
                            <ActivityIndicator size="small" color={item.role === 'user' ? Colors.WHITE : Colors.GRAY} /> :

                            <Text style={[styles.messageText, item.role === 'user' ? styles.userText : styles.assistantText]}>
                                {item.content}
                            </Text>
                        ) :
                            <>
                                {item.content.find((c: any) => c.type === 'image') && (
                                    <Text style={[styles.messageText, item.role === 'user' ? styles.userText : styles.assistantText]}>{item.content.find((c) => c.type == 'text').text}</Text>
                                )}
                                {item.content.find((c: any) => c.type === 'image_url') && (
                                    <Image source={{ uri: item.content.find((c: any) => c.type == "image_url").image_url?.uri }} style={{ width: 180, height: 180, borderRadius: 8, marginTop: 6 }} />
                                )}
                            </>
                        }



                        {item.role === 'assistant' && (
                            <Pressable onPress={() => copyToClipboard(item?.content.toString())}>
                                <Copy color={Colors.GRAY} size={16} style={{ marginTop: 1 }} />
                            </Pressable>
                        )}


                    </View>
                )}
                keyExtractor={(_, index) => index.toString()}
                ListEmptyComponent={<Text style={{ textAlign: 'center', padding: 20 }}>No messages yet</Text>}
            />

            <View>
                {/* Input area */}
                {file && (
                    <View style={{ marginBottom: 10, display: "flex", flexDirection: 'row' }}>
                        <Image source={{ uri: file }} style={{ width: 50, height: 50, borderRadius: 6 }} />
                        <TouchableOpacity>
                            <X size={20} onPress={() => setFile(undefined)} />
                        </TouchableOpacity>
                    </View>
                )}
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 10,
                        borderTopWidth: 1,
                        borderRadius: 25,
                        borderColor: '#ddd',
                        backgroundColor: 'white'
                    }}
                >
                    <TouchableOpacity onPress={pickImage} style={{ marginRight: 8 }}>
                        <Camera size={26} color="#555" />
                    </TouchableOpacity>

                    <TextInput
                        style={{
                            flex: 1,
                            paddingHorizontal: 12,
                            paddingVertical: 10,
                            backgroundColor: '#f2f2f2',
                            borderRadius: 20,
                            fontSize: 16
                        }}
                        placeholder="Type a message..."
                        onChangeText={(text) => setInput(text)}
                        value={input}
                        placeholderTextColor="#888"
                        editable={!loading}
                    />

                    <TouchableOpacity
                        style={{
                            backgroundColor: '#007bff',
                            padding: 10,
                            borderRadius: 20,
                            marginLeft: 8,
                            opacity: loading ? 0.6 : 1
                        }}
                        onPress={onSendMessage}
                        disabled={loading}
                    >
                        <Send size={18} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}



// Stylesheet 

const styles = StyleSheet.create({
    messageContainer: {
        maxWidth: '75%',
        marginVertical: 4,
        padding: 10,
        borderRadius: 12,
    },
    assistantMessage: {
        backgroundColor: Colors.LIGHT_GRAY,
        alignSelf: 'flex-start',
        borderBottomLeftRadius: 2,
        color: Colors.BLACK
    },
    userMessage: {
        backgroundColor: Colors.PRIMARY,
        alignSelf: 'flex-end',
        borderBottomRightRadius: 2,
    },
    userText: { color: Colors.WHITE },
    messageText: { fontSize: 16 },
    assistantText: { color: Colors.BLACK },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 12
    },
    input: {
        flex: 1,
        padding: 10,
        fontSize: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#CCC',
        backgroundColor: Colors.WHITE,
        marginRight: 8,
        paddingHorizontal: 15,
    }
});
