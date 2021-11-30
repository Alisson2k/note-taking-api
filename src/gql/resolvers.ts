import { Tags, Notes } from "../database";

export const resolvers = {
  Query: {
    getAllTags: (_: any) => {
      return new Promise((resolve, reject) => {
        Tags.find((err, tags) => {
          if (err) reject(err);
          else resolve(tags);
        });
      });
    },
    getAllNotes: (_: any) => {
      return new Promise((resolve, reject) => {
        Notes.find((err, notes) => {
          if (err) reject(err);
          else resolve(notes);
        });
      });
    },
    findNotes: (_: any, { input }) => {
      return new Promise((resolve, reject) => {
        Notes.find()
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
    createTag: (_: any, { input }) => {
      return new Promise((resolve, reject) => {
        Tags.findOne({ name: input.name }, (err, doc) => {
          if (err) {
            reject(err);
          } else if (doc) {
            resolve(doc);
          } else {
            const newTag = new Tags({
              name: input.name,
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
    updateTag: (_: any, { input }) => {
      return new Promise((resolve, reject) => {
        Tags.updateOne({ id: input.id }, { name: input.name }, (err) => {
          if (err) reject(err);
          else resolve(input);
        });
      });
    },
    createNote: async (_: any, { input }) => {
      const createNote = (input) => {
        const newNote = new Notes({
          title: input.title,
          description: input.description,
          color: input.color,
          tags: input.tags,
          checkList: input.checkList,
        });

        newNote.id = newNote._id;

        return new Promise((resolve, reject) => {
          newNote.save((err) => {
            if (err) reject(err);
            else resolve(newNote);
          });
        });
      };

      if (input.tags && input.tags.length > 0) {
        return await Promise.all(
          input.tags.map((tag) => {
            return resolvers.Mutation.createTag(_, {
              input: {
                name: tag,
              },
            });
          })
        ).then((values) => {
          input.tags = values;
          return createNote(input);
        });
      } else {
        return createNote(input);
      }
    },
    updateNote: (_: any, { input }) => {
      return new Promise((resolve, reject) => {
        var newNote: any = {};
        if (input.title) newNote.title = input.title;
        if (input.description) newNote.description = input.description;
        if (input.color) newNote.color = input.color;
        if (input.checkList) newNote.checkList = input.checkList;
        if (input.tags) newNote.tags = input.tags;

        Notes.findOneAndUpdate({ id: input.id }, newNote, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });
    },
  },
};
