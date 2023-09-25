"use client";

import Prisma from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const EditButton = ({ id, project }: {id: string, project: Prisma.Project}) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const handleEdit = async () => {
    setShowModal(true);
  }

  const handleFormUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    const body = {
      name,
      description,
    };

    try {
      const response = await fetch(`/api/v1/projects/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok)
        throw new Error(`${response.status}: (${response.statusText})`);
      else {
        setShowModal(false);
        router.push(`/projects/${id}`);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <button
        className="border bg-black px-3 py-2 rounded-md w-fit text-white"
        onClick={handleEdit}
      >
        Edit
      </button>
      {showModal && (
        <div className="fixed z-10 bg-black/25 inset-0 flex items-center justify-center" onClick={(e) => {
          if (e.target !== e.currentTarget) return;
          setShowModal(false);
        }}>
          <div className="absolute bg-white p-4 rounded-md shadow max-w-sm">
            <header className="flex justify-between items-center gap-16">
              <h2 className="text-3xl font-extrabold">
                Edit Project
              </h2>
              <button className="bg-black px-3 py-2 rounded-md w-fit text-white" onClick={() => setShowModal(false)}>Close</button>
            </header>

            <form className="mt-8 flex flex-col space-y-6" onSubmit={handleFormUpdate}>
              <label className="flex flex-col">
                Name
                <input className="px-3 py-2 border rounded-sm" placeholder="Title" type="text" name="name" defaultValue={project.name} />
              </label>
              <label className="flex flex-col">
                Description
                <textarea className="px-3 py-2 border rounded-sm" placeholder="Description" name="description" defaultValue={project.description ?? ""} />
              </label>

              <button className="mx-auto border bg-black px-3 py-2 rounded-md w-fit text-white" type="submit">
                Edit
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EditButton;
