const UserModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const mailService = require("./mail-service");
const tokenService = require("../services/token-service");
const UserDto = require("../dtos/user-dto");
const ApiError = require("../exceptions/api-error");

class UserService {
  async registration(email, password) {
    const candidate = await UserModel.findOne({email});
    if (candidate) {
      throw ApiError.BadRequest(`User with ${email} already exists`);
    }
    const hashPassword =  await bcrypt.hash(password, 3);
    const activationLink = uuid.v4();

    const user = await UserModel.create({email, password: hashPassword, activationLink});
    await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}` );

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({...userDto});

    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto
    }
  }

  async activate(activationLink) {
    const user = await UserModel.findOne({activationLink})
    if (!user) {
      throw ApiError.BadRequest('Not valid Link!')
    }
    user.isActivated = true;
    await user.save();
  }
  async login(email, password) {
    const user = await UserModel.findOne({email})
    if (!user) {
      throw ApiError.BadRequest("User doesnt exist!")
    }
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest("Incorrect Password!");
    }
    const userDto = new UserDto(user);
    const tokens = await tokenService.generateTokens({...userDto});
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {...tokens, user: userDto};
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);

    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError(); 
    }

    const user = UserModel.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = await tokenService.generateTokens({...userDto});
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {...tokens, user: userDto};
  }

  async getAllUsers() {
    const users = await UserModel.find();
    return users;
  }
}

module.exports = new UserService();