import { Agents } from '@/shred/AgentList'
import React from 'react'
import { FlatList, View } from 'react-native'
import AgentCard from './AgentCard'

export default function AgentListComponent({isFeaturd}:any) {
    return (
        <View>
            <FlatList data={Agents}
                numColumns={2}
                // @ts-ignore
                renderItem={({ item, index }) => item.featured = isFeaturd && (
                    <View style={{flex:1, padding:5}}>
                        <AgentCard agent={item} key={index} />
                    </View>
                )}>

            </FlatList>
        </View>
    )
}