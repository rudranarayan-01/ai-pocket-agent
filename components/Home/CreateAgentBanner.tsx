import React from 'react'
import { Image, View } from 'react-native'

export default function CreateAgentBanner() {
    return (
        <View>
            <Image source={require("../../assets/images/agents/agentGroup.png")} style={{width:200, height:120}} />
        </View>
    )
}