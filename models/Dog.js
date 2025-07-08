import mongoose from "mongoose";

const dogSchema = new mongoose.Schema({
  breed: { type: String, required: true, unique: true },
  subBreeds: [String],
});

dogSchema.set("toJSON", {
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("Dog", dogSchema);
