import { prisma } from "../../config/prisma";

class UserService{
    public async findUserById(userId : string){
        const user = await prisma.user.findUnique({
            where : {id : userId}
        })

        return user;
    }

    public async findUserByEmail(email : string){
        const user = await prisma.user.findUnique({
            where : {email}
        })

        return user;
    }

    public async findUserByUsername(username : string){
        const user = await prisma.user.findUnique({
            where : {username}
        })

        return user;
    }
}

export default new UserService();