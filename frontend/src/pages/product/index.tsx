import { ChangeEvent, FormEvent, useState } from 'react';
import styles from './styles.module.scss';
import Head from 'next/head';
import { Header } from '@/components/UI/Header';
import { canSSRAuth } from "@/utils/canSSRAuth"

import { RiImageAddLine } from 'react-icons/ri';
import { setupAPIClient } from '@/services/api';
import { toast } from 'react-toastify';

import Select from 'react-select';

type ItemProps = {
    id: String;
    name: String;
}

interface CategoryProps{
    categoryList: ItemProps[];
}

export default function Product({ categoryList }: CategoryProps) {

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');

    const [avatarUrl, setAvatarUrl] = useState('');
    const [imageAvatar, setImageAvatar] = useState<File>();

    const [categories, setCategories] = useState(categoryList);
    const [categorySelected, setCategorySelected] = useState(0);

    const options = [
        {value: "none", label: "--- Escolha uma categoria ---"}
    ]

    function handlefile(e: ChangeEvent<HTMLInputElement>){

        if(!e.target.files){
            return;
        }

        const image = e.target.files[0];

        if(!image){
            return;
        }
        
        if(image.type === 'image/jpeg' || image.type === 'image/png'){
            setImageAvatar(image);
            setAvatarUrl(URL.createObjectURL(e.target.files[0]));
        }
    }

    function handleChangeCategory(event: ChangeEvent<HTMLSelectElement>){
        setCategorySelected(Number(event.target.value));
    }

    async function handleRegister(event: FormEvent){
        event.preventDefault();

        try{
            const data:any = new FormData();

            if(name === '' || price === '' || description === '' || imageAvatar === null){
                toast.warning("Preencha todos os campos!");
                return;
            }

            data.append('name', name);
            data.append('price', price);
            data.append('description', description);
            data.append('category_id', categories[categorySelected].id);
            data.append('file', imageAvatar);

            const apiClient = setupAPIClient();

            await apiClient.post('/product', data);

            toast.success("Produto cadastrado com sucesso!", {theme: "dark"})

        }catch(err){
            console.log(err);
            toast.error("Ops! Erro ao cadastrar");
        }

        setName('');
        setPrice('');
        setDescription('');
        setImageAvatar(undefined);
        setAvatarUrl('');
    }

    return (
        <>
            <Head>
                <title>Novo Produto - Sujeito Pizzaria</title>
            </Head>

            <div>
                <Header />

                <main className={styles.container}>
                    <h1>Novo produto</h1>

                    <form className={styles.form} onSubmit={handleRegister}>

                        <label className={styles.labelAvatar}>
                            <span>
                                <RiImageAddLine size={30} color="#FFF" />
                            </span>

                            <input type="file" accept='image/png, image/jpeg' onChange={handlefile}/>

                            {avatarUrl && (
                                <img
                                    className={styles.preview}
                                    src={avatarUrl}
                                    alt="Foto do produto"
                                    width={250}
                                    height={250}
                                />
                            )}

                        </label>
                                                
                        <select value={categorySelected} onChange={handleChangeCategory} className={styles.minimal}>
                            <option value="first" disabled>--- Escolha sua categoria ---</option>
                            {categories.map( (item, index) => {
                                return(
                                    <option value={index} key={item.id.toString()}>
                                        {item.name}
                                    </option>
                                )
                            })}
                        </select>

                        <input
                            type="text"
                            placeholder='Digite o nome do produto'
                            className={styles.input}
                            value={name}
                            onChange={ (e) => setName(e.target.value)}
                        />

                        <input
                            type="text"
                            placeholder='Valor'
                            className={styles.input}
                            value={price}
                            onChange={ (e) => setPrice(e.target.value)}
                        />

                        <textarea
                            placeholder='Decreva seu produto...'
                            className={styles.input}
                            value={description}
                            onChange={ (e) => setDescription(e.target.value)}
                        />

                        <button type="submit" className={styles.buttonAdd}>
                            Cadastrar
                        </button>
                    </form>
                </main>


            </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    const apiClient = setupAPIClient(ctx);

    const response = await apiClient.get('/category');

    return {
        props: {
            categoryList: response.data
        }
    }
})