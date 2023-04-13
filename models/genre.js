const mongoose = require('mongoose')

const Schema = mongoose.Schema

const GenreSchema = new Schema({
    name: {type: String, minLength: 3, maxLength: 100},
})

// Virtual for genre's url
GenreSchema.virtual("url").get(function () {
    return `/catalog/genre/${this._id}`
})

// Export modules
module.exports = mongoose.model("Genre", GenreSchema)

