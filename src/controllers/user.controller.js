import pkg from "nodemon";
const { emit } = pkg;
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation - not empty
  // check if user already exists: username, email
  // check for images, check for avatar
  // create user object - create entry in DB
  // remove password and refresh token field from response
  // check for user creation
  // return res

  const { fullName, email, username, password } = req.body;
  console.log("Sent email: ", email);

  // the given code checks for the empty data
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All field are required.");
  }

  // checking for the user is already registered or not
  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "The user is already exists.");
  }

  // check for images
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required.");
  }

  // upload on cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  // check that, is it uploaded or not
  if (!avatar) {
    throw new ApiError(400, "Avatar file is required.");
  }

  // entry in database
  User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });
  // searching for the same user in DB to confirm the entry
  // here in select section we subtract which we donot need, by default all are selected
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  // response to the frontend
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registered!"));
});
export { registerUser };
