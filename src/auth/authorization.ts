import jwt from "jsonwebtoken";

export const getUser = async (token: string) => {
  if (!token) return null;

  token = token.replace("Bearer ", "");

  const user = await jwt.verify(
    token,
    process.env.SECRET,
    (err, decoded) => {
      if (err) return null;
      return decoded.id;
    }
  );

  return user;
};
