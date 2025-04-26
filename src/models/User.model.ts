import { DataTypes, Model } from "sequelize";
import bcrypt from 'bcrypt';
import sequelize from "../config/database.config";

class User extends Model {
    declare id: number
    declare password: string
    declare username: string

    public checkPassword(loginPassword: string): boolean {
        return bcrypt.compareSync(loginPassword, this.password)
    }
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [8, 32]
        }
    }
},
{
    hooks: {
        // salt and hash the password so it isn't stored in cleartext in the database
        async beforeCreate(newUserData: User) {
            newUserData.password = await bcrypt.hash(newUserData.password, 10)
        },
        async beforeUpdate(updatedUserData: User) {
            if (updatedUserData.password) {
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10)
            }
        }
    },
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'user'
})

export = User