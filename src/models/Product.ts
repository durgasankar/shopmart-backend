import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../configs/postgres-db";

export interface ProductAttributes {
    id?: number;
    name: string;
    price: number;
    category: string;
    quantity: number;
    image?: Buffer;
    createdAt?: Date;
    updatedAt?: Date;
}

interface ProductCreationAtttribute extends Optional<ProductAttributes, 'id'> { }

class Product extends Model<ProductAttributes, ProductCreationAtttribute> implements ProductAttributes {

    public id!: number;
    public name!: string;
    public category!: string;
    public price!: number;
    public quantity!: number;
    public image!: Buffer;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Product.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: true
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    image: {
        type: DataTypes.BLOB('long'),
        allowNull: true,
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'products'
});

export default Product;