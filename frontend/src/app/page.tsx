import Image from "next/image";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import "@/styles/layout.css";
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
    <div className="layout">
      <Sidebar />

      <main className="content">
        <Topbar />

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
              width={540}
              height={451}
              className="heroImg"
              priority
            />
          </div>

          <button className="welcomeBtn" type="button">
            Bem-vindo ao WenLock!
          </button>
        </section>
      </main>
    </div>
  );
}
