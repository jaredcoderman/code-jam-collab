import Prisma from "@prisma/client";
import prisma from "../../../lib/prisma";
import DeleteButton from "../../components/DeleteButton";
import EditButton from "../../components/EditButton";
import authOptions from "../../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

const getUser = async (email: string): Promise<Prisma.User | null> => {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  return user;
};

const getProject = async (
  id: string,
): Promise<(Prisma.Project & { owner: Prisma.User }) | null> => {
  const project = await prisma.project.findUnique({
    where: {
      id,
    },
    include: {
      owner: true,
    },
  });

  return project;
};

const Page = async ({ params }: { params: { id: string } }) => {
  const session = await getServerSession(authOptions);
  const project = await getProject(params.id);

  if (!project) throw new Error("Project not found");

  if(!session?.user?.email) throw new Error("User not found");
  const authUser = await getUser(session?.user?.email);

  return project === null ? (
    <div>Project not found</div>
  ) : (
    <section className="mx-8 mt-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl">{project.name}</h1>
          <p>by {project.owner.name}</p>
        </div>
        {project.owner.id === authUser?.id && (
          <div className="flex gap-2">
            <DeleteButton id={params.id} projectName={project.name} />
            <EditButton id={params.id} project={project} />
          </div>
        )}
      </header>
      <hr className="my-6" />
      <p>{project.description}</p>
    </section>
  );
};

export default Page;
