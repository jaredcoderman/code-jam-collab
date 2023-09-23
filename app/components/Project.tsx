"use client";
import Prisma from "@prisma/client";
import React from "react";

const Project = ({ project }: { project: Prisma.Project }) => {
  return (
    <div className="mx-8 border-2 border-black p-8 basis-1/3 rounded">
      <h1 className="text-4xl">{project.name}</h1>
      <p>{project.description}</p>
    </div>
  );
};

export default Project;
