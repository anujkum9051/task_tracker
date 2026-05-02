import mongoose from 'mongoose';
import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';

const projectPopulate = [
  { path: 'createdBy', select: 'name email role' },
  { path: 'members', select: 'name email role' }
];

export const createProject = async (req, res) => {
  const { name, description = '', members = [] } = req.body;
  const uniqueMemberIds = [...new Set([...members, req.user.id].map(String))];
  const memberCount = await User.countDocuments({ _id: { $in: uniqueMemberIds } });

  if (memberCount !== uniqueMemberIds.length) {
    throw new AppError('One or more selected members do not exist', 400);
  }

  const project = await Project.create({
    name,
    description,
    members: uniqueMemberIds,
    createdBy: req.user._id
  });

  res.status(201).json(await project.populate(projectPopulate));
};

export const getProjects = async (req, res) => {
  const query =
    req.user.role === 'admin'
      ? {}
      : { members: new mongoose.Types.ObjectId(req.user.id) };

  const projects = await Project.find(query).populate(projectPopulate).sort({ createdAt: -1 });
  res.json(projects);
};

export const getProject = async (req, res) => {
  const project = await Project.findById(req.params.id).populate(projectPopulate);

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  const isMember = project.members.some((member) => member.id === req.user.id);
  if (req.user.role !== 'admin' && !isMember) {
    throw new AppError('You do not have access to this project', 403);
  }

  const tasks = await Task.find({ projectId: project._id })
    .populate('assignedTo', 'name email role')
    .populate('createdBy', 'name email role')
    .sort({ dueDate: 1 });

  res.json({ ...project.toJSON(), tasks });
};

export const updateProjectMembers = async (req, res) => {
  const { members = [] } = req.body;
  const project = await Project.findById(req.params.id);

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  const uniqueMemberIds = [...new Set([...members, project.createdBy.toString()].map(String))];
  const memberCount = await User.countDocuments({ _id: { $in: uniqueMemberIds } });

  if (memberCount !== uniqueMemberIds.length) {
    throw new AppError('One or more selected members do not exist', 400);
  }

  project.members = uniqueMemberIds;
  await project.save();

  res.json(await project.populate(projectPopulate));
};
