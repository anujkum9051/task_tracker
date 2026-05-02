import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: 2,
      maxlength: 160
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1500,
      default: ''
    },
    status: {
      type: String,
      enum: ['Todo', 'In Progress', 'Done'],
      default: 'Todo'
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required']
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

taskSchema.virtual('isOverdue').get(function isOverdue() {
  return this.status !== 'Done' && this.dueDate && this.dueDate < new Date();
});

taskSchema.index({ assignedTo: 1, status: 1 });
taskSchema.index({ projectId: 1, dueDate: 1 });

export const Task = mongoose.model('Task', taskSchema);
