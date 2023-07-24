"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Profile from "@components/Profile";
import { useSession } from "next-auth/react";

const MyProfile = () => {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);
  const handleEdit = (prompt) => {
    router.push(`/update-prompt?id=${prompt._id}`);
  };

  const handleDelete = async (prompt) => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete this prompt?"
    );

    if (hasConfirmed) {
      try {
        await fetch(`/api/prompt/${prompt._id.toString()}`, {
          method: "DELETE",
        });
        const filteredPosts = posts.filter((p) => {
          return p._id !== prompt._id;
        });
        setPosts(filteredPosts);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${params.username}/posts`);
      const data = await response.json();
      setPosts(data);
    };
    fetchPosts();
  }, []);

  return (
    <Profile
      name={params.username === session?.user.username ? "My" : params.username}
      desc='Welcome to your personalized profile page'
      data={posts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};

export default MyProfile;
