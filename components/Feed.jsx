"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import PromptCard from "./PromptCard";

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className='mt-16 prompt_layout'>
      {data.map((prompt) => (
        <PromptCard
          key={prompt._id}
          post={prompt}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const router = useRouter();
  const [searchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState([]);

  const handleSearchChange = async (e) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("/api/prompt", {
        cache: "no-store",
      });
      const data = await res.json();
      setPosts(data);
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    if (!searchParams) setSearchText("");
  }, [searchParams]);

  useEffect(() => {
    const filteredPosts = posts.filter((post) => {
      return (
        post.tag.toLowerCase().includes(searchText.toLocaleLowerCase()) ||
        post.creator.username
          .toLowerCase()
          .includes(searchText.toLocaleLowerCase()) ||
        post.prompt.toLowerCase().includes(searchText.toLocaleLowerCase())
      );
    });
    setResults(filteredPosts);
  }, [searchText]);

  const handleTagClick = (tag) => {
    router.push(`?tag=${tag}`);
    setSearchText(tag);
    handleSearchChange({ target: { value: tag } });
  };

  return (
    <section className='feed'>
      <form className='relative w-full flex-center'>
        <input
          type='text'
          placeholder='Search for a tag or a username...'
          value={searchText}
          onChange={handleSearchChange}
          required
          className='search_input peer'
        />
      </form>
      <PromptCardList
        data={searchText.length > 0 ? results : posts}
        handleTagClick={handleTagClick}
      />
    </section>
  );
};
export default Feed;
