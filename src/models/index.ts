import UserModel from './User.model'
import GameModel from './Game.model'
import CommentModel from './Comment.model'

const User = UserModel
const Game = GameModel
const Comment = CommentModel

// associations
User.hasMany(Game)
Game.belongsTo(User)

Game.hasMany(Comment)
Comment.belongsTo(Game)

// export
export { User, Game, Comment }