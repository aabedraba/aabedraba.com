import { Layout } from "../components/Layout";

import { GetServerSideProps } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { getBlogposts } from "../lib/blogposts";

type PageProps = {
  postList: {
    slug: string;
    title: string;
    date: string;
    tags: string[];
  }[];
};

const Index = ({ postList }: PageProps) => {
  const [songDetails, setSongDetails] = useState<{
    title: string;
    artists: string;
    songUrl: string;
    lastPlayed: Date;
  } | null>(null);

  useEffect(() => {
    async function getCurrentSongDetails() {
      const request = await fetch("api/spotify-auth");

      if (request.status === 401) {
        return;
      }

      const json = await request.json();

      setSongDetails({
        title: json.track.name,
        artists: json.track.artists
          .map((artist: { name: string }) => artist.name)
          .join(", "),
        songUrl: json.track.external_urls.spotify,
        lastPlayed: new Date(json.played_at),
      });
    }

    getCurrentSongDetails();
  }, []);

  dayjs.extend(relativeTime);

  return (
    <Layout>
      <div className="space-y-10">
        {songDetails && (
          <div className="flex flex-col">
            <span className="text-gray-900">
              {" "}
              Recently played on my Spotify
            </span>
            <span>
              <a href={songDetails.songUrl}>
                {songDetails.title}
                <p>
                  by <span className="italic">{songDetails.artists}</span>
                </p>
              </a>
              <p className="text-gray-900">
                {dayjs(songDetails.lastPlayed).fromNow()}
              </p>
            </span>
          </div>
        )}
        <ul className="space-y-5">
          {postList.map((post) => {
            return (
              <li key={post.title} className="flex">
                <span className="block pr-10 text-gray-700">
                  {new Date(post.date).toISOString().split("T")[0]}
                </span>
                <div className="flex flex-col">
                  <Link
                    href={{
                      pathname: "/posts/[slug]",
                      query: {
                        slug: post.slug,
                      },
                    }}
                  >
                    <a>{post.title}</a>
                  </Link>

                  <div>
                    {post.tags.map((tag) => {
                      return (
                        <Link
                          href={{
                            pathname: "/tags/[tag]",
                            query: {
                              tag,
                            },
                          }}
                        >
                          <a className="text-sm text-gray-500 mr-2">#{tag}</a>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </Layout>
  );
};

export const getStaticProps: GetServerSideProps<PageProps> = async () => {
  return {
    props: {
      postList: getBlogposts(),
    },
  };
};

export default Index;
