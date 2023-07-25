import Feed from "@components/Feed";

const Home = async () => {
  const posts = await getPosts();

  return (
    <section className='w-full flex-center flex-col'>
      <h1 className='head_text text-center'>
        Discover & share
        <br className='max-md:hidden' />
        <span className='orange_gradient text-center'>AI-powered prompts</span>
      </h1>
      <p className='desc text-center'>
        Promptopia is an open-source AI prompting tool for modern world to
        discover, create and share creative prompts
      </p>
      <Feed posts={posts} />
    </section>
  );
};

const getPosts = async () => {
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/prompt`, {
    cache: "no-store",
  });
  const posts = await response.json();
  return posts;
};

export default Home;
