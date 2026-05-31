import pg from 'pg';
import 'dotenv/config';
import pkg from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const { PrismaClient } = pkg;
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Resetando tabelas...');
    
    // Deletamos primeiro os posts por causa da restrição de chave estrangeira (FK)
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();

    console.log('📦 Inserindo usuários de teste...');
    
    const alice = await prisma.user.create({
        data: {
            nome: 'Alice Silva',
            user_name: 'alice_dev',
            email: 'alice@email.com',
            senha: 'senha_criptografada_123', // Em produção, use bcrypt/argon2
        },
    });

    const bob = await prisma.user.create({
        data: {
            nome: 'Bob Souza',
            user_name: 'bob_banco',
            email: 'bob@email.com',
            senha: 'senha_criptografada_456',
        },
    });

    const charlie = await prisma.user.create({
        data: {
            nome: 'Charlie Costa',
            user_name: 'charlie_chu',
            email: 'charlie@email.com',
            senha: 'senha_criptografada_789',
        },
    });

    console.log('👥 Conectando a rede de seguidores...');
    
    // Bob e Charlie seguem a Alice
    await prisma.user.update({
        where: { id: bob.id },
        data: { following: { connect: { id: alice.id } } },
    });
    
    await prisma.user.update({
        where: { id: charlie.id },
        data: { following: { connect: { id: alice.id } } },
    });

    // Alice segue o Bob de volta
    await prisma.user.update({
        where: { id: alice.id },
        data: { following: { connect: { id: bob.id } } },
    });

    console.log('📝 Criando Tweets principais...');
    
    const tweetAlice = await prisma.post.create({
        data: {
            content: 'Acabei de modelar um clone do Twitter usando apenas 2 tabelas físicas no Prisma! 🚀',
            author_id: alice.id,
        },
    });

    const tweetBob = await prisma.post.create({
        data: {
            content: 'Bancos relacionais são fantásticos quando você acerta na modelagem auto-referenciada.',
            author_id: bob.id,
        },
    });

    console.log('💬 Criando interações (Respostas e Retweets)...');

    // Bob responde ao tweet da Alice (Usa o parent_id)
    await prisma.post.create({
        data: {
            content: 'Caramba, genial! Ficou muito limpo o schema.',
            author_id: bob.id,
            parent_id: tweetAlice.id,
        },
    });

    // Charlie faz um Retweet simples do tweet da Alice (content vai como null, mas aponta para o parent_id)
    await prisma.post.create({
        data: {
            content: null,
            author_id: charlie.id,
            parent_id: tweetAlice.id,
        },
    });

    console.log('✅ Seed do Twitter concluído com sucesso!');
}

main()
    .catch((e) => {
        console.error('❌ Erro no seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });