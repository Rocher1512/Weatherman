const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReportSchema = new Schema({
    title: {
        type: String
    },
    description:{
        type: String
    }
});


module.exports = mongoose.model('report', ReportSchema);