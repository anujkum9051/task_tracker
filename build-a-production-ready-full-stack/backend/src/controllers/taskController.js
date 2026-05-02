import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';

const taskPopulate = [
  { path: 'assignedTo', select: 'name email role' },
  { path: 'createdBy', select: 'name email role' },
  { path: 'projectId', select: 'name description members' }
];

export const createTask = async (req, res) => {
  const { title, description = '', status = 'Todo', dueDate, assignedTo, projectId } = req.body;
  const [project, user] = await Promise.all([
    Project.findById(projectId),
    User.findById(assignedTo)
  ]);

  if (!project) throw new AppError('Project not found', 404);
  if (!user) throw new AppError('Assigned user not found', 404);

  const isProjectMember = project.members.map(String).includes(String(assignedTo));
  if (!isProjectMember) {
    project.members.push(assignedTo);
    await project.save();
  }

  const task = await Task.create({
    title,
    description,
    status,
    dueDate,
    assignedTo,
    projectId,
    createdBy: req.user._id
  });

  res.status(201).json(await task.populate(taskPopulate));
};

export const getTasks = async (req, res) => {
  const { status, project, assignedTo, search } = req.query;
  const query = {};

  if (req.user.role === 'member') {
    query.assignedTo = req.user._id;
  } else if (assignedTo) {
    query.assignedTo = assignedTo;
  }

  if (status) query.status = status;
  if (project) query.projectId = project;
  if (search) query.title = { $regex: search, $options: 'i' };

  const tasks = await Task.find(query).populate(taskPopulate).sort({ dueDate: 1, createdAt: -1 });
  res.json(tasks);
};

export const updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  const isAssignedMember = String(task.assignedTo) === req.user.id;
  if (req.user.role !== 'admin' && !isAssignedMember) {
    throw new AppError('You can only update tasks assigned to you', 403);
  }

  if (req.user.role === 'member') {
    task.status = req.body.status ?? task.status;
  } else {
    const allowedFields = ['title', 'description', 'status', 'dueDate', 'assignedTo', 'projectId'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) task[field] = req.body[field];
    });
  }

  await task.save();
  res.json(await task.populate(taskPopulate));
};

export const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  await task.deleteOne();
  res.status(204).send();
};
