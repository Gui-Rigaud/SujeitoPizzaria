import prismaClient from "../../prisma";

interface ProductRequest{
    name: String;
    price: String;
    description: String;
    banner: String;
    category_id: String;
}

class CreateProductService{
    async execute({ name, price, description, banner, category_id}: ProductRequest){
        
        const product = await prismaClient.product.create({
            data:{
                name: `${name}`,
                price: `${price}`,
                description: `${description}`,
                banner: `${banner}`,
                category_id: `${category_id}`,
            }
        })

        return product;
    }
}

export { CreateProductService }