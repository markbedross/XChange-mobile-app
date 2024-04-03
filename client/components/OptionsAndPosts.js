import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import AdCard from './AdCard';
import { FlatList } from 'react-native-gesture-handler';

function OptionsAndPosts({navigation, userAds}) {

    const renderAds = ({item}) => (
        <AdCard id={item._id} ad={item} navigation={navigation}/>
    )

    return (
        <View style={{flex: 1, marginBottom: 20}}>
            <FlatList
                ListHeaderComponent={
                <View style={styles.header}>
                    <Text style={styles.text}>Your posts</Text>
                    <FontAwesome onPress={()=>navigation.navigate("NameAndEmails")} name="user-circle-o" size={24} color="black" />
                </View>
                }
                keyExtractor={(item) => item._id}
                data={userAds}
                renderItem={renderAds}
                numColumns={2}
                columnWrapperStyle={{
                    justifyContent: "space-between",
                    marginHorizontal: 20,
                }}
             />
        </View>
    );
}

export default OptionsAndPosts;

const styles = StyleSheet.create({
    header: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        // borderWidth: 1,
        width: '55%',
        marginLeft: 'auto',
        marginRight: 20,
        marginTop: 10
    },
    text: {
        fontWeight: 'bold',
        fontSize: 18
    }
})