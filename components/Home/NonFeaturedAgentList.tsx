import { Agents } from '@/shred/AgentList'
import React from 'react'
import { FlatList, View } from 'react-native'
import NonFeaturedAgentCard from './NonFeaturedAgentCard'

export default function NonFeaturedAgentList({ isFeatured }: any) {
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
                        <NonFeaturedAgentCard agent={item} key={index} />
                    </View>
                )}
            />
        </View>
    )
}