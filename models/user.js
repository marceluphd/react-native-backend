const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
      type: String,
      trim: true,
      required: true,
      minlength: 4
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      index: true,
      required: true,
      minlength: 6
    },
    password: {
       type: String,
       trim: true,
       required: true,
       minlength: 8
    },
    tokens: [
        {
          access: {
              type: String,
              required: true
          },
          token: {
              type: String,
              required: true
          }
        }
    ]
});

UserSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();
    return _.pick(userObject, ["_id", "email", "name"]);
}

UserSchema.pre("save", function(next) {
    const user = this;
    if(user.isModified("password")) {
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(user.password, salt, function(err, hash) {
            user.password = hash;
            next();
        });
      });
    } else {
        next();
    }
});

UserSchema.methods.generateAuthToken = function() {
    const user = this;
    const access = "auth";

    const token = jwt.sign({_id: user._id.toHexString(),  access}, 'NJBKJBK34853456HVJHV').toString();

    user.tokens.push({access, token});

    return user.save().then(() => {
        return token;
    });
}

UserSchema.statics.findUserByCredentails = function(email, password) {
    const User = this;
    return User.findOne({email}).then((user) => {
        if(!user) {
            return Promise.reject();
        } else {
            return new Promise((resolve, reject) => {
              bcrypt.compare(password, user.password, (err, res) => {
                  if(res) {
                      resolve(user);
                  } else {
                      reject();
                  }
              })
            })
        }
    });
}

UserSchema.statics.findUserByToken = function(token) {
    const User = this;
    let decoded;

    try {
        decoded = jwt.verify(token, "NJBKJBK34853456HVJHV");
    } catch (e) {
        return Promise.reject();
    }

    return User.findOne({
        "_id": decoded._id,
        "tokens.token": token,
        "tokens.access": "auth"
    });
}

UserSchema.methods.removeToken = function(token) {
    const user = this;

    return user.update({
        $pull: {
            tokens: {token}
        }
    });
}

const User = mongoose.model('UserDB', UserSchema);

module.exports = {User};
