import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Tag {
    id: ID
    name: String
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
    checkList: [String]
    tags: [Tag]
  }
  
  input NoteInput {
    id: ID
    title: String
    description: String
    color: Color
    checkList: [String]
    tags: [String]
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
  }

  type Mutation {
    createTag(input: TagInput): Tag
    updateTag(input: TagInput): Tag
    createNote(input: NoteInput): Note
    updateNote(input: NoteInput): Note
  }
`;
