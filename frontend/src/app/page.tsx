import Image from "next/image";
import { AppShell } from "@/components/layout/AppShell";
import "@/styles/home.css";

function formatPtBrDate(d: Date) {
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function HomePage() {
  const userName = "Millena";
  const today = formatPtBrDate(new Date());

  return (
    <AppShell>
      <h1 className="pageTitle">Home</h1>

      <section className="homeCard">
        <div className="homeHeader">
          <p className="greeting">Olá {userName}!</p>
          <div className="date">{today}</div>
        </div>

        <div className="heroWrap">
          <Image
            src="/img/group-669.jpg"
            alt="Ilustração de boas-vindas WenLock"
            width={480}
            height={400}
            className="heroImg"
            priority
          />
        </div>

        <button className="welcomeBtn" type="button">
          Bem-vindo ao WenLock!
        </button>
      </section>
    </AppShell>
  );
}
