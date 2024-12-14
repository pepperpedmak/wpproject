import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt"

// Extend Document interface for Mongoose
interface User extends Document {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    bio?: string;
    pic_dir?: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<User>({
  email: {
      type: String,
      required: true,
      unique: true
  },
  password: {
      type: String,
      required: true,
  },
  firstName: {
      type: String,
      required: true
  },
  lastName: {
      type: String,
      required: true 
  },
  phone: {
      type: String,
      required: true 
  },
  bio: {
      type: String,
      required: false
  },
  pic_dir: {
      type: String,
      required: false
  }
});

userSchema.pre<User>('save', function(next) {
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, (saltError, salt) => {
            if (saltError) {
                return next(saltError);
            }

            bcrypt.hash(this.password, salt, (hashError, hash) => {
                if (hashError) {
                    return next(hashError);
                }
                
                this.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

userSchema.methods.comparePassword = function(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.models.User || mongoose.model<User>("User", userSchema);

const teamSchema = new Schema({
  team_name: {
      type: String,
      required: true 
  }
});

export const Team = mongoose.models.Team || mongoose.model("Team", teamSchema);