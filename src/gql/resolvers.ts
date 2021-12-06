import { AuthenticationError } from "apollo-server-express";
import { ArchivedNotes, Notes, Tags, Users } from "../database";
import jwt from "jsonwebtoken";

export const resolvers = {
  Query: {
    getAllTags: (_, args, context) => {
      if (!context.user) throw new AuthenticationError("You must be logged in");

      return new Promise((resolve, reject) => {
        Tags.find({ user: context.user }, (err, tags) => {
          if (err) reject(err);
          else resolve(tags);
        });
      });
    },
    getAllNotes: (_: any, args, context) => {
      if (!context.user) throw new AuthenticationError("You must be logged in");

      return new Promise((resolve, reject) => {
        Notes.find({ user: context.user }, (err, notes) => {
          if (err) reject(err);
          else resolve(notes);
        });
      });
    },
    findNotes: (_: any, { input }, context) => {
      if (!context.user) throw new AuthenticationError("You must be logged in");

      return new Promise((resolve, reject) => {
        Notes.find({ user: context.user })
          .or([
            { title: { $regex: input } },
            { description: { $regex: input } },
          ])
          .exec((err, notes) => {
            if (err) reject(err);
            else resolve(notes);
          });
      });
    },
    findArchivedNotes: (_: any, { input }, context) => {
      if (!context.user) throw new AuthenticationError("You must be logged in");

      return new Promise((resolve, reject) => {
        ArchivedNotes.find({ user: context.user })
          .or([
            { title: { $regex: input } },
            { description: { $regex: input } },
          ])
          .exec((err, notes) => {
            if (err) reject(err);
            else resolve(notes);
          });
      });
    },
  },
  Mutation: {
    createTag: (_: any, { input }, context) => {
      if (!context.user) throw new AuthenticationError("You must be logged in");

      return new Promise((resolve, reject) => {
        Tags.findOne({ name: input.name, user: context.user }, (err, doc) => {
          if (err) {
            reject(err);
          } else if (doc) {
            resolve(doc);
          } else {
            const newTag = new Tags({
              name: input.name,
              user: context.user,
            });

            newTag.id = newTag._id;

            resolve(
              new Promise((resolve, reject) => {
                newTag.save((err) => {
                  if (err) reject(err);
                  else resolve(newTag);
                });
              })
            );
          }
        });
      });
    },
    updateTag: (_: any, { input }, context) => {
      if (!context.user) throw new AuthenticationError("You must be logged in");

      return new Promise((resolve, reject) => {
        Tags.updateOne({ id: input.id }, { name: input.name }, (err) => {
          if (err) reject(err);
          else resolve(input);
        });
      });
    },
    createNote: async (_: any, { input }, context) => {
      if (!context.user) throw new AuthenticationError("You must be logged in");

      const createNote = (input) => {
        const newNote = new Notes({
          title: input.title,
          color: input.color,
          tags: input.tags,
          user: context.user,
        });

        newNote.id = newNote._id;
        if (input.description) {
          newNote.description = input.description;
        } else {
          newNote.checkList = input.checkList;
        }

        return new Promise((resolve, reject) => {
          newNote.save((err) => {
            if (err) reject(err);
            else resolve(newNote);
          });
        });
      };

      if (input.tags && input.tags.length > 0) {
        return await Promise.all(
          input.tags
            .filter((tag) => tag.id == null)
            .map((tag) => {
              return resolvers.Mutation.createTag(
                _,
                {
                  input: {
                    name: tag.name,
                  },
                },
                context
              );
            })
        ).then((values) => {
          input.tags = values;
          return createNote(input);
        });
      } else {
        return createNote(input);
      }
    },
    updateNote: (_: any, { input }, context) => {
      if (!context.user) throw new AuthenticationError("You must be logged in");

      return new Promise((resolve, reject) => {
        var newNote: any = {};
        if (input.title) newNote.title = input.title;
        if (input.description) newNote.description = input.description;
        if (input.color) newNote.color = input.color;
        if (input.checkList) newNote.checkList = input.checkList;
        if (input.tags) newNote.tags = input.tags;

        Notes.findByIdAndUpdate(input.id, newNote, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });
    },
    deleteNote: (_: any, { input }, context) => {
      if (!context.user) throw new AuthenticationError("You must be logged in");

      return new Promise((resolve, reject) => {
        Notes.findByIdAndDelete(input, (err, result) => {
          if (err) {
            reject(err);
          }

          if (result == null) {
            ArchivedNotes.findByIdAndDelete(input, (err, result) => {
              if (err) reject(err);
              else resolve(result);
            });
          } else {
            resolve(result);
          }
        });
      });
    },
    archiveNote: async (_: any, { input }, context) => {
      if (!context.user) throw new AuthenticationError("You must be logged in");

      return new Promise((resolve, reject) => {
        Notes.findByIdAndDelete(input, (err, result) => {
          if (err) {
            reject(err);
          } else if (result != null) {
            const newNote = new ArchivedNotes({
              title: result.title,
              color: result.color,
              tags: result.tags,
              user: context.user
            });

            if (result.description) {
              newNote.description = result.description;
            } else {
              newNote.checkList = result.checkList;
            }

            newNote.id = newNote._id;

            newNote.save((err, res) => {
              if (err) reject(err);
              else resolve(res);
            });
          } else {
            resolve(result);
          }
        });
      });
    },
    createUser: (_: any, { input }, context) => {
      return new Promise((resolve, reject) => {
        const newUser = new Users({
          name: input.name,
          email: input.email,
          password: input.password,
        });

        newUser.id = newUser._id;

        newUser.save((err, res) => {
          if (err) reject(false);
          else resolve(true);
        });
      });
    },
    login: (_: any, { email, password }) => {
      return new Promise((resolve, reject) => {
        Users.findOne({ email }, async (err, user) => {
          if (err) reject(err);
          if (await user.matchPassword(password)) {
            user.token = jwt.sign(
              { id: user._id },
              process.env.SECRET,
              {
                expiresIn: "1h",
              }
            );
            resolve(user);
          } else {
            resolve(null);
          }
        });
      });
    },
  },
};
