module.exports = class UserDto {
  email;
  id;
  isActivated;

  constructor(model) {
    this.email = model.email;
    this.is = model._id;
    this.isActivated = model.isActivated;
  }
}