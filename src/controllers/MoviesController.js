const knex = require('../database/knex');

class MoviesController {

    async create(request, response) {
        const { title, description, tags, rating} = request.body;
        const { user_id } = request.params;

        const movie_id = await knex("movies_notes").insert({
            title,
            description,
            rating,
            user_id
        });

        const tagsInsert = tags.map( name => {
            return {
                movie_id,
                name,
                user_id
            } 
        });

        await knex("tags").insert(tagsInsert);

        response.json();
    }

    async show(request, response) {
        const { id } = request.params;

        const movies = await knex("movies_notes").where({ id }).first();
        const tags = await knex("tags").where({ movie_id: id }).orderBy("name");

        return response.json({
            ...movies,
            tags,
        });
    }

    async delete(request, response) {
        const { id } = request.params;

        await knex("movies_notes").where({ id }).delete();

        return response.json();
    }

    async index(request, response) {

        const {title, user_id, tags} = request.query;

        let notes;

        if(tags) {
            const filterTags = tags.split(',').map(tag => tag.trim());

            notes = await knex("tags")
            .select([
                "movies_notes.id",
                "movies_notes.title",
                "movies_notes.user_id"
            ])
            .where("movies_notes.user_id", user_id)
            .whereLike("movies_notes.title", `%${title}%`)
            .whereIn("name", filterTags)
            .innerJoin("movies_notes", "movies_notes.id", "tags.movie_id")
            .orderBy("movies_notes.title");
            
        }else {
            notes = await knex("movies_notes")
            .where({ user_id })
            .whereLike("title", `%${title}%`)
            .orderBy("title");
        }

        const userTags = await knex("tags").where({ user_id });
        const notesWithTags = notes.map(note => {
            const noteTags = userTags.filter(tag => tag.note_id === note.id);

            return {
                ...note,
                tags: noteTags
            }
        })
        
        return response.json(notesWithTags);

    }

}

module.exports = MoviesController;