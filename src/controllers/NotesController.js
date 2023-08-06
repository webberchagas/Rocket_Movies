const knex = require('../database/knex')
const AppError = require('../utils/AppError')

class NotesController {
  async create(request, response){
    const { title, description, rating, tags } = request.body
    const id = request.user.id

    const ratingValid = new Array (1,2,3,4,5)
    const ratingIsInvalid = ratingValid.find( value => String(value) === rating)

    if(!ratingIsInvalid){
      throw new AppError('O rank tem que ser entre 1 e 5!')
    }

    const [note_id] = await knex('movie_notes').insert({title, description, rating,   d})

    const tagsInsert = tags.map( name => {
      return {
        note_id,
        user_id: id,
        name
      }
    })

    await knex('movie_tags').insert(tagsInsert)

    return response.json()
  }

  async show(request, response){
    const { id } = request.params

    const note = await knex('movie_notes').where({id}).first()

    const tags = await knex('movie_tags').where({note_id: id}).orderBy('name')

    return response.json({
      ...note,
      tags
    })

  } 

  async delete(request, response){
    const { id } = request.params

    await knex('movie_notes').where({ id }).delete()

    return response.json()
  }

  async index(request, response){
    const { title } = request.query
    const id = request.user.id

    let notes 

    if(title){
      notes = await knex('movie_notes').where({ user_id: id }).whereLike('title', `%${title}%`).orderBy('title')

    } else{
      notes = await knex('movie_notes').where({ user_id: id }).orderBy('title')

    } 

    const userTags = await knex('movie_tags').where({user_id: id})
    const notesWithTags = notes.map( note => {
      const noteTags = userTags.filter( tag => tag.note_id === note.id)

      return {
        ...note,
        tags: noteTags
      }
    })

    return response.json(notesWithTags)
  }
}

module.exports = NotesController