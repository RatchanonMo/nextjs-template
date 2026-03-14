import mongoose, { Document, Schema } from 'mongoose';

export interface ITokenBlacklist extends Document {
  tokenHash: string;
  userId: mongoose.Types.ObjectId;
  expiresAt: Date;
  reason: string;
  createdAt: Date;
  updatedAt: Date;
}

const tokenBlacklistSchema = new Schema<ITokenBlacklist>(
  {
    tokenHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    reason: {
      type: String,
      default: 'logout',
      trim: true,
      maxlength: 80,
    },
  },
  { timestamps: true },
);

// Automatically purge blacklisted tokens once expiration passes.
tokenBlacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const TokenBlacklist = mongoose.model<ITokenBlacklist>('TokenBlacklist', tokenBlacklistSchema);
export default TokenBlacklist;
