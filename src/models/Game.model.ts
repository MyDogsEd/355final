import {
    DataTypes,
    Model,
    BelongsToGetAssociationMixin,
    HasManyGetAssociationsMixin,
    HasManyCreateAssociationMixin,
} from "sequelize";
import sequelize from "../config/database.config";
import User from "./User.model";
import Comment from "./Comment.model";

class Game extends Model {
    declare name: string;
    declare datePurchased: Date;
    declare willPlayDate: Date;
    declare notes: string;
    declare id: number;
    declare formattedWillPlayDate: string
    declare formattedDatePurchased: string

    // Game.belongsTo(User)
    declare getUser: BelongsToGetAssociationMixin<User>;

    // Game.hasMany(Comment)
    declare getComments: HasManyGetAssociationsMixin<Comment>;
    declare createComment: HasManyCreateAssociationMixin<Comment>;

    public formatDatePurchased(): string {
        return `${this.datePurchased.toISOString().slice(0, 10)}`;
    }

    public formatWillPlayDate(): string {
        return `${this.willPlayDate.toISOString().slice(0, 10)}`;
    }
}

Game.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        datePurchased: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        willPlayDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        notes: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        formattedDatePurchased: {
            type: DataTypes.STRING
        },
        formattedWillPlayDate: {
            type: DataTypes.STRING
        }

    },
    {
        sequelize,
        underscored: true,
        hooks: { // hooks to format the comment date on updates and creation
            async beforeCreate(newGameData: Game) {
                newGameData.formattedDatePurchased = newGameData.formatDatePurchased()
                newGameData.formattedWillPlayDate = newGameData.formatWillPlayDate()
            },
            async beforeUpdate(newGameData: Game) {
                newGameData.formattedDatePurchased = newGameData.formatDatePurchased()
                newGameData.formattedWillPlayDate = newGameData.formatWillPlayDate()
            },
        }
    }
);

export = Game;
