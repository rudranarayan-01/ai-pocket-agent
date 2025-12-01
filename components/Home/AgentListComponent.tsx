import { Agents } from '@/shred/AgentList'
import React from 'react'
import { FlatList, View } from 'react-native'
import AgentCard from './AgentCard'

export default function AgentListComponent() {
    return (
        <View>
            <FlatList data={Agents} 
            // @ts-ignore
            renderItem={({item, index})=> item.featured && (
                <AgentCard agent={item} key={index} />
            )}>

            </FlatList>
        </View>
    )
}