const {Schema,model} = require('mongoose');


const TokenSchema = new mongoose.Schema({
    user:{type : Schema.Types.ObjectId,ref :'User'},
    reffershtoken : {type:String,required:true}},
)

module.exports = model('User',UserSchema);