import mongoose, { Document, Schema, Types } from "mongoose";
import bcrypt from "bcrypt"
import { describe } from "node:test";

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
  teamName: {
      type: String,
      required: true 
  },
  projects:[{
    project :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
      },
  }],
  users: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      role: {
        type: String,
        enum : ["projectmanager","member"] ,
        required: true,
      },
      status: {
        type: String,
        enum: ["pending", "join"], 
        default: "pending",
        required: true,
      },
      
      totalSend: {
        type: Number,
        default: 0,
      },
      totalApprove: {
        type: Number,
        default: 0,
      },
      totalReject: {
        type: Number,
        default: 0,
      },
      late: {
        type: Number,
        default: 0,
      },
    },
  ],
});

export const Team = mongoose.models.Team || mongoose.model("Team", teamSchema);

const projectSchema = new Schema({
  projectName : {
    type : String,
    required : true,
  },
  tasks : [{
      task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    }],
})

export const Project = mongoose.models.Project || mongoose.model("Project" , projectSchema);

const taskSchema = new Schema({
  taskTitle :{
    type : String,
    required :true,
  },
  startDate:{
    type : Date,
    required :true,
  },
  endDate:{
    type : Date,
    required :true,
  },
  status:{
    type: String,
    enum : ['todo','inprogress','testing','complete'] ,
    default: 'todo' ,
  },
  priority:{
    type: String,
    enum : ['low','medium','high','urgent'] ,
    required : true,
  },
  describtion:{
    type : String,
  },
  users:[{
    user:{
      type: mongoose.Schema.Types.ObjectId,
      ref : "User",
    },
    fileDir:{
      type : String,
      required : true,
    },
    fileName:{
      type : String,
      required : true,
    },
    uploadDate:{
      type : Date,
      required : true
    },
    isAccept:{
      type : Boolean,
      default : false,
    }
  }]
})

export const Task = mongoose.models.Task || mongoose.model("Task" , taskSchema);