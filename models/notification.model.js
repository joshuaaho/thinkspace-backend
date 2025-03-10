import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const notificationSchema = new Schema(
  {
    to: {
      type: Schema.ObjectId,
      ref: 'User',
    },
    from: {
      type: Schema.ObjectId,
      ref: 'User',
    },
    redirectPath: {
      type: String,
    },
    event: { type: String },
    isRead: { type: Boolean, default: false },
    resourceId: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model('Notification', notificationSchema);
