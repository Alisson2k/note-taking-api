import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Tag {
    id: ID
    name: String
    createdAt: String
    updatedAt: String
  }

  input TagInput {
    id: ID
    name: String
  }

  type Note {
    id: ID
    title: String
    description: String
    color: Color
    checkList: [CheckList]
    tags: [Tag]
    createdAt: String
    updatedAt: String
  }

  type Note {
    id: ID
    title: String
    description: String
    color: Color
    checkList: [CheckList]
    tags: [Tag]
    createdAt: String
    updatedAt: String
  }

  type CheckList {
    checked: Boolean
    item: String
  }

  input NoteInput {
    id: ID
    title: String
    description: String
    color: Color
    checkList: [CheckListInput]
    tags: [TagInput]
  }

  input CheckListInput {
    checked: Boolean
    item: String
  }

  input TagInput {
    id: ID
    name: String
  }

  enum Color {
    BLACK
    RED
    ORANGE
    YELLOW
    GREEN
    BLUE
    CYAN
    PURPLE
    PINK
    BROWN
    GRAY
  }

  type Query {
    getAllTags: [Tag]
    getAllNotes: [Note]
    findNotes(input: String): [Note]
    findArchivedNotes(input: String): [Note]
  }

  type Mutation {
    createTag(input: TagInput): Tag
    updateTag(input: TagInput): Tag
    createNote(input: NoteInput): Note
    updateNote(input: NoteInput): Note
    deleteNote(input: ID): Note
    archiveNote(input: ID): Note
  }
`;
