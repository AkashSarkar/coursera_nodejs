const moongoose = require("mongoose");

const Schema = moongoose.Schema;

const CommentSchema = new Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const DishSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    comments: [CommentSchema],
  },
  {
    timestamps: true,
  }
);

let Dishes = moongoose.model("Dish", DishSchema);

module.exports = Dishes;
