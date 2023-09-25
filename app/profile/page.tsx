import { getServerSession } from "next-auth";
import prisma from "../../lib/prisma";
import authOptions from "../api/auth/[...nextauth]/options";
import Project from "../components/Project";

const Profile = async () => {

  const session = await getServerSession(authOptions);

  if(!session || !session.user || !session.user.email) throw new Error("User not found");

  let user = await prisma.user.findUnique({
    where: {
      email: session.user.email
    },
    include: {
      ownedProjects: true,
      joinedProjects: {
        include: {
          Project: true,
        }
      }
    }
  });

  return (
    <section className="mt-8 mx-8">
      <h1 className="text-4xl">{user?.name}</h1>
      <hr className="my-6" />

      <section className="mb-6">
        <h2 className="text-2xl">Owned Projects</h2>
        <ul>
          {user?.ownedProjects.map((project) => (
            <Project project={project} key={project.id} />
          ))}
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl">Joined Projects</h2>
        <ul>
          {user?.joinedProjects.map((project) => (
            <Project project={project.Project!} key={project.id} />
          ))}
        </ul>
      </section>
    </section>
  );
};

export default Profile;
