import { Agents } from '@/shred/AgentList'
import React from 'react'
import { FlatList, View } from 'react-native'
import AgentCard from './AgentCard'

export default function AgentListComponent({ isFeatured }: any) {

    const filteredAgents = Agents.filter(agent =>
        isFeatured ? agent.featured === true : agent.featured !== true
    )

    return (
        <View>
            <FlatList
                data={filteredAgents}
                numColumns={2}
                renderItem={({ item, index }) => (
                    <View style={{ flex: 1, padding: 5 }}>
                        <AgentCard agent={item} key={index} />
                    </View>
                )}
            />
        </View>
    )
}
