'use strict'

const Tarefa = use('App/Models/Task')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with tasks
 */
class TaskController {
  /**
   * Show a list of all tasks.
   * GET tasks
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view, auth }) {
    const tarefa = await Tarefa.query().where('user_id', auth.user.id).fetch( )

    return tarefa
  }

  /**
   * Render a form to be used for creating a new task.
   * GET tasks/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new task.
   * POST tasks
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth}) {
    const {id} = auth.user

    const data = request.only(["nome", "descricao"])

    const tarefa = await Tarefa.create({...data,user_id: id})
  
    return tarefa
  }

  /**
   * Display a single task.
   * GET tasks/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, auth }) {
    const tarefa = await Tarefa.query().where('id', params.id)
    .where('user_id','=', auth.user.id).first()

    if(!tarefa) {
      return response.status(404).send({message: 'Nenhuma tarefa encontrada'})
    }

    return tarefa
  }

  /**
   * Render a form to update an existing task.
   * GET tasks/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update task details.
   * PUT or PATCH tasks/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response, auth }) {
    const { nome, descricao } = request.all()

    const tarefa = await Tarefa.query().where('id', params.id)
    .where('user_id','=', auth.user.id).first()

    if(!tarefa) {
      return response.status(404).send({message: 'Nenhuma tarefa encontrada'})
    }

    tarefa.nome = nome
    tarefa.descricao = descricao
    tarefa.id = params.id

    await tarefa.save()

    return tarefa
  }

  /**
   * Delete a task with id.
   * DELETE tasks/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response, auth }) {
    const tarefa = await Tarefa.query().where('id', params.id)
    .where('user_id','=', auth.user.id).first()

    if(!tarefa) {
      return response.status(404).send({message: 'Nenhuma tarefa encontrada'})
    }

    await tarefa.delete()
    return response.status(200).send({message: 'Tarefa removida Com Sucesso'})
  }
}

module.exports = TaskController
