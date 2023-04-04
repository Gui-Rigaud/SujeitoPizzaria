import React, { useState, useContext } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, TextInput } from 'react-native';

import { AuthContext } from '../../contexts/AuthContext';
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamsList } from '../../Routes/app.routes';
import { api } from '../../services/api';

export default function Dashboard() {
    const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();

    const { user, signOut } = useContext(AuthContext);
    const [table, setTable] = useState('');

    async function openOrder() {
        if(table === ''){
            return
        }

        const response = await api.post('/order', {
            table: Number(table)
        });

        navigation.navigate('Order', { table: table, order_id: response.data.id});

        setTable('');
    }
    
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.signOutbut} onPress={signOut}>
                    <Entypo name="log-out" size={24} color="white" />
                </TouchableOpacity>
            </View>

            <View style={styles.containerDesk}>
                <Text style={styles.title}>Novo Pedido</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder='Número da mesa'
                        style={styles.input}
                        placeholderTextColor="#F0F0F0"
                        keyboardType='numeric'
                        value={table}
                        onChangeText={setTable}
                    />

                    <TouchableOpacity style={styles.button} onPress={openOrder}>
                        <Text style={styles.buttonText}>Abrir a mesa</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.footer}>
                <Text style={styles.userName}><Text style={styles.label}>Signed as: </Text>{user.name}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1d1d2e"
    },
    header: {
        width: '100%',
        flexDirection: 'row',
    },
    signOutbut: {
        marginTop: '5%',
        paddingStart: '90%',
    },
    containerDesk: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        color: '#F0F0F0',
        fontSize: 30,
        fontWeight: 'bold',
    },
    inputContainer: {
        width: '95%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 32,
        paddingHorizontal: 30,
    },
    input: {
        width: '95%',
        height: 60,
        color: '#fff',
        fontSize: 20,
        backgroundColor: '#101026',
        paddingHorizontal: 12,
        paddingVertical: 12,
        marginBottom: 10,
        borderWidth: 0.3,
        borderColor: '#f0f0f0',
        borderRadius: 5,
        textAlign: 'center',
    },
    button: {
        width: '95%',
        height: 40,
        backgroundColor: '#3fffa3',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
    },
    buttonText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#101026',
    },
    footer: {
        marginBottom: '5%',        
    },
    label: {
        color: 'red',
        fontSize: 10,
    },
    userName:{
        color: '#fff',
        fontSize: 10,
        paddingTop: '6%',
        marginStart: '5%',
    }
});