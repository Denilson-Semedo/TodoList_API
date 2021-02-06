'use strict'

const User = use('App/Models/User')
const { validateAll } = use('Validator')

class UserController {
    async create({ request, response }) {
        try {
            const erroMessage = {
                'username.required': 'O username é Obrigatório',
                'username.min': 'O username deve ter mais que 6 caracteres',
                'username.unique': 'Esse utilizador já existe',
                'email.required': 'O email é Obrigatório',
                'email.email': 'O campo tem de ser um email. exemplo: utilizador@email.com',
                'email.unique': 'Esse email já existe',
                'password.required': 'O password é Obrigatório',
                'password.min': 'O password deve ter mais que 6 caracteres'

            }

            const validation = await validateAll(request.all(), {
                username: 'required|min:5|unique:users',
                email: 'required|email|unique:users',
                password: 'required|min:6'
            }, erroMessage)

            if (validation.fails()) {
                return response.status(401).send({ message: validation.messages() })
            }

            const data = request.only(["username", "email", "password"])

            const user = await User.create(data)

            return user
        } catch (err) {
            return response.status(500).send({ error: `Erro: ${err.message}!!` })
        }

    }

    async login({ request, response, auth }) {
        try {
            const { email, password } = request.all()

            const validaToken = await auth.attempt(email, password)

            return validaToken
        } catch (err) {
            return response.status(500).send({ error: `Erro: ${err.message}` })
        }
    }

    async update({ params, request, response }) {
        try {
            const erroMessage = {
                'username.required': 'O username é Obrigatório',
                'username.min': 'O username deve ter mais que 6 caracteres',
                'email.required': 'O email é Obrigatório',
                'email.email': 'O campo tem de ser um email. exemplo: utilizador@email.com',
                'password.required': 'O password é Obrigatório',
                'password.min': 'O password deve ter mais que 6 caracteres'

            }

            const validation = await validateAll(request.all(), {
                username: 'required|min:5',
                email: 'required|email',
                password: 'required|min:6'
            }, erroMessage)

            if (validation.fails()) {
                return response.status(401).send({ message: validation.messages() })
            }

            const { username, email, password } = request.all()

            const user = await User.query().where('id', params.id).first()

            if (!user) {
                return response.status(404).send({ message: 'Nenhum user encontrado' })
            }

            user.username = username
            user.email = email
            user.password = password
            user.id = params.id

            await user.save()

            return user
        } catch (err) {
            return response.status(500).send({ error: `Erro: ${err.message}` })
        }
    }

    async destroy({ params, request, response, auth }) {
        const user = await User.query().where('id', params.id).first()

        if (!user) {
            return response.status(404).send({ message: 'Nenhum user encontrado' })
        }

        await user.delete()

        return response.status(200).send({ message: 'User removido Com Sucesso' })
    }

    async index({ request, response, view }) {
        const user = await User.all()

        return user
    }

    async show({ params, request, response }) {
        const user = await User.query().where('id', params.id).first()

        if (!user) {
            return response.status(404).send({ message: 'Nenhum user encontrado' })
        }

        return user
    }

}

module.exports = UserController
