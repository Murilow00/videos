import Usermodel from '../models/UserModel.js';

export const criar = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const { nome, user_name, email, senha } = req.body;

        if (!nome ) {
            return res.status(400).json({ error: 'O campo nome é obrigatório!' });
        }
                if (!user_name ) {
            return res.status(400).json({ error: 'O campo user_name é obrigatório!' });
        }
                if (!email ) {
            return res.status(400).json({ error: 'O campo email é obrigatório!' });
        }
                if (!senha ) {
            return res.status(400).json({ error: 'O campo senha é obrigatório!' });
        }


        const user = new Usermodel({ nome, user_name, email, senha });
        const data = await user.criar();

        return res.status(201).json({ message: 'Registro criado com sucesso!', data });
    } catch (error) {
        console.error('Erro ao criar:', error);
        return res.status(500).json({ error: 'Erro interno ao salvar o registro.' });
    }
};

export const buscarTodos = async (req, res) => {
    try {
        const registros = await Usermodel.buscarTodos(req.query);

        if (!registros || registros.length === 0) {
            return res.status(400).json({ message: 'Nenhum registro encontrado.' });
        }

        return res.status(200).json(registros);
    } catch (error) {
        console.error('Erro ao buscar:', error);
        return res.status(500).json({ error: 'Erro ao buscar registros.' });
    }
};

export const buscarPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'O ID enviado não é um número válido.' });
        }

        const user = await Usermodel.buscarPorId(parseInt(id));

        if (!user) {
            return res.status(404).json({ error: 'Registro não encontrado.' });
        }

        return res.status(200).json({ data: user });
    } catch (error) {
        console.error('Erro ao buscar:', error);
        return res.status(500).json({ error: 'Erro ao buscar registro.' });
    }
};

export const atualizar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        if (!req.body) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const user = await Usermodel.buscarPorId(parseInt(id));

        if (!user) {
            return res.status(404).json({ error: 'Registro não encontrado para atualizar.' });
        }

        if (req.body.nome !== undefined) {
            user.nome = req.body.nome;
        }

        const data = await user.atualizar();

        return res.status(200).json({ message: `O registro "${data.nome}" foi atualizado com sucesso!`, data });
    } catch (error) {
        console.error('Erro ao atualizar:', error);
        return res.status(500).json({ error: 'Erro ao atualizar registro.' });
    }
};

export const deletar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        const user = await Usermodel.buscarPorId(parseInt(id));

        if (!user) {
            return res.status(404).json({ error: 'Registro não encontrado para deletar.' });
        }

        await user.deletar();

        return res.status(200).json({ message: `O registro "${user.nome}" foi deletado com sucesso!`, deletado: user });
    } catch (error) {
        console.error('Erro ao deletar:', error);
        return res.status(500).json({ error: 'Erro ao deletar registro.' });
    }
};