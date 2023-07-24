import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth/next";
import User from "@models/user";
import { connectToDB } from "@utils/database";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      const sessionUser = await User.findOne({ email: session.user.email });
      session.user.id = sessionUser._id.toString();
      session.user.username = sessionUser.username;
      return session;
    },
    async signIn({ profile }) {
      try {
        await connectToDB();

        // check if user already exists
        const userExists = await User.findOne({ email: profile.email });

        // if not, create a new document and save user in MongoDB
        if (!userExists) {
          // First generate a username using the user's name
          let proposedUsername = profile.name.replace(" ", "").toLowerCase();
          let uniteration = -1;
          // Have an initial name to check against
          let nextName = proposedUsername;
          // Add an incremental number to the end of the username if it already exists
          const generateUsername = async () => {
            const usernameExists = await User.findOne({
              username: proposedUsername,
            });
            if (usernameExists) {
              uniteration++;
              nextName = `${proposedUsername}${uniteration}`;
              generateUsername();
            }
            return nextName;
          };
          // Create a new user object
          const newUser = async () => ({
            email: profile.email,
            // Start with the proposed username
            username: await generateUsername(),
            image: profile.picture,
          });
          const finalUser = await newUser();
          // Save the user with unique username to the database
          await User.create(finalUser);
        }

        return true;
      } catch (error) {
        console.log("Error checking if user exists: ", error.message);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
