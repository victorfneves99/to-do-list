import React, { ChangeEvent, FormEvent, useState } from "react";

import styles from "../task/styles.module.css";
import Head from "next/head";
import { GetServerSideProps } from "next";

import { db } from "../../services/firebaseConnection";
import {
  addDoc,
  collection,
  query,
  orderBy,
  where,
  onSnapshot,
  doc,
  deleteDoc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import Textarea from "../../components/textarea";
import { useSession } from "next-auth/react";

interface TaskProps {
  item: {
    tarefa: string;
    created: string;
    public: boolean;
    user: string;
    taskId: string;
  };
  allComments: CommentProps[];
}
interface CommentProps {
  id: string;
  comment: string;
  taskId: string;
  user: string;
  name: string;
}

export default function Task({ item, allComments }: TaskProps) {
  const { data: session } = useSession();

  const [input, setInput] = useState("");
  const [comments, setComments] = useState<CommentProps[]>(allComments || []);

  async function handleComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (input === "") return;

    if (!session?.user?.email || !session?.user?.name) return;

    try {
      const docRef = await addDoc(collection(db, "comments"), {
        comment: input,
        created: new Date(),
        user: session?.user?.email,
        name: session?.user?.name,
        taskId: item?.taskId,
      });

      setInput("");
    } catch (error) {}
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Detalhes da Tarefa</title>
      </Head>
      <main className={styles.main}>
        <h1>Tarefa</h1>
        <article className={styles.task}>
          <p>{item?.tarefa}</p>
        </article>
      </main>

      <section className={styles.commentsContainer}>
        <h2>Deixar comentario</h2>
        <form onSubmit={handleComment}>
          <Textarea
            value={input}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setInput(e.target.value)
            }
            placeholder="Digite seu comentario . . ."
          />
          <button className={styles.button} disabled={!session?.user}>
            Enviar Comentario
          </button>
        </form>
      </section>

      <section className={styles.commentsContainer}>
        <h2>Todos Comentatios</h2>
        {comments.length === 0 && (
          <span>Nenhum comentario encontrado . . .</span>
        )}

        {comments.map((item) => (
          <article key={item.id} className={styles.comment}>
            <p>{item.comment}</p>
          </article>
        ))}
      </section>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id as string;

  const docRef = doc(db, "tarefas", id);

  const q = query(collection(db, "comments"), where("taskId", "==", id));
  const snapshotComments = await getDocs(q);

  let allComments: CommentProps[] = [];
  snapshotComments.forEach((doc) => {
    allComments.push({
      id: doc.id,
      comment: doc.data().comment,
      user: doc.data().user,
      name: doc.data().name,
      taskId: doc.data().taskId,
    });
  });

  const snapshot = await getDoc(docRef);

  if (snapshot.data() === undefined) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  if (!snapshot.data()?.public) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const miliseconds = snapshot.data()?.created?.seconds * 1000;

  const task = {
    tarefa: snapshot.data()?.tarefa,
    public: snapshot.data()?.public,
    created: new Date(miliseconds).toLocaleDateString(),
    user: snapshot.data()?.user,
    taskId: id,
  };

  return {
    props: {
      item: task,
      allComments: allComments,
    },
  };
};
