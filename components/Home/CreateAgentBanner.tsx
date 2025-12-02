import Colors from '@/shred/Colors'
import React from 'react'
import { Image, Text, View } from 'react-native'

export default function CreateAgentBanner() {
    return (
        <View style={{ backgroundColor: Colors.PRIMARY, padding: 15, borderRadius: 10, display: "flex", flexDirection: "row", marginTop: 15, shadowColor: Colors.BLACK, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 6 }}>
            <Image source={require("../../assets/images/agents/agentGroup.png")} style={{ width: 200, height: 120, resizeMode: "contain" }} />
            <View style={{ flex: 1, justifyContent: "center", alignItems: "flex-start", paddingLeft: 15 }}>
                <Text style={{ color: Colors.WHITE, fontSize: 20, fontWeight: "bold", flex: 1 }}>Create your own AI Agent</Text>
            </View>
        </View>
    )
}