import Colors from '@/shred/Colors'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'

export default function CreateAgentBanner() {
    return (
        <View style={{ paddingTop:15,backgroundColor: Colors.PRIMARY,  borderRadius: 15, display: "flex", flexDirection: "row", marginTop: 15, marginBottom:15, shadowColor: Colors.BLACK, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 6 }}>
            <Image source={require("../../assets/images/agents/agentGroup.png")} style={{ width: 200, height: 120, resizeMode: "contain" }} />
            <View style={{ padding:10, width:180 }}>
                <Text style={{ color: Colors.WHITE, fontSize: 22, fontWeight: "bold", flex: 1 }}>Create your own AI Agent</Text>

                {/* Button  */}
                <TouchableOpacity style={{ backgroundColor: Colors.WHITE, padding: 10, borderRadius: 5, marginTop: 10,  }}>
                    <Text style={{ color: Colors.PRIMARY, fontWeight: "bold", fontSize:20, textAlign:"center" }}>Create now</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}