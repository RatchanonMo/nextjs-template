import bcrypt from 'bcryptjs';
import mongoose, { Document, Schema } from 'mongoose';

export type UserAccountStatus = 'active' | 'suspended' | 'deactivated';
export type UserRole = 'admin' | 'user';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  accountStatus: UserAccountStatus;
  passwordChangedAt: Date | null;
  tokenInvalidBefore: Date | null;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
      index: true,
    },
    accountStatus: {
      type: String,
      enum: ['active', 'suspended', 'deactivated'],
      default: 'active',
      index: true,
    },
    passwordChangedAt: {
      type: Date,
      default: null,
    },
    tokenInvalidBefore: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const stripSensitiveFields = (ret: any) => {
  ret.id = ret._id ? String(ret._id) : undefined;
  delete ret._id;
  delete ret.__v;
  delete ret.password;
  delete ret.passwordChangedAt;
  delete ret.tokenInvalidBefore;
  return ret;
};

userSchema.pre('save', async function save(next) {
  if (!this.isModified('password')) {
    next();
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  if (!this.isNew) {
    this.passwordChangedAt = new Date();
  }

  next();
});

userSchema.pre('findOneAndUpdate', async function hashPasswordOnUpdate(next) {
  const update = this.getUpdate() as Record<string, unknown> | undefined;
  if (!update) {
    next();
    return;
  }

  const directPassword = typeof update.password === 'string' ? update.password : undefined;
  const setObject = (update.$set as Record<string, unknown> | undefined) ?? undefined;
  const setPassword = typeof setObject?.password === 'string' ? setObject.password : undefined;
  const password = directPassword ?? setPassword;

  if (!password) {
    next();
    return;
  }

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  if (directPassword) {
    update.password = hashedPassword;
  }

  const changedAt = new Date();

  if (setPassword) {
    update.$set = {
      ...setObject,
      password: hashedPassword,
      passwordChangedAt: changedAt,
    };
  } else {
    update.$set = {
      ...(setObject ?? {}),
      passwordChangedAt: changedAt,
    };
  }

  this.setUpdate(update);
  next();
});

userSchema.methods.comparePassword = async function comparePassword(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.set('toJSON', {
  virtuals: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform: (_doc, ret: any) => stripSensitiveFields(ret),
});

userSchema.set('toObject', {
  virtuals: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform: (_doc, ret: any) => stripSensitiveFields(ret),
});

const User = mongoose.model<IUser>('User', userSchema);
export default User;
