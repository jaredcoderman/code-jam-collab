"use client";
import { useRouter } from "next/navigation";
import React from "react";

type DeleteProps = {
  id: string;
  projectName: string;
};

const DeleteButton = (props: DeleteProps) => {
  const { id, projectName } = props;
  const router = useRouter();

  const handleDelete = async () => {
    const verification = confirm(
      `Are you sure you want to delete Project: ${projectName}`,
    );
    if (!verification) return;
    try {
      const response = await fetch(`/api/v1/projects/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      //TODO Find less cringe way to do this
      router.push("/projects");
      router.refresh();
      if (!response.ok)
        throw new Error(`${response.status}: (${response.statusText})`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button
      className="border bg-black px-3 py-2 rounded-md w-fit text-white"
      onClick={handleDelete}
    >
      Delete
    </button>
  );
};

export default DeleteButton;
