const { DateTime } = require("luxon")
const mongoose = require("mongoose")

const Schema = mongoose.Schema

const AuthorSchema = new Schema({
    first_name: {type: String, required: true, maxLength: 100},
    family_name: {type: String, required: true, maxLength: 100},
    date_of_birth: {type:Date},
    date_of_death: {type:Date},
})


// Virtual for authors full name
AuthorSchema.virtual("name").get(function () {
    let fullName = ""
    if (this.first_name && this.family_name) {
        fullName = `${this.family_name}, ${this.first_name}` 
    }
    if (!this.first_name || !this.family_name) {
        fullName = ""
    }
    return fullName
})

// Virtual for author's URL
AuthorSchema.virtual('url').get(function () {
    return `/catalog/author/${this._id}`
})

// Virtual for author's lifespan
AuthorSchema.virtual('lifespan').get(function () {
    // DateTime.fromJSDate(this.due_back).toLocaleString(DateTime.DATE_MED)
    if (this.date_of_birth && this.date_of_death) {
        var lifespan = `${DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED)} - ${DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED)}`
    }else if (this.date_of_birth && !this.date_of_death) {
        var lifespan = `${DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED)} - present`
    }
    return lifespan
     
})


// Export model
module.exports = mongoose.model("Author", AuthorSchema)
