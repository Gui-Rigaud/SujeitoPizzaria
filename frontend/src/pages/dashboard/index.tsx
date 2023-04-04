import { useState } from "react"
import { canSSRAuth } from "@/utils/canSSRAuth"
import { setupAPIClient } from "@/services/api"

import Head from "next/head"
import { Header } from "@/components/UI/Header"

import styles from './styles.module.scss'
import { FiRefreshCcw } from "react-icons/fi"

import Modal from 'react-modal'
import { ModalOrder } from "@/components/UI/ModalOrder"

type OrderProps = {
    id: String;
    table: String | number;
    status: boolean;
    draft: boolean;
    name: String | null;
}

interface HomeProps {
    orders: OrderProps[];
}

export type OrderItemProps = {
    id: String,
    amount: number,
    order_id: String,
    product_id: String,
    product: {
        id: String,
        name: String,
        description: String,
        price: String,
        banner: String
    }
    order: {
        id: String;
        table: String | number;
        status: boolean;
        draft: boolean;
        name: String | null;
    }
}

export default function Dashboard({ orders }: HomeProps) {
    const [orderList, setOrderList] = useState(orders || []);

    const [modalItem, setModalItem] = useState<OrderItemProps[] | any>();
    const [modalVisible, setModalVisible] = useState(false);

    function handleCloseModal(){
        setModalVisible(false);
    }

    async function handleOpenModalView(id: String) {
        
        const apiClient = setupAPIClient();

        const response = await apiClient.get('/order/detail', {
            params:{
                order_id: id,
            }
        });

        setModalItem(response.data);
        setModalVisible(true);
    }

    async function handleFinishItem(id: String){
        const apiClient = setupAPIClient();
        await apiClient.put('/order/conclude', {
            order_id: id,
        });

        const response = await apiClient.get('order/list');

        setOrderList(response.data);
        setModalVisible(false);
    }

    async function handleRefreshOrders() {
        const apiClient = setupAPIClient();

        const response = await apiClient.get('/order/list')
        setOrderList(response.data);
    }

    Modal.setAppElement('#__next');

    return (
        <>
            <Head>
                <title>Painel - Sujeito Pizzaria</title>
            </Head>


            <div>
                <Header />


                <main className={styles.container}>
                    <div className={styles.containerHeader}>
                        <h1>Últimos pedidos</h1>

                        <button onClick={handleRefreshOrders}>
                            <FiRefreshCcw size={25} color="#3fffa3" />
                        </button>
                    </div>

                    <article className={styles.listOrders}>

                        {orderList.length === 0 && (
                            <span className={styles.emptyList}>
                                Não há pedidos abertos...
                            </span>
                        )}

                        {orderList.map((item, index) => {
                            return (
                                <section key={String(item.id)} className={styles.orderItem}>
                                    <button onClick={() => { handleOpenModalView(item.id) }}>
                                        <div className={styles.tag}></div>
                                        <span>Mesa {item.table}</span>
                                    </button>
                                </section>
                            )
                        })}
                    </article>
                </main>

                {modalVisible && (
                    <ModalOrder
                    isOpen={modalVisible}
                    onRequestClose={handleCloseModal}
                    order={modalItem}
                    handleFinishOrder={handleFinishItem}
                    />
                )}
            </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

    const apiClient = setupAPIClient(ctx);

    const response = await apiClient.get('/order/list');

    return {
        props: {
            orders: response.data
        }
    }
})