import prismaClient from "../../prisma";

interface CategoryResquest{
    name: String;
}

class CreateCategoryService{
    async execute({ name }: CategoryResquest){

        if(name === ''){
            throw new Error("Name invalid")
        }

        const category = await prismaClient.category.create({
            data:{
                name: `${name}`,
            },
            select:{
                id: true,
                name: true,
            }
        })

        return category
    }
}

export { CreateCategoryService }