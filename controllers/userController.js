const userModel = require('./../models/userModels')
const asyncError = require('./../utils/asyncError')



exports.getAllUsers = asyncError(async (req,res)=>{
    const users = await userModel.find()
    // console.log(users);

    res.status(200).json({
      status : 'success',
      data : {
        users
      }
    })
})

exports.updateUser = (req,res)=>{
  res.send("this route will handle user post requests")
}

exports.getUserById = (req,res)=>{
  const user = req.params.id
  res.send(`this is the user of id ${user}`)
}

exports.postUserById = (req,res)=>{
  const user = req.params.id
  res.send(`this is the updated user of id ${user}`)
}
