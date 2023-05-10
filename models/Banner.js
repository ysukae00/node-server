import mongoose from "mongoose";

const bannerSchema = mongoose.Schema({
    image: String,
    description:  String,
    title: String,
}, {timestamps: true});

const Banner = mongoose.model("Banner", bannerSchema);

export default Banner;