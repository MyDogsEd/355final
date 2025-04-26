import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database.config";

class Comment extends Model {
    declare id: number;
    declare title: string;
    declare date: Date;
    declare content: string;
    declare formattedDate: string;

    public formatDate(): string {
        return `${this.date.toISOString().slice(0, 10)}`
    }
}

Comment.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        formattedDate: {
            type: DataTypes.STRING
        }
    },
    {
        sequelize,
        underscored: true,
        hooks: { // hooks to format the comment date on updates and creation
            async beforeCreate(newCommentData: Comment) {
                newCommentData.formattedDate = newCommentData.formatDate()
            },
            async beforeUpdate(newCommentData: Comment) {
                newCommentData.formattedDate = newCommentData.formatDate()
            },
        }
    }
);

export = Comment;
