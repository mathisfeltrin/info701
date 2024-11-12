import { Model, model, Schema } from "mongoose";
import { hash, compare, genSalt } from "bcrypt";

interface UserDocument extends Document {
  email: string;
  name: string;
  password: string;
  role:
    | "vendeur"
    | "RCO"
    | "secretaire"
    | "chauffeur"
    | "expert_produit"
    | "accessoiriste"
    | "FM"
    | "comptable";
}

interface Methods {
  comparePassword(password: string): Promise<Boolean>;
}

const userSchema = new Schema<UserDocument, {}, Methods>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: [
        "vendeur",
        "RCO",
        "secretaire",
        "chauffeur",
        "expert_produit",
        "accessoiriste",
        "FM",
        "comptable",
      ],
      default: "vendeur",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (password) {
  return await compare(password, this.password);
};

const UserModel = model("User", userSchema);

export default UserModel as Model<UserDocument, {}, Methods>;
