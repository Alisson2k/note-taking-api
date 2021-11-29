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
  },
};
