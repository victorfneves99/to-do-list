import Textarea from "@/components/textarea";
import styles from "@/pages/dashboard/styles.module.css";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";

export default function Dashboard() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Meu Painel de Tarefas</title>
      </Head>

      <main className={styles.main}>
        <section className={styles.content}>
          <div className={styles.contentForm}>
            <h1 className={styles.title}>Qual sua tarefa?</h1>
            <form>
              <Textarea placeholder="Digite qual sua tarefa. . ." />
              <div className={styles.checkboxArea}>
                <input type="checkbox" className={styles.checkbox} />
                <label>Deixar tarefa publica?</label>
              </div>

              <button className={styles.button} type="submit">
                Registrar
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  if (!session?.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
