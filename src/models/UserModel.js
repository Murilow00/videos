import prisma from '../lib/services/prismaClient.js';

export default class UserModel {
    constructor({ id = null, nome, user_name, email, senha, create_at, posts, followers, following } = {}) {
        this.id = id;
        this.nome = nome;
        this.user_name = user_name;
        this.email = email;
        this.senha = senha;
        this.create_at = create_at;
        this.posts = posts;
        this.followers = followers;
        this.following = following;
    }

    async criar() {
        return prisma.user.create({
            data: {
                nome: this.nome,
                user_name: this.user_name,
                email: this.email,
                senha: this.senha, 
                create_at: this.create_at,
                posts: this.posts ? { create: this.posts } : undefined,
                followers: this.followers ? { connect: this.followers.map(id => ({ id })) } : undefined,
                following: this.following ? { connect: this.following.map(id => ({ id })) } : undefined,
            },
        });
    }

    async atualizar() {
        return prisma.user.update({
            where: { id: this.id },
            data: { nome: this.nome, user_name: this.user_name, email: this.email, senha: this.senha },
        });
    }

    async deletar() {
        return prisma.user.delete({ where: { id: this.id } });
    }

    static async buscarTodos(filtros = {}) {
        const where = {};

        if (filtros.nome) {
            where.nome = { contains: filtros.nome, mode: 'insensitive' };
        }
        if (filtros.user_name !== undefined) {
            where.user_name = { contains: filtros.user_name, mode: 'insensitive' };
        }       
        return prisma.user.findMany({ where });
    }

    static async buscarPorId(id) {
        const data = await prisma.user.findUnique({ where: { id } });
        if (!data) {
            return null;
        }
        return new UserModel(data);
    }
}