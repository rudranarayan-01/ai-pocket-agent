import { Tabs } from 'expo-router'
import { HomeIcon } from 'lucide-react-native'
import React from 'react'

export default function TabLayout() {
    return (
        <Tabs>
            <Tabs.Screen name='Home' options={{
                tabBarIcon:({color,size}) => <HomeIcon size={size} color={color}/>
            }} />
            <Tabs.Screen name='Explore' />
            <Tabs.Screen name='History' />
            <Tabs.Screen name='Profile' />
        </Tabs>
    )
}