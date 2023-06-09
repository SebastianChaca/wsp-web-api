const User = require("../models/usuario");
const addFriend = async (req, res) => {
  const myId = req.uid;
  const email = req.body.email;

  try {
    const findFriend = await User.findOne({ email });


    if (!findFriend) {
      return res.status(404).json({
        ok: false,
        msg: "Email incorrecto",
      });
    }
    const findUser = await User.findOne({ _id: myId });
  
    if (findUser.email === findFriend.email) {
      return res.status(404).json({
        ok: false,
        msg: "No podes ingresar tu propio email",
      });
    }
    const checkifFriendExist = findUser.friends.find((friend) => {
      return friend.user.email == findFriend.email;
    });

    if (checkifFriendExist) {
      return res.status(404).json({
        ok: false,
        msg: "Ya son amigos",
      });
    }
    //agrego el amigo a mi lista de amigos y vice
    const addFriendFN = await User.findOneAndUpdate(
      { _id: myId },
      { $push: { friends: { user: findFriend._id, status: 0 } } },
      { new: true }
    );
    await User.findOneAndUpdate(
      { _id: findFriend._id },
      { $push: { friends: { user: myId, status: 0 } } },
      { new: true }
    );

    const friendAdded = addFriendFN.friends.find((friend) => {
      return friend.user.email == findFriend.email;
    });

    res.json({
      ok: true,
      friend: friendAdded,
    });
  } catch (error) {
    res.json({
      ok: "false",
      friend: "error",
    });
  }
};
const acceptFriend = () => {};

const blockFriend = () => {};

const getFriendAPI= async (req, res) => {
  try{
    const user = await User.findById(req.uid)
    res.json({
      ok: true,
      friend: user.friends,
    });
  }catch(e){
    res.json({
      ok: "false",
      friends: [],
    });
  }
}
const getFriends = async (id) => {

  const user = await User.findById(id);
  //   let user = await User.aggregate([
  //     { $match: { _id: ObjectId(id) } },
  //     {
  //       $lookup: {
  //         from: User.collection.name,
  //         let: { friends: "$friends" },
  //         pipeline: [
  //           {
  //             $match: {
  //               "friends.status": 3,
  //             },
  //           },
  //           {
  //             $project: {
  //               name: 1,
  //               email: 1,
  //               online: 1,
  //             },
  //           },
  //         ],
  //         as: "friends",
  //       },
  //     },
  //   ]);

  return user.friends;
};

module.exports = {
  addFriend,
  getFriends,
  getFriendAPI
};
