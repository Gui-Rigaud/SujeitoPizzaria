import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Modal,
    FlatList
} from 'react-native'

import { useRoute, RouteProp, useNavigation } from '@react-navigation/native'

import { Feather } from '@expo/vector-icons'
import { api } from '../../services/api';
import { ModalPicker } from '../../components/ModalPicker';
import { MaterialIcons } from '@expo/vector-icons';
import { ListItem } from '../../components/ListItem';
import { AntDesign } from '@expo/vector-icons';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamsList } from '../../Routes/app.routes';

type RouteDetailParams = {
    Order: {
        table: String | number;
        order_id: String;
    }
}

type OrderRouteProps = RouteProp<RouteDetailParams, 'Order'>;

export type CategoryProps = {
    id: String;
    order_id: String;
    name: String;
}

export type ProductProps = {
    id: String;
    order_id: String;
    name: String;
}

export type ItemProps = {
    id: String;
    product_id: String;
    name: String;
    amount: String | number;
}

export default function Order() {
    const route = useRoute<OrderRouteProps>();
    const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();

    const [category, setCategory] = useState<CategoryProps[] | []>([]);
    const [categorySelected, setCategorySelected] = useState<CategoryProps | undefined>();
    const [modalCategoryVisible, setModalCategoryVisible] = useState(false);

    const [products, setProducts] = useState<ProductProps[] | []>([]);
    const [productSelected, setProductSelected] = useState<ProductProps | undefined>();
    const [modalProductVisible, setModalProductVisible] = useState(false);

    const [amount, setAmount] = useState('1');
    const [items, setItems] = useState<ItemProps[]>([]);

    useEffect(() => {
        async function loadInfo() {
            const response = await api.get('/category');

            setCategory(response.data);
            setCategorySelected(response.data[0]);
        }

        loadInfo();
    }, [])

    useEffect(() => {
        async function loadProducts() {
            const response = await api.get('/category/product', {
                params: {
                    category_id: categorySelected?.id
                }
            });

            setProducts(response.data);
            setProductSelected(response.data[0]);
        }

        loadProducts();
    }, [categorySelected])

    async function handleCloseOrder() {
        try {
            await api.delete('/order', {
                params: {
                    order_id: route.params?.order_id
                }
            })

            navigation.goBack();
        } catch (err) {
            console.log(err);
        }
    }

    function handleChangeCategory(item: CategoryProps) {
        setCategorySelected(item);
    }

    function handleChangeProduct(item: ProductProps) {
        setProductSelected(item);
    }

    async function handleAdd() {
        const response = await api.post('/order/add', {
            order_id: route.params?.order_id,
            product_id: productSelected?.id,
            amount: Number(amount),
        });


        let data = {
            id: response.data.id,
            product_id: productSelected?.id as String,
            name: productSelected?.name as String,
            amount: amount
        }

        setItems(oldArray => [...oldArray, data]);

    }

    async function handleDeleteItem(item_id: String) {
        await api.delete("/order/remove", {
            params: {
                item_id: item_id
            }
        })

        let removeItem = items.filter(item => {
            return (item.id !== item_id)
        })

        setItems(removeItem);
    }

    function handleAddQtd() {
        setAmount(String(Number(amount) + 1));
    }

    function handleLessQtd() {
        if(Number(amount) > 1){
            setAmount(String(Number(amount) - 1));
        }else{
            return;
        }
    }

    function handleFinishOrder(){
        navigation.navigate("FinishOrder", { table: route.params.table, order_id: route.params.order_id});
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Mesa {route.params.table}</Text>
                {items.length === 0 && (
                    <TouchableOpacity onPress={handleCloseOrder}>
                        <Feather name="trash-2" size={28} color="#FF3F4b" />
                    </TouchableOpacity>
                )}
            </View>

            {category.length !== 0 && (
                <TouchableOpacity style={[styles.input, { justifyContent: 'space-between' }]} onPress={() => setModalCategoryVisible(true)}>
                    <Text style={{ color: '#fff', fontSize: 16 }}>
                        {categorySelected?.name}
                    </Text>

                    <MaterialIcons name="arrow-drop-down" size={30} color='#F0f0f0' />
                </TouchableOpacity>
            )}

            {products.length !== 0 && (
                <TouchableOpacity style={[styles.input, { justifyContent: 'space-between' }]} onPress={() => setModalProductVisible(true)}>
                    <Text style={{ color: '#fff', fontSize: 16 }}>
                        {productSelected?.name}
                    </Text>

                    <MaterialIcons name="arrow-drop-down" size={30} color='#F0f0f0' />
                </TouchableOpacity>
            )}

            <View style={styles.qtdContainer}>
                <Text style={styles.qtdText}>Quantidade</Text>

                <TouchableOpacity style={styles.btQtd} onPress={handleLessQtd}>
                    <AntDesign name="minuscircleo" size={24} color="white" />
                </TouchableOpacity>

                <TextInput
                    style={[styles.input, { width: '40%', textAlign: 'center' }]}
                    keyboardType='numeric'
                    value={amount}
                    onChangeText={setAmount}
                    placeholderTextColor='#FFF'
                />

                <TouchableOpacity style={styles.btQtd} onPress={handleAddQtd}>
                    <AntDesign name="pluscircleo" size={24} color="white" />
                </TouchableOpacity>

            </View>

            <View style={styles.actions}>
                <TouchableOpacity style={styles.buttonAdd} onPress={handleAdd} >
                    <Text style={[styles.buttonText, { color: '#fff' }]}>+</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, { opacity: items.length === 0 ? 0.3 : 1 }]}
                    disabled={items.length === 0}
                    onPress={handleFinishOrder}
                >
                    <Text style={styles.buttonText}>Avançar</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                showsVerticalScrollIndicator={false}
                style={{ flex: 1, marginTop: 24 }}
                data={items}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => <ListItem data={item} deleteItem={handleDeleteItem} />}
            />

            <Modal
                transparent={true}
                visible={modalCategoryVisible}
                animationType="fade"
            >
                <ModalPicker
                    handleCloseModal={() => setModalCategoryVisible(false)}
                    options={category}
                    selectedItem={handleChangeCategory}
                />
            </Modal>

            <Modal
                transparent={true}
                visible={modalProductVisible}
                animationType="fade"
            >

                <ModalPicker
                    handleCloseModal={() => setModalProductVisible(false)}
                    options={products}
                    selectedItem={handleChangeProduct}
                />

            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1d1d2e',
        paddingVertical: '5%',
        paddingEnd: '4%',
        paddingStart: '4%',
    },
    header: {
        flexDirection: 'row',
        marginBottom: 12,
        alignItems: 'center',
        marginTop: 24,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#fff',
        marginRight: 14,
    },
    input: {
        backgroundColor: '#101026',
        borderRadius: 4,
        width: '100%',
        height: 46,
        marginBottom: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 8,
        color: '#fff',
        fontSize: 24,
        flexDirection: 'row',
    },
    qtdContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    qtdText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        paddingBottom: 17,
        paddingRight: 4,
    },
    actions: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
    },
    buttonAdd: {
        backgroundColor: '#3fd1ff',
        borderRadius: 4,
        width: '18%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#101026',
        fontSize: 18,
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#3fffa3',
        borderRadius: 4,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        width: '77%'
    },
    btQtd: {
        padding: 6,
        marginBottom: 12,
    }
});

