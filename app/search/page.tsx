"use client";
import React, { useState } from "react";
import Project from "../components/Project";
import Prisma from "@prisma/client";

const SearchPage = () => {
  const [search, setSearch] = useState("");
  const [queriedProjects, setQueriedProjects] = useState<Prisma.Project[]>([]);

  const fetchSearchedProjects = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/v1/projects?search=${search}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`${response.status}: (${response.statusText})`);
      }

      const body = await response.json();
      setQueriedProjects(body.projects as Prisma.Project[]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mx-20 flex flex-col mt-20">
      <h1 className="text-4xl font-bold">Search</h1>
      <form className="mt-4" onSubmit={fetchSearchedProjects}>
        <input
          type="text"
          className="border-2 border-black rounded px-2 py-1"
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
        />
      </form>
      <p
        className="text-lg mt-4
      "
      >
        {queriedProjects.length !== 1
          ? `${queriedProjects.length} Results`
          : `${queriedProjects.length} Result`}
      </p>
      {queriedProjects?.map((project) => {
        return <Project key={project.id} project={project} />;
      })}
    </div>
  );
};

export default SearchPage;
