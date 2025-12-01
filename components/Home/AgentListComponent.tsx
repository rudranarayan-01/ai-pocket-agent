import { Agents } from '@/shred/AgentList'
import React from 'react'
import { FlatList, View } from 'react-native'
import AgentCard from './AgentCard'

export default function AgentListComponent() {
    return (
        <View>
            <FlatList data={Agents} renderItem={({item, index})=>(
                <AgentCard agent={item} key={index} />
            )}>

            </FlatList>
        </View>
    )
}